<template>
	<view class="my-income">
		<bar ref="bar"></bar>
		<view @tap="btnBack()" class="safe-header">
			<image src="../../../static/image/login/left.svg" />
			<text>我的收益</text>
		</view>

		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<view class="btc-list" v-for="(item ,index) in m_items" :key="index" v-if="haveData">
				<image class="yuan" src="../../../static/image/safe/yuan.svg" />
				<view class="btc-title">
					<text>{{item.asset.toLocaleUpperCase()}}总收益({{item.unit}}）</text>
					<view class="detail" @tap="btnRecord(item.asset)">收益明细</view>
				</view>
				<view class="btc-count">{{item.total}}</view>
				<image class="juxing" src="../../../static/image/safe/juxing.svg" />
			</view>
			<noData v-if="noData"></noData>
		</scroll-view>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	import noData from '@/components/no-data/no-data.vue';
	export default {
		components: {
			Bar,
			noData
		},
		created() {
			this.util.UiUtils.showLoading("")
			this.dal.Mine.onGetMyProfit();
			this.util.EventUtils.addEventListenerCustom(this.dal.Mine.evtGetMyProfit, this.onGetMyProfit);
		},

		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Mine.evtGetMyProfit, this.onGetMyProfit);
		},
		data() {
			return {
				scrollHeight: '',
				m_items: [],
				haveData:true,
				noData:false
			}
		},
		onLoad() {

		},
		methods: {
			btnBack: function() {
				this.util.UiUtils.switchBackPage();
			},
			btnRecord: function(asset) {
				this.$openPage({
					name: "income-income-eth",
					query: {
						asset: asset
					}
				})
			},
			onGetMyProfit: function(data) {
				console.log("=====onGetMyProfit====", data)
				this.m_items = data.data;
				console.log("=====this.m_items====",this.m_items)
				if(this.m_items.length == 0){
					this.haveData = false
					this.noData = true
				}else{
					this.noData = false
					this.haveData = true
				}
			}
		},
		onShow() {
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight - 44;
				}
			});
		}
	}
</script>

<style lang="scss">
	@import "my-income.scss"
</style>
