<template>
	<div class="stamp">
        <img class="background" :src="`${state.publicPath}img/stamp-background.png`"/>
        <div class="content">
            <img :src="stamp ? `https://www.cooplubbers.nl/${actie.stamp_imgurl}` : `https://www.cooplubbers.nl/${actie.imgurl}`" :class="{'visible_stamp': stamp}" />
            <img class='coin visible_stamp' :src="last ? `img/coin_exchange.png`: ``" v-if="last" style="max-width: 80%;"/>
            <div class="number" v-html="stamp_number" v-if="!stamp && !last"></div>
        </div>
	</div>
</template>

<script setup>
import { reactive, defineProps, onMounted, computed, defineEmits, defineExpose } from 'vue';
	
import {HTTP} from '@/assets/scripts/http-common.js';
import Stamp from '@/components/SpaaractieScreen/Stamp.vue'

const props = defineProps({
    'actie': Object,
    'stamp': Boolean,
    'stamp_number': Number,
    'last': Boolean
})


const state = reactive({
    publicPath: process.env.BASE_URL,
    productModalOpened: false
})

const stamp_amount = computed(() => {
    return state.customer_actie.stamp_amount
})

const stampconvert = computed(() => {
    return Math.floor(state.customer_info.storepoints / props.actie.point_for_stamp)
})	


		/*
		newline:function(html){
			html = html.replace(new RegExp('\r?\n','g'), '<br />');
			return html;
		}
		*/
        function getCustomerInfo(){
            const id = localStorage.getItem("user_id");
            const token = localStorage.getItem("access_token");

            const params = {
                customer_id: id,
                accessToken: token
            }
            HTTP.get("customer", {params})

            .then(response => {
                state.customer_info = response.data[0]
            })
            .catch(() => {
            })
        }
        function getCustomerActies(){
        HTTP.get(`customer_spaaractie/${localStorage.getItem('user_id')}`)
        .then((response) => {
            for (let index = 0; index < response.data.length; index++) {
                if(props.actie.spaaractie_id == response.data[index].spaaractie_id){
                    state.customer_actie = response.data[index]
                    state.stamp_amount = state.customer_actie.stamp_amount
                    state.pages = Math.ceil(state.stamp_amount/props.actie.amount_of_stamps)
                    if (state.pages  < 3) state.pages = 3
                }
                else{
                    state.customer_actie.point_amount = 0
                    state.customer_actie.spaaractie_id = props.actie.spaaractie_id
                    state.customer_actie.stamp_amount = 0
                    state.stamp_amount = state.customer_actie.stamp_amount
                    state.pages = Math.ceil(state.stamp_amount/props.actie.amount_of_stamps)
                    if (state.pages  < 3) state.pages = 3
                }
            }
           
        })
        .catch(() => {
        })
    }

    onMounted(() => {
        //getCustomerInfo()
        //getCustomerActies()   
	})



</script>

<style scoped>
.stamp{
    position: relative;
    height: 100%;
	display: flex;
	flex-direction: column;
	align-content: center;
    align-items: stretch;
    justify-content: space-between;
    flex-wrap: nowrap;
}
.background{
    opacity: 0.8;
}
.content{
    position: absolute;
    width: 100%;
    height: 100%;
    display: inline-block;
}
.content img{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    opacity: 0.4;
}
.content .visible_stamp{
    opacity: 1;
}
.content .number{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    color: #0010ee;
    font-weight: 600;
}
</style>