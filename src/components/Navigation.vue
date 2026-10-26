<template>
	<div class="navigation">
		<ul>
			<router-link :to=item.slug v-for="item in nav_public" v-bind:key="item.id">
				<div class="sidebar-item">
					{{item.tag}}
				</div>
			</router-link>
		</ul>
		<ul v-if="!auth.isAuthenticated()">
			<router-link :to=item.slug v-for="item in nav_no_user" v-bind:key="item.id">
				<div class="sidebar-item">
					{{item.tag}}
				</div>
			</router-link>
		</ul>
		<a v-if="auth.isAuthenticated()">
			<router-link :to=item.slug v-for="item in nav_user" v-bind:key="item.id">
				<div class="sidebar-item">
					{{item.tag}}
				</div>
			</router-link>
			<div class="sidebar-item" @click="logout()">
				Logout
			</div>
		</a>
		<div class="sizing sidebar-item">
			<p>Schaphoogte:</p><b-button @click="changesize">{{rowSize}}</b-button>
		</div>
	</div>
</template>

<script>
import auth from '@/assets/scripts/auth';
export default {
	name: 'navigation',
	props: {
		msg: String
	},
	data: function () {
		return {
			rowSize: 5,
			nav_public: [
				{ id: 0, tag: "Producten", slug: "/"},
				//{ id: 1, tag: "Folder", slug: "/folder"},
				//{ id: 2, tag: "Aanbiedingen", slug: "/folder"},
				//{ id: 3, tag: "Zelfscanner", slug: "/zelfscanner"},
				//{ id: 4, tag: "Privacybeleid", slug: "/privacy"},
				{ id: 5, tag: "Algemene Voorwaarden", slug: "/privacy"},
				//{ id: 6, tag: "Informatie", slug: "/information"},
				//{ id: 7, tag: "Spelregels", slug: "/spelregels"},
				//{ id: 8, tag: "Klantenkaart", slug: "/loyalty_card"},
				//{ id: 9, tag: "Winkel", slug: "/store"},
				//{ id: 10 tag: "Recepten", slug: "/recept"}
			],
			nav_no_user:[
				//{ id: 11, tag: "Registreren", slug: "/register"},
				//{ id: 12, tag: "Login", slug: "/login"}
			],
			nav_user: [
				{ id: 13, tag: "Favorieten", slug: "/favorites"},
				{ id: 14, tag: "Instellingen", slug: "/settings"},
				{ id: 15, tag: "Bestellingen", slug: "/bestelling"},
				{ id: 16, tag: "Spaaracties", slug: "/spaaracties"},
			],
			user: auth.user,
			auth: auth
		}
	},
	methods: {
		logout(){
			auth.logout()
		},
		changesize: function(){
			if(this.rowSize == 5){
				this.rowSize = 3
			}
			else{
				this.rowSize++
			}
			
		}
	},
	created(){
	},
	mounted(){
	//	auth.checkAuth();
	},
	watch:{
		rowSize: function(){
				this.$store.commit('updateRowsize', this.rowSize)
		},
		'$store.state.rowsize':{
			immediate: true,
			deep: true,
			handler(){				
				this.rowSize = this.$store.state.rowsize
			}
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navigation{
    -webkit-box-shadow: 4px 5px 4px 0px rgb(0 0 0 / 30%);
    box-shadow: 4px 5px 4px 0px rgb(0 0 0 / 30%);	
    border-bottom: 1px solid #000000;
    border-left: 2px solid #000000;
    border-top: 1px solid #000000;	
    border-bottom-left-radius: 30px;
    border-top-left-radius: 30px;
    background-color: #ffffff;
    height: 90vh;
    display: block;
    overflow-y: scroll;
    z-index: 100000;
    position: fixed;
    bottom: 10vh;
    width: 40vw;
    right: 0;
	top: 5vh;
	display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
}
.navigation ul{
	padding:0;
	padding-top: 10px;
}
.sidebar-item{
	color: #000000;
	font-weight: 600;
}
.navigation a.router-link-exact-active .sidebar-item{
    color: #ff8800;
}
.sizing p{
	margin-bottom: 0;
}
.sizing .btn{	
    color: #ffffff;
	font-weight: 600;
    background: #ffa500;
    -webkit-box-shadow: 6px 10px 5px 0px rgb(0 0 0 / 75%);
    box-shadow: 4px 4px 3px 0px rgb(0 0 0 / 40%);
    border: 2px solid #ffa500;
}
</style>
