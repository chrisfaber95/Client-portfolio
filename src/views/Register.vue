<template>
  <div class="login">
	<h2>Register</h2>
        <div class="new-user">
			<form class="register-user">
				<div>
					<label for="firstname">Naam</label>
					<input name="firstname" type="text" v-model="user.firstName"/>
				</div>
				<div>
					<label for="lastname">Achternaam</label>
					<input name="lastname" type="text" v-model="user.lastName"/>
				</div>
				<div>
					<label for="cardnumber">Kaartnummer</label>
					<input name="cardnumber" type="text" v-model="user.username"/>
				</div>
				<div>
					<label for="email">E-mailadres</label>
					<input name="email" type="text" v-model="user.email"/>
				</div>
				<div>
					<label for="password">Wachtwoord</label>
					<input name="password" type="text" v-model="user.password"/>
				</div>
				<div>
					<label for="confirmpassword">Bevestig wachtwoord</label>
					<input name="confirmpassword" type="text" @blur="checkPassword" v-model="user.passwordConfirm"/>
				</div>
			</form>
		</div>
			<b-button @click="addAccount()">Account toevoegen</b-button>
  </div>
</template>


<script>
import auth from '@/assets/scripts/auth';
    export default {    
        name: "register",
		data(){
			return{
            user: {
                firstName: '',
                lastName: '',
                username: '',
                password: '',
				passwordConfirm: '',
                email: ''
            },
			error: ''
			}
		},
		component:{
		},
        methods: {    
            addAccount() {
				auth.register(this.user)
			  
			},
			checkPassword: function(){
				if(this.user.password != this.user.passwordConfirm){
					alert("wachtwoord niet gelijk");
				}
			}
		}
	}
    
</script>
