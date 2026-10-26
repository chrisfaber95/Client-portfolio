import router from "../router"
import store from '@/store'
import { HTTP } from '@/assets/scripts/http-common.js';


export default {

    cart: {
        items: new Map(),
        totalPrice: 0,
        orderPickingPrice: parseFloat(3.00).toFixed(2),
        btw: 0
    },
    addItem(item, amount) {
        if (amount == null)
            amount = 1
        var product = {
            product_id: item.product_id,
            ean: item.ean,
            price: parseFloat(item.price).toFixed(2),
            title: item.title,
            amount: amount,
            variant: item.variant,
            categoryname1: item.categoryname1,
            btw: item.btw,
            statiegeld: item.statiegeld
        }
        this.store.commit('updateMand', product)
    },
    updateItemAmount(item, amount) {
        var product = {
            ean: item.ean,
            amount: amount
        }
        if (amount == 0) {
            this.store.commit('removeItem', product)
        } else if (amount >= 1) {
            this.store.commit('updateItemAmount', product)
        }
    },
    async getItemByEan(code, callback) {
        HTTP.get(`product/` + code)
            .then((response) => {
                var product = response.data.docs
                if (product.length == 0) {
                    alert(code + " code niet correct of product niet beschikbaar");
                } else {
                    let response = product[0]
                    callback(response)
                }
            })
            .catch((errors) => {
                var response = errors
                callback(response)
            })
    },

    async calculateBags() {
        var self = this
        const smallbag = '8710725038685' // max 8
        const bigbag = '8710725030573' //max 15
        const bigshopper = '8710725030566' //max 25
        const diepvries = '8710725038678' //max 4
        const tassen = ['8710725038685', '8710725030573', '8710725030566', '8710725038678']
        const mand = this.store.state.winkelmand
        let mandsize = 0
        let diep = 0
        let bb = 0
        let bs = 0
        let sb = 0

        for (var item in mand) {
            if (!tassen.includes(mand[item].ean) && parseInt(mand[item].amount) >= 1) {
                if (mand[item].categoryname1 == "diepvries") {
                    diep += parseInt(mand[item].amount)
                } else {
                    mandsize += parseInt(mand[item].amount)
                }
            }
        }
        bs = Math.floor(mandsize / 25)
        bb = Math.floor((mandsize - (bs * 25)) / 16)
        sb = Math.ceil((mandsize - (bs * 25) - (bb * 15)) / 8)
        if (sb == 2) {
            sb = 0
            bb = 1
        }
        if (mandsize == 24) {
            sb = 0
            bb = 2
        }
        diep = Math.ceil(diep / 4)
        if (diep != 0) {
            this.getItemByEan(diepvries, function(response) {
                if (response) {
                    if (!(diepvries in mand))
                        self.addItem(response, diep)
                    else
                        self.updateItemAmount(response, diep)
                }
            })
        } else {
            if (diepvries in mand) {
                var product = {
                    ean: diepvries
                }
                self.updateItemAmount(product, diep)
            }
        }
        if (bs != 0) {
            this.getItemByEan(bigshopper, function(response) {
                if (response) {
                    if (!(bigshopper in mand))
                        self.addItem(response, bs)
                    else
                        self.updateItemAmount(response, bs)
                }
            })
        } else {
            if (bigshopper in mand) {
                let product = {
                    ean: bigshopper
                }
                self.updateItemAmount(product, diep)
            }
        }
        if (bb != 0) {
            this.getItemByEan(bigbag, function(response) {
                if (response) {
                    if (!(bigbag in mand))
                        self.addItem(response, bb)
                    else
                        self.updateItemAmount(response, bb)
                }
            })
        } else {
            if (bigbag in mand) {
                let product = {
                    ean: bigbag
                }
                self.updateItemAmount(product, diep)
            }
        }
        if (sb != 0) {
            this.getItemByEan(smallbag, function(response) {
                if (response) {
                    if (!(smallbag in mand))
                        self.addItem(response, sb)
                    else
                        self.updateItemAmount(response, sb)
                }
            })
        } else {
            if (smallbag in mand) {
                let product = {
                    ean: smallbag
                }
                self.updateItemAmount(product, diep)
            }
        }
    },
    reloadCart() {
        try {
            var products = JSON.parse(localStorage.getItem('cart'))
            for (var item in products) {
                this.addItem(products[item], products[item].amount)
            }
        } catch (err) {
            //console.error(err)
        }
        return false
    },
    saveCartLocal() {
        if (this.store) {
            try {
                localStorage.setItem('cart', JSON.stringify(this.store.state.winkelmand))
            } catch (err) {
                //console.log(err)
            }
        }
    },
    clearItems() {
        var result = confirm("Weet u zeker dat u het mandje wilt legen?");
        if (result) {
            const tassen = ['8710725038685', '8710725030573', '8710725030566', '8710725038678']
            const mand = this.store.state.winkelmand
            for (var item in mand) {
                try {
                    if (!tassen.includes(mand[item].ean)) {
                        this.updateItemAmount(mand[item], 0)
                    }
                } catch (e) {
                    // console.log(e) 
                }
            }
        }
    },
    clearItemsNoMessage() {
        const tassen = ['8710725038685', '8710725030573', '8710725030566', '8710725038678']
        const mand = this.store.state.winkelmand
        for (var item in mand) {
            try {
                if (!tassen.includes(mand[item].ean)) {
                    this.updateItemAmount(mand[item], 0)
                }
            } catch (e) {
                // console.log(e) 
            }
        }
    },





    async updateCart(cartProduct) {
        if (!this.cart.items.has(cartProduct.ean)) {
            this.cart.items.set(cartProduct.ean, cartProduct)
        } else {
            this.cart.items.get(cartProduct.ean).amount += cartProduct.amount
        }
        this.store.commit('updateMand', { mand: this.cart.items })
        localStorage.setItem('cart', this.stringifyCart(this.cart.items)),
            this.calculatePrice()
    },

    async removeItem(item) {
        this.cart.items.delete(item)
        this.store.commit('updateMand', { mand: this.cart.items })
        localStorage.setItem('cart', this.stringifyCart(this.cart.items));
    },

    async updateItem() {
        const smallbag = '8710725038685'
        const bigbag = '8710725038678'
        const bigshopper = '8710725030566'
        for (var i = 0; i < this.cart.items.length; i++) {
            if (this.cart.items[i].amount <= 0 && (this.cart.items[i].ean != smallbag || this.cart.items[i].ean != bigbag)) {
                this.cart.items[i].amount = 0
                this.removeItem(this.cart.items[i].product_id)
            }
            if ((this.cart.items[i].ean == smallbag || this.cart.items[i].ean == bigbag) && this.cart.items[i].amount > 1) {
                this.cart.items[i].amount = 1
            }
            this.cart.totalPrice = (parseFloat(this.cart.totalPrice) + (parseFloat(this.cart.items[i].price) * this.cart.items[i].amount)).toFixed(2)
            if (this.cart.items[i].statiegeld != null) {
                this.cart.totalPrice = (parseFloat(this.cart.totalPrice) + (parseFloat(this.cart.items[i].statiegeld) * this.cart.items[i].amount)).toFixed(2)
            }
        }
    },
    async updateAmountUsingEan(item) {
        this.cart.items.get(item.ean).amount = item.amount
        for (const [key, value] of this.cart.items.entries()) {
            if (value.amount <= 0) {
                this.removeItem(key)
            }
        }
        this.store.commit('updateMand', { mand: this.cart.items })
        localStorage.setItem('cart', this.stringifyCart(this.cart.items)),
            this.calculatePrice()

    },
    async calculatePrice() {
        var self = this
        this.checkForTas()
            .then(function() {
                self.cart.totalPrice = parseFloat(0.00).toFixed(2);
                self.cart.btw = parseFloat(0.00).toFixed(2);
                self.cart.items = self.parseCartJSON(localStorage.getItem('cart'))


                for (const [key, value] of self.cart.items.entries()) {
                    self.cart.totalPrice = (parseFloat(self.cart.totalPrice) + (parseFloat(value.price) * value.amount)).toFixed(2)
                    if (value.statiegeld != null) {
                        self.cart.totalPrice = (parseFloat(self.cart.totalPrice) + (parseFloat(value.statiegeld) * value.amount)).toFixed(2)
                    }
                    self.cart.btw = (parseFloat(self.cart.btw) + ((parseFloat(value.price) * value.amount) / (parseFloat(value.btw) + 100) * parseFloat(value.btw))).toFixed(2)
                }
                return self.cart.totalPrice;
            })
    },
    async addTas(item, amount) {
        var self = this

        var product_id = item.product_id
        var ean = item.ean
        var title = item.title
        var variant = item.variant
        var btw = item.btw
        var statiegeld = item.statiegeld
        var categoryname1 = item.categoryname1

        var price = parseFloat(item.price).toFixed(2)
        var product = {}
            //var eanname = new Array()
            //price = (price * (1-(parseFloat(item.hasflyeroffer)/100))).toFixed(2);
        var product = { product_id, ean, price, title, amount, variant, categoryname1, btw, statiegeld }

        if (!self.cart.items.has(product.ean)) {
            self.cart.items.set(product.ean, product)
        } else {
            self.cart.items.get(product.ean).amount = amount
        }

        self.store.commit('updateMand', { mand: self.cart.items })
        localStorage.setItem('cart', self.stringifyCart(self.cart.items))
    },
    async checkForTas() {
        var self = this
        var smallbag = '8710725038685'
        var bigbag = '8710725030573'
        var bigshopper = '8710725030566'
        var diepvries = '8710725038678'


        var sum = 0
        var diep = 0
        this.cart.items.forEach((v) => {
            console.log(v)
            if (v.categoryname1 == "diepvries") {
                diep += parseInt(v.amount)
            } else {
                sum += parseInt(v.amount);
            }
        });

        if (diep != 0) {
            console.log(diep / 4)
            var amount = Math.ceil(diep / 4)
            HTTP.get(`product/` + diepvries)
                .then((response) => {
                    var product = response.data.docs
                    if (product.length == 0) {
                        alert(diepvries + " code niet correct of product niet beschikbaar");
                    } else {
                        console.log(product[0])
                        var item = product[0]
                        self.addTas(item, amount)
                    }
                })
                .catch((errors) => {
                    console.log(errors)
                })
        } else {
            this.cart.items.delete(diepvries)
            this.store.commit('updateMand', { mand: this.cart.items })
            localStorage.setItem('cart', this.stringifyCart(this.cart.items));
        }
        var bigshop = 0;
        var big = 0;
        var small = 0;
        if (sum > 48) {
            var amount = Math.ceil(sum / 48)
            for (var i = 0; i < amount; i++) {

            }
        } else if (sum > 0 && sum <= 48) {
            if (sum > 15) {
                sum -= 25
                HTTP.get(`product/` + bigshopper)
                    .then((response) => {
                        var product = response.data.docs
                        if (product.length == 0) {
                            alert(bigshopper + " code niet correct of product niet beschikbaar");
                        } else {
                            console.log(product[0])
                            var item = product[0]
                            self.addTas(item, 1)
                        }
                    })
                    .catch((errors) => {
                        console.log(errors)
                    })
                if (sum > 8 && sum <= 15) {
                    sum -= 15
                    HTTP.get(`product/` + bigbag)
                        .then((response) => {
                            var product = response.data.docs
                            if (product.length == 0) {
                                alert(bigbag + " code niet correct of product niet beschikbaar");
                            } else {
                                console.log(product[0])
                                var item = product[0]
                                self.addTas(item, 1)
                            }
                        })
                        .catch((errors) => {
                            console.log(errors)
                        })
                    if (sum > 0 && sum <= 8) {
                        HTTP.get(`product/` + smallbag)
                            .then((response) => {
                                var product = response.data.docs
                                if (product.length == 0) {
                                    alert(smallbag + " code niet correct of product niet beschikbaar");
                                } else {
                                    console.log(product[0])
                                    var item = product[0]
                                    self.addTas(item, 1)
                                }
                            })
                            .catch((errors) => {
                                console.log(errors)
                            })
                    }
                } else if (sum > 0 && sum <= 8) {
                    HTTP.get(`product/` + smallbag)
                        .then((response) => {
                            var product = response.data.docs
                            if (product.length == 0) {
                                alert(smallbag + " code niet correct of product niet beschikbaar");
                            } else {
                                console.log(product[0])
                                var item = product[0]
                                self.addTas(item, 1)
                            }
                        })
                        .catch((errors) => {
                            console.log(errors)
                        })

                }

            } else if (sum > 8 && sum <= 15) {
                sum -= 15
                HTTP.get(`product/` + bigbag)
                    .then((response) => {
                        var product = response.data.docs
                        if (product.length == 0) {
                            alert(bigbag + " code niet correct of product niet beschikbaar");
                        } else {
                            console.log(product[0])
                            var item = product[0]
                            self.addTas(item, 1)
                        }
                    })
                    .catch((errors) => {
                        console.log(errors)
                    })
                if (sum > 0 && sum <= 8) {
                    HTTP.get(`product/` + smallbag)
                        .then((response) => {
                            var product = response.data.docs
                            if (product.length == 0) {
                                alert(smallbag + " code niet correct of product niet beschikbaar");
                            } else {
                                console.log(product[0])
                                var item = product[0]
                                self.addTas(item, 1)
                            }
                        })
                        .catch((errors) => {
                            console.log(errors)
                        })

                }

            } else if (sum > 0 && sum <= 8) {
                HTTP.get(`product/` + smallbag)
                    .then((response) => {
                        var product = response.data.docs
                        if (product.length == 0) {
                            alert(smallbag + " code niet correct of product niet beschikbaar");
                        } else {
                            console.log(product[0])
                            var item = product[0]
                            self.addTas(item, 1)
                        }
                    })
                    .catch((errors) => {
                        console.log(errors)
                    })

            }

        } else {
            if (this.cart.items.has(bigbag)) {
                this.cart.items.delete(bigbag)
                this.store.commit('updateMand', { mand: this.cart.items })
                localStorage.setItem('cart', this.stringifyCart(this.cart.items));
            }
            if (this.cart.items.has(smallbag)) {
                this.cart.items.delete(smallbag)
                this.store.commit('updateMand', { mand: this.cart.items })
                localStorage.setItem('cart', this.stringifyCart(this.cart.items));
            }
            if (this.cart.items.has(bigshopper)) {
                this.cart.items.delete(bigshopper)
                this.store.commit('updateMand', { mand: this.cart.items })
                localStorage.setItem('cart', this.stringifyCart(this.cart.items));
            }
        }
        return true
    },
    resetCart() {
        if (localStorage.hasOwnProperty('cart')) {
            this.cart.items = this.parseCartJSON(localStorage.getItem('cart'));
            this.store.commit('updateMand', { mand: this.cart.items })
            this.calculatePrice();
        }
    },
    getItems() {
        return this.cart
    },
    parseCartJSON(json) {
        let parsed = new Map(JSON.parse(json));
        return parsed
    },
    stringifyCart(map) {
        var str = JSON.stringify([...map])
        return str
    }

}