<template>
	<view class="wallet-index">
		<bar ref="bar"></bar>
		<view @tap="btnBack()" class="safe-header">
			<image src="../../../static/image/login/left.svg" />
			<text>我的钱包</text>
		</view>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<view class="power-bg">
				<view class="power-info">
					<view class="all-power">账户资产总额(USDT）</view>
					<view class="all-count">{{usdtCount.toFixed(6)}}</view>
					<text class="power-btn">≈{{usdtCountCNY.toFixed(6)}}(CNY)</text>
				</view>
			</view>
			<view @tap="btnRecord('btc')" class="wallet-list">
				<view class="titile">BTC</view>
				<view class="wallet-info">
					<view class="can-use">
						<text>可用</text>
						<view class="data">{{btcCount.toFixed(6)}}</view>
					</view>
					<view class="can-use">
						<text>折合(CNY）</text>
						<view class="data">{{btcCountCNY.toFixed(6)}}</view>
					</view>
				</view>
			</view>
			<view @tap="btnRecord('eth')" class="wallet-list">
				<view class="titile">ETH</view>
				<view class="wallet-info">
					<view class="can-use">
						<text>可用</text>
						<view class="data">{{ethCount.toFixed(6)}}</view>
					</view>
					<view class="can-use">
						<text>折合(CNY）</text>
						<view class="data">{{ethCountCNY.toFixed(6)}}</view>
					</view>
				</view>
			</view>
			<view @tap="btnRecord('filecoin')" class="wallet-list">
				<view class="titile">Filecoin</view>
				<view class="wallet-info">
					<view class="can-use">
						<text>可用</text>
						<view class="data">{{filCount.toFixed(6)}}</view>
					</view>
					<view class="can-use">
						<text>折合(CNY）</text>
						<view class="data">{{filCountCNY.toFixed(6)}}</view>
					</view>
				</view>
			</view>
			<view @tap="btnRecord('usdt')" class="wallet-list">
				<view class="titile">USDT</view>
				<view class="wallet-info">
					<view class="can-use">
						<text>可用</text>
						<view class="data">{{usdtCount.toFixed(6)}}</view>
					</view>
					<view class="can-use">
						<text>折合(CNY）</text>
						<view class="data">{{usdtCountCNY.toFixed(6)}}</view>
					</view>
				</view>
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
			this.init();
			this.onRefresh();
			this.util.EventUtils.addEventListenerCustom(this.dal.Wallter.evtBalance, this.onRefresh);
		},
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Wallter.evtBalance, this.onRefresh);
		},
		data() {
			return {
				scrollHeight: 0,
				btcCount: 0,
				btcCountCNY:0,
				ethCount: 0,
				ethCountCNY: 0,
				filCount: 0,
				filCountCNY:0,
				usdtCount: 0,
				usdtCountCNY: 0,
			}
		},
		onLoad() {

		},
		methods: {
			init: function() {
				this.dal.Ethers.onBalance();
				this.dal.UsdtErc20.onBalance();
				this.dal.FileCoinWallter.onBalance();
			},
			
			onUsdToRmb:function(asset){
				let priceinfo = this.dal.Common.getAssetpriceInfo(asset);
				// console.log("====priceinfo==",priceinfo)
				if(!priceinfo){
					return 1;
				}
				return priceinfo.price_cny;
			},
			
			onRefresh:function(){
				let item = this.dal.Common.onGetRateInfo("exchange_key");
				
				this.btcCount = this.dal.BtcWallter.getBalance();
				this.ethCount = this.dal.Ethers.getBalance();
				this.usdtCount = this.dal.UsdtErc20.getBalance();
				this.filCount = this.dal.FileCoinWallter.getBalance();
				console.log('==this.filCount==',this.filCount)
				this.btcCountCNY = this.btcCount * this.onUsdToRmb("btc")
				this.ethCountCNY = this.ethCount * this.onUsdToRmb("eth")
				this.usdtCountCNY = this.usdtCount * this.onUsdToRmb("usdt")
				this.filCountCNY = this.filCount * this.onUsdToRmb("fil")
			},
			btnBack: function() {
				this.util.UiUtils.switchToPage("mine-mine", "create-wallter", {});
			},
			btnRecord: function(asset) {
				if(asset.toLocaleLowerCase() == "btc" ){
					this.util.UiUtils.showToast("暂未开启，敬请期待...");
					return;
				}
				this.util.UiUtils.switchToPage("deal-record-deal-record", "my-wallter", {
					asset: asset
				});
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
	@import "my-wallet.scss"
</style>
