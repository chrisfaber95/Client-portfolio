<template>
	<div class="settings">
		<!--<div class="row">
			<div class="col-6" v-for="item in sec_nav" v-bind:key="item.id">
				<b-button @click="slug">{{item.tag}}</b-button>
			</div>
		</div>
		<div v-if="page= 'profile'">
			<div class="profile" id="profile">
				<h2>Profiel</h2>
				<label>Naam</label>
				<input type="text" name="name" v-model="credentials.userinfo.name" @change="updateCreds" /><br>
				<label>Klantenkaart</label>
				<input type="text" name="pasnummer" v-model="credentials.userinfo.pasnummer" @change="updateCreds" /><br>
				<label>Telefoon</label>
				<input type="text" name="telefoon" v-model="credentials.userinfo.telefoon" @change="updateCreds" /><br>
			</div>
			<div class="passwordChange" id="passwordChange">
				<h2>Profiel</h2>
					<label>Oud Wachtwoord</label>
					<input type="text" name="name" /><br>
					<label>Oud wachtwoord bevestiging</label>
					<input type="text" name="name" /><br>
					<label>Nieuw wachtwoord</label>
					<input type="text" name="name" /><br>
					<label>Nieuw wachtwoord bevestig</label>
					<input type="text" name="name" /><br>
			</div>
		</div>-->		
		<div class="col-4" @click="changeRowcount()">
			<b-form-group id="input-group-4">
				<b-form-select
					type="number" 
					name="rij"
					:options="options"
					v-model="rowSize" 
					id= "input-4"
				>{{settings.rowSize}}</b-form-select>
			</b-form-group>
		</div>
		{{settings}}
	</div>
</template>

<script>
import auth from '@/assets/scripts/auth';

export default {
  name: 'settings',
  props: {
    msg: String
  },
	data: function () {
		return {
			credentials: auth.user,			
			sec_nav:[
				{ id: 0, tag: "Profiel", slug: "profile"},
				{ id: 1, tag: "Mijn bestellingen", slug: "myorders"}
			],
			page: 'profile',			
			options: [
				{ value: 3, text: '3 rijen' },
				{ value: 4, text: '4 rijen' },
				{ value: 5, text: '5 rijen' }
			],
			rowSize: 5,
			settings: {
				rowSize: 5
			}
		}
	},
	methods: {
		updateCreds: function(item){
		//	auth.updateInfo();
		},
		changeRowcount: function(){			
			console.log( this.rowSize)	
			this.settings = JSON.parse(localStorage.getItem('settings'))
			this.settings.rowSize = this.rowSize
			console.log(JSON.stringify(this.settings))	
			localStorage.setItem('settings', JSON.stringify(this.settings));
		}
	},
	created(){
		//auth.reloadInfo()
	},
	mounted(){
		if(!JSON.parse(localStorage.getItem('settings'))){
			this.settings.rowSize = 5
			this.rowSize = this.settings.rowSize
			localStorage.setItem('settings', JSON.stringify(this.settings));
		}
		else{
			this.settings = JSON.parse(localStorage.getItem('settings'))	
			this.rowSize = this.settings.rowSize
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

#profile{
	width:100%;
	text-align: left;
	margin: 10px;
}
#profile label{
	width: 30%;
}

#profile input{
	width: 60%;
	margin: 10px;
}
#passwordChange{
	width:100%;
	text-align: left;
	margin: 10px;
}
#passwordChange label{
	width: 40%;
}

#passwordChange input{
	width: 50%;
	margin: 10px;
}
button{
    margin-top: 5px;
	border-radius: 5px;
	background: #ffffff;
	-webkit-box-shadow: 6px 10px 5px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 6px 10px 5px 0px rgba(0,0,0,0.75);
    box-shadow: 4px 4px 3px 0px rgba(0,0,0,0.4);
	color:#ee151e;
    border: 2px solid #ffa500;
} 
</style>
