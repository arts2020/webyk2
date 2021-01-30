<template>
	<view class="import-wallet-index">
		<uniNavBar :status="true" :fixed="true" left-icon="back" title="导入身份&钱包" @clickLeft="btnBack"></uniNavBar>
		<view class="import-status" @tap="goRecoverStatus">
			<image class="status_icon" src="../../../static/image/index/chanpin-select.png" mode=""></image>
		    <text>导入身份钱包</text>
			<image class="right_arr" src="../../../static/image/index/jiantou.png" mode=""></image>
		</view>
		<view class="single-wallet">
			<view class="title">导入单底层钱包</view>
			<view class="main-list">
				<view class="menu-item" @tap="goimport(item)" v-for="(item,index) in coinList" :key="index">
					<image class="menu-icon" :src="item.logo" mode=""></image>
					<view class="menu-msg">
						<view class="msg-title">{{item.short_name}}</view>
						<view class="msg-subT">{{item.full_name}}</view>
					</view>
					<image class="right_arr" src="../../../static/image/index/jiantou.png" mode=""></image>
				</view>
			</view>
		</view>
	    <uni-popup type="bottom" ref="popupS">
			<view class="main-c">
				<view class="type-item" v-for="(item,index) in items" :key="index" @tap="goRecover(index)">{{item}}</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	export default {
		name:'import-wallet-index',
		components: {
			uniNavBar
		},
		data() {
			return {
				items: ['助记词导入', '私钥导入'],
				activeCoin:{},
				scrollHeight:0,
				coinList:[
					{
						logo:"../../../static/image/index/eth.png",
						short_name:"ETH",
						full_name:"Ethereum"
					},
					{
						logo:"../../../static/image/index/btc.png",
						short_name:"BTC",
						full_name:"Btcoin"
					},
				]
			};
		},
		onShow() {
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight -44;
				}
			});
		},			
		methods:{
			goRecoverStatus(){
				this.$openPage({name:"import-wallet-recover"})
			},
			goRecover(index){
				this.activeCoin.recoverType = index;
				this.$openPage({name:"import-wallet-wallet",query:this.activeCoin})
			},
			btnBack:function(){
				this.util.UiUtils.switchBackPage();
			},
			goimport(item){
				this.activeCoin = item;
				this.$refs.popupS.open();
			}
		}
	}
</script>

<style lang="scss" scoped>
.import-wallet-index{
	width: 100%;
	height: 100%;
	min-height: 100vh;
	background-color: #F2F2F2;
	.import-status{
		width: 100%;
		height: 90rpx;
		border-radius: 20rpx;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		padding: 0 30rpx;
		box-sizing: border-box;
		.status_icon{
			width: 30rpx;
			height: 20rpx;
			margin-right: 30rpx;
		}
		.right_arr{
			width: 20rpx;
			height: 20rpx;
			margin-left: auto;
		}
	}
	.single-wallet{
		width: 100%;
		margin-top: 40rpx;
		.title{
			margin-left: 40rpx;
		}
		.main-list{
			width: calc(100% - 20rpx);
			margin: 20rpx auto;
			background-color: #FFFFFF;
			border-radius: 20rpx;
			padding: 0rpx 20rpx;
			box-sizing: border-box;
			.menu-item{
				width: 100%;
				height: 100rpx;
				display: flex;
				align-items: center;
				border-bottom: 2rpx solid #F2F2F2;
				&:last-child{
					border-bottom:0rpx solid #F2F2F2;
				}
				.menu-icon{
					width: 60rpx;
					height: 60rpx;
					margin-right: 30rpx;
				}
				.menu-msg{
					.msg-title{
						font-size: 28rpx;
						color: #444444;
						font-weight: bold;
					}
					.msg-subT{
						font-size: 24rpx;
						color: #8e8e8e;
					}
				}
				.right_arr{
					width: 20rpx;
					height: 20rpx;
					margin-left: auto;
				}
			}
		}
	}
    .main-c{
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		border-radius: 20rpx 20rpx 0 0;
		.type-item{
			width: 100%;
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
		}
	}
}
</style>
