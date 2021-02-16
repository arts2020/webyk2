<template>
	<view class="backup-keystore">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" :title="title_str19" @clickLeft="goBack"></uni-nav-bar>	    
		<view class="box">
			<view class="p1">{{btnstring_save_online}}</view>
			<view class="p2">{{bak_title_str9}}</view>
		</view>
		<view class="box">
			<view class="p1">{{bak_title_str10}}</view>
			<view class="p2">{{bak_title_str11}}</view>
		</view>
		<view class="box">
			<view class="p1">{{bak_title_str12}}</view>
			<view class="p2">{{bak_title_str13}}</view>
		</view>
		<view class="box">
			<view class="p2">{{keystore}}</view>
		</view>
		<view class="copy_btn" @tap="goCopy">{{btnstring_copyPrivate}}</view>
		<uni-popup ref="popup" type="message">
		    <uni-popup-message type="success" :message="copy_success" :duration="2000"></uni-popup-message>
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
		onLoad() {
			this.initword()
		},
		onShow() {
			// 获取keystore
			let walletInfo = this.dal.WalletManage.getCurrWallet();
			this.keystore = walletInfo.privateKey;
		},
		methods:{
			initword(){
				this.copy_success = this.getLocalStr("copy_success")
				this.btnstring_copyPrivate = this.getLocalStr("btnstring_copyPrivate")
				this.btnstring_save_online = this.getLocalStr("btnstring_save_online")
				this.bak_title_str9 = this.getLocalStr("bak_title_str9");
				this.bak_title_str10 = this.getLocalStr("bak_title_str10");
				this.bak_title_str11 = this.getLocalStr("bak_title_str11");
				this.bak_title_str12 = this.getLocalStr("bak_title_str12");
				this.bak_title_str13 = this.getLocalStr("bak_title_str13");
				
				this.title_str19 = this.getLocalStr("title_str19");
		
			},
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
