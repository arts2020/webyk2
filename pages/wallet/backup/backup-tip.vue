<template>
	<view class="create-index">
		<uniNavBar :statusBar="true" :fixed="true" left-icon="back" title="备份" @clickLeft="btnBack"></uniNavBar>
		<view class="create-list">
			<view class="tip-title">备份提示</view>
			<view class="tip-cotent">获取助记词等于获取钱包资产所有权</view>
			<view class="tip-list">
				<image src="../../../static/image/notice/warn.svg" />
				<view>助记词由英文单词组成，请抄写并妥善保管</view>
			</view>
			<view class="tip-list">
				<image src="../../../static/image/notice/warn.svg" />
				<view>助记词丢失无法找回，请务必备份助记词</view>
			</view>
		</view>
		<view @tap="goNext" class="container-login" >下一步</view>
		<uni-popup type="bottom" class="tip-pop" ref="popup">
			<view class="pop-main">
				<image @tap="cancel" class="cancell-icon" src="../../../static/image/login/cha.png" mode=""></image>
				<image class="noPhoto" src="../../../static/image/wallet/guide_word.png" mode=""></image>
				<view class="title">请勿截屏</view>
				<view class="subTitle">请勿截屏和分享，这将可能被第三方恶意软件收集，造成资产损失</view>
				<view class="ok_btn" @tap="btnNext">我知道了</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'	
	export default {
		components: {			
			uniPopup
		},
		data() {
			return {
				scrollHeight: 0,
			}
		},
		created() {
			
		},
		onLoad() {
			
		},
		methods: {
			btnBack:function(){
				this.util.UiUtils.switchBackPage();
			},
			goNext(){
				this.$refs.popup.open()
			},
			cancel(){
				this.$refs.popup.close()
			},
			btnNext:function(){
				this.util.UiUtils.switchToPage("backup-info", "backup-tip",{});
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

<style lang="scss" scoped>
.create-index{
	height: 100%;
	width: 100%;
	overflow: hidden;
	background: linear-gradient(180deg,#f2f6fa, #ffffff);
	.safe-header{
		width: 100%;
		height: 44px;
		line-height: 44px;
		padding: 0 15px;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		border-bottom: 5px solid rgba(0,0,0,0.04);
		image{
			width: 18px;
			height: 18px;
		}
		text{
			font-size: 16px;
			font-weight: bolder;
			color: #111111;
			margin-left: 6px;
		}
	}
	.create-list{
		margin: 15px;
		background-color: #FFFFFF;
		border-radius: 15px;
		padding: 10px 0px 10px 15px;
		border: 1px solid #e7e6ed;
		.tip-title{
			font-size: 17px;
			font-family: PingFang SC, PingFang SC-Heavy;
			font-weight: bolder;
			color: #071328;
		}
		.tip-cotent{
			font-size: 14px;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			color: #071328;
			margin-top: 3px;
			border-bottom: 1px solid #E7E6ED;
			padding-bottom: 10px;
		}
		.tip-list{
			display: flex;
			align-items: center;
			margin-top: 10px;
			image{
				width: 13px;
				height: 13px;
				margin-right: 6px;
			}
			view{
				font-size: 13px;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
				color: #909090;
				line-height: 23px;
			}
		}
	}
	.container-login {
		width: 30%;
		height: 36px;
		line-height: 36px;
		border-radius: 4px;
		color: #FFFFFF;
		text-align: center;
		background: linear-gradient(to right, #3FA2FF, #5470FF);
		font-size: 13px;
		letter-spacing: 1px;
		position: fixed;
		bottom: 10%;
		left: 35%;
	}
    .pop-main{
		width: 100%;
		background-color: #FFFFFF;
		position: relative;
		text-align: center;
		border-radius: 20rpx;
		.cancell-icon{
			position: absolute;
			top: 20rpx;
			left: 20rpx;
			width: 40rpx;
			height: 40rpx;
		}
		.noPhoto{
			width: 200rpx;
			height: 200rpx;
			margin-top: 50rpx;
		}
		.title{
			
		}
		.subTitle{
			margin: 30rpx 0;
		}
		.ok_btn{
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			background-color: #007AFF;
			color: #FFFFFF;
			border-radius: 20rpx;
		}
	}
}
</style>
