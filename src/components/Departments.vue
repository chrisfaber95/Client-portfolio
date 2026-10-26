 <template>
    <div class="departmentList">
		<div class="departments" v-for="item in filteredDepartments" v-bind:key="item.department_id" v-bind:class="{active: activeDepartment == item.slug}" >
			<span @click="changeActiveDepartment(item)">{{item.label}}</span>
		</div>
    </div>
</template>

<script>
// @ is an alias to /src
import auth from '@/assets/scripts/auth';
import {HTTP} from '@/assets/scripts/http-common.js';
import $ from 'jquery'


export default {
  name: 'home',
  components: {
  },
	data: function () {
		return {
			departments: [],
            activeDepartment: null
		}
	},
	methods: {
		getDepartments: function(){
			HTTP.get('departments')
			.then((response) => {
				this.departments = response.data.docs
					const unique = this.departments
					.map(e => e['slug'])

				// store the keys of the unique objects
				.map((e, i, final) => final.indexOf(e) === i && i)

				// eliminate the dead keys & store unique objects
				.filter(e => this.departments[e]).map(e => this.departments[e]);
				const un = unique.sort(function(a, b){
								var keyA = a.slug,
									keyB = b.slug;
								// Compare the 2 dates
								if(keyA < keyB) return -1;
								if(keyA > keyB) return 1;
								return 0;
							});
				
				this.changeActiveDepartment(un[0]);

				
			})
			.catch((errors) => {
				console.log(errors)
			})
		},
		changeActiveDepartment: function (item){
			try{
				if(item.slug == "wijn_bier_en_sterke_drank" && !localStorage.getItem('NIX18')){
					if(confirm("NIX18 - Door verder te gaan bevestigd u dat u 18 jaar of ouder bent.")){
						localStorage.setItem("NIX18", true)
						this.$store.commit('updateDepartment', item.slug)
					}
					else{
						throw 'Leeftijd niet correct'
					}
				}
				else{
					this.$store.commit('updateDepartment', item.slug)
				}
					//for(var i = 0; i < this.$refs.shelfing.length; i++){
					//	this.$refs.shelfing[i].setSubDepartment();
					//	this.$refs.shelfing[i].resetScroll();
					//	this.$refs.shelfing[i].getProducts(this.activeDepartment);
					//}				
			}
			catch(e){
				console.log(e)
			}
		}
	},
	created(){	
		this.getDepartments();
	},
	mounted(){	
	},
	computed: {
		filteredDepartments:function()
		{   
            const unique = this.departments
				.map(e => e['slug'])

			// store the keys of the unique objects
			.map((e, i, final) => final.indexOf(e) === i && i)

			// eliminate the dead keys & store unique objects
			.filter(e => this.departments[e]).map(e => this.departments[e]);
			var uniqueDepartments = unique.sort(function(a, b){
				var keyA = a.slug,
					keyB = b.slug;
					// Compare the 2 dates
					if(keyA < keyB) return -1;
					if(keyA > keyB) return 1;
					return 0;
				});
			return uniqueDepartments
		}	
	},
	watch:{	
		'$store.state.department':{
			immediate: false,
			deep: true,
			handler(){				
				this.activeDepartment = this.$store.state.department
			}
		},
	},
	metaInfo: {
		meta: [
			{ name: 'HandheldFriendly', content: "true" }
		]
	}
}
</script>

<style scoped>
.departmentList{
	width: 100%;
	overflow-x: scroll;
	overflow-y: hidden;
	display: inline-flex;
	white-space: nowrap;
	border-bottom: 2px solid #666666;
	border-top: 2px solid #666666;
	border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
	align-items: center;
    align-content: center;
    flex-wrap: nowrap;
    flex-direction: row;
}
.departmentList{
	/*background-color: #ffa500ab;
	background-color: rgb(187 187 187 / 67%);
    background: -webkit-gradient(linear, left top, left bottom, from(#d48700ab),color-stop(13%, #ec9600ab),color-stop(85%, #ec9600ab),to(#f79c00ab));
    background: linear-gradient(to bottom, #d48700ab 0%,#ec9600ab 13%,#ec9600ab 85%,#f79c00ab 100%);*/
	height: 7%;	
    box-shadow: 3px 4px 3px 0px rgba(0,0,0,0.3);
}
.departments, .subDepartments{
	background-color: #3a3a3a;
    padding: 2px;
	margin: 0px 5px;
	display: inline-flex;
	color: #f6f6f6;
    font-weight: 700;
    border: 1px solid #ffffff;
	border-radius: 10px;	
    box-shadow: 4px 5px 4px 0px rgba(0,0,0,0.4);
}
.departments span{
	font-size: 0.9rem;
	padding: 2px
}

.departments.active{
	background-color: var(--header-color);
}
</style>
