<template>
	<div class="order container-fluid">		
	</div>	
</template>

<script>
import router from "../router"
import cart from '../cart'
import auth from '@/assets/scripts/auth';
import {HTTP} from '@/assets/scripts/http-common.js';

export default {
  name: 'orderPage',
  components: {
  },
  props: {
  },
	data: function () {
		return {
		}
	},
	methods: {
		confirmOrder: function(){
			var data = {
				  order_id: this.$route.params.orderid,
				  user: 0,				  
				}
				if(data.order_id == null){
					alert("Order vergeten");
				}
				else{
					HTTP.put('order/'+data.order_id, data)
					.then((response) => {
						if(response.data.docs._links){
							window.location.href = response.data.docs._links.checkout.href
						}
						else{
							router.push('/')
						}
					})
					.catch((errors) => {
						console.log(errors)
					})
				}
		}
	},
	created(){
		this.confirmOrder()
	},
	mounted(){
	},
	watch: {
	},
	computed:{
	}
}
</script>
<style scoped>
</style>