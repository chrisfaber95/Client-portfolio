<template>
	<div class="privacy">
		<!--<pdf id="pdf-iframe"  v-for="i in pdfLength"
			:key="i"
			:page="i"
			:src="`${state.publicPath}${pdfurl}`"></pdf>-->
			<div class="tac-text" v-html="props.tac">
			</div>
	</div>	
</template>

<script setup>
import { reactive, defineProps, onMounted, computed, defineEmits, defineExpose, watch, ref } from 'vue';
import {useRoute} from 'vue-router'
//import pdf from 'vue3-pdf'

const props = defineProps({
    'pdfurl': String,
    'pdfLength': Number,
	'tac': String
})


	const state = reactive({
        publicPath: process.env.BASE_URL
        //publicPath: 'https://localhost:3001'
	})
const route=useRoute();
onMounted(() => {
	})

</script>
<style scoped>
	.spelregels{
		overflow-y: scroll;
	}
	.privacy{		
		overflow-y: scroll;
		overflow-x: hidden;
		width: 100%;
	}
	.tac-text{
		padding-left: 5px;
		padding-right: 5px;
		text-align: left;
	}
	
</style>
<style>
	#pdf-iframe canvas{
		position: inherit;
	}
	.tac-text ul{
		list-style-type: decimal !important;
	}
</style>