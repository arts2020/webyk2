<template>
	<view class="backup-keystore">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" title="导出keystore" @clickLeft="goBack"></uni-nav-bar>	    
		<view class="box">
			<view class="p1">离线保存</view>
			<view class="p2">切勿保存至邮箱，记事本，网盘，聊天工具等，非常危险</view>
		</view>
		<view class="box">
			<view class="p1">请勿使用网络传输</view>
			<view class="p2">请勿使用网络工具传输，一旦被黑客获取将造成不可挽回的资
产损失，建议离线设备通过扫描二维码方式传输。</view>
		</view>
		<view class="box">
			<view class="p1">密码管理工具保存</view>
			<view class="p2">建议使用密码管理工具管理</view>
		</view>
		<view class="box">
			<view class="p2">{{keystore}}</view>
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
			this.keystore = 'bsuggfenpoe55bsuggfenpoe55856sdvsd5a4s5zx5a9s856sdvsd5a4s5zx5a9s'
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
	position: relative;
	/deep/ .uni-navbar--border{
		border: 0;
	}
	/deep/ .uni-popup-message{
		height: 162rpx !important;
		line-height: 162rpx !important;
	}
	/deep/ .uni-popup{
		z-index: 999 !important;
	}
	.box{
		color: #071328;
		width: 100%;
		height: 195rpx;
		padding: 40rpx 30rpx 42rpx;
		box-sizing: border-box;
		border-bottom: 1rpx solid #e7e6ed;
		&:nth-child(3){
			height: 241rpx;
		}
		.p1{
			font-size: 38rpx;
			font-family: PingFang SC, PingFang SC-Semibold;
			font-weight: 600;			
		}
		.p2{
			font-size: 26rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
		}
		&:nth-child(5){
			border-bottom: 0;
			height: fit-content;
			word-break: break-all;
		}
	}
	.copy_btn{
		width: 647rpx;
		height: 88rpx;
		line-height: 88rpx;
		background: #4c72ef;
		border-radius: 14rpx;
		box-shadow: 0px 3rpx 26rpx 0px rgba(0,0,0,0.06); 
		text-align: center;
		color: #FFFFFF;
		font-size: 32rpx;
		font-family: PingFang SC, PingFang SC-Bold;
		font-weight: 600;
		position: fixed;
		bottom: 47rpx;
		left: 50%;
		transform: translateX(-50%);
	}
}
</style>
