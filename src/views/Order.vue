<template>
	<div class="order container-fluid">
		<div class="row">
			<b-button id="backBtn" @click="backToShop()">Verder Winkelen</b-button>
		</div>
		<div id="mandlist">
			<div class="row title">
				<div class="col-6">
					<h5>Product</h5>
				</div>
				<div class="col-2">
					<h5>Prijs</h5>
				</div>
				<div class="col-2 aantalCart">
					<h5>Aantal</h5> 
				</div>
			</div>
			<div class="row" v-for="item in cartitemlist" v-bind:key="item.product_id">
				<div class="col-6">
					<p>{{unescape(item.title)}}</p>
					<i>{{item.variant}}</i>
				</div>
				<div class="col-2">
					<span>&euro;{{item.price}}</span>
					<br>
					<i v-if="item.statiegeld && item.statiegeld != '0.00'">&euro;{{item.statiegeld}}</i>
				</div>
				<div class="col-2 aantalCart">
					<input class="aantalInput" onkeypress='return event.charCode >= 48 && event.charCode <= 57' pattern="\d*" type="number" min="0" step="1" @blur="cart1.updateItemAmount(item, item.amount)" name="input" v-model="item.amount" />
				</div>
				<div class="col-2">
					<b-button class="deleteProduct" @click="cart1.updateItemAmount(item, 0)">X</b-button>
				</div>
			</div>
			<!--<div class="row cost">
				<div class="col-3">
				</div>
				<div class="col-5">
					<span>Koopzegels:</span> 
					<input class="aantalInput" pattern="\d*" type="number" min="0" :max="maxZegels" step="1" name="input" v-model="userinfo.koopzegels" @blur="resetStamps()"/>				
				</div>
				<div class="col-4">
					<span>&euro; {{(userinfo.koopzegels * 0.05).toFixed(2)}}</span>
				</div>
			</div>-->
			<div class="row cost">
				<div class="col-3">
				</div>
				<div class="col-5">
					<span>Totaal: </span>
				</div>
				<div class="col-4">
					<span>&euro; {{(parseFloat(totalPrice) + userinfo.koopzegels * 0.05).toFixed(2)}}</span>
				</div>
			</div>
			<div class="row cost">
				<div class="col-3">
				</div>
				<div class="col-5">
					<span>BTW: </span>
				</div>
				<div class="col-4">
					<span>&euro; {{btw}}</span>
				</div>
			</div>
			<div class="row cost">
				<div class="col-3">
				</div>
				<div class="col-5">
					<span>Verzamelkosten: </span>
				</div>
				<div class="col-4">
					<span>&euro; {{orderPickingPrice}}</span>
				</div>
			</div>
		</div>
		<div class="row" id="information">
		
			<!--<b-form-group id="checkbox-group-1" label="Koopzegels:" label-for="checkbox-1">
				<b-form-checkbox
					id="checkbox-1"
					v-model="kzcheck"
					name="checkbox-1"
					value="1"
					unchecked-value="0"
					@change="calcZegels"
					disabled
				>
			</b-form-checkbox>
			</b-form-group>-->
			<b-form-group id="checkbox-group-2" label="Spaarzegels:" label-for="checkbox-2">
				<b-form-checkbox
					id="checkbox-2"
					v-model="userinfo.spaarzegels"
					name="checkbox-2"
					value="1"
					unchecked-value="0"
				>
			</b-form-checkbox>
			</b-form-group>
			<b-form-group id="input-group-1" label="Naam:" label-for="input-1">
				<b-form-input
					type="text" 
					name="name"
					placeholder="Naam"
					v-model="userinfo.name"
					id= "input-1"
					autocomplete="name"
				></b-form-input>
			</b-form-group>
			<b-form-group id="input-group-2" label="Email:" label-for="input-2" :class="['input-group', isEmailValid()]">
				<b-form-input
					type="email" 
					name="pasnummer" 
					placeholder="Email"
					v-model="email"
					id= "input-2"
					class="form-control"
					autocomplete="email"
				></b-form-input>
			</b-form-group>
			<b-form-group id="input-group-4" label="Klantenkaart:" label-for="input-4">
				<b-form-input
					type="text" 
					name="pasnummer" 
					placeholder="Klantenkaart"
					v-model="userinfo.pasnummer"
					id= "input-4"
					class="form-control"
					onkeypress='return event.charCode >= 48 && event.charCode <= 57'
					pattern="\d*"
				></b-form-input>
			</b-form-group>
			<b-form-group id="input-group-3" label="Telefoon:" label-for="input-3">
				<b-form-input
					type="text" 
					name="telefoon" 
					placeholder="Telefoon"
					v-model="userinfo.telefoon"
					id= "input-3"
					class="form-control"
					pattern="\d*"
					autocomplete="tel"
				></b-form-input>
			</b-form-group>
			<b-form-group id="input-group-5" label="Afhaaldatum:" label-for="input-5">
				<datetime v-model="pickupDate" :min-datetime="minDatetime"></datetime>
			</b-form-group>
			<b-form-group id="input-group-6" label="Afhaaltijd*:" label-for="input-6">
				<vue-timepicker drop-direction="up" v-if="pickupDate" v-model="pickupTime" close-on-complete hide-disabled-hours hide-disabled-minutes format="HH:mm" :hour-range="[[mintime, 19]]" :minute-range="openMinutes"></vue-timepicker>
			</b-form-group>
			<i>*Plus kwartier uitloop</i>
			<b-form-group id="input-group-4" label="Betaalmethode:" label-for="input-4">
				<b-form-select
					type="text" 
					name="name"
					:options="betaalopties"
					v-model="selectedBetaal" 
					id= "input-4"
					disabled
				></b-form-select>
			</b-form-group>
			<div class="container">
				<div class="row">				
					<div class="col-12">
						<span>Betaalmoment 1: <b>&euro; {{orderPickingPrice}}</b></span>
						<i> Verzamelkosten</i>
					</div>
					<div class="col-12">
						<span>Na het verzamelen: <b>&euro; {{(parseFloat(totalPrice) + userinfo.koopzegels * 0.05).toFixed(2)}}</b></span>
						<i> Deze betaling kan nog wijzigen op basis van aanbiedingen en voorraad. U ontvangt een mail voor deze betaling.</i>
					</div>
				</div>
				<div class="row">
				</div>
				<div class="row">
					<div class="col-12">
						<i>Bij confirmatie van de bestelling gaat u akoord met de <a @click="fadeCookie()">Algemene Voorwaarden</a></i>
						<div class="modaloverlay" @click="fadeCookie()" v-if="modalOpened"></div>				
						<transition name="fadeCookie" v-on:enter="enter">	
							<div class="cookies" v-if="modalOpened">						
								<div class="closebutton">
									<b-button @click="fadeCookie()" >X</b-button>
								</div>
								<Privacy />
							</div>
						</transition>		
					</div>
				</div>
				<div class="row">
					<div class="col-12">					
						<button id="orderBtn" type='button' v-on:click="confirmOrder" class="btn" :disabled="totalPrice == 0.00">Bestellen</button >
					</div>
				</div>
			</div>
		</div>
	</div>	
