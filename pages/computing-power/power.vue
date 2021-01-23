<template>
	<view class="power-index">
		<bar ref="bar"></bar>
		<view @tap="btnBack()" class="safe-header">
			<image src="../../static/image/login/left.svg" />
			<text>我的算力</text>
		</view>
		<view class="type-list">
			<view class="list-btc" :class="['btc' == currentIndex ? 'active' : '']" :items="0" :current="currentIndex" @click="onClickItem('btc')">
				<image src="../../static/image/index/btc.png" />
				<text class="btc">BTC</text>
			</view>
			<view class="list-btc" :class="['eth' == currentIndex ? 'active' : '']" :items="1" :current="currentIndex" @click="onClickItem('eth')">
				<image src="../../static/image/index/eth.png" />
				<text class="btc">ETH</text>
			</view>
			<view class="list-btc" :class="['filecoin' == currentIndex ? 'active' : '']" :items="2" :current="currentIndex"
			 @click="onClickItem('filecoin')">
				<image src="../../static/image/index/fil.png" />
				<text class="btc">FIL</text>
			</view>
		</view>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<view class="power-bg">
				<view class="power-info">
					<view class="all-power">全部算力({{m_items.unit}}）</view>
					<view class="all-count">{{m_items.total}}</view>
					<text class="power-btn" @tap="btnPower()" >收益明细</text>
				</view>
			</view>
			<view class="use-power">
				<view class="use-title">
					<image src="../../static/image/safe/yuan.svg" />
					<view class="title">有效算力({{m_items.unit}}）</view>
				</view>
				<view class="use-title right">
					<image src="../../static/image/safe/juxing.svg" />
					<view class="count">{{m_items.valid}}</view>
				</view>
			</view>
			<view class="power-list">
				<view class="list" v-for="(item , index) in m_items.powerLists" :key="index" v-if="haveData">
					<view class="list-title">{{item.order ? item.order.order_product.product_name : ""}}</view>
					<view class="list-count">{{item.power}}</view>
				</view>
				<noData v-if="noData"></noData>
			</view>
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
			this.dal.Mine.onGetPower(this.currentIndex)
			this.util.EventUtils.addEventListenerCustom(this.dal.Mine.evtGetPower, this.onGetPower);
		},

		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Mine.evtGetPower, this.onGetPower);
		},
		data() {
			return {
				scrollHeight: 0,
				currentIndex: 'btc',
				m_items: {},
				haveData:true,
				noData:false
			}
		},
		onLoad() {

		},
		methods: {
			onClickItem(asset) {
				this.currentIndex = asset
				this.dal.Mine.onGetPower(this.currentIndex)
			},
			btnBack: function() {
				this.util.UiUtils.switchBackPage();
			},
			btnPower:function(){
				this.$openPage({
					name: "income-income-eth",
					query: {
						asset: this.currentIndex
					}
				})
			},
			onGetPower: function(data) {
				this.m_items = this.dal.Mine.getPowerList(this.currentIndex)
			    if(this.m_items.powerLists.length == 0){
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
	@import 'power.scss';
</style>
