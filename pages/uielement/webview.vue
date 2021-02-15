<template>
	<view>
		<uni-nav-bar :title="m_title" :fixed="true" :status-bar="true" :background-color="bgcolor">
			<view class="right_btn" slot="right">
				<view class="box" :style="'background-color: '+bgcolor">
					<image src="../../static/image/index/shenglve.png" mode="" @tap="goChoice"></image>
					<view class="line"></view>
					<image src="../../static/image/index/x.png" mode="" @click="goBack"></image>
				</view>
			</view>
		</uni-nav-bar>
		<web-view ref="scope" :webview-styles="webviewStyles" :src="m_url" @message="handleMessage" :style="'top:'+topHeight+'px'"></web-view>
	    <uni-popup type="bottom" ref="popup">
			<view class="main-c">
				<view class="top-box">
					<view>
						<view class="menu copy" @tap="btnCopyFun">
							<image src="../../static/image/index/copy-h5.png" mode=""></image>
						</view>
						<view class="title">{{copy_link}}</view>
					</view> 
					<view>
						<view class="menu refersh" @tap="refershFun">
							<image src="../../static/image/index/refersh.png" mode=""></image>
						</view>
						<view class="title">{{refersh}}</view>
					</view>
				</view>
				<view class="botto-btn" @tap="cancellFun">{{btnstring_cancle}}</view>
			</view>
		</uni-popup>
		<uni-popup ref="msgPop" type="message">
		    <uni-popup-message type="error" :message="copy_success" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
	</view>
</template>

<script>
	import menus from '@/common/shared/bottomMenu.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message'
	export default {
		components: {
			uniPopup,
			uniPopupMessage
		},
		onReady() {
			console.log("==onReady====2222222== ==",)
			this.topHeight = uni.getSystemInfoSync().statusBarHeight+44;
			if (this.$scope) {
				console.log("==onReady====333333== ==")
				let Web3 = this.dal.Dapp.getWeb3()
				console.log("==onReady====44444== ==", Web3)
				var currentWebview = this.$scope.$getAppWebview().children()[0];
				//监听注入的js
				// currentWebview.addEventListener('loaded', function() {
				let window = require('../../common/dal/dapp/window.js')
				// console.log("==window==", JSON.stringify(window))
				currentWebview.evalJS(window);		
				// #ifdef APP-PLUS
				currentWebview.setStyle({top:this.topHeight})
				// #endif
			}
		}, 
		data() { 
			return {
				topHeight:0,
				m_url: "",
				isdisabled: true,
				bgcolor:"",
				webviewStyles: {
					progress: {
						color: '#FF6666',
					}
				}
			}
		},
		onLoad(option) {
			var data = JSON.parse(option.query);
			this.m_title = data.title;
			this.m_url = data.url;
			this.bgcolor = data.bgcolor?data.bgcolor:"#ffffff";
			// uni.setNavigationBarTitle({
			// 	title: this.m_title
			// })
			this.initword()
			
		},
		
		methods: {
			initword(){		
				this.refersh = this.getLocalStr("refersh")
				this.copy_link = this.getLocalStr("copy_link")
				this.btnstring_cancle = this.getLocalStr("btnstring_cancle")
				this.copy_success = this.getLocalStr("copy_success")
			},
			goBack(){
				uni.navigateBack({
					delta:1
				})
			},
			goChoice(){
				// #ifdef H5
				this.$refs.popup.open()
				// #endif
				
				// #ifdef APP-PLUS
				 let list = [
				 	{
				 		icon:"/static/image/index/copy.png",
				 		text:this.copy_link
				 	},
				 	{
				 		icon:"/static/image/index/refersh.png",
				 		text:this.refersh
				 	},
				 ]
				 this.menuObj=menus({},list,(index)=>{
				 	console.log('123')
				 	switch (index){
				 		case 0:this.btnCopyFun()
				 			break;
				 		case 1:this.refershFun()
				 			break;
				 		default:
				 			break;
				 	}
				 	
				 })
				 this.$nextTick(()=>{					
				 	this.menuObj.alphaBg.show();
				 	this.menuObj.shareMenu.show();
				 })
				// #endif
			},
			btnCopyFun: function() {
				let self = this;
				uni.setClipboardData({
					data: this.m_url,
					success: function(data) {
						// self.util.UiUtils.showToast(this.copy_success);
						self.$refs.msgPop.open();
						self.$refs.popup.close();
						
						// #ifdef APP-PLUS
						self.menuObj.shareMenu.hide();
						self.menuObj.alphaBg.hide();
						// #endif
					},
					fail: function(err) {},
					complete: function(res) {}
				});
			},
			refershFun(){
				this.$openPage({
					name: "webui-webview",
					query: {
						url: this.m_url,
						title: this.m_title,
						bgcolor:this.bgcolor
					},
					gotype:"redirectTo"
				})
				
				// #ifdef APP-PLUS
				this.menuObj.shareMenu.hide();
				this.menuObj.alphaBg.hide();
				// #endif
			},
			cancellFun(){
				this.$refs.popup.close()
			},
			handleAccountsChanged: function() {
				console.log('=====handleAccountsChanged=========');
			},

			handleChainChanged: function() {
				console.log('=====handleChainChanged=========');
			},
			
			handleMessage(evt) {
				uni.cclog('接收到的消息：' + JSON.stringify(evt.detail.data));
			},
			radioChange: function(evt) {
				this.isdisabled = false;
			},
			onBtnClick: function() {
				this.util.StringUtils.setUserDefaults("guide_agree_key", "true");
				uni.navigateBack({
					delta: 1
				});
			}
		}

	}
