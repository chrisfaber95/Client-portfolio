<template>
	<div class="privacy">
		<pdf id="pdf-iframe"  v-for="i in 6"
			:key="i"
			:page="i"
			:src="`${publicPath}CoopLubbers-gebruiksvoorwaarden-online.pdf`"></pdf>
	</div>	
</template>

<script>
import router from "../router"
import {HTTP} from '@/assets/scripts/http-common.js';
import pdf from 'vue-pdf'

export default {
  name: 'Privacy',
  components: {
  pdf
  },
  props: {
    msg: String
  },
	data: function () {
		return {
			publicPath: process.env.BASE_URL
		}
	},
	methods: {
	},
	created(){
	},
	mounted(){
	},
	watch: {
	}
}
</script>
<style scoped>
	.spelregels{
		overflow-y: scroll;
	}
	.privacy{		
		overflow-y: scroll;
	}
</style>
<style>
	#pdf-iframe canvas{
		position: inherit;
	}
</style>