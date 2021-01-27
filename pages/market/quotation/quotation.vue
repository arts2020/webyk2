<template>
	<view class="quotation-index">
		<!-- <bar ref="bar"></bar> -->
		<view class="prodect-title">
			<view :class="active==0?'pro active-index':'pro'" @tap="updateMenu(0)">自选</view>
			<view :class="active==1?'pro active-index':'pro'" @tap="updateMenu(1)">市值</view>
			<view :class="active==2?'pro active-index':'pro'" @tap="updateMenu(2)">DeFi</view>
		</view>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<view class="quotation-info">
				<view class="info-title">
					币种
				</view>
				<view class="info-title">
					价格(¥)
				</view>
				<view class="info-title">
					24H涨幅
				</view>
			</view> 
			<view v-for="(item, index) in m_marketList" :key="index"  v-if="haveData">
				<view class="quotation-info info-list">
					<view class="info-title">
						<image :src="item.logo_png"></image>
						<view class="title">
							<text>{{item.symbol}}</text>
							<view>{{item.name_zh}}</view>
						</view>
					</view>
					<view class="list-title" :style="getStyle(item.percent_change_24h)">
						<view style="align-items: center;width: 100%;display: flex;flex-direction: column;justify-content: center;">
							<label style="font-size: 13px;">{{(item.price_usd * (m_configitem.value * 1)).toFixed(2)}}</label> 
							<label style="color: #b5b2b6;font-size: 10px;">${{(item.price_usd*1).toFixed(2)}}</label> 
						</view>
					</view>
					<view class="list-title" :style="getStyle(item.percent_change_24h)">
						{{item.percent_change_24h}}%
					</view>
				</view>
			</view>
			<noData v-if="noData"></noData>
		</scroll-view>
	</view>
</template>

<script>
	// import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	import noData from '@/components/no-data/no-data.vue';
	export default {
		components: {
			// Bar,
			noData
		},
		created() {
			// this.util.UiUtils.showLoading("")
			this.util.EventUtils.addEventListenerCustom(this.dal.Common.evtGetAssetprice, this.onGetAssetprice);
		    let _this = this;
		    uni.startPullDownRefresh();
		    //获取高度
		    uni.getSystemInfo({
		    	success(res) {
		    		
		    		_this.scrollHeight = res.windowHeight - res.statusBarHeight - 54-60;
		    	}
		    });
			setTimeout(function () {
				this.dal.Common.onGetAssetprice();
			}.bind(this), 1000);
		},
		
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Common.evtGetAssetprice, this.onGetAssetprice);
		},
		data() {
			return {
				m_marketList:[],
				m_stype:"",
				m_configitem:{},
				scrollHeight: 0,
				getStyle(val){
					return val > 0 ? 'color: #5DB567;' : 'color: #E1643F;'
				},
				active:1,
				haveData:true,
				noData:false,
				ishow_selfC:false,
				ishow_market:true,
				ishow_defi:false,
			}
		},
		// onLoad() {
		// 	console.log("====onGetAssetprice===onLoad===")
			
		// },
		// onShow() {
		// 	console.log("====onGetAssetprice===onShow===")
		// 	let _this = this;
		// 	uni.startPullDownRefresh();
		// 	setTimeout(function () {
		// 		this.dal.Common.onGetAssetprice();
		// 	}.bind(this), 1000);
		// 	//获取高度
		// 	uni.getSystemInfo({
		// 		success(res) {
					
		// 			_this.scrollHeight = res.windowHeight - res.statusBarHeight - 54;
		// 		}
		// 	});
		// },
		onPullDownRefresh() {
			this.dal.Common.onGetAssetprice();
			// this.onRefresh();
			// setTimeout(function () {
			// 	uni.stopPullDownRefresh();
			// }, 1000);
		},
		
		methods: {
			updateMenu(val){
				this.active = val;
				this.$nextTick(()=>{
					setTimeout(()=>{
						if(val==0){
							this.ishow_selfC = true;
						}else if(val==1){
							this.ishow_market=true;
						}else if(val==2){
							this.ishow_defi = true
						}
					},50)
				})
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
		},
		
	}
</script>

<style lang="scss">
	@import 'quotation.scss';
</style>
