<template>
	<div class="product">	
		<img class="img-fluid search-img" v-bind:src="product.imgurl" @click="fade()"/>
		<div class="info">
			<span class="itembrand" v-html="unescape(newline(product.title))"></span>
			<span class="itembrand">{{product.variant}}</span>
			<div class="price">
				<span class="itemprice" @click="cart1.addItem(product)">&euro; {{calculatePrice(product)}}</span>
			</div>
		</div>		
		<div class="amountoverlay" v-if="itemInCart(product.ean)">
			<p v-if="itemInCart(product.ean)" @click="cart1.updateItemAmount(product, 0)">Aantal: {{itemInCart(product.ean)}}</p>
		</div>
		<b-button @click="cart1.addItem(product); log(product)">Voeg toe</b-button>
		<b-button @click="goToProduct(product)">Ga naar product</b-button>				
		<hr>				
		<div class="modaloverlay" v-if="modalOpened" @click="fade()"></div>						
		<transition name="fade" v-on:enter="enter">	
			<ProductModal v-bind:item="product" v-if="modalOpened"/>
		</transition>			
	</div>
</template>

<script>
import $ from 'jquery'
import {HTTP} from '@/assets/scripts/http-common.js';
import cart from '../cart'
import ProductModal from '@/components/ProductModal.vue'

export default {
	name: 'Searchproduct',
	components: {
		ProductModal
	},
	props: {
		product: Object
	},
	data: function () {
		return {
			cartItems: new Object(null),
			cart1: cart,
			modalOpened: false
		} 
	},
	methods: {
		log(prod){
			console.log(prod)
		},
		fade() {
		  this.modalOpened = !this.modalOpened
		},
		enter(el, done) {
			setTimeout(function() {
				this.modalOpened = false;
				}, 1500);
		},		
		unescape: function(html){
			var txt = document.createElement('textarea');
			txt.innerHTML = html;
			return txt.value;
		},
		newline:function(html){
			html = html.replace(new RegExp('\r?\n','g'), '<br />');
			return html;
		},
		even: function() {
			// Set slice() to avoid to generate an infinite loop!
			return this.productList.slice().sort(function(a, b) {
				return a.schapplaats - b.schapplaats;
			});
		},
		calculatePrice: function (item){
			var calcPrice = 0;
			
			calcPrice = parseFloat(item.price).toFixed(2);
			//calcPrice = (calcPrice * (1-(parseFloat(item.hasflyeroffer)/100))).toFixed(2);
			return calcPrice;
		},
		itemInCart: function(id){
			if(this.cartItems){
				if(this.cartItems[id]){
					return this.cartItems[id].amount
				}
			}
			return false
		},
		goToProduct: function(item){
			this.$parent.$parent.$parent.goToProduct(item)
			this.$parent.$parent.showScanner = false
			if(this.$parent.$parent.showCart){
					this.$parent.$parent.openCart()
			}
		},
	},
	created(){
	},
	mounted(){
	},
	computed: {
	},
	watch:{
		'$store.state.winkelmand':{
			immediate: true,
			deep: true,
			handler(){
				var mand = this.$store.state.winkelmand
				this.cartItems = mand
			}
		},
		'$store.state.screenorientation':{
			immediate: true,
			deep: true,
			handler(){				
				//	this.changeOr(this.$store.state.screenorientation)
			}
		}
	}
};
</script>

<style scoped>
.prod-data{
	display: flex;
}
.prod-data img{
	max-width: 30%;
}
.search-img{
	max-width:50%;
}
.product .btn{	
	margin: 10px;
    margin-top: 5px;
    border-radius: 5px;
    background: #ffa500;
    -webkit-box-shadow: 6px 10px 5px 0px rgb(0 0 0 / 75%);
    box-shadow: 4px 4px 3px 0px rgb(0 0 0 / 40%);
    color: #ffffff;
    border: 2px solid #ffa500;
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: #ecececa3;
    font-size: 1.2rem;
}
.cartoverlay{
	position: absolute;
	color: black;
}
.cartoverlay .icon{
	width: 2.215em;
	height: 1.4em;
}
.cartoverlay p{
	position: absolute;
	top: 0;
	left: auto;
	color: white;
	border-radius: 50%;
	width: 30px;
	height: 30px;
	background: #f00;
	border: 2px solid #f00;
	color: #ffffff;
	text-align: center;
}
.amountoverlay{
	width:100%;
	color: red;
}
.amountoverlay p{
	background: #f00;
    border: 2px solid #f00;
    color: #ffffff;
    text-align: center;
    font-size: 1rem;
    line-height: normal;
    margin-bottom: unset;
}
.searchblock{
	border: 2px solid #ffa500;
    -webkit-box-shadow: 4px 5px 4px 0px rgb(0 0 0 / 30%);
    box-shadow: 4px 5px 4px 0px rgb(0 0 0 / 30%);
    background-color: #ffffff;
    display: block;
    z-index: 100000;
    position: fixed;
    bottom: 10vh;
    width: 90vw;
    left: 5vw;
}
.searchbar{
	margin: 5px;
}
#result_strip{
	max-height: 50vh;
	overflow-y: scroll;
}

#result_strip::-webkit-scrollbar {
  width: 5px;
  height: 8px;
  background-color: #aaa; /* or add it to the track */
}
#result_strip::-webkit-scrollbar-thumb {
    background: #000;
}
.search{
	width: 80%;
	margin: auto;
}

.search input{
	width: 100%;
}
.search select{
	width: 100%;
}

.modaloverlay{
	position: fixed;
	width: 100vw;
	height: 100vh;
	top: 0;
	left: 0;
	background-color: #99999999;	
	z-index: 100
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s
}

.fade-enter,
.fade-leave-to
{
  opacity: 0
}
</style>