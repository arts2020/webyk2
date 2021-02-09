<template>
	<view class="quotation-index">
		<view class="prodect-title">
			<view :class="active==0?'pro active-index':'pro'" @tap="updateMenu(0)">自选</view>
			<view :class="active==1?'pro active-index':'pro'" @tap="updateMenu(1)">市值</view>
			<view :class="active==2?'pro active-index':'pro'" @tap="updateMenu(2)">DeFi</view>
		</view>
		<view class="quotation-info">
			<view class="info-title" v-if="active==0">
				成交量
			</view>
			<view class="info-title" v-else>
				市值
			</view>
			<view class="info-title">
				价格(¥)
			</view>
			<view class="info-title">
				24H涨幅
			</view>
		</view> 
		<scroll-view v-if="active==0" class="info-list" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<view class="list-item" v-for="(item, index) in m_marketList" :key="index">
				<view class="title">
					<view>{{item.symbol}}</view>
					<view>{{item.name_zh}}</view>
				</view>
				<view class="price-title" :style="'color:'+getStyle(item.percent_change_24h)">
					<view style="align-items: center;width: 100%;display: flex;flex-direction: column;justify-content: center;">
						<label style="font-size: 30rpx;">{{(item.price_usd * (m_configitem.value * 1)).toFixed(2)}}</label> 
						<label style="color: #b5b2b6;font-size: 24rpx;">${{(item.price_usd*1).toFixed(2)}}</label> 
					</view>
				</view>
				<view class="cha-title" :style="'background-color:'+getStyle(item.percent_change_24h)">
					{{item.percent_change_24h}}%
				</view>
			</view>
			<view class="nodata_add" @tap="goAdd">
				添加
			</view>
		</scroll-view>
		<scroll-view v-if="active==1" class="info-list" scroll-y="true" :style="{ height: scrollHeight + 'px' }">	
			<view class="list-item" v-for="(item, index) in m_marketList" :key="index"  v-if="haveData">
				<view class="title">
					<view>{{item.symbol}}</view>
					<view>{{item.name_zh}}</view>
				</view>
				<view class="price-title" :style="'color:'+getStyle(item.percent_change_24h)">
					<view style="align-items: center;width: 100%;display: flex;flex-direction: column;justify-content: center;">
						<label style="font-size: 30rpx;">{{(item.price_usd * (m_configitem.value * 1)).toFixed(2)}}</label> 
						<label style="color: #b5b2b6;font-size: 24rpx;">${{(item.price_usd*1).toFixed(2)}}</label> 
					</view>
				</view>
				<view class="cha-title" :style="'background-color:'+getStyle(item.percent_change_24h)">
					{{item.percent_change_24h}}%
				</view>
			</view>
			<noData v-else></noData>
		</scroll-view>
		<scroll-view v-if="active==2" class="info-list" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<view class="list-item" v-for="(item, index) in m_marketList" :key="index"  v-if="haveData">
				<view class="title">
					<view>{{item.symbol}}</view>
					<view>{{item.name_zh}}</view>
				</view>
				<view class="price-title" :style="'color:'+getStyle(item.percent_change_24h)">
					<view style="align-items: center;width: 100%;display: flex;flex-direction: column;justify-content: center;">
						<label style="font-size: 30rpx;">{{(item.price_usd * (m_configitem.value * 1)).toFixed(2)}}</label> 
						<label style="color: #b5b2b6;font-size: 24rpx;">${{(item.price_usd*1).toFixed(2)}}</label> 
					</view>
				</view>
				<view class="cha-title" :style="'background-color:'+getStyle(item.percent_change_24h)">
					{{item.percent_change_24h}}%
				</view>
			</view>
			<noData v-else></noData>
		</scroll-view>
	</view>
</template>

<script>
	import noData from '@/components/no-data/no-data.vue';
	export default {
		components: {
			noData
		},
		created() {
			this.util.EventUtils.addEventListenerCustom(this.dal.Common.evtGetAssetprice, this.onGetAssetprice);
		    let _this = this;
		    uni.startPullDownRefresh();
		    //获取高度
		    uni.getSystemInfo({
		    	success(res) {
		    		
		    		_this.scrollHeight = res.windowHeight - res.statusBarHeight - 54-60;
		    	}
		    });
			this.onRefersh()
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
					return val > 0 ? '#61C0A0;' : '#E46866;'
				},
				active:1,
				haveData:false,
				ishow_selfC:false,
				ishow_market:true,
				ishow_defi:false,
			}
		},
		onPullDownRefresh() {
			this.onRefersh()
		},
		
		methods: {
			onRefersh(){
				//清空之前数据重新获取
				this.m_marketList = []
				this.dal.Common.onGetAssetprice();
			},
			goAdd(){
			 this.$openPage({name:"quotation-search"});	
			},
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
				uni.stopPullDownRefresh();
				function rankFun(a,b){
					return a.rank - b.rank
				}
				data.data.sort(rankFun)
				this.m_marketList = data.data;
				this.m_configitem = this.dal.Common.onGetRateInfo("exchange_key");
				if(this.m_marketList.length == 0){
					this.haveData = false
				}else{	
					this.haveData = true;
				}
			}
		},
		
	}
</script>

<style lang="scss">
	@import 'quotation.scss';
</style>
