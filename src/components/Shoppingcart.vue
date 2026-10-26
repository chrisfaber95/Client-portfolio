<template>
	<div class="shoppingCart" id="cart" ref="cartdiv">	
		<div class="menuoverlay" @click="openCart()" v-if="showCart"></div>
		<div id="cartslide" class="closed">
			<div id="scanner" v-if="showScanner">
				<div class="searchoverlay" @click="showScanner = !showScanner;"></div>				
				<transition name="fade">
					<Search />
				</transition>
			</div>
			<div class="carthead" @click="openCart()">
				<div  class="searchbutton">
					<img @click="showScanner = !showScanner;openCart()" class="pricetag" v-bind:src="require('@/assets/search.png')"/>
				</div>
				<div class="cartbutton" ref="cartbutton">
					<h2>
						<font-awesome-icon icon="shopping-basket"></font-awesome-icon>		
					</h2>
				</div>
				<div class="carttotal">
					<span>Totaal: &euro;{{totalPrice}}</span>
				</div>
			</div>
			<div id="mandlist" >
				<h5>
					<button class="clearcart" @click ="cart1.clearItems()">Mandje legen</button>
				</h5>
				
				<div class="cartitem" v-for="item in cartitemlist" v-bind:key="item.ean">
					<div class="itemname">
						<span class="productname">{{unescape(item.title)}}</span>
						<span class="variant">{{item.variant}}</span>
					</div>
					<div class="itemprice">
						<span>&euro;{{item.price}}</span>
					</div>
					<b-button class="cartamount" :id="'cartamount-'+item.ean" @click="openAmountChanger(item.ean)">{{item.amount}}</b-button>
					<div class="itemamount" :id="'cart-'+item.ean">
						<div class="changeroverlay"></div>
						<b-button class="amountchanger" :disabled="item.amount == 0" @click="cart1.updateItemAmount(item, parseInt(item.amount) - 1)"><font-awesome-icon icon="minus"></font-awesome-icon></b-button>
							<input class="cartamount" onkeypress='return event.charCode >= 48 && event.charCode <= 57' pattern="\d*" type="number" min="0" step="1" @blur="cart1.updateItemAmount(item, parseInt(item.amount))" name="input" v-model="item.amount" />
						<b-button class="amountchanger" @click="cart1.updateItemAmount(item, parseInt(item.amount) + 1)"><font-awesome-icon icon="plus"></font-awesome-icon></b-button>
						
					</div>
					<b-button class="deleteProduct" @click="cart1.updateItemAmount(item, 0)">X</b-button>
				</div>
				
				<span>Totaal: &euro; {{totalPrice}}</span>
				<div class="orderbutton">				
					<h3><router-link :to="{name: 'bestellen'}">Bestel</router-link></h3>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import cart from '../cart'
