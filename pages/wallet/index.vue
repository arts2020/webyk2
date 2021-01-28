<template>
	<view class="wallet-index">
       <!-- 没有钱包 -->
	   <view class="no-wallet">
		   <image class="bannerImg" src="../../static/image/1080x1882.png" mode=""></image>
	       <view class="tips">
			   <view class="title">数字资产钱包</view>
			   <view class="tip-content">支持BTC、ETH、EOS、YKC、TRX、FIH......</view>
		   </view>
		   <view class="menu-nav">
			   <view class="menu-item" @tap="importWallet">
					<image class="menu-icon" src="../../static/image/index/gonggao.png" mode=""></image>
					<view class="menu-msg">
						<view class="msg-title">我有钱包</view>
						<view class="msg-subT">导入钱包</view>
					</view>
					<image class="right_arr" src="../../static/image/index/jiantou.png" mode=""></image>
			   </view>
			   <view class="menu-item" @tap="createWallet">
					<image class="menu-icon" src="../../static/image/index/gonggao.png" mode=""></image>
					<view class="menu-msg">
						<view class="msg-title">我没有钱包</view>
						<view class="msg-subT">创建钱包</view>
					</view>
					<image class="right_arr" src="../../static/image/index/jiantou.png" mode=""></image>
			   </view>
		   </view>
	   </view>
	   <!-- 有钱包 -->
	   <view class="has-wallet">
	   	
	   </view>
	</view>
</template>

<script>
	export default {
		name:"wallet",
		data(){
			return{
				hasWallet:false,
			}
		},
		methods:{
			importWallet(){
				this.$openPage({name:"import-wallet-index"})
			},
			createWallet(){
				this.$openPage({name:"creat-wallet-index"})
			}
		}
	}
</script>

<style lang="scss" scoped>
.wallet-index{
	width: 100%;
	.no-wallet{
		width: 100%;
		height: 100%;
		min-height: 100vh;
		background-color: #F2F2F2;
		.bannerImg{
			width: 100%;
			height: 600rpx;
			margin-bottom: 30rpx;
		}
		.tips{
			width: 100%;
			padding: 0 30rpx;
			box-sizing: border-box;
			margin-bottom: 80rpx;
			.title{
				font-size: 28rpx;
				color: #444444;
				font-weight: bold;
			}
			.tip-content{
				font-size: 24rpx;
				color: #8e8e8e;
			}
		}
		.menu-nav{
			width: 100%;
			background-color: #FFFFFF;
			border-radius: 20rpx;
			padding: 20rpx 30rpx;
			box-sizing: border-box;
			.menu-item{
				width: 100%;
				height: 100rpx;
				display: flex;
				align-items: center;
				border-bottom: 2rpx solid #F2F2F2;
				&:nth-child(2){
					margin-top: 30rpx;
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
}
</style>