</script>

<style lang="scss" scoped>
	/deep/ .uni-navbar--border{
		border: 0;
	}
	/deep/ .uni-popup{
		z-index: 999;
	}
	/deep/ .uni-popup-message{
		height: 162rpx !important;
		line-height: 162rpx !important;
	}
	/deep/ .uni-popup__error{
		background-color: #375efe;
	}
	/deep/ .uni-popup__error-text{
		color: #FFFFFF;
	}
	/deep/ .uni-transition{
		background-color: rgba(0, 0, 0, 0)!important;
	}
	.box{
		width: 180rpx;
		height: 70rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		border-radius: 35rpx;
		border: 1rpx solid #E7E6ED;
		display: flex;
		align-items: center;
		justify-content: space-between;
		image{
			width: 50rpx;
			height: 50rpx; 
		}
		view{
			width: 1rpx;
			height: 40rpx;
			background-color: #E7E6ED;
		}
	}
	.main-c{
		position: relative;
		width: 100%;
		height: 30vh;
		border-radius: 10rpx 10rpx 0 0;
		background-color: #FAFAFA;
		padding: 30rpx 20rpx 10rpx;
		box-sizing: border-box;
		.top-box{
			display: flex;
			align-items: center;
			>view{
				margin-right: 30rpx;
				width: 120rpx;
				text-align: center;
			}
			.title{
				font-size: 28rpx;
				font-weight: 400;
				color: #121212;
			}
			.menu{
				width: 120rpx;
				height: 120rpx;
				margin: 0 auto 15rpx;
				border-radius: 20rpx;
				background-color: #FFFFFF;
				text-align: center;
				image{
					width: 60rpx;
					height: 60rpx;
					margin-top: 30rpx;
				}
			}
		}
		.botto-btn{
			width: calc(100% - 40rpx);
			background-color: #FFFFFF;
			line-height: 90rpx;
			height: 90rpx;
			text-align: center;
			font-size: 32rpx;
			font-weight: 400;
			color: #121212;
			border-radius: 10rpx;
			position: absolute;
			bottom: 15rpx;
			left: 50%;
			transform: translateX(-50%);
		}
	}
</style>