import Search from '@/components/Search.vue'
export default {
	components: {
		Search
	},
  name: 'shoppingCart',
  props: {
    msg: String
  },
	data: function () {
		return {
			cartItems: new Object(null),
			showCart: false,
			showScanner: false,
			cart1: cart,
			totalPrice: 0.00
		}
	},directives: {
        clickoutside: {
            bind: function(el, binding, vnode) {
                el.clickOutsideEvent = function(event) {
                    // here I check that click was outside the el and his childrens
                    if (!(el == event.target || el.contains(event.target))) {
                        // and if it did, call method provided in attribute value
                        vnode.context[binding.expression](event);
                    }
                };
                document.body.addEventListener("click", el.clickOutsideEvent);
                document.body.addEventListener("touchstart", el.clickOutsideEvent);
            },
            unbind: function(el) {
                document.body.removeEventListener("click", el.clickOutsideEvent);
                document.body.removeEventListener("touchstart", el.clickOutsideEvent);
            },
            stopProp(event) {
                event.stopPropagation();
            }
        }
    },
	methods: {
		unescape: function(html){
			var txt = document.createElement('textarea');
			txt.innerHTML = html;
			return txt.value;
		},
		clearCart: function(){
			cart.clearItems().then(this.updateCartPrice());
		},
		updateCartPrice: function(){
			cart.calculatePrice();
		},
		openCart: function(){
			if(!this.showCart){
				document.getElementById("cart").classList.add("opened");
				document.getElementById("cartslide").classList.add("opened");
				document.getElementById("cartslide").classList.remove("closed");
				this.showCart = true;
			}
			else{
				document.getElementById("cart").classList.remove("opened");
				document.getElementById("cartslide").classList.remove("opened");
				document.getElementById("cartslide").classList.add("closed");
				this.showCart = false;
			}
		},
		onClose: function(){
			if(this.showCart){
				document.getElementById("cart").classList.remove("opened");
				document.getElementById("cartslide").classList.remove("opened");
				document.getElementById("cartslide").classList.add("closed");
				this.showScanner = false
				this.showCart = false
				document.getElementById("cart").scrollTop = 0;				
			}
		},
		openAmountChanger(id){
			//document.getElementById("cartamount-"+id).classList.remove("opened");
			document.getElementById('cart-'+id).classList.add("opened");
			//document.getElementById("cartamount-"+id).classList.add("closed");
			setTimeout(() => {
				this.closeAmountChanger(id)
			}, 10000);
		},
		closeAmountChanger(id){
			//document.getElementById("cartamount-"+id).classList.remove("closed");
			document.getElementById('cart-'+id).classList.remove("opened");
			//document.getElementById("cartamount-"+id).classList.add("opened");
		}
	},
	created(){
	},
	mounted(){
	},
	computed:{
		cartitemlist: function(){
			var mand = this.cartItems
			return mand
		}
	},
	watch:{
		'$store.state.winkelmand':{
			immediate: true,
			deep: true,
			handler(){
				var mand = this.$store.state.winkelmand
				this.cartItems = mand
				cart.calculateBags()				
			}
		},
		'$store.state.totalPrice':{
			immediate: true,
			deep: true,
			handler(){
				var totalPrice = this.$store.state.totalPrice
				this.totalPrice = totalPrice
			}
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.carthead{
	height: 7vh;
	width: 100%;
    border-bottom: 1px dashed black;   
	display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-evenly;
    align-items: center;
}
.searchbutton{
	width: 22%;
	max-height: 100%;	
    display: inline-flex;
    justify-content: center;
}


.searchbutton img{
	filter: invert(0%) sepia(4%) saturate(0%) hue-rotate(59deg) brightness(96%) contrast(101%);
    width: 80%;
}

.cartbutton{
	width: 22%;

}
.cartbutton h2{
	margin-bottom: unset;
}
.carttotal{
    font-size: 0.95rem;
    font-weight: 700;
	width: 22%;
}

.searchbutton, .cartbutton{
    border-radius: 5px;
    background: #ffffff;
    -webkit-box-shadow: 6px 10px 5px 0px rgba(0,0,0,0.75);
    box-shadow: 3px 3px 3px 0px rgba(0,0,0,0.6);
    color: #000000;
}

.cartitem{
	position: relative;
	width: 100%;
    margin-bottom: 10px;
	display: flex;
	flex-direction: row;
    justify-content: space-evenly;
    align-items: flex-start;
	border-bottom: 1px dotted #999999;
	padding-bottom: 5px;
}
.itemname{
	width: 40%;
}

button.deleteProduct.btn{
	background-color: orange !important;
	color: rgb(243, 243, 243) !important;
}

.cartamount{
    border-style: outset;
	text-align: center;
	max-width:50%;
	font-weight: 600;
	background-color: rgb(255, 166, 0) !important;
}

.btn.cartamount.closed{
	display: none;
}
.btn.cartamount.opened{
	display: block;
}
.itemamount.opened > *{
	z-index: 3;
}
.itemamount.opened .changeroverlay{
    width: 140%;
    height: 100%;
    background-color: white;
    left: -40%;
    position: absolute;
    z-index: 2;
}
.itemamount.opened{
	position: absolute;
	right:-30%;
	width: 40%;
	display: flex;
	flex-direction: row;
    justify-content: space-evenly;
    align-items: stretch;
	opacity: 0.5;
	background-color: #fafafa;
    -webkit-animation: slide 1s forwards;
    animation: slide 1s forwards;
}

@-webkit-keyframes slide {
    100% { 
		right: 5%; 
		opacity: 1;
	}
}

@keyframes slide {
    100% { 
		right: 5%; 
		opacity: 1;		
	}
}

.itemamount{
	display: none;
}

.amountchanger{
	width: 25%;
	background-color: orange;
    padding: 0.5rem;
}

.clearcart{
	margin-bottom: 15px;
    margin-top: 5px;
    color: #ffffff;
	display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    border-radius: 5px;
    background: #ffa500;
    -webkit-box-shadow: 6px 10px 5px 0px rgb(0 0 0 / 75%);
    box-shadow: 4px 4px 3px 0px rgb(0 0 0 / 40%);
    border: 2px solid #ffa500;
	padding: 3px;
}

.orderbutton{
	margin-bottom: 15px;
    margin-top: 5px;
    color: #ffffff;
	display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
}
.orderbutton h3{
    border-radius: 5px;
    background: #ffa500;
    -webkit-box-shadow: 6px 10px 5px 0px rgb(0 0 0 / 75%);
    box-shadow: 4px 4px 3px 0px rgb(0 0 0 / 40%);
    border: 2px solid #ffa500;
	padding: 3px;
}
.orderbutton h3 a{
  color:  #ffffff;
}

.menuoverlay{
    background-color: #66666666;
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.shoppingCart{
	overflow-y: hidden;
	position: absolute;
}
.shoppingCart h2{
	color: #000000;
}
.shoppingCart.opened{
	bottom: 0;
	overflow-x: hidden;
}
#cartslide.opened{
	position: fixed;
    z-index: 1000;
    max-height: 50vh;
    transition: max-height 0.25s ease-in;
    bottom: 0;
    background: #ffffff;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    border: 1px solid #111111;
    left: 1vw;
    padding: 10px;
    width: calc(var(--app-width)*0.98);
}
#cartslide.closed{
    max-height: 10vh;
	transition: max-height 0.15s ease-out;
}
.productname{
	font-size: 0.9rem;
	text-overflow: ellipsis;
	/*white-space: nowrap;*/
	overflow: hidden;
	width: 100%;
	display: block;
	text-align: left;
}
/*
.productname{
	-webkit-transition: 3.3s;
	-moz-transition: 3.3s;
	transition: 3.3s;     

	-webkit-transition-timing-function: linear;
	-moz-transition-timing-function: linear;
	transition-timing-function: linear;
}
.productname:hover{
  margin-left: -300px;
}*/

.variant{
	font-size: 0.7rem;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	width: 100%;
	display: block;	
	text-align: left;
}
#mandlist{
    max-height: 40vh;
    margin-top: 10px;
    margin-bottom: 10px;
}
.shoppingCart.opened #mandlist{
    overflow-y: scroll;
}

.shoppingCart.opened #mandlist::-webkit-scrollbar {
  width: 5px;
  height: 8px;
  background-color: #aaa; /* or add it to the track */
}
.shoppingCart.opened #mandlist::-webkit-scrollbar-thumb {
    background: #000;
}

#scanner{
    position: fixed;
    z-index: 10;
    background: white;
    width: 90vw;
    bottom: 7vh;
    left: 5vw;
    max-height: 70vh;
}
.barcodescanner{
	height: 85%;
    display: block;
    width: 85%;
}
.barcodescanner .pricetag{
	height: 90%;
}
.barcodescanner svg{
	height: 1em;
	width: auto;
	vertical-align: middle;
}/*
.barcodescanner{
	border-radius: 5px;
    height: 85%;
    padding: 5px;	
	background: #ffffff;
	margin-left: -5px;
	-webkit-box-shadow: 6px 10px 5px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 6px 10px 5px 0px rgba(0,0,0,0.75);
    box-shadow: 3px 3px 3px 0px rgba(0,0,0,0.6);
	color:#ee151e;
}*/
.searchoverlay{
    background-color: #66666666;
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
}
</style>
