<template>
	<view class="quotation-index">
		<view class="prodect-title">
			<!-- <view :class="active==0?'pro active-index':'pro'" @tap="updateMenu(0)">自选</view> -->
			<view :class="active==1?'pro active-index':'pro'" @tap="updateMenu(1)">{{mark_index_title_3}}</view>
			<view :class="active==2?'pro active-index':'pro'" @tap="updateMenu(2)">DeFi</view>
		</view>
		<view class="quotation-info">
			<view class="info-title" v-if="active==0">
				{{mark_index_title_6}}
			</view>
			<view class="info-title" v-else>
				{{mark_index_title_3}}
			</view>
			<view class="info-title">
				{{mark_index_title_4}}(¥)
			</view>
			<view class="info-title">
				{{mark_index_title_5}}
			</view>
		</view> 
		<!-- <scroll-view v-if="active==0" class="info-list" scroll-y="true" :refresher-triggered="triggered" :refresher-enabled="true" @refresherrefresh="onRefersh" @scroll="scrollHandle" :style="{ height: scrollHeight + 'px' }">
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
				{{btnstring_add}}
			</view>
		</scroll-view> -->
		<scroll-view v-if="active==1" class="info-list" scroll-y="true" :refresher-triggered="triggered" :refresher-enabled="true" @refresherrefresh="onRefersh" @scroll="scrollHandle" :style="{ height: scrollHeight + 'px' }">	
			<view class="list-item" v-for="(item, index) in m_marketList" :key="index"  v-if="haveData">
				<image :src="item.logo" mode=""></image>
				<view class="title">
					<view>{{item.symbol}}</view>
					<view>{{item.name_zh}}</view>
				</view>
				<view class="price-title" :style="'color:'+getStyle(item.percent_change_24h)">
					<view style="align-items: center;width: 100%;display: flex;flex-direction: column;justify-content: center;">
						<label style="font-size: 30rpx;">￥{{(item.price_usd * (m_configitem.value * 1)).toFixed(2)}}</label> 
						<label style="color: #b5b2b6;font-size: 24rpx;">{{(item.price_usd*1).toFixed(2)}}</label> 
					</view>
				</view>
				<view class="cha-title" :style="'background-color:'+getStyle(item.percent_change_24h)">
					{{item.percent_change_24h}}%
				</view>
			</view>
			<noData v-else></noData>
		</scroll-view>
		<scroll-view v-if="active==2" class="info-list" scroll-y="true" :refresher-triggered="triggered" :refresher-enabled="true" @refresherrefresh="onRefersh" @scroll="scrollHandle" :style="{ height: scrollHeight + 'px' }">
			<view class="list-item" v-for="(item, index) in m_defiList" :key="index"  v-if="haveData">
				<image :src="item.logo" mode=""></image>
				<view class="title">
					<view>{{item.assest}}</view>
					<view>{{item.name}}</view>
				</view>
				<view class="price-title">
					{{item.exponential}}
				</view>
				<view class="cha-title" :style="'background-color:'+getStyle(item.zf_24)">
					{{item.zf_24}}
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
			this.util.EventUtils.addEventListenerCustom(this.dal.Common.evtGetAssetPrice, this.getAssetPrice);
			this.util.EventUtils.addEventListenerCustom(this.dal.Common.evtGetDefi, this.getDefi);
		   
			let _this = this;
		    uni.startPullDownRefresh();
		    //获取高度
		    uni.getSystemInfo({
		    	success(res) {		    		
		    		_this.scrollHeight = res.windowHeight - res.statusBarHeight - 54-60;
		    	}
		    });
			this.initWord()
			this.onRefersh()
			
		},
		
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Common.evtGetDefi, this.getDefi);
			this.util.EventUtils.removeEventCustom(this.dal.Common.evtGetAssetPrice, this.getAssetPrice);
		},
		data() {
			return {
				  //true 表示下拉刷新已经被触发，false 表示下拉刷新未被触发
				triggered: false,
				m_marketList:[],
				m_defiList:[],
				m_stype:"",
				m_configitem:{},
				scrollHeight: 0,
				getStyle(val){
					if(typeof val == 'string'){
						if(val.indexOf('+')!=-1||val.indexOf('%')!=-1||val.indexOf('-')!=-1){
							val=val.substring(0,val.length-1)*1;
						}
					}
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
			initWord(){
				//获取所有中文文字
				this.mark_index_title_3 = this.getLocalStr("mark_index_title_3");
				this.mark_index_title_4 = this.getLocalStr("mark_index_title_4");
			    this.mark_index_title_5 = this.getLocalStr("mark_index_title_5");
				this.mark_index_title_6 = this.getLocalStr("mark_index_title_6");
				this.btnstring_add = this.getLocalStr("btnstring_add")
			},
			onRefersh(){
				if(!this.triggered){this.triggered = true;}
				this.dal.Common.onGetDefi();
				this.dal.Common.onGetAssetPrice();
				this.util.UiUtils.showLoading("loading...");
			},
			scrollHandle(e){
				if (e.detail.scrollTop === 0) {
				this.triggered = true
				} else {
				this.triggered = false
				}
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
			getAssetPrice(data){
				this.triggered = false;
				uni.stopPullDownRefresh();
				function rankFun(a,b){
					return a.rank - b.rank
				}
				data.data.sort(rankFun)
				this.m_marketList = data.data;
				this.m_configitem = this.dal.Common.onGetConfigInfo("exchange_key");
				if(this.m_marketList.length == 0){
					this.haveData = false
				}else{	
					this.haveData = true;
				}
			},
			getDefi(data){
				this.triggered = false;
				uni.stopPullDownRefresh();
				function rankFun(a,b){
					return a.rank - b.rank
				}
				data.data.sort(rankFun)
				this.m_defiList = data.data;
				this.m_configitem = this.dal.Common.onGetConfigInfo("exchange_key");
				if(this.m_defiList.length == 0){
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
