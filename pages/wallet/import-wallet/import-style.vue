<template>
	<view class="importType">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back"  title="导入方式"  @clickLeft="goBack"></uni-nav-bar>
		<view class="main-list">
			<view class="menu-item" @tap="goRecover(1)">
				<image style="width: 49rpx;height: 43rpx;" class="menu-icon" src="../../../static/image/index/word.png" mode=""></image>
				<view class="menu-msg">
					<view class="msg-title">助记词</view>
					<view class="msg-subT">助记词由单词组成，用空格隔开</view>
				</view>
				<image class="right_arr" src="../../../static/image/mine/arrow-left.svg" mode=""></image>
			</view>
	
			<view class="menu-item" @tap="goRecover(2)">
				<image class="menu-icon" style="width: 44rpx;height: 46rpx;" src="../../../static/image/index/privateword.png" mode=""></image>
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
				console.log(option.query)
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
	background-color: #FAFBFF;
	/deep/ .uni-navbar--border{
		border: 0;
	}
	.main-list{
		width: calc(100% - 72rpx);
		margin: 20rpx auto;
		.menu-item{
			width: 100%;
			height: 135rpx;
			margin-bottom: 20rpx;
			background-color: #FFFFFF;
			border-radius: 10rpx;
			padding: 0rpx 29rpx 0 33rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			&:last-child{
				border-bottom:0rpx;
			}
			.menu-icon{
				margin-right:45rpx;
			}
			.menu-msg{
				color: #121212;
				font-family: PingFang SC, PingFang SC-Semibold;
				.msg-title{
					font-size: 30rpx;
					font-weight: 600;
				}
				.msg-subT{
					font-size: 26rpx;
					font-weight: 400;
				}
			}
			.right_arr{
				width: 13rpx;
				height: 24rpx;
				margin-left: auto;
			}
		}
	}
}
</style>
