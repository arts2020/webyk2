<template>
	<view class="importType">
		<uni-nav-bar :statusBar="true" :fixed="true" left-icon="back"  title="导入方式"  @clickLeft="goBack"></uni-nav-bar>
		<view class="main-list">
			<view class="menu-item" @tap="goRecover(1)">
				<image class="menu-icon" src="../../../static/image/index/no-list.png" mode=""></image>
				<view class="menu-msg">
					<view class="msg-title">助记词</view>
					<view class="msg-subT">助记词由单词组成，用空格隔开</view>
				</view>
				<image class="right_arr" src="../../../static/image/mine/arrow-left.svg" mode=""></image>
			</view>
			<view class="line"></view>
			<view class="menu-item" @tap="goRecover(2)">
				<image class="menu-icon" src="../../../static/image/index/no-list.png" mode=""></image>
				<view class="menu-msg">
					<view class="msg-title">私钥</view>
					<view class="msg-subT">明文私钥字符</view>
				</view>
				<image class="right_arr" src="../../../static/image/mine/arrow-left.svg" mode=""></image>
			</view>
				
		</view>
	</view>
</template>

<script>
	export default {
		name:"importType",
		data() {
			return {
				activeCoin:{}
			};
		},
		onLoad(option) {
			if(option.query){
				this.activeCoin  = JSON.parse(option.query)	
			}
		},
		methods:{
			goBack:function(){
				this.util.UiUtils.switchBackPage();
			},
			goRecover(e){
                this.activeCoin.type = e;
				this.$openPage({name:"import-wallet-wallet",query:this.activeCoin})
			}
		}
	}
</script>

<style lang="scss" scoped>
.importType{
	height: 100%;
	width: 100%;
	min-height: 100vh;
	background-color: #f2f2f2;
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
</style>
