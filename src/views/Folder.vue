<template>
	<div class="folder1">
		<iframe
            :src="`https://folder.coop.nl/week-${weeknumber}-${year}-1/page/1`"
            width="100%"
            height="100%"
            frameborder="0" >
           </iframe>
		<!--<folder :pageAmount="6" :doublePage="true">
		</folder>	-->	  
	</div>
</template>

<script setup>
import auth from '@/assets/scripts/auth';
import { reactive, defineProps, onMounted, computed, defineEmits, defineExpose } from 'vue';	
import {HTTP} from '@/assets/scripts/http-common.js';
import { DateTime } from 'luxon';
import { useStore } from 'vuex'
import Folder from '@/components/Basics/Folder/Folder.vue'
//import Stamps from '@/components/'
const state = reactive({
})

const store = useStore()

	const weeknumber = computed(() => {
		return DateTime.local().weekNumber
	})
	const year = computed(() => {
		return DateTime.local().year
	})
	onMounted(() => {
	})
	
	function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx);
}

</script>
	
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.folder{
}
</style>
<style>
    iframe #publication #content.front-cover #banner-cta{
        display: none;
    }
</style>
