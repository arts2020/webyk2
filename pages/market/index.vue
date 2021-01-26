<template>
	<view class="market-index">
		<bar ref="bar"></bar>
		<view class="nav-menu">
			<view :class="active==0?'menu active-index':'menu'" @tap="updateMenu(0)">行情</view>
			<view :class="active==1?'menu active-index':'menu'" @tap="updateMenu(1)">交易</view>
		</view>
		<!-- 行情 -->
		<Quotation :class="active==0?'quotation-content active':'quotation-content'" :scrollHeight="scrollHeight" :m_marketList="m_marketList" :m_configitem="m_configitem" :haveData="haveData" :noData="noData"/>
	    <!-- 交易 -->
		<view :class="active==1?'transf-content active':'transf-content'">
			
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
		created() {
			// this.util.UiUtils.showLoading("")
			this.util.EventUtils.addEventListenerCustom(this.dal.Common.evtGetAssetprice, this.onGetAssetprice);
		},
		
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Common.evtGetAssetprice, this.onGetAssetprice);
		},
		onShow() {
			console.log("====onGetAssetprice===onShow===")
			let _this = this;
			uni.startPullDownRefresh();
			setTimeout(function () {
				this.dal.Common.onGetAssetprice();
			}.bind(this), 1000);
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight - 54;
				}
			});
		},
		onPullDownRefresh() {
			console.log('refresh');
			this.dal.Common.onGetAssetprice();
			// this.onRefresh();
			// setTimeout(function () {
			// 	uni.stopPullDownRefresh();
			// }, 1000);
		},
		data(){
			return{
				active:0,
				m_marketList:[],
				m_configitem:{},
				haveData:true,
				noData:false,
				scrollHeight:0
			}
		},
		methods:{
			updateMenu(val){
				this.active = val;
			},
			onGetAssetprice:function(data){
				console.log("====onGetAssetprice===data===",data.data)
				uni.stopPullDownRefresh();
				function rankFun(a,b){
					return a.rank - b.rank
				}
				data.data.sort(rankFun)
				this.m_marketList = data.data;
				this.m_configitem = this.dal.Common.onGetRateInfo("exchange_key");
				console.log("====onGetAssetprice===onShow===",this.m_configitem)
				if(this.m_marketList.length == 0){
					this.haveData = false
					this.noData = true
				}else{
					this.noData = false
					this.haveData = true
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import 'index.scss'
</style>
