<template>
	<view class="backup-keystore">
		<uni-nav-bar :statusBar="true" :fixed="true" left-icon="back" title="导出keystore" @clickLeft="goBack"></uni-nav-bar>
	    
		<view class="content-c">
			{{keystore}}
		</view>
		<view class="copy_btn" @tap="goCopy">复制keystore</view>
		<uni-popup ref="popup" type="message">
		    <uni-popup-message type="success" message="复制成功" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	export default {
		name:"backup-keystore",
		components: {
		        uniPopup,
		        uniPopupMessage,
		    },
		data() {
			return {
				keystore:""
			};
		},
		onShow() {
			// 获取keystore
			this.keystore = 'bsuggfenpoe55856sdvsd5a4s5zx5a9s'
		},
		methods:{
			goBack(){
				this.util.UiUtils.switchBackPage();
			},
			goCopy(){
				this.util.Utils.setClipboardData(this.keystore);
				this.$refs.popup.open()
			}
		}
	}
</script>

<style lang="scss" scoped>
.backup-keystore{
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
	.content-c{
		
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
