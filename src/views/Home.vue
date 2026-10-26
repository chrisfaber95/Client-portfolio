<template>
  <div class="home">
	<div class="shelfList" id="shelfs" v-if="rowamount > 0">
		<div class="shelf" :style="{'height': 100/rowamount+'%'}" v-for="(n, index) in rowamount" v-bind:key="rowamount+'shelf'+index+'-'+activeDepartment" ref="shelf">
			<Shelfunit v-bind:row=n ref="shelfing" v-bind:key="rowamount+'x'+index"/>
		</div>
	</div>
	<Departments />
	<hr />
	<div class="shoppingcart">
		<Shoppingcart />
	</div>
  </div>
</template>

<script>
// @ is an alias to /src
import Shoppingcart from '@/components/Shoppingcart.vue'
import Shelfunit from '@/components/Shelfunit.vue'
import Departments from '@/components/Departments.vue'
import {HTTP} from '@/assets/scripts/http-common.js';


export default {
  name: 'home',
  components: {
	Shoppingcart,
	Shelfunit,
	Departments
  },
	data: function () {
		return {
			rowSize: '',
			activeDepartment: null,
			products: null,
			searchProduct: '',
			settings: null
		}
	},
	methods: {
		changeActiveDepartment: function (){
			try{
				for(var i = 0; i < this.$refs.shelfing.length; i++){
					this.$refs.shelfing[i].resetScroll();
					this.$refs.shelfing[i].getProducts(this.activeDepartment);
				}
			}
			catch(e){
				console.log(e)
			}
			
		},
		goToProduct: function(item){
			try{
				this.$store.commit('updateDepartment', item.categoryname1)
				for(var i = 0; i < this.$refs.shelfing.length; i++){
					this.scrollTo(item.ean);	
				}
			}
			catch(e){
				console.log(e)
			}
		},
		scrollTo: function(item){			
			setTimeout(function () {					
				try{
					document.getElementById(item).scrollIntoView({
						behavior: "smooth", block: 'nearest', inline: 'start' 
					});
					document.getElementById(item).classList.add('active-product')
					setTimeout(() => {
						document.getElementById(item).classList.remove('active-product')
					}, 10000);
				}
				catch(e){
					console.log(e)
				}
			}, 1000);
		},
		getProducts: function(norow){
			var active = this.activeDepartment
			var prodlist = null;
			HTTP.get('product', {params: {dep: active, row: norow -1, app: 3}})
			.then((response) => {
				prodlist = response.data.docs
				return prodlist;
			})
			.catch((errors) => {
				console.log(errors)
				return prodlist;
			})
		},
		chunkArray: function(myArray, chunk_size){
			var results = [];
			
			while (myArray.length) {
				results.push(myArray.splice(0, chunk_size));
			}
			
			return results;
		},
		changeRowcount: function(amount){
			if(amount != this.rowSize){			
				let old = this.rowSize
				this.rowSize = amount
				var ref = this.$refs.shelf.slice(Math.max(this.$refs.shelf.length - (this.$refs.shelf.length - amount), 0))
				for(var j = 0; j < ref.length; j++){
					ref[j].style.visibility = "hidden";
				}
				for(var j = 0; j < this.$refs.shelf.length; j++){
					var productsize = 100/amount + "%"
					this.$refs.shelf[j].style.height = productsize;
					this.$refs.shelfing[j].setProductSize(amount);				
				}
				if(old <= this.rowSize){
					setTimeout(()=> {					
						try{
							for(var i = 0; i < this.rowSize; i++){
								this.$refs.shelfing[i].setSubDepartment();
								this.$refs.shelfing[i].setProductSize(this.rowSize);		
								this.$refs.shelfing[i].getProducts(this.activeDepartment);
							}
						}
						catch(e){
							console.log(e)
						}
					}, 100);
					setTimeout(function () {					
						try{						
							this.addProds()
						}
						catch(e){
							console.log(e)
						}
					}, 300);
				}
			}
		},
		addProds: function(){			
			for(var j = 5; j > this.rowSize; j--){
				var active = this.activeDepartment
				var prod = []
				const self = this
				HTTP.get('product', {params: {dep: active, row: j -1, app: 3}})
				.then((response) => {
					prod = JSON.stringify(response.data)
					const prodarray = JSON.parse(prod).docs
					const prods = [];			
					for (var i = 0; i < prodarray.length; i += Math.floor(prodarray.length/self.rowSize)){
						prods.push(prodarray.slice(i, i + Math.floor(prodarray.length/self.rowSize)));
					}
					for(var i = 0; i < this.rowSize; i++){
						self.$refs.shelfing[i].addProductList(prods[i]);
					}
				})
				.catch((errors) => {
					console.alert(errors)
				})
			}
		}
	},
	created(){	
	//	this.getDepartments();
	},
	mounted(){	
	},
	computed: {
		filteredDepartments:function()
		{	
			const unique = this.departments
				.map(e => e['slug'])

			// store the keys of the unique objects
			.map((e, i, final) => final.indexOf(e) === i && i)

			// eliminate the dead keys & store unique objects
			.filter(e => this.departments[e]).map(e => this.departments[e]);
			var uniqueDepartments = unique.sort(function(a, b){
				var keyA = a.slug,
					keyB = b.slug;
					// Compare the 2 dates
					if(keyA < keyB) return -1;
					if(keyA > keyB) return 1;
					return 0;
				});
			return uniqueDepartments
		},
		
		filteredSubDepartments:function()
		{					
			return this.subdepartments
		},
		rowamount: function(){
			return this.rowSize
		}		
	},
	watch:{
		'$store.state.screenorientation':{
			immediate: true,
			deep: true,
			handler(){				
		//			this.changeOr(this.$store.state.screenorientation)
			}
		},		
		'$store.state.rowsize':{
			immediate: true,
			deep: true,
			handler(){			
				this.rowSize = this.$store.state.rowsize
				//this.changeRowcount()
			}
		},				
		'$store.state.department':{
			immediate: false,
			deep: true,
			handler(){				
				this.activeDepartment = this.$store.state.department
				this.changeActiveDepartment()
			}
		},
		'$store.state.productsLoaded':{
			immediate: true,
			deep: true,
			handler(){				
				if(this.$store.state.productsLoaded){
					this.addProds()
				}
			}
		},
	},
	metaInfo: {
		meta: [
			{ name: 'HandheldFriendly', content: "true" }
		]
	}
}
</script>

