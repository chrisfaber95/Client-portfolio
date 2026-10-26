<template>
	<div class="order container-fluid">
		<pdf id="pdf-iframe1" :src="`${publicPath}informatie.pdf`"></pdf>
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

</style>