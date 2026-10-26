<template>
  <div id="app">
	<div class="landscapeoverlay" ref="overlay">
		<div class="warning">
			<h2>Deze applicatie is niet beschikbaar in landschap modus</h2>	
		</div>
	</div>
	<!--<div class="overlay" ref="overlay" v-if="screenor != 0">
		<h2>Deze applicatie is niet beschikbaar in landschap modus {{screenorientation}}</h2>
	</div>-->
	<Header />
    <router-view class="view" id="view"/>
	
	<footer>
		<cookie-law theme="dark-lime">
			<div slot-scope="props">
				<div class="modaloverlay" @click="fadeCookie()" v-if="modalOpened"></div>				
				<transition name="fadeCookie" v-on:enter="enter">	
					<div class="cookies" v-if="modalOpened">						
						<div class="closebutton">
							<b-button @click="fadeCookie()" >X</b-button>
						</div>
						<h2>Cookie Settings</h2>
						<p>
							We use cookies to provide you with the best possible experience.
							Read more about our policies in <router-link :to="'/privacy'">Terms and Conditions</router-link>
						</p>
						<div class="cookiechoices">
							<div class="choice">
								<p>Essential cookies: </p>
								<b-checkbox v-model="status" value="accepted" unchecked-value="not_accepted"  disabled></b-checkbox>
							</div>
						</div>
						<button class="skew" @click="cookieDB(props)"><span>Accept</span></button>
						<Privacy />
					</div>
				</transition>		
				<div class="modaloverlay"></div>
				<div class="cookie-block">
					<p>
						<a @click="fadeCookie()">This website uses cookies to ensure you get the best experience on our website. Click on this text for more information</a>
					</p>		
					<button class="skew" @click="cookieDB(props)"><span>Cookies accepteren</span></button>					
				</div>
			</div>
		</cookie-law>
	</footer>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import Privacy from '@/views/Privacy.vue'
import cart from '@/cart'
import $ from 'jquery'
import CookieLaw from 'vue-cookie-law'
import axios from 'axios'
import {HTTP} from '@/assets/scripts/http-common.js';

export default {
  name: 'home',
  components: {
    Header,
	CookieLaw,
    Privacy
  },
	data: function () {
		return {
			screenorientation: 0,
			modalOpened: false,
			status: "accepted",
			cookies: false
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
		checkCookies(){
			if(localStorage['cookie:accepted'] === true){
				this.cookies = true
			}
			else{
				this.cookies = false
			}
		},
		cookieDB(prop){
			prop.accept()
			this.checkCookies()
			axios.get('https://api.ipify.org?format=json')
			.then(function (response) {
				// handle success
				console.log(response);				
				var data = {
					ip: response.data.ip
				}
				HTTP.post('site/cookies', data)
				.then((response) => {
					console.log(response)
				})
				.catch((errors) => {
					//console.log(errors)
				})
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			})
			.then(function () {
				// always executed
			});
		},
		appheight: function(){			
			const appHeight = () => {
				const doc = document.documentElement
				doc.style.setProperty('--app-height', `${window.innerHeight}px`)
				doc.style.setProperty('--app-width', `${window.innerWidth}px`)
				
				let viewheight = $(window).height();
				let viewwidth = $(window).width();
				if(viewwidth >= viewheight*2){
					viewheight = viewheight*2
				}
				else{
					viewheight = $(window).height();
				}
				doc.style.setProperty('--app-height', `${viewheight}px`)
				doc.style.setProperty('--app-width', `${viewwidth}px`)	
			}
			window.addEventListener('resize', appHeight)
		},
		iOS: function() {
			return [
				'iPad Simulator',
				'iPhone Simulator',
				'iPod Simulator',
				'iPad',
				'iPhone',
				'iPod'
			].includes(navigator.platform)
		// iPad on iOS 13 detection
			|| (navigator.userAgent.includes("Mac") && "ontouchend" in document)
		},
		setViewport: function(){
			setTimeout(function () {
				let viewheight = $(window).height();
				let viewwidth = $(window).width();
				if($(window).width() >= $(window).height()*2){
					viewheight = viewheight*2	
				}
				else{			
					viewheight = $(window).height();
				}
				let viewport = document.querySelector("meta[name=viewport]");
				viewport.setAttribute("content", "height=" + viewheight + "px, width=" + viewwidth + "px, initial-scale=1.0, user-scalable=no, shrink-to-fit=no");
			}, 300);
		},
		handleOrientationChange() {
			const orientation = window.screen.orientation.type
				if (orientation === "portrait-primary") {
					this.screenorientation = 0
				} else if (orientation === "landscape-primary") {
					this.screenorientation = 1
				}
		}
	},
	created(){
		this.setViewport()
		if (window.matchMedia('(display-mode: standalone)').matches) {
			document.getElementById('header').style.height = '5vh'
			document.getElementById('view').style.height = '95vh'
		}
		cart.store = this.$store
		cart.reloadCart()
	},
	mounted(){
	},
	computed:{
		screenor: function(){
			return this.screenorientation
		},
		cookiescheck: function(){
			return this.cookies
		}
	},
	watch:{
		'$store.state.winkelmand':{
			immediate: true,
			deep: true,
			handler(){				
				this.$store.commit('updateBtw', 1),
				this.$store.commit('updatePrice', 1),
				cart.saveCartLocal()
			}
		},
		screenorientation:{
			immediate: true,
			deep: true,
			handler(){			 
				this.$store.state.screenorientation = this.screenorientation
			}
		}
		
	}
}
</script>

<style lang="scss">
@import "./assets/styles/styles.scss";
:root {
   --app-height: 100%;
   --app-width: 100%;
}

html {
  height: -webkit-fill-available;
    height: 100%;
    width: 100%;
}
html, body{
	//height: 100vh;
	//min-height: 100vh;
	//min-height: -webkit-fill-available;	
	//max-height: 100vh;
	//max-height: -webkit-fill-available;
    height: 100%;
    width: 100%;
	overflow-y: hidden;
}
@media screen and (orientation: landscape) {
  html, body {
	overflow: scroll;
	height: unset;
  }
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: inherit;
  overflow-y: hidden;
}

.view{
	height: 95%;
}
@media screen and (orientation: landscape) {
	.view{
		height: unset;
		max-height: unset;
	}
}

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
.cookie-block{	
    z-index: 11;
    position: relative;
}

.cookiechoices{
	display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    width: 80%;
    align-content: center;
    margin-left: auto;
    margin-right: auto;
}

.cookiechoices .choice{    
	display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    flex-wrap: wrap;
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
.landscapeoverlay{
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	display: none;
	background: #aaaaaa;
	z-index: 99999999;
}
.landscapeoverlay .warning{
	color: white;
	background-color: #ffa500;
	width: 80%;
	height: 80%;
	display: flex;
	flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
	padding: 10px;
}
.landscapeoverlay .warning h2{
	font-size: 2rem;
	font-weight: 600;
	width: 50%;
}
.landscapeoverlay .warning img{
	width: 50%;
}
@media only screen and (orientation: landscape) and (max-height: 767px) and (max-height: 767px) {
	.landscapeoverlay{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
}
</style>
