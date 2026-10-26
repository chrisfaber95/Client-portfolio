<template>
  <div class="login">
	<div class="container">
		<h2>Login</h2>
        <form id="loginForm">
            <label>Email</label><input type="text" name="email" v-model="credentials.username" /><br>
            <label>Wachtwoord</label><input type="password" name="password" v-model="credentials.password" /><br>    
            <button type='button' v-on:click="submit" class="btn btn-lg btn-primary btn-block">Login</button >
        </form> 
	</div>
	<div class="container">
		<h2> Nog geen account </h2>
		<router-link :to="register.slug"><button type='button' v-on:click="submit" class="btn btn-lg btn-primary btn-block">Registreer hier</button ></router-link>
	</div>
  </div>
</template>


<script>
import router from "../router"
import auth from '@/assets/scripts/auth';
import axios from "axios" 
import bcrypt from 'bcryptjs'
   
const API_URL = 'https://chrisfaber.tk/api'
    export default {    
        name: "Login",
		data(){
			return{
			credentials: {
				username: '',
				password: ''
			},
			error: '',
			register: { id: 0, tag: "Registreren", slug: "/register"},
			}
		},
		component:{
		},
        methods: {    
            submit() {
				var data = {
				  username: this.credentials.username,
				  password: this.credentials.password
				}
				
				// We need to pass the component's this context
				// to properly make use of http in the auth service
				auth.login(data);
			  
			}
		}
	}
    
</script>

<style scoped>
	.btn-block{
		width: 25%;
		margin-left: auto;
		margin-right: auto;
		margin-top: 10px;
		margin-bottom: 10px;
	}
	#loginForm input{
		margin: 5px;
	}
</style>
