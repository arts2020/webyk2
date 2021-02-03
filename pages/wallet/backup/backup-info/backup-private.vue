<template>
	<view class="backup-private">
		<uni-nav-bar :statusBar="true" :fixed="true" left-icon="back" title="导出私钥" @clickLeft="goBack"></uni-nav-bar>
	    <view class="content-c">
	    	{{privateKey}}
	    </view>
		<view class="copy_btn" @tap="goCopy">复制私钥</view>
		<uni-popup ref="popup" type="message">
		    <uni-popup-message type="success" message="复制成功" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				privateKey:""
			};
		},
		onShow() {
			// 获取私钥
			this.privateKey = 'bsuggfenpoe55856sdvsd5a4s5zx5a9s'
		},
		methods:{
			goBack(){
				this.util.UiUtils.switchBackPage();
			},
			goCopy(){
				this.util.Utils.setClipboardData(this.privateKey)
				this.$refs.popup.open();
			}
		}
	}
</script>

<style lang="scss" scoped>
.backup-private{
	width: 100%;
	min-height: 100vh;
	position: relative;
	/deep/ .uni-popup-message{
		height: 162rpx !important;
		line-height: 162rpx !important;
	}
	/deep/ .uni-popup{
		z-index: 999 !important;
	}
	.copy_btn{
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		background-color: #007AFF;
		color: #FFFFFF;
		font-size: 30rpx;
		font-weight: 600;
		position: absolute;
		bottom: 0;
	}
}
</style>
