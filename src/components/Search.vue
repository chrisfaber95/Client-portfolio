<template>
  <div class="searchblock">
    <div class="row" id="result_strip">	
		<div class="products" v-for="item in filteredProducts" v-bind:key="item.product_id"  :id="item.ean">	
			<Product v-bind:product="item"/>	
		</div>
    </div>
	<!--<div id="scanner" v-if="scanning">
		<Scanner />
	</div>-->
	<div class="searchbar">		
		<!--<div @click="scanning = !scanning" class="barcodescanner scannerBtn">
			<font-awesome-icon icon="barcode"></font-awesome-icon>
		</div>-->
		<div class="search">		
			<label for="isbn_input" class="col-12">Zoeken:</label>
			<input id="isbn_input" class="isbn col-12" type="text" v-model="searchedItem" />
		</div>		
		<div class="search">		
			<label for="isbn_input" class="col-12">Afdeling:</label>
			<select v-model="selectedDep">
				<option v-for="option in filteredDepartments" v-bind:value="option.value">
					{{ option.text }}
				</option>
			</select>
		</div>		
		<div class="buttons">
			<button class="stop" @click="close()">Sluiten</button>	
			<button @click="getItem()">Zoeken</button>	
		</div>
	</div>
	
  </div>
</template>

<script>
import {HTTP} from '@/assets/scripts/http-common.js';
import $ from 'jquery'
import cart from '../cart'
import Scanner from '@/components/Barcodescanner.vue'
import Product from '@/components/Searchproduct.vue'

