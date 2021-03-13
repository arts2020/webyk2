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
		<web-view ref="scope" :webview-styles="webviewStyles" @message="handleMessage" :style="'top:'+topHeight+'px'"></web-view>
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
			let seft = this;
			this.topHeight = uni.getSystemInfoSync().statusBarHeight + 44;
			if (this.$scope) {
				this.dal.WindowJs.getCurrentWebView().then(function(currWebView) {
					console.log('===currWebView==' + currWebView)
					if (currWebView) {
						setTimeout(function() {
							var childrenWebView = plus.webview.currentWebview();
							// let currWebView = this.dal.WindowJs.getCurrentWebView();//plus.webview.create();
							currWebView.loadURL(seft.m_url)
							currWebView.setStyle({
								top: seft.topHeight
							})
							childrenWebView.append(currWebView)
							var w = plus.nativeUI.showWaiting();
							currWebView.addEventListener("loading", function() {
								w.show();
							}, false);
							currWebView.addEventListener("loaded", function() {
								w.close();
								w = null;
							}, false);
							currWebView.show("slide-in-bottom",200);
						}, 1000)
					}
				});
				plus.globalEvent.addEventListener('plusMessage', function(msg) {
					if (msg.data.args.data.name == 'postMessage') {
						console.log('子页面返回的数据为:' + JSON.stringify(msg.data.args.data.arg));
						let data = msg.data.args.data.arg;
						if (data.count == 2) {
							console.log("====11====", this.m_url)
							// var webviews = this.$scope.$getAppWebview().children()[0]
							// setTimeout(function(){
							// 	webviews.loadURL(this.m_url)
							// 	console.log("====222====",this.m_url)
							// 	// var webview = plus.webview.create(this.m_url,'custom-webview')
							// 	childrenWebView.append(webviews);
							// }.bind(this),1000)
						}
					}
				}.bind(this));
			} else {
				console.log('==this.$ref==', this.$refs)
				let webview = this.$refs.scope;
				webview.src = this.m_url;
			}
		},
		data() {
			return {
				topHeight: 0,
				m_url: "",
				m_url2: "",
				isdisabled: true,
				bgcolor: "",
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
			this.m_url = "http://192.168.3.30:8080/";
			// this.m_url = "https://uniswap.tokenpocket.pro/?utm_source=tokenpocket#/swap";
			this.bgcolor = data.bgcolor ? data.bgcolor : "#ffffff";
			// uni.setNavigationBarTitle({
			// 	title: this.m_title
			// })
			if (plus) {
				plus.webview.prefetchURL(this.m_url)
			}
			this.initword()
		},

		methods: {
			initword() {
				this.refersh = this.getLocalStr("refersh")
				this.copy_link = this.getLocalStr("copy_link")
				this.btnstring_cancle = this.getLocalStr("btnstring_cancle")
				this.copy_success = this.getLocalStr("copy_success")
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			goChoice() {
				// #ifdef H5
				this.$refs.popup.open()
				// #endif

				// #ifdef APP-PLUS
				let list = [{
						icon: "/static/image/index/copy.png",
						text: this.copy_link
					},
					{
						icon: "/static/image/index/refersh.png",
						text: this.refersh
					},
				]
				this.menuObj = menus({}, list, (index) => {
					console.log('123')
					switch (index) {
						case 0:
							this.btnCopyFun()
							break;
						case 1:
							this.refershFun()
							break;
						default:
							break;
					}

				})
				this.$nextTick(() => {
					this.menuObj.alphaBg.show();
					this.menuObj.shareMenu.show();
				})
				// #endif
			},
			btnCopyFun: function() {
				console.log('=====btnCopyFun=========');
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
			refershFun() {
				console.log('=====refershFun=========');
				this.$openPage({
					name: "webui-webview",
					query: {
						url: this.m_url,
						title: this.m_title,
						bgcolor: this.bgcolor
					},
					gotype: "redirectTo"
				})

				// #ifdef APP-PLUS
				this.menuObj.shareMenu.hide();
				this.menuObj.alphaBg.hide();
				// #endif
			},
			cancellFun() {
				console.log('=====cancellFun=========');
				this.$refs.popup.close()
			},
			handleAccountsChanged: function() {
				console.log('=====handleAccountsChanged=========');
			},

			handleChainChanged: function() {
				console.log('=====handleChainChanged=========');
			},

			handleMessage: function(evt) { //data={"params":"eth_accounts","callbackid":1614872174140} 
				console.warn('===x=xxxxxxxx======111==接收到的消息：' + JSON.stringify(evt));
				let data = evt.detail.data[0];
				if (data) {
					console.warn('===x=xxxxxxxx======data=' + JSON.stringify(data));
					if (data.apiName == "user.showAccountSwitch") {
						this.util.StringUtils.setUserDefaults("imtoken_account_address_key",
							"0x9CaCdC05cD8CE97d13d76CF1939E1c8c9e785508");
						this.m_currentWebview.evalJS(
							"window.callBack3({apiName:'" + data.apiName + "',callbackid:'" + data.callbackid +
							"',address:'0x9CaCdC05cD8CE97d13d76CF1939E1c8c9e785508',err:null});"
						)
					} else if (data.apiName == "transaction.signTransaction") {
						// var params = {
						//   to: '0x0fa38abec02bd4dbb87f189df50b674b9db0b468',
						//   from: web3.eth.defaultAccount,
						//   value: '1250000000000000',
						// }
						this.m_currentWebview.evalJS(
							"window.callBack3({apiName:'" + data.apiName + "',callbackid:'" + data.callbackid +
							"',signature:'tx',err:null});"
						);
					} else if (data.apiName == "eth_requestAccounts") {
						this.m_currentWebview.evalJS(
							"window.callBack3({apiName:'" + data.apiName + "',callbackid:'" + data.callbackid +
							"',signature:'tx',err:null});"
						);
					} else if (data.apiName == "eth_accounts") {
						this.m_currentWebview.evalJS(
							"window.callBack3({apiName:'" + data.apiName + "',callbackid:'" + data.callbackid +
							"',signature:'tx',err:null});"
						);
					}
				}
			},
			handlePostMessage: function(evt) {
				console.warn('===x=xxxxxxxx=====22===接收到的消息：');
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
	/deep/ .uni-navbar--border {
		border: 0;
	}

	/deep/ .uni-popup {
		z-index: 999;
	}

	/deep/ .uni-popup-message {
		height: 162rpx !important;
		line-height: 162rpx !important;
	}

	/deep/ .uni-popup__error {
		background-color: #375efe;
	}

	/deep/ .uni-popup__error-text {
		color: #FFFFFF;
	}

	/deep/ .uni-transition {
		background-color: rgba(0, 0, 0, 0) !important;
	}

	.box {
		width: 180rpx;
		height: 70rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		border-radius: 35rpx;
		border: 1rpx solid #E7E6ED;
		display: flex;
		align-items: center;
		justify-content: space-between;

		image {
			width: 50rpx;
			height: 50rpx;
		}

		view {
			width: 1rpx;
			height: 40rpx;
			background-color: #E7E6ED;
		}
	}

	.main-c {
		position: relative;
		width: 100%;
		height: 30vh;
		border-radius: 10rpx 10rpx 0 0;
		background-color: #FAFAFA;
		padding: 30rpx 20rpx 10rpx;
		box-sizing: border-box;
		z-index: 1000;

		.top-box {
			display: flex;
			align-items: center;

			>view {
				margin-right: 30rpx;
				width: 120rpx;
				text-align: center;
			}

			.title {
				font-size: 28rpx;
				font-weight: 400;
				color: #121212;
			}

			.menu {
				width: 120rpx;
				height: 120rpx;
				margin: 0 auto 15rpx;
				border-radius: 20rpx;
				background-color: #FFFFFF;
				text-align: center;

				image {
					width: 60rpx;
					height: 60rpx;
					margin-top: 30rpx;
				}
			}
		}

		.botto-btn {
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
