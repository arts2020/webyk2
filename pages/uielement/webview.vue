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

		<uni-popup type="center" ref="pasdPop">
			<view class="main-content">
				<view class="title">{{pasd_title}}</view>
				<view class="input-box">
					<input type="text" :placeholder="pasd_title" password v-model="password" />
				</view>
				<view class="btns">
					<view class="cancell" @click="cancellPass">{{btnstring_cancle}}</view>
					<view class="ok" @click="confirmOk">{{btnstring_confirm}}</view>
				</view>
			</view>
		</uni-popup>
		<web-view ref="scope" :webview-styles="webviewStyles" :src="m_url2" @message="handleMessage"
			:style="'top:'+topHeight+'px'"></web-view>
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
		created() {
			this.util.EventUtils.addEventListenerCustom(this.dal.WalletManage.evtTransResult, this.onTransResult);
		},
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.WalletManage.evtTransResult, this.onTransResult);
		},
		onReady() {
			this.topHeight = uni.getSystemInfoSync().statusBarHeight + 44;
			if (this.$scope) {
				this.util.UiUtils.showLoading("loading...");
				this.m_currentWebview = this.$scope.$getAppWebview().children()[0]; //currentWebview.children()[0]
				this.m_currentWebview.addEventListener("loaded", function() {
					console.log("==window==loaded===")
					this.util.UiUtils.hideLoading();
				}.bind(this), false);
				let self = this;
				plus.io.requestFileSystem(plus.io.PRIVATE_WWW, function(fobject) {
					fobject.root.getFile('_www/static/js/uni.webview.1.5.2.js', {
						create: false
					}, function(fileEntry) {
						fileEntry.file(function(file) {
							console.log("====uni.webview=file===", file)
							var fileReader = new plus.io.FileReader();
							fileReader.readAsText(file, 'utf-8');
							fileReader.onloadend = function(evt) {
								console.log("====44444444444444444444444===")
								self.m_currentWebview.evalJS(
									evt.target.result
								)
								setTimeout(function() {
									console.log("====5555555555555555555===")
									self.m_currentWebview.loadURL(self.m_url)
									console.log("====666666666666666666===")
								}, 1000)


							}
						});
					});
				})

				this.m_currentWebview.setStyle({
					top: this.topHeight
				})
				let strjs = this.dal.WindowJs.getImTokenInjectionStr();
				this.m_currentWebview.evalJS(
					strjs
				)
			} else {
				this.m_url2 = this.m_url;
				console.log("==this.m_url2==", this.m_url2)
			}
		},
		data() {
			return {
				topHeight: 0,
				password: "",
				m_url: "",
				m_url2: "",
				isdisabled: true,
				bgcolor: "",
				webviewStyles: {
					progress: {
						color: '#FF6666',
					}
				},
				dataParams: null,
			}
		},
		onLoad(option) {
			var data = JSON.parse(option.query);
			this.m_title = data.title;
			this.m_url = data.url;
			// this.m_url = "http://192.168.3.30:8080/";
			// this.m_url = "http://192.168.3.30:3000";
			// this.m_url = "https://uniswap.tokenpocket.pro/?utm_source=tokenpocket#/swap";
			// this.m_url = "https://dapp.tokenpocket.pro/StakingVault/index.html?locale=zh&utm_source=tokenpocket#/";
			this.bgcolor = data.bgcolor ? data.bgcolor : "#ffffff";
			// uni.setNavigationBarTitle({
			// 	title: this.m_title
			// })
			// #ifdef APP-PLUS
			plus.webview.prefetchURL(this.m_url)
			// #endif
			this.$refs.pasdPop.open()
			
			this.initword()
		},

		methods: {
			initword() {
				this.refersh = this.getLocalStr("refersh")
				this.copy_link = this.getLocalStr("copy_link")
				this.btnstring_cancle = this.getLocalStr("btnstring_cancle")
				this.copy_success = this.getLocalStr("copy_success")
				this.pasd_title = this.getLocalStr("pasd_title")
				this.pasd_err_blank = this.getLocalStr("pasd_err_blank")
				this.pasd_err_tip = this.getLocalStr("pasd_err_tip")
				this.btnstring_confirm = this.getLocalStr("btnstring_confirm")
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
			onTransResult: function(data) {
				console.log("=onTransResult=data==", data)
				let txid = "";
				if (data.result == true) {
					txid = data.txid;
				}
				this.m_currentWebview.evalJS(
					"window.callBack3({method:'" + this.dataParams.method + "',callbackid:'" + this.dataParams
					.callbackid +
					"',signature:'" + txid + "',state:true,err:null});"
				);
			},

			confirmOk() {
				if (!this.password) {
					this.util.UiUtils.showToast(this.pasd_err_blank)
					return;
				}

				if (this.password != this.statusInfo.password) {
					this.util.UiUtils.showToast(this.pasd_err_tip);
					this.password = ""
					return;
				}
				//检查输入密码是否正确，正确则跳转到备份页，否则给与密码不对提示
				this.password = "";
				this.$refs.pasdPop.close()

				this.dal.WalletManage.sendTransaction('eth', this.dataParams.to, this.dataParams.value, 0, "dapp交易").then(
					result => {
						console.log("=111=result===")
					});
			},
			cancellPass() {
				this.password = "";
				this.$refs.pasdPop.close()
				this.m_currentWebview.evalJS(
					"window.callBack3({method:'" + this.dataParams.method + "',callbackid:'" + this.dataParams
					.callbackid +
					"',signature:'',state:false,err:null});"
				);
			},

			handleAccountsChanged: function() {
				console.log('=====handleAccountsChanged=========');
			},

			handleChainChanged: function() {
				console.log('=====handleChainChanged=========');
			},

			handleMessage: function(evt) { //data={"params":"eth_accounts","callbackid":1614872174140} 
				// console.warn('===x=xxxxxxxx======111==接收到的消息：' + JSON.stringify(evt));
				let data = evt.detail.data[0];
				if (data) {
					// console.warn('===x=xxxxxxxx======data=' + JSON.stringify(data));
					// console.warn('===x=xxxxxxxx======data.method=', data.method)
					if (data.method == "user.showAccountSwitch") {
						// this.$refs.popup.open()
						// this.dataParams = data;
						// this.m_currentWebview.evalJS(
						// 	"window.callBack3({method:'" + data.method + "',callbackid:'" + data.callbackid +
						// 	"',address:'[0x9CaCdC05cD8CE97d13d76CF1939E1c8c9e785508]',err:null});"
						// )
					} else if (data.method == "transaction.signTransaction") {
						this.dataParams = data;
						console.warn('===x=xxxxxxxx======this.dataParams=',data)
						this.$refs.pasdPop.open()
					} else if (data.method == "eth_requestAccounts") {
						console.warn('===x=xxxxxxxx======data=')
						let item = this.dal.Dapp.getAllowDappByDeault()
						if (item) {
							this.m_currentWebview.evalJS(
								"window.callBack3({method:'" + data.method + "',callbackid:'" + data.callbackid +
								"',accounts:['" + item.address + "'],err:null});"
							);
						}
					} else if (data.method == "eth_accounts") {
						let item = this.dal.Dapp.getAllowDappByDeault()
						if (item) {
							this.m_currentWebview.evalJS(
								"window.callBack3({method:'" + data.method + "',callbackid:'" + data.callbackid +
								"',accounts:['" + item.address + "'],err:null});"
							);
						}
					} else if (data.method == "eth_chainId") {
						this.m_currentWebview.evalJS(
							"window.callBack3({method:'" + data.method + "',callbackid:'" + data.callbackid +
							"',chainId:'1',err:null});"
						);
					} else if (data.method == "eth_call") {
						this.m_currentWebview.evalJS(
							"window.callBack3({method:'" + data.method + "',callbackid:'" + data.callbackid +
							+"',params" + data.params + ",chainId:'1',err:null});"
						);
					} else if (data.method == "eth_approve") {
						this.m_currentWebview.evalJS(
							"window.callBack3({method:'" + data.method + "',callbackid:'" + data.callbackid +
							+"',params" + data.params + ",chainId:'1',err:null});"
						);
					} else if (data.method == "eth_getBalance") {
						let balane = this.dal.WalletManage.getBalance(null)
						this.m_currentWebview.evalJS(
							"window.callBack3({method:'" + data.method + "',callbackid:'" + data.callbackid +
							+"',params" + balane + ",chainId:'1',err:null});"
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
		},
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

	.main-content {
		width: 569rpx;
		height: 320rpx;
		background: #ffffff;
		border: 1rpx solid #707070;
		border-radius: 21rpx;
		padding-top: 26rpx;
		box-sizing: border-box;

		.title {
			font-size: 30rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			color: #071328;
			text-align: center;
			font-weight: bold;
		}

		.input-box {
			width: 505rpx;
			height: 77rpx;
			background: #f6f5f8;
			margin: 42rpx auto 49rpx;

			uni-input {
				width: 100%;
				height: 77rpx;
				line-height: 77rpx;
				border-radius: 10rpx;
				padding-left: 20rpx;
				box-sizing: border-box;
				background: #f6f5f8;
				font-size: 30rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
				color: #c2c2c2;
			}
		}

		.btns {
			width: 100%;
			font-size: 26rpx;
			color: #007AFF;
			font-weight: bold;
			text-align: center;
			border-top: 1rpx solid #E7E6ED;
			display: flex;
			align-items: center;
			font-size: 30rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;

			.cancell {
				color: #C2C2C2;
				width: 50%;
				line-height: 60rpx;
				border-right: 1rpx solid #E5E5E5;
			}

			.ok {
				color: #4C72EF;
				width: 50%;
				line-height: 60rpx;
			}
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
