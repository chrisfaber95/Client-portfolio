<template>
	<div class="header">	
		<div class="logo">
			<router-link to="/">
				<img class="img-fluid" :src="`${publicPath}img/logo-supermarkt-coop.png`"/>
			</router-link>
			</div>
		<div class="ad-reserve"></div>
		<div id="menu-btn" @click="fade()">
			Menu
		</div>
		<div class="modaloverlay" v-if="modalOpened" @click="fade()"></div>						
		<transition name="fade" v-on:enter="enter">	
			<Navigation v-if="modalOpened"/>
		</transition>
	</div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
export default {
	components: {
		Navigation
	},
	data: function () {
		return {
			modalOpened: false,
			publicPath: process.env.BASE_URL,
			title: ""
		}
	},
	methods: {
		fade() {
			this.modalOpened = !this.modalOpened
		},
		enter() {
			setTimeout(function() {
				this.modalOpened = false;
				}, 1500);
		},
	},
	created(){
	},
	mounted(){
	
	}
}
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s
}

.fade-enter,
.fade-leave-to
{
  opacity: 0
}
.header{
	display: inline-flex;
	height: 6%;	
	width: 100%;
	background-color: var(--header-color); 
	padding: 5px 5px 0px 5px;
	border-bottom: 2px solid rgba(0,0,0,0.6);
	justify-content: space-between;
}


.logo{
	height: 100%;
}
.logo img{
	width: auto;
	max-height: 100%;
	height: unset;
}
.title{
	display: flex;
	justify-content: center;
}
.ad-reserve{
	display: flex;
    align-items: center;
    justify-content: center;
	margin-left: auto;
	margin-right: auto;
    color: var(--header-text-color);
}
#menu-btn{
	display: flex;
    align-items: center;
    justify-content: center;
    height: 85%;
    padding: 5px;	
	border-radius: 5px;
	margin-left: -5px;
	background: #ffffff;
	-webkit-box-shadow: 6px 10px 5px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 6px 10px 5px 0px rgba(0,0,0,0.75);
    box-shadow: 3px 3px 3px 0px rgba(0,0,0,0.6);
	color:#3e3e3e;
	font-weight: 700;
}

@media screen and (orientation: landscape) {
	.header{
		max-height: 50px;
	}
	.logo{
		height: unset;
	}
}
</style>
