<template>
	<view class="market-index">
		<bar ref="bar"></bar>
		<view class="nav-menu">
			<view :class="active==0?'menu active-index':'menu'" @tap="updateMenu(0)">交易</view>
			<view :class="active==1?'menu active-index':'menu'" @tap="updateMenu(1)">行情</view>
			
			<!-- <uni-icons v-if="active==1" type="search" class="search-icon" size="20" color="#000000" @tap="goAdd"></uni-icons> -->
		</view>
		<swiper :style="{ height: scrollHeight + 'px' }" @change="swiperChange" :current="active">
			<swiper-item>
				<!-- 交易 -->
				<view class="transf-c">
					<view class="transf-content">
						<image class="trans-icon" src="../../static/image/index/transf.png" mode=""></image>
						<view class="select-icon">
							<picker class="coin-picker" mode="selector" :value="coin_L" :range="assetArr" :range-key="'name'" @change="pickerChangeLeft">
								<view class="pick-c">
									<image :src="'../../static/image/chain/'+assetArr[coin_L].img" mode=""></image>
									<text>{{assetArr[coin_L].name}}</text>
									<image src="../../static/image/index/down.png" mode=""></image>
								</view>
							</picker>
							<picker class="coin-picker" mode="selector" :value="coin_R" :range="assetArr" :range-key="'name'" @change="pickerChangeRight">
								<view class="pick-c">
									<image :src="'../../static/image/chain/'+assetArr[coin_R].img" mode=""></image>
									<text>{{assetArr[coin_L].name}}</text>
									<image src="../../static/image/index/down.png" mode=""></image>
								</view>
							</picker>
						</view>
					
						<view class="selsect-num">
							<view>
								<input type="text" v-model="output_num" placeholder-style="color:#c2c2c2" placeholder="转出数量"/>
							</view>
							<view>
								<input type="text" v-model="input_num" placeholder-style="color:#c2c2c2" placeholder="收到数量" value="收到数量" />
							</view>
						</view>
					
						<view class="rate-fee">
							<view class="rate">汇率 1{{assetArr[coin_L].name}}=={{assetArr[coin_R].name}}</view>
						    <view class="fee">手续费 0.3%</view>
						</view>
					</view>
					<view class="btn-ok">立即兑换</view>
				</view>
			</swiper-item>
			<swiper-item>
				<!-- 行情  :scrollHeight="scrollHeight" :m_marketList="m_marketList" :m_configitem="m_configitem" :haveData="haveData" :noData="noData"-->
				<Quotation class="quotation-content" />
			</swiper-item>
			
		</swiper>
		
	    
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	import Quotation from './quotation/quotation.vue'
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	export default {
		components: {
			Bar,
			Quotation,
			uniIcons
		},
		// created() {
		// 	this.util.EventUtils.addEventListenerCustom(this.dal.Common.evtGetAssetprice, this.getAssetPrice);
		// 	this.util.EventUtils.addEventListenerCustom(this.dal.Common.evtGetDefi, this.getDefi);
		// 	this.onRefersh()		   
		// },
		// destroyed() {
		// 	this.util.EventUtils.addEventListenerCustom(this.dal.Common.evtGetDefi, this.getDefi);
		// 	this.util.EventUtils.removeEventCustom(this.dal.Common.evtGetAssetprice, this.onGetAssetPrice);
		// },
		// onPullDownRefresh() {
		// 	this.onRefersh()
		// },
		onShow() {
			//获取高度
			uni.getSystemInfo({
				success:(res)=>{					
					this.scrollHeight = res.windowHeight - res.statusBarHeight-54;
				}
			});
			this.onRefersh();
		},
		onPullDownRefresh() {
			this.onRefersh();
			uni.stopPullDownRefresh()
		},
		data(){
			return{
				active:1,
				// ishow:true,
				scrollHeight:0,
				// 全部代币数组
				assetArr:[
					{
						chaintype: 2,
						img: "btc.png",
						name: "BTC",
						alias: "Btcoin"
					},
					{
						chaintype: 3,
						img: "fil.png",
						name: "ATOM",
						alias: "Cosmos"
					},
				],
				coin_L:0,
				coin_R:0,
				output_num:"",
				input_num:"",
			}
		},
		methods:{
			onRefersh(){
				// 重新获取获取所有资产
				this.assetArr = [
					{
						chaintype: 2,
						img: "btc.png",
						name: "BTC",
						alias: "Btcoin"
					},
					{
						chaintype: 3,
						img: "fil.png",
						name: "ATOM",
						alias: "Cosmos"
					},
				]
			},
			goAdd(){
			 this.$openPage({name:"quotation-search"});	
			},
			swiperChange(e){
				this.active = e.detail.current;
			},
			updateMenu(val){
				this.active = val;
			},
			pickerChangeLeft(e){
				this.coin_L = e.target.value
			},
			pickerChangeRight(e){
				this.coin_R = e.target.value
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'index.scss'
</style>
