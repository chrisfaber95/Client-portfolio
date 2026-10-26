<template>
	<div class="shelfunit">
		<div class="shelfproduct" v-for="(item, index) in filteredProducts" v-bind:key="item.product_id + '--' + index" :id="item.ean">
			<Product v-bind:product="item"/>			
		</div>
	</div>
</template>

<script>
import {HTTP} from '@/assets/scripts/http-common.js';
import cart from '../cart'
import Product from '@/components/Product.vue'
import $ from 'jquery'


export default {
  name: 'HelloWorld',
  components: {
      Product
    },
  props: {
    row: Number
  },
	data: function () {
		return {
			rowSize: '',
			showMenu: false,
			productList:[],
			isModalVisible: false,
			cartItems: new Object(null),
			cart1: cart,
			currentScroll: 900,
			activeDepartment: ''
		} 
	},
	methods: {
		even: function() {
			// Set slice() to avoid to generate an infinite loop!
			return this.productList.slice().sort(function(a, b) {
				return a.schapplaats - b.schapplaats;
			});
		},
		setProductList: function(doc){
			for(var i = 0; i < this.$parent.products.length; i++) {
				if (this.row == this.$parent.products[i].schaphoogte) {
					this.productList.push(this.$parent.products[i])
				}
			}
		},
		expandList(){
			for(var i = 0; i < (this.rowlength - this.productList.length); i++) {
				this.productList.push(this.productList[i])
			}
		},
		addProductList:function(prods){
			for(var i = 0; i < prods.length; i++) {
				this.productList.push(prods[i])
			}
		},
		getProducts: function(){
			if(this.activeDepartment){
				this.$store.commit('updateproductsLoaded', false)
				var active = this.activeDepartment
				HTTP.get('product', {params: {dep: active, row: this.row - 1, app: 3}})
				.then((response) => {
					this.productList = response.data.docs
					this.$store.commit('updateproductsLoaded', true)
				})
				.catch((errors) => {
					console.log(errors)
				})
			}
			return this.productList;
		},
		scrollToProduct: function(item){
			var active = this.activeDepartment
			const prod = item
			HTTP.get('product', {params: {dep: active, row: this.row - 1, app: 10}})
			.then((response) => {
				this.productList = response.data.docs
				this.$parent.scrollTo(prod.ean)
			})
			.catch((errors) => {
				console.log(errors)
			})
			return this.productList;
		},
		setProductSize: function(amount){
			let view = window.innerHeight
			let boxheight = view * 0.8 * (1/amount)
			var productsize = 100/amount + "%"
			//$(".product").css({"width": boxheight *0.70 + "px"});
			$(".shelf").css({"height": productsize});
		},
		infiScroll: function(){
			var self = this
			$('#shelfs').scroll(function () {
				if ($('#shelfs')[0].scrollLeft > $('#view').width() / 2) {					
					self.currentScroll += 10
					//if(self.productList.length <= self.currentScroll){
					//	$('#shelfs').unbind('scroll');
					//}
				} 
			});
		},
		resetScroll:function(){			
			this.currentScroll = 900
		}
	//	changeOr: function(or){
	//		if(or == 0){
	//			$(".product").css({"width": '20%'});
	//		}
	//		else if(or == 1){
	//			$(".product").css({"width": '30%'});
	//		}
	//	}
	},
	created(){
	},
	mounted(){
	//	this.changeOr(this.$store.state.screenorientation)
		//this.setProductSize(this.size)		
		this.infiScroll()
		var self = this
		setTimeout(function () {
			//self.setProductSize(self.size)
		}, 300);
	},
	computed: {
		filteredProducts:function()
		{	
			const products = []
			//for(var i in this.productList.slice(0, this.currentScroll)){
			for(var i in this.productList){
				if(this.productList[i]){
					if(this.productList[i].categoryname1 == this.activeDepartment && this.productList[i].product_id){
						products.push(this.productList[i])
					}
				}
			}
			//this.setProductSize(this.size);	
			return products
		},
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
			}
		},
		'$store.state.screenorientation':{
			immediate: true,
			deep: true,
			handler(){				
				//	this.changeOr(this.$store.state.screenorientation)
			}
		},	
		'$store.state.rowsize':{
			immediate: true,
			deep: true,
			handler(){			
				this.rowSize = this.$store.state.rowsize
				this.getProducts()
				this.resetScroll()
			}
		},
		'$store.state.department':{
			immediate: true,
			deep: true,
			handler(){				
				this.activeDepartment = this.$store.state.department
				this.getProducts()
				this.resetScroll()
			}
		},
		'$store.state.longestrow':{
			immediate: true,
			deep: true,
			handler(){				
				this.rowlength = this.$store.state.longestrow
				this.expandList()
			}
		},
		productList: function(){
			if(this.rowlength < this.productList.length){
				this.$store.commit('updateLongestrow', this.productList.length)
			}
			else{			
				this.expandList()
			}
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.shelfunit{
	height:100%;
	display: flex;
}
@media screen and (orientation: landscape) {
	.shelfunit{
		max-height: 50vh;
	}
}
</style>