</template>

<script>
import router from "../router"
import cart from '../cart'
import auth from '@/assets/scripts/auth';
import { DateTime as LuxonDateTime } from 'luxon'

import {HTTP} from '@/assets/scripts/http-common.js';

import { Datetime } from 'vue-datetime'
import VueTimepicker from 'vue2-timepicker'

import 'vue-datetime/dist/vue-datetime.css'
import 'vue2-timepicker/dist/VueTimepicker.css'
import Privacy from '@/views/Privacy.vue'

export default {
  name: 'orderPage',
  components: {
    datetime: Datetime,
    vueTimepicker: VueTimepicker,
	Privacy
  },
  props: {
    msg: String
  },
	data: function () {
		return {
			cartItems: new Object(null),
			cart1: cart,
			totalPrice: 0.00,
			btw: 0.00,
			orderPickingPrice: 0.00,
			selectedBetaal: 'ideal',
			kzcheck: 0,
			maxZegels: 0,
			szcheck: 0,
			userinfo: {
				name: '',
				pasnummer: '',
				telefoon: '',
				koopzegels: 0,
				spaarzegels: 0
			},
			pickupDate: null,
			pickupTime: null,
			//Possible values: applepay bancontact banktransfer belfius creditcard directdebit 
			//eps giftcard giropay ideal inghomepay kbc mybank paypal paysafecard przelewy24 sofort
			// Check Mollie for current selected methods
			betaalopties:[
				{text: "Ideal", value: "ideal"},
				//{text: "Paypal", value: "paypal"},
				//{text: "Contant", value: "contant"}
			],
			minDatetime: LuxonDateTime.local().toISO(),
			mintime: 9,
			email: null,
			reg: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
			regname: /^[A-Za-z\s]+$/,
			ordercount: null,
			openMinutes: [0,15,30,45],
			voorwaarden: false,			
			modalOpened: false
		}
	},
	methods: {
		fadeCookie() {
			this.modalOpened = !this.modalOpened
		},
		enter() {
			setTimeout(function() {
				this.modalOpened = false;
				}, 1500);
		},	
		unescape: function(html){
			var txt = document.createElement('textarea');
			txt.innerHTML = html;
			return txt.value;
		},
		clearCart: function(){
			cart.clearItems()
		},
		backToShop: function(){
			router.push('/')
		},
		isEmailValid: function() {
			return (this.email == "")? "" : (this.reg.test(this.email)) ? 'has-success' : 'has-error';
		},
		sanitizeString: function(name){
			name = name.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
			return name.trim();
		},
		confirmOrder: function(){
			this.userinfo.name = this.sanitizeString(this.userinfo.name)
			var data = {
				price: (parseFloat(this.totalPrice) + this.userinfo.koopzegels * 0.05).toFixed(2),
				orderprice: this.orderPickingPrice,
				credentials: this.userinfo,
				selectedBetaal: this.selectedBetaal,
				pickupDate: this.pickupDate,
				pickupTime: this.pickupTime,
				email: this.email,
				user_id: localStorage.getItem('id_token'),
				cart: localStorage.getItem('cart')				  
			}
			if(
				this.cartItems.length <= 1 ||
				data.pickupDate == null ||
				data.pickupTime == null ||
				data.pickupTime.mm == null ||
				data.pickupTime.mm == "" ||
				data.credentials.name == null ||
				data.credentials.name == '' ||
				data.credentials.telefoon == null ||
				data.credentials.telefoon == '' ||
				this.validName(data.credentials.name) == false ||
				data.selectedBetaal == null ||
				data.email == null ||
				data.email == "" ||
				this.validMail(data.email) == false ||		
				data.credentials.koopzegels > this.maxZegels ||		
				data.credentials.koopzegels < 0 
			){
				alert("Informatie vergeten");
			}
			else{
				HTTP.post('order', data)
				.then((response) => {
					if(response.data.success == true){
						this.cart1.clearItemsNoMessage()
						window.location.href = response.data.docs._links.checkout.href
					}
					else{
						alert("Something went wrong, try again.")
					}
				})
				.catch((errors) => {
					alert("Something went wrong, try again.")
				})
			}
		},
		validMail: function(mail){
			if(mail == null || mail == '' || mail.replace(/\s+/g, '') == ''){
				return false
			}
			else if(!this.reg.test(mail)){
				return false
			}
			else{
				return true
			}
		},
		validName: function(name){		
			if(name == null || name == '' || name.replace(/\s+/g, '') == ''){
				return false
			}
			else if(!this.regname.test(name)){
				return false
			}
			else{
				return true
			}
		},
		checkDate: function(){
			if(LuxonDateTime.local().hour >= 18){
				this.minDatetime = LuxonDateTime.local().plus({ days: 1 }).toISO()
			}
		},
		orderCounter: function(date){
			HTTP.get('order/count/'+date)
			.then((response) => {
				var counts = response.data.ordercounter
				this.ordercount = counts
			})
			.catch((errors) => {
				//console.log(errors)
			})
		},
		calcZegels: function(){
			this.userinfo.koopzegels = Math.floor(this.totalPrice / 0.5 * this.kzcheck)
			this.maxZegels = this.userinfo.koopzegels
			return Math.floor(this.totalPrice / 0.5 * this.kzcheck)
		},
		resetStamps: function(){
			if(this.kzcheck == 1){
				this.userinfo.koopzegels = this.maxZegels
			}
		},
		clearEmpty(){
			let cartlist = this.$store.state.winkelmand
			for (var item in cartlist) {
				if(cartlist[item].amount == "" || cartlist[item].amount == null){
					this.cart1.updateItemAmount(cartlist[item], 0)
				}
			}
		}
	},
	created(){
		this.checkDate()
	},
	mounted(){
		this.clearEmpty()
	},
	watch: {
		pickupDate: function(){
		this.mintime = 9
			if(LuxonDateTime.fromISO(this.pickupDate).ordinal <= LuxonDateTime.local().ordinal){
				this.pickupDate = LuxonDateTime.local().toISO()
			}
			if(LuxonDateTime.fromISO(this.pickupDate).ordinal == LuxonDateTime.local().ordinal && LuxonDateTime.local().hour >= this.mintime -1){
				this.mintime = LuxonDateTime.local().plus({hours: 2}).hour
			}
			if(this.pickupDate){
				this.orderCounter(this.pickupDate.split("T")[0])
			}
		},
		pickupTime: function(){
			this.openMinutes = [0,15,30,45]
			for(var i in this.ordercount){
				if(this.ordercount[i]['pickupTime'].split(":")[0] == this.pickupTime.HH){
					if(this.ordercount[i]['ordercount'] >= 25){
						var index = this.openMinutes.indexOf(this.ordercount[i]['pickupTime'].split(":")[1]);
						this.openMinutes.splice(index, 1);
					}
				}
			}
		},		
		'$store.state.winkelmand':{
			immediate: true,
			deep: true,
			handler(){
				this.cartItems = this.$store.state.winkelmand
				cart.calculateBags()
			}
		},
		'$store.state.totalPrice':{
			immediate: true,
			deep: true,
			handler(){
				this.totalPrice = this.$store.state.totalPrice
				this.calcZegels() 
			}
		},
		'$store.state.btw':{
			immediate: true,
			deep: true,
			handler(){
				this.btw = this.$store.state.btw
			}
		},
		'$store.state.orderPickingPrice':{
			immediate: true,
			deep: true,
			handler(){
				this.orderPickingPrice = this.$store.state.orderPickingPrice
			}
		}
	},
	computed:{
		cartitemlist: function(){
			var mand = this.cartItems
			return mand
		}
	}
}
</script>
<style scoped>

