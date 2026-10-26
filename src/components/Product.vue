<template>
	<div class="product" :style="{'width': 100/rowamount * 0.99+'vw'}">
		<img class="img-fluid" v-bind:src="product.imgurl"  @click="fade"/>
		<div class="product-line"></div>
		<span class="itembrand" v-bind:class="{lessrows: rowSize < 5}">{{product.variant}}</span>
		<div class="price">
			<img class="img-fluid pricetag" v-bind:src="require('@/assets/kaart1.png')"/>
			<span class="itemprice" v-bind:class="{lessrows: rowSize < 5}" @click="cart1.addItem(product)">&euro; {{calculatePrice(product)}}</span>
		</div>
		<div class="cartoverlay" v-if="itemInCart(product.ean)">
			<div id="amount" class="amountcircle" v-if="itemInCart(product.ean)" @click="cart1.updateItemAmount(product, 0)"><p>{{itemInCart(product.ean)}}</p></div>
			
		</div>
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
	name: 'Shelfproduct',
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
			modalOpened: false,
			rowSize: ''
		} 
	},
	methods: {
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
		}
	},
	created(){
	},
	mounted(){
	},
	computed: {
		rowamount: function(){
			return this.rowSize
		}
	},
	watch:{		
		'$store.state.rowsize':{
			immediate: true,
			deep: true,
			handler(){			
				this.rowSize = this.$store.state.rowsize
				//this.changeRowcount()
			}
		},
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
.active-product .product .price img{
	filter: invert(15%) sepia(0) saturate(800%) hue-rotate(0) brightness(100%) contrast(105%);
}
.product{
    display: inline-flex;
	aspect-ratio: 1/1.4;
	/*max-width:calc(20vw * 0.9);
	min-width: calc(33vw * 0.9);*/
    height: 100%;
	display: inline-flex;
	flex-direction: column;
	
	background: rgb(255,255,255);
	background: -moz-linear-gradient(0deg, rgba(255,255,255,1) 9%, rgba(214,213,213,1) 10%, rgba(196,192,192,1) 24%, rgba(123,123,123,1) 25%, rgba(171,171,171,1) 49%, rgba(255,255,255,1) 51%, rgba(255,255,255,1) 100%);
	background: -webkit-linear-gradient(0deg, rgba(255,255,255,1) 9%, rgba(214,213,213,1) 10%, rgba(196,192,192,1) 24%, rgba(123,123,123,1) 25%, rgba(171,171,171,1) 49%, rgba(255,255,255,1) 51%, rgba(255,255,255,1) 100%);
	background: linear-gradient(0deg, rgba(255,255,255,1) 9%, rgba(214,213,213,1) 10%, rgba(196,192,192,1) 24%, rgba(123,123,123,1) 25%, rgba(171,171,171,1) 49%, rgba(255,255,255,1) 51%, rgba(255,255,255,1) 100%);
	filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#ffffff",endColorstr="#ffffff",GradientType=1);
}
.product::after{
    content: "";
	position: absolute;
    height: 50%;
    bottom: 25%;
    border-right: 4px solid grey;
    margin-left: -5px;
    -webkit-box-shadow: 5px 0px #888888;
    box-shadow: 1px 0px #888888;
    box-shadow: 2px -5px #c1c1c1;
}
.product img{
    max-width: 85%;
    height: 65%;
    position: relative;
    display: block;
	margin-left: auto;
    margin-right: auto;
}
.product-line{   
	position: absolute;
    height: 50%;
    bottom: 25%;
    border-right: 4px solid grey;
    margin-left: -5px;
    -webkit-box-shadow: 5px 0px #888888;
    box-shadow: 1px 0px #888888;
    box-shadow: 2px -5px #c1c1c1;
}
.itembrand{
    width: 100%;
    height: 15%;
    display: block;
    font-size: 0.7rem;
	color: #ffffff;
}
.itembrand.lessrows{
	font-size: 0.9rem;
	height:20%;
	font-weight: 600;
}
.price{
    color: #ffffff;
    margin: 0;
    font-size: 0.9rem;
    height: 22%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}

.discounted {
    color: red;
}

.shelfunit{
	height:100%;
}
.itemprice{
    color: #000;
    border-left: none;
    border-right: none;
    border-radius: unset;
    font-size: 0.9em;
    position: relative;
    width: 80%;
    position: absolute;
    /* line-height: 100%; */
    /* height: 100%; */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.itemprice{
    color: #000;
    border-left: none;
    border-right: none;
    border-radius: unset;
    font-size: 0.85rem;
    position: relative;
    width: 66%;
    position: absolute;
    /* line-height: 100%; */
    /* height: 100%; */
    top: 50%;
    left: 60%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-56%, -50%);
}
.itemprice.lessrows{
	font-size: 1rem;
	font-weight: 600;
}
@media screen and (min-width: 768px) {
	.itembrand{
		font-size: 1rem;
	}
	.itemprice{
		font-size: 1.1rem;
	}
}
.discount .itemprice{
	color: red;
}
.cartoverlay{
	position: absolute;
    color: red;
    top: 0;
    left: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
}
.cartoverlay .icon{
	width: 2.215em;
	height: 1.4em;
}
.cartoverlay .amountcircle{
    border-radius: 50%;
    min-width: 20px;
	aspect-ratio: 1;
    background: #f00;
    border: 2px solid #f00;
    color: #ffffff;
    text-align: center;
    font-size: 0.9rem;	
    line-height: normal;
    display: flex;
    align-items: center;
    justify-content: center;
}
.cartoverlay .amountcircle p{
	margin: unset;
}
.price .pricetag{
    width: 100%;
    height: 100%;
	max-width: 100%;
    position: absolute;
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
  transition: opacity 0.3s
}

.fade-enter,
.fade-leave-to
{
  opacity: 0
}
</style>