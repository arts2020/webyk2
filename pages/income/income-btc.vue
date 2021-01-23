<template>
	<view class="income-btc">
		<bar ref="bar"></bar>
		<view @tap="btnBack()" class="safe-header">
			<image src="../../static/image/login/left.svg" />
			<text>BTC收益明细</text>
		</view>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<view class="btc-list">
				<view class="btc-title">
					<text>BTC算力奖励</text>
					<view class="date">2020/11/25</view>
				</view>
				<view class="btc-count">0.0000712BTC</view>
			</view>
			<view class="btc-list">
				<view class="btc-title">
					<text>BTC算力奖励</text>
					<view class="date">2020/11/25</view>
				</view>
				<view class="btc-count">0.0000712BTC</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	export default {
		components: {
			Bar
		},
		created() {
			this.dal.Mine.onGetProfitList('btc');
			this.util.EventUtils.addEventListenerCustom(this.dal.Mine.evtGetProfitList, this.onGetProfitList);
		},
		
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Mine.evtGetProfitList, this.onGetProfitList);
		},
		data(){
			return{
				scrollHeight:''
			}
		},
		onLoad() {
			
		},
		methods: {
			btnBack:function(){
				this.util.UiUtils.switchBackPage();
			},
			onGetProfitList:function(data){
				console.log("====btc===onGetProfitList=====",data)
				if(data && data.asset == "btc"){
					
				}
			}
		},
		onShow() {
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight -44;
				}
			});
		}
	}
</script>

<style lang="scss">
	@import "income-btc.scss"
</style>