.modaloverlay{
    background-color: #66666666;
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
}

.cookies{
    display: block;
	position: fixed;
    height: 90vh;
    width: 90vw;
    top: 0vh;
    margin: 10px;
	margin-left: auto;
	margin-right: auto;
    background-color: #ffffff;
	color: black;
    border: 1px solid black;
    -webkit-box-shadow: 0 5px 5px 0 #00000099, 0 1px 10px 0 #00000099;
    box-shadow: 0 5px 5px 0 #00000099, 0 1px 10px 0 #00000099;
    justify-content: space-between;
    z-index: 101;
	overflow-y: scroll;
}
.closebutton{
	position: absolute;
    right: 0;
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
.aantalCart input{
	width: 100%;
	text-align: center;
}
#orderBtn{
	margin-bottom: 30px;
	margin-top: 5px;
	border-radius: 5px;
	background: #ffa500;
	-webkit-box-shadow: 6px 10px 5px 0px rgb(0 0 0 / 75%);
	box-shadow: 4px 4px 3px 0px rgb(0 0 0 / 40%);
	color: #ffffff;
	border: 2px solid #ffa500;
}
#backBtn{
	margin: 10px;
	margin-left: 25px;
	border-radius: 5px;
	height: 85%;
	padding: 5px;
	background: #ffffff;
	-webkit-box-shadow: 6px 10px 5px 0px rgba(0,0,0,0.75);
	box-shadow: 3px 3px 3px 0px rgba(0,0,0,0.6);
	color: #3e3e3e;
	font-weight: 700;
}

