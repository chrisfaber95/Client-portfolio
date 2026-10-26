import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        winkelmand: Object.create(null),
        totalPrice: 0,
        orderPickingPrice: parseFloat(3.00).toFixed(2),
        btw: 0,
        screenorientation: 0,
        rowsize: 4,
        department: '',
        productsLoaded: false,
        longestrow: 0
    },
    mutations: {
        updateRowsize(state, payload) {
            state.rowsize = payload
        },
        updateLongestrow(state, payload) {
            state.longestrow = payload
        },
        updateDepartment(state, payload) {
            state.longestrow = 0
            state.department = payload
        },
        updateproductsLoaded(state, payload) {
            state.productsLoaded = payload
        },
        updateMand(state, payload) {
            const mand = payload
            Vue.delete(state.winkelmand, undefined)
            if (payload.ean in state.winkelmand) {
                state.winkelmand[payload.ean].amount += parseInt(payload.amount)
            } else {
                Vue.set(state.winkelmand, payload.ean, payload)
            }
        },
        updatePrice(state, payload) {
            Vue.delete(state.winkelmand, undefined)
            state.totalPrice = 0.00
            for (const item in state.winkelmand) {
                state.totalPrice = (parseFloat(state.totalPrice) + (parseFloat(state.winkelmand[item].price) * state.winkelmand[item].amount)).toFixed(2)
                if (state.winkelmand[item].statiegeld != null) {
                    state.totalPrice = (parseFloat(state.totalPrice) + (parseFloat(state.winkelmand[item].statiegeld) * state.winkelmand[item].amount)).toFixed(2)
                }
            }
        },
        updateBtw(state, payload) {
            Vue.delete(state.winkelmand, undefined)
            state.btw = 0.00
            for (const item in state.winkelmand) {
                state.btw = (parseFloat(state.btw) + ((parseFloat(state.winkelmand[item].price) * state.winkelmand[item].amount) / (parseFloat(state.winkelmand[item].btw) + 100) * parseFloat(state.winkelmand[item].btw))).toFixed(2)
            }
        },
        //Voeg confirm toe voor amount = 0
        updateItemAmount(state, payload) {
            if (payload.ean in state.winkelmand) {
                state.winkelmand[payload.ean].amount = parseInt(payload.amount)
            }
            var circles = document.getElementsByClassName("amountcircle")

            circles.forEach(element => {
                element.style.height = element.offsetWidth + "px"
                element.style.width = element.offsetHeight + "px"
            });
        },
        removeItem(state, payload) {
            delete state.winkelmand[payload.ean]
            Vue.set(state.winkelmand, state.winkelmand[payload.ean])
        }
    },
    actions: {},
    modules: {}
})