export default {
	components: {
		Scanner,
		Product
	},
  data: function() {

    return {
		searchedItem: '',
		productList: null,
		scanning: false,
		departments: [],
		selectedDep: null,
		cartItems: new Object(null),
		modalOpened: false
    }

  },

  mounted: function() {
		this.getDepartments()
  },

  destroyed: function() {


  },
  methods:{
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
		close(){			
			this.$parent.showScanner = false
		},
		sanitizeString: function(name){
			name = name.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
			return name.trim();
		},
		getItem: function(){
			const search = this.sanitizeString(this.searchedItem)
			HTTP.get('product/search/'+search, {params: {dep: this.selectedDep}})
			.then((response) => {
				console.log(response)
				this.productList = response.data
			})
			.catch((errors) => {
				console.log(errors)
			})
		},
		closeScanner: function(){
			Quagga.stop()
			this.$parent.showScanner = false
		},
		addItemToCart: function (item){
			cart.addItem(item);
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
			this.$parent.$parent.goToProduct(item)
			this.$parent.showScanner = false
      if(this.$parent.showCart){
		  	this.$parent.openCart()
      }
		},
		getDepartments: function(){
			HTTP.get('departments')
			.then((response) => {
				this.departments = response.data.docs
					const unique = this.departments
				   .map(e => e['slug'])

				 // store the keys of the unique objects
				.map((e, i, final) => final.indexOf(e) === i && i)

				// eliminate the dead keys & store unique objects
				.filter(e => this.departments[e]).map(e => this.departments[e]);
				const un = unique.sort(function(a, b){
								var keyA = a.slug,
									keyB = b.slug;
								// Compare the 2 dates
								if(keyA < keyB) return -1;
								if(keyA > keyB) return 1;
								return 0;
							});
			})
			.catch((errors) => {
				console.log(errors)
			})
		}
	},
	
	computed: {
		filteredProducts:function()
		{
			const products = []
			for(var i in this.productList){
				products.push(this.productList[i])
			}
			return products
		},
		filteredDepartments:function()
		{
			const unique = this.departments
          .map(e => e['slug'])

      // store the keys of the unique objects
			.map((e, i, final) => final.indexOf(e) === i && i)

			// eliminate the dead keys & store unique objects
			.filter(e => this.departments[e]).map(e => this.departments[e]);
			var un = unique.sort(function(a, b){
							var keyA = a.slug,
								keyB = b.slug;
							// Compare the 2 dates
							if(keyA < keyB) return -1;
							if(keyA > keyB) return 1;
							return 0;
						});
			var deps = [{"value": null, "text": "Filter zoekresultaten op afdeling:"}]			
			for(var i in un){
				deps.push({"value": un[i].slug, "text": un[i].label})
			}
			return deps
		}
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

<style scoped>

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


.stop{
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
.scanner{
    border: 2px solid #ffa500;
    box-shadow: 4px 5px 4px 0px rgba(0,0,0,0.3);
    background-color: #dddddd;
}

.controls{
    display: inline-flex;
    width:100%;
}
.controls fieldset.input-group{
    width: 30%;
    margin:5px 10px;  
}
#result_strip{
    margin-left: auto;
    margin-right: auto;
    width: 95%;
}
.infooverlay{
	/*position: absolute;*/
	color: red;
}
.infooverlay .icon{
	width: 2.215em;
	height: 1.4em;
}
.infooverlay p{
	/*position: absolute;*/
    top: 0;
    left: auto;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    background: #f00;
    border: 2px solid #f00;
    color: #ffffff;
    text-align: center;
    font-size: 0.9rem;	
    line-height: normal;
}

button{ 
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
.controls fieldset.reader-config-group{
    width: 70%;
    text-align:left;
    margin:10px
}
.controls fieldset.reader-config-group span{
    text-align:left;
    width: 40%;
}
.controls fieldset.reader-config-group select{
    text-align:left;
    width: 60%;
}
</style>

<style >
.collapsable-source pre {
    font-size: small;
}

.input-field {
    display: flex;
    align-items: center;
    width: 260px;
}

.input-field label {
    flex: 0 0 auto;
    padding-right: 0.5rem;
}

.input-field input {
    flex: 1 1 auto;
    height: 20px;
}

.input-field button {
    flex: 0 0 auto;
    height: 28px;
    font-size: 20px;
    width: 40px;
}

.icon-barcode {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHBhdGggZD0iTTAgNGg0djIwaC00ek02IDRoMnYyMGgtMnpNMTAgNGgydjIwaC0yek0xNiA0aDJ2MjBoLTJ6TTI0IDRoMnYyMGgtMnpNMzAgNGgydjIwaC0yek0yMCA0aDF2MjBoLTF6TTE0IDRoMXYyMGgtMXpNMjcgNGgxdjIwaC0xek0wIDI2aDJ2MmgtMnpNNiAyNmgydjJoLTJ6TTEwIDI2aDJ2MmgtMnpNMjAgMjZoMnYyaC0yek0zMCAyNmgydjJoLTJ6TTI0IDI2aDR2MmgtNHpNMTQgMjZoNHYyaC00eiI+PC9wYXRoPjwvc3ZnPg==);
}

.overlay {
    overflow: hidden;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.3);
}



.overlay__content {
    top: 50%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-height: 90%;
    max-width: 800px;
}



.overlay__close {
    position: absolute;
    right: 0;
    padding: 0.5rem;
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    background-color: white;
    cursor: pointer;
    border: 3px solid black;
    font-size: 1.5rem;
    margin: -1rem;
    border-radius: 2rem;
    z-index: 100;
    box-sizing: content-box;
}

.overlay__content video {
    width: 100%;
    height: 100%;
}

.overlay__content canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
}

#interactive.viewport {
    position: relative;
}

#interactive.viewport > canvas, #interactive.viewport > video {
    max-width: 100%;
    width: 100%;
}

canvas.drawing{
    position: absolute;
    left: 0;
    top: 0;
}
.drawingBuffer {
    position: absolute;
    left: 0;
    top: 0;
}

/* line 16, ../sass/_viewport.scss */
.controls fieldset {
  border: none;
}
/* line 19, ../sass/_viewport.scss */
.controls .input-group {
  float: left;
}
/* line 21, ../sass/_viewport.scss */
.controls .input-group input, .controls .input-group button {
  display: block;
}
/* line 25, ../sass/_viewport.scss */
.controls .reader-config-group {
  float: right;
}
/* line 28, ../sass/_viewport.scss */
.controls .reader-config-group label {
  display: block;
}
/* line 30, ../sass/_viewport.scss */
.controls .reader-config-group label span {
  width: 11rem;
  display: inline-block;
  text-align: right;
}
/* line 37, ../sass/_viewport.scss */
.controls:after {
  content: '';
  display: block;
  clear: both;
}

