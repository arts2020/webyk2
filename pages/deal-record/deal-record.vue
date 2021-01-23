<template>
	<view class="deal-index">
		<bar ref="bar"></bar>
		<view @tap="btnBack()" class="safe-header">
			<image src="../../static/image/login/left.svg" />
			<text>交易记录</text>
		</view>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px',paddingTop:8 +'px'}">
			<view class="power-bg">
				<view class="power-info">
					<view class="power-title">{{m_asset.toLocaleUpperCase()}}</view>
					<view class="deal-list">
						<view class="list">
							<text>可用</text>
							<view>{{m_amount}}</view>
						</view>
						<view class="list">
							<text>折合(CNY）</text>
							<view>{{m_tormb}}</view>
						</view>
					</view>
				</view>
				<view class="btn-list">
					<view @tap="btnChongBi()" class="list">
						<image src="../../static/image/notice/chongbi.svg" />
						<text>充币</text>
					</view>
					<view @tap="btnZhuangZhang()" class="list">
						<image src="../../static/image/notice/zhuanzhang.svg" />
						<text>转账</text>
					</view>
				</view>
			</view>
			<view class="deal-list-info" v-for="(item, index) in m_items" :key="index" v-if="haveData">
				<view class="deal-title">
					<view class="title">{{item.remark}}</view>
					<view class="date">{{item.created_at}}</view>
				</view>
				<view class="deal-title" style="display: flex;flex-direction: column;text-align: right;">
					<view v-if="item.type != 0" class="deal-data">{{item.amount}} {{item.unit.toLocaleUpperCase()}}</view>
					<view v-if="item.type == 0" class="deal-data red">-{{item.amount}} {{item.unit.toLocaleUpperCase()}}</view>
					<view class="date">{{item.state_txt}}</view>
				</view>
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
			this.init();
			this.onBalance();
			this.onRefresh();
			this.util.EventUtils.addEventListenerCustom(this.dal.WallterTranser.evtGetTransferList, this.onGetTransferList);
			this.util.EventUtils.addEventListenerCustom(this.dal.Wallter.evtBalance, this.onBalance);
		},
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Wallter.evtBalance, this.onBalance);
			this.util.EventUtils.removeEventCustom(this.dal.WallterTranser.evtGetTransferList, this.onGetTransferList);
		},
		
		data() {
			return {
				m_asset: "btc",
				// m_amount: "0.000000",
				// m_tormb: "0.000000",
				m_items:[],
				scrollHeight: 0,
				haveData:true,
				noData:false
			}
		},
		onLoad(option) {
				console.log("===onLoad==this.m_asset===")
			if (option && option.query) {
				var data = JSON.parse(option.query);
				console.log("=onLoad=data=",data)
				this.m_asset = data.param.asset;
				console.log("=this.m_asset=",this.m_asset)
				uni.startPullDownRefresh();
				setTimeout(function () {
					this.dal.WallterTranser.onGetTransferList(this.m_asset)
				}.bind(this), 1000);
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
			uni.startPullDownRefresh();
			setTimeout(function () {
				console.log("=====this.m_asset===",this.m_asset)
				this.dal.WallterTranser.onGetTransferList(this.m_asset)
				this.init();
			}.bind(this), 1000);
		},
		
		onPullDownRefresh() {
			console.log('refresh');
			this.dal.WallterTranser.onGetTransferList(this.m_asset)
			this.init();
		},
		methods: {
			init: function() {
				if(this.m_asset == "btc"){
					this.dal.BtcWallter.onBalance();
				}else if(this.m_asset == "eth"){
					this.dal.Ethers.onBalance();
				}else if(this.m_asset == "usdt"){
					this.dal.UsdtErc20.onBalance();
				}else if(this.m_asset == "filecoin"){
					this.dal.FileCoinWallter.onBalance();
				}
			},
			
			onGetTransferList:function(){
				uni.stopPullDownRefresh();
				this.onRefresh();
			},
				
			onRefresh:function(){
				this.m_items = this.dal.WallterTranser.GetTransferList(this.m_asset)
				for(let i = 0 ; i < this.m_items.length;i++){
					let item = this.m_items[i];
					if(item.state == 1){
						item.state_txt = "交易成功"
					}else if(item.state == 0){
						item.state_txt = "交易中..."
					}else{
						item.state_txt = "交易失败"
					}
				console.log('==item.state_txt=',item.state_txt)
				console.log('==item.state=',item.state)
				}
				if(this.m_items.length == 0){
					this.haveData = false
					this.noData = true
				}else{
					this.noData = false
					this.haveData = true
				}
			},
			onUsdToRmb:function(asset){
				let priceinfo = this.dal.Common.getAssetpriceInfo(asset);
				// console.log("====priceinfo==",priceinfo)
				if(!priceinfo){
					return 0;
				}
				return priceinfo.price_cny;
			},
			onBalance:function(data){
				if(this.m_asset == "btc"){
					this.m_amount = this.dal.BtcWallter.getBalance();
				}else if(this.m_asset == "eth"){
					this.m_amount = this.dal.Ethers.getBalance();
				}else if(this.m_asset == "usdt"){
					this.m_amount = this.dal.UsdtErc20.getBalance();
				}else if(this.m_asset == "filecoin"){
					this.m_amount = this.dal.FileCoinWallter.getBalance();
				}
				
				console.log("====this.m_amount==1==",this.m_amount)
				if(this.m_amount <=0){
					this.m_amount = "0.000000"
				}else{
					this.m_amount = this.m_amount.toFixed(6)
				}
				console.log("====this.m_amount==2==",this.m_amount)
				console.log("====this.m_asset==2==",this.m_asset)
				let item = this.dal.Common.onGetRateInfo("exchange_key");
				this.m_tormb = this.m_amount * this.onUsdToRmb(this.m_asset)
				this.m_tormb = this.m_tormb.toFixed(6)
			},
			
			btnBack: function() {
				this.util.UiUtils.switchBackPage();
			},
			
			btnChongBi:function(){
				this.util.UiUtils.switchToPage("recharge-currency", "deal-record",{asset:this.m_asset});
			},
			
			btnZhuangZhang:function(){
				if(this.m_asset == "filecoin"){
					this.util.UiUtils.switchToPage("filecoin-carry-over", "deal-record",{asset:this.m_asset});
				}else{
					this.util.UiUtils.switchToPage("carry-over", "deal-record",{asset:this.m_asset});
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "deal-record.scss"
</style>
