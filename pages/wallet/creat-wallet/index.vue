<template>
	<view class="create-wallet-index">
		<uniNavBar :status="true" :fixed="true" left-icon="back" title="创建身份&钱包" @clickLeft="btnBack"></uniNavBar>
		<view class="create-status" @tap="goCreateStatus">
			<image class="status_icon" src="../../../static/image/index/chanpin-select.png" mode=""></image>
		    <text>创建身份钱包</text>
			<image class="right_arr" src="../../../static/image/index/jiantou.png" mode=""></image>
		</view>
		<view class="single-wallet">
			<view class="title">创建单底层钱包</view>
			<view class="main-list">
				<view class="menu-item" @tap="goCreate(item)" v-for="(item,index) in coinList" :key="index">
					<image class="menu-icon" :src="item.logo" mode=""></image>
					<view class="menu-msg">
						<view class="msg-title">{{item.short_name}}</view>
						<view class="msg-subT">{{item.full_name}}</view>
					</view>
					<image class="right_arr" src="../../../static/image/index/jiantou.png" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	export default {
		name:'create-wallet-index',
		components: {
			uniNavBar
		},
		data() {
			return {
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
			btnBack:function(){
				this.util.UiUtils.switchBackPage();
			},
			goCreate(item){
				this.$openPage({name:"creat-wallet-wallet",query:item})
			},
			goCreateStatus(){
				this.$openPage({name:"creat-wallet-status"})
			}
		}
	}
</script>

<style lang="scss" scoped>
.create-wallet-index{
	width: 100%;
	height: 100%;
	min-height: 100vh;
	background-color: #F2F2F2;
	.create-status{
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
}
</style>