.btn{
	background: #ffffff;
    -webkit-box-shadow: 6px 10px 5px 0px rgba(0,0,0,0.75);
    box-shadow: 3px 3px 3px 0px rgba(0,0,0,0.6);
    color: #ee151e;
    font-weight: 600;
	border: 1px solid #cccccc
}
#mandlist .row{
	border-bottom: 1px solid #cccccc;
	padding: 5px;
	box-shadow: 1px 2px 1px 0px rgba(255, 136, 0, 0.6);
}

.aantalInput{
	-webkit-appearance: inherit;
	-moz-appearance:inherit;
}
.deleteProduct{
	background-color: orange !important;
	color: rgb(243, 243, 243) !important;
}
.title h5{
	font-weight: 600;
	margin: 4px;
}

.order.view{
	overflow-y: scroll;
}
.form-group{
	padding-top: 10px;
    display: flex;
	margin: 5px;
    flex-direction: column;
    align-items:center;
    flex-wrap: wrap;
    align-content: center;
}
#information .form-group input{
    margin: 7px;
	font-weight: 600;
	font-size: 1rem;
}
#orderBtn:disabled{
	background: #cccccc;
}
.cost div{
	text-align: right;
}
</style>
<style>
#information{
	width: 80%;
	margin-left:auto;
	margin-right: auto;
}
#information label{	
    margin: 7px;
	font-weight: 600;
	margin-top: auto;
	margin-bottom: auto;
}
#information .form-group{
	width: 100%;
}
#information input{
	font-size: 1rem;
}
.vue__time-picker .dropdown{
	top: calc(-11.0em + 2px);
}
.vue__time-picker-dropdown ul li:not([disabled]).active, .vue__time-picker-dropdown ul li:not([disabled]).active:focus, .vue__time-picker-dropdown ul li:not([disabled]).active:hover, .vue__time-picker .dropdown ul li:not([disabled]).active, .vue__time-picker .dropdown ul li:not([disabled]).active:focus, .vue__time-picker .dropdown ul li:not([disabled]).active:hover {
    background: #ffae00;
    color: #fff;
}
</style>