/* line 22, ../sass/_viewport.scss */
#result_strip {
  margin: 10px 0;
  border-top: 1px solid #EEE;
  border-bottom: 1px solid #EEE;
  padding: 10px 0;
}
/* line 28, ../sass/_viewport.scss */
#result_strip ul.thumbnails {
  padding: 0;
  margin: 0;
  list-style-type: none;
  width: auto;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}
/* line 37, ../sass/_viewport.scss */
#result_strip ul.thumbnails > li {
  display: inline-block;
  vertical-align: middle;
  width: 160px;
}
/* line 41, ../sass/_viewport.scss */
#result_strip ul.thumbnails > li .thumbnail {
  padding: 5px;
  margin: 4px;
  border: 1px dashed #CCC;
}
/* line 46, ../sass/_viewport.scss */
#result_strip ul.thumbnails > li .thumbnail img {
  max-width: 140px;
}
/* line 49, ../sass/_viewport.scss */
#result_strip ul.thumbnails > li .thumbnail .caption {
  white-space: normal;
}
/* line 51, ../sass/_viewport.scss */
#result_strip ul.thumbnails > li .thumbnail .caption h4 {
  text-align: center;
  word-wrap: break-word;
  height: 40px;
  margin: 0px;
}
/* line 61, ../sass/_viewport.scss */
#result_strip ul.thumbnails:after {
  content: "";
  display: table;
  clear: both;
}

@media (max-width: 603px) {
  /* line 2, ../sass/phone/_core.scss */
  #container {
    margin: 10px auto;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
}
@media (max-width: 603px) {
  /* line 5, ../sass/phone/_viewport.scss */
  #interactive.viewport {
    width: 100%;
    height: auto;
    overflow: hidden;
  }

  /* line 20, ../sass/phone/_viewport.scss */
  #result_strip {
    margin-top: 5px;
    padding-top: 5px;
  }

  #result_strip ul.thumbnails {
    width: 100%;
    height: auto;
  }

  /* line 24, ../sass/phone/_viewport.scss */
  #result_strip ul.thumbnails > li {
    width: 150px;
  }
  /* line 27, ../sass/phone/_viewport.scss */
  #result_strip ul.thumbnails > li .thumbnail .imgWrapper {
    width: 130px;
    height: 130px;
    overflow: hidden;
  }
  /* line 31, ../sass/phone/_viewport.scss */
  #result_strip ul.thumbnails > li .thumbnail .imgWrapper img {
    margin-top: -25px;
    width: 130px;
    height: 180px;
  }
}
</style>

<style scoped>
.prod-data{
	display: flex;
}
.prod-data img{
	max-width: 30%;
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
.searchblock{
  border: 2px solid #ffa500;
  -webkit-box-shadow: 4px 5px 4px 0px rgb(0 0 0 / 30%);
  box-shadow: 4px 5px 4px 0px rgb(0 0 0 / 30%);
  background-color: #ffffff;
  display: block;
  z-index: 100000;
  position: fixed;
  bottom: 4vh;
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

.modal-footer .btn{
	margin: 10px;
    margin-top: 5px;
    border-radius: 5px;
    background: #ffa500;
    -webkit-box-shadow: 6px 10px 5px 0px rgb(0 0 0 / 75%);
    box-shadow: 4px 4px 3px 0px rgb(0 0 0 / 40%);
    color: #ffffff;
    border: 2px solid #ffa500;
}
.modal-dialog .modal-footer{
	background-color: #dddddd;
}
.img-fluid.modal-img{
	width: 50%;
    display: block;
}
</style>
<style>
.modal-body{
	max-height: 80%;
    overflow: -moz-scrollbars-vertical; 
    overflow-y: scroll;
}
.modal{
	width: 90%;
	margin-left: 5%;
	margin-right: 5%;
	height: 80vh;
}
.modal.show .modal-dialog{
	height: 80%;
}
.modal-content{
	height: 80%;
}
.mostly-customized-scrollbar::-webkit-scrollbar {
  width: 5px;
  height: 8px;
  background-color: #aaa; /* or add it to the track */
}
.modal-body::-webkit-scrollbar {
  width: 5px;
  height: 8px;
  background-color: #aaa; /* or add it to the track */
}
.modal-body::-webkit-scrollbar-thumb {
    background: #000;
}
</style>