<template>
	<view class="market-index">
		<bar ref="bar"></bar>
		<view class="nav-menu">
			<view :class="active==0?'menu active-index':'menu'" @tap="updateMenu(0)">行情</view>
			<view :class="active==1?'menu active-index':'menu'" @tap="updateMenu(1)">交易</view>
		</view>
		<!-- 行情  :scrollHeight="scrollHeight" :m_marketList="m_marketList" :m_configitem="m_configitem" :haveData="haveData" :noData="noData"-->
		<Quotation v-if="active==0" class="quotation-content" :class="{'active':ishow}"/>
	    <!-- 交易 -->
		<view  v-if="active==1" class="transf-content" :class="{'active':!ishow}">
			
		</view>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	import Quotation from './quotation/quotation.vue'
	export default {
		components: {
			Bar,
			Quotation
		},
		
		data(){
			return{
				active:0,
				ishow:true,
			}
		},
		methods:{
			updateMenu(val){
				this.active = val;
				this.$nextTick(()=>{
					setTimeout(()=>{
						if(val==0){
							this.ishow = true;
						}else if(val==1){
							this.ishow=false;
						}
					},50)
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'index.scss'
</style>