<style scoped>
.shelf{
	position: relative;
	white-space: nowrap;
}
.shelfList > .shelf:first-child{
	padding-top: 0px;
}
.shelfList{
	height: 80%;
	overflow-x: scroll;
	overflow-y: hidden;
	padding-bottom: 5px;
	/*background-color: #f9f9f9;*/
	display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.shoppingCart{
    background-color: #FFFFFF;
    width: var(--app-width);
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    border: 1px solid #111111;
}
.departmentList{
	width: 100%;
	overflow-x: scroll;
	overflow-y: hidden;
	display: inline-flex;
	white-space: nowrap;
	border-bottom: 2px solid #666666;
	border-top: 2px solid #666666;
	border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
	align-items: center;
    align-content: center;
    flex-wrap: nowrap;
    flex-direction: row;
}
.departmentList{
	/*background-color: #ffa500ab;
	background-color: rgb(187 187 187 / 67%);
    background: -webkit-gradient(linear, left top, left bottom, from(#d48700ab),color-stop(13%, #ec9600ab),color-stop(85%, #ec9600ab),to(#f79c00ab));
    background: linear-gradient(to bottom, #d48700ab 0%,#ec9600ab 13%,#ec9600ab 85%,#f79c00ab 100%);*/
	height: 7%;	
    box-shadow: 3px 4px 3px 0px rgba(0,0,0,0.3);
}
.departments, .subDepartments{
	background-color: #3a3a3a;
    padding: 2px;
	margin: 0px 5px;
	display: inline-flex;
	color: #f6f6f6;
    font-weight: 700;
    border: 1px solid #ffffff;
	border-radius: 10px;	
    box-shadow: 4px 5px 4px 0px rgba(0,0,0,0.4);
}
.departments span{
	font-size: 0.9rem;
	padding: 2px
}
.subdeplist{
	position: absolute;
    overflow-x: hidden;
    overflow-y: scroll;
    white-space: nowrap;
    border-bottom: 2px solid #666666;
    border-top: 2px solid #666666;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    bottom: 15%;
    background-color: orange;
    width: 50vw;
    max-height: 40vw;
    right: 5px;
    border-radius: 6px;
    border: 1px solid #cccccc;
    -webkit-box-shadow: 4px 5px 4px 0px rgba(0,0,0,0.4);
    box-shadow: 4px 5px 4px 0px rgba(0,0,0,0.4);
}
.selectedDep{
	background-color: var(--header-color);
}
.subDepartments{
display: block;
    max-width: 100%;
    white-space: normal;
}
.shoppingcart{
	height: 12%;
}
hr {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
}
@media screen and (orientation: landscape) {
  .shelfList {
    height: unset;
  }
}
</style>
