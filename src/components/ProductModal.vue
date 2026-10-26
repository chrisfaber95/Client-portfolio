<template>
	<div class="product-modal">
		<div class="modalheader">
			<div class="top">
				<div class="title">
					<marquee behavior="scroll" direction="left" scrollamount="4">{{unescape(item.title)}}</marquee>
				</div>	
				<div class="closebutton">
					<b-button @click="close()">X</b-button>
				</div>
			</div>
			
			<div class="variant">				
				<p>{{item.variant}}</p>
			</div>
		</div>
		<div class="modalcontent">		
			<img class="img-fluid modal-img" v-bind:src="item.imgurl" />
			<p>Barcode: {{item.ean}}</p>
			<p>Prijs: &euro; {{item.price}}</p>
			<div class="omschrijving mostly-customized-scrollbar" v-html="unescape(newline(item.omschrijving))"></div>
		</div>		
		<div class="modalfooter">
				<div class="amountoverlay" v-if="itemInCart(item.ean)">
					<p v-if="itemInCart(item.ean)" @click="cart1.updateItemAmount(item, 0)">Aantal: {{itemInCart(item.ean)}}</p>
				</div>
				<b-button size="sm"  @click="close()">
					Sluiten
				</b-button>
				<b-button size="sm" @click="cart1.addItem(item)">
					Toevoegen
				</b-button>
		</div>
	</div>
</template>

<script>
import $ from 'jquery'
import {HTTP} from '@/assets/scripts/http-common.js';
import cart from '../cart'
export default {
	name: 'ProductModal',
	props: {
		item: Object
	},
	data: function () {
		return {
			cartItems: new Object(null),
			cart1: cart
		} 
	},
	methods: {
		unescape(html){
			var txt = document.createElement('textarea');
			txt.innerHTML = html;
			return txt.value;
		},
		newline(html){
			//html = html.replace(new RegExp('\r?\n','g'), '<br />');
			html = html.replace("/\n/g", '<br />');
			html = html.replace(new RegExp('--- ---','g'), '');
			html = html.replace(new RegExp('---','g'), '<br />');
			return html;
		},
		itemInCart(id){
			if(this.cartItems){
				if(this.cartItems[id]){
					return this.cartItems[id].amount
				}
			}
			return false
		},
		calculatePrice: function (item){
			var calcPrice = 0;
			
			calcPrice = parseFloat(item.price).toFixed(2);
			//calcPrice = (calcPrice * (1-(parseFloat(item.hasflyeroffer)/100))).toFixed(2);
			return calcPrice;
		},
		close(){
			this.$parent.fade()
		}
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
		}
	}
};
</script>

<style scoped lang="scss">
.product-modal{
	position: fixed;
    display: block;
    width: 80vw;
    height: 70vh;
    top: 15vh;
    left: 10vw;
    border: 1px solid black;
    margin: 10px;
    background-color: #ffffff;
    -webkit-box-shadow: 0 5px 5px 0 #00000099, 0 1px 10px 0 #00000099;
    box-shadow: 0 5px 5px 0 #00000099, 0 1px 10px 0 #00000099;
    z-index: 101;
    justify-content: space-between;
}
.modalheader{
	display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    border-bottom: 1px solid #dddddd;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: flex-start;
    -webkit-box-align: start;
    -ms-flex-align: start;
    padding-left: 10px;
    padding-right: 5px;
    flex-wrap: nowrap;
    align-items: flex-start;
	align-content: space-between
}
.modalheader .title h5{
	margin-bottom: 0;
	line-height: 1;
}
.modalheader .title{
	white-space: initial;
    text-align: left;
    font-weight: 600;
    font-size: 1.1em;
    width: -webkit-fill-available;
}
.modalheader .top{
	width: 90%;
}
.modalheader .variant{
    font-size: 1.2rem;
    font-weight: 600;
    left: 15px;
}
.modalheader .variant p{    
	margin: 0;
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

.closebutton{
}
.closebutton .btn{
    background: #ffa500;
    -webkit-box-shadow: 1px 2px 1px 0px rgb(0,0,0 / 75%);
    box-shadow: 1px 2px 1px 0px rgb(0,0,0 / 40%);
    border: 1px solid #292929;
	color: #ffffff;
	aspect-ratio: 1;
	padding: 0.3rem 0.4rem;
    font-size: 1rem;
    line-height: 1;
}
.closebutton h3{
	font-size: 1.2em;
	margin-bottom: unset;
	
}
.modalcontent{
	max-height: 75%;
	overflow-y: scroll;
    white-space: break-spaces;
}
.modalcontent p{
	font-size: 1.1rem;
	font-weight: 600;
}
.modalfooter{
	max-height: 80%;
}

.modalfooter button{
	width: 40%;
    color: #ffffff;
	font-weight:700;
    font-size: 1.3rem;
    padding-left: 5px;
    padding-right: 5px;
	margin: 5px;
    background-color: #ffa500 !important;
    -webkit-box-shadow: 6px 10px 5px 0px rgb(0,0,0 / 75%) !important;
    box-shadow: 4px 4px 3px 0px rgb(0,0,0 / 40%) !important;
    border: 2px solid #ffa500 !important;
}

/* width */
::-webkit-scrollbar {
  width: 20px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #ffa500;
  border-radius: 10px;
}
@media only screen and (max-width: 425px){	
	.product-modal{
		width: 80vw;
		height: 70vh;
		top: 10vh;
		left: 10vw;
	}
	.modalcontent label,input{
		width: 90%;
		margin-left: auto;
		margin-right: auto;
	}
	.modalcontent textarea{
		width: 90%;
		height: 50%;
		margin-left: auto;
		margin-right: auto;
	}
} 
</style>