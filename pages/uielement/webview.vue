<template>
	<view>
		<uni-nav-bar :title="m_title" :fixed="true" :status-bar="true" :background-color="bgcolor">
			<view class="right_btn" slot="right">
				<view class="box" :style="'background-color: '+bgcolor">
					<image src="../../static/image/index/shenglve.png" mode="" @tap="goChoice"></image>
					<view class="line"></view>
					<image src="../../static/image/index/x.png" mode="" @tap="goBack"></image>
				</view>
			</view>
		</uni-nav-bar>
		<cover-view v-if="show" class="controls-title">简单的自简单的自定义 controls简单的自定义 controls简单的自定义 controls简单的自定义
			controls简单的自定义 controls简单的自定义 controls简单的自定义 controls定义 controls</cover-view>
		<web-view ref="scope" :webview-styles="webviewStyles" :src="m_url2" @message="handleMessage"
			:style="'top:'+topHeight+'px'"></web-view>
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
			uniPopupMessage,

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
				this.m_currentWebview = this.$scope.$getAppWebview().children()[0]; //currentWebview.children()[0]
				this.m_currentWebview.loadURL(this.m_url)
				this.m_currentWebview.addEventListener("loaded", function() {
					console.log("==window==loaded===")
				}, false);
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
									// self.m_currentWebview.loadURL(self.m_url)
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
				title: 'Hello',
				show: false,
				dialogContent: 'are you ok?',
				password: "",
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

			// 验证密码是否正确
			uni.$on('popup-page', (data) => {
				console.log("-------------", data);
				if (data.iscancel == false) {
					//验证密码是否正确  密码来自原生子窗体
					console.log("-------------", data.password);
					if (!data.password) {
						this.util.UiUtils.showToast(this.pasd_err_blank)
						return;
					}
					let walletInfo = this.dal.WalletManage.getCurrWallet();
					if (data.password != walletInfo.password) {
						this.util.UiUtils.showToast(this.pasd_err_tip);
						// data.password = ""
						return;
					}
					this.onConfirmTrans()
					data.obj.hide();
				} else {
					this.onCancleTrans();
					data.obj.hide();
				}
			})

			this.initword()
		},

		methods: {
			onTransResult: function(data) {
				uni.hideLoading();
				console.log("=onTransResult=data==", data)
				let str = {
					"method": this.dataParams.method,
					"callbackid": this.dataParams.callbackid,
					"hash": "",
					"error": {
						"message": "交易失败，余额不足",
						"code": "2001"
					}
				}
				if (data.result == true) {
					str.txid = data.txid;
					str.hash = data.txid;
					str.error = null;
				}
				console.log("=this.dataParamsdata==", this.dataParams)
				console.log("window.callBack3(" + JSON.stringify(str) + ");");
				this.m_currentWebview.evalJS(
					"window.callBack3(" + JSON.stringify(str) + ");"
				);
			},

			showPasdPop() {
				let walletInfo = this.dal.WalletManage.getCurrWallet();
				if(walletInfo){
					let amount = this.dataParams.params.value * 1;
					let symbol = this.dataParams.params.symbol.toLowerCase();
					if (symbol == "eth") {
						let balance = this.dal.WalletManage.getBalance();
						if(balance <= amount){
							this.util.UiUtils.showToast(symbol.toUpperCase() + "余额不足");
							return;
						}
					} else {
						let contractaddress = ""
						if (symbol == "yk") {
							contractaddress = this.dal.Eth.contractYKAddress;
						} else if (symbol == 'usdt') {
							contractaddress = this.dal.Eth.contractUsdtAddress;
						}
						console.log("=33333=contractaddress===", contractaddress)
						if (contractaddress.length > 0) {
							let contractWalletInfo = this.dal.ContractWallet.getContractMoney(walletInfo.address, contractaddress);
							if(contractWalletInfo){
								let money  = contractWalletInfo.money
								console.log("=33333=money===", money)
								console.log("=33333=amount===", amount)
								if(money <= amount){
									this.util.UiUtils.showToast(symbol.toUpperCase() + "余额不足");
									this.onCancleTrans();
									return;
								}
							}else{
								this.util.UiUtils.showToast("钱包暂无此代币，加入钱包后进行操作");
								this.onCancleTrans();
								return;
							}
						}else{
							this.util.UiUtils.showToast("未知代币名称");
							this.onCancleTrans();
							return;
						}
					}
				}
				
				//显示密码框
				const subNvue = uni.getSubNVueById('pasd-popup'); // 获取subNvue实例
				subNvue.show(); // 显示
			},

			//取消交易
			onCancleTrans: function() {
				let str = {
					"method": this.dataParams.method,
					"callbackid": this.dataParams.callbackid,
					"hash": "",
					"error": {
						"message": "用户取消了操作",
						"code": "1001"
					}
				}

				this.m_currentWebview.evalJS(
					"window.callBack3(" + JSON.stringify(str) + ");"
				);
			},
			//确认交易
			onConfirmTrans: function() {
				uni.showLoading();
				//检查输入密码是否正确，正确则跳转到备份页，否则给与密码不对提示
				// data.password = "";
				// this.$refs.pasdPop.close()
				let symbol = this.dataParams.params.symbol.toLowerCase();
				if (symbol == "eth") {
					this.dal.WalletManage.sendTransaction(symbol, this.dataParams.params.to, this.dataParams.params
						.value, 0, "dapp交易").then(result => {
						console.log("=111=result===")
					});
				} else {
					let contractaddress = ""
					if (symbol == "yk") {
						contractaddress = this.dal.Eth.contractYKAddress;
					} else if (symbol == 'usdt') {
						contractaddress = this.dal.Eth.contractUsdtAddress;
					}							
					console.log("=111=symbol===" , symbol)
					console.log("=111=contractaddress===" , contractaddress)
					if (contractaddress.length > 0) {
						this.dal.WalletManage.sendTokenTransaction(symbol, this.dataParams.params.to, this.dataParams
							.params.value, contractaddress, 0).then(result => {
						});
					}
				}
			},

			initword() {
				this.refersh = this.getLocalStr("refersh")
				this.copy_link = this.getLocalStr("copy_link")
				this.btnstring_cancle = this.getLocalStr("btnstring_cancle")
				this.copy_success = this.getLocalStr("copy_success")
				this.pasd_title = this.getLocalStr("pasd_title")
				this.pasd_err_blank = this.getLocalStr("pasd_err_blank")
				this.pasd_err_tip = this.getLocalStr("pasd_err_tip")
				this.btnstring_confirm = this.getLocalStr("btnstring_confirm")
				this.btnstring_cancle = this.getLocalStr("btnstring_cancle")
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			cancell() {
				this.password = "";
				this.$refs.pasdPop.close()
			},
			confirmOk() {

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

			handleMessage: function(evt) { //data={"params":"eth_accounts","callbackid":1614872174140} 
				// console.warn('===x=xxxxxxxx======111==接收到的消息：' + JSON.stringify(evt));
				let data = evt.detail.data[0];
				if (data) {
					// console.warn('===x=xxxxxxxx======data=' + JSON.stringify(data));
					// console.warn('===x=xxxxxxxx======data.method=', data.method)
					if (data.method == "user.showAccountSwitch") {
						// this.util.StringUtils.setUserDefaults("imtoken_account_address_key",
						// 	"0x9CaCdC05cD8CE97d13d76CF1939E1c8c9e785508");
						// this.m_currentWebview.evalJS(
						// 	"window.callBack3({method:'" + data.method + "',callbackid:'" + data.callbackid +
						// 	"',address:'[0x9CaCdC05cD8CE97d13d76CF1939E1c8c9e785508]',err:null});"
						// )
					} else if (data.method == "transaction.signTransaction") {
						this.dataParams = data;
						console.log('=this.dataParams=', JSON.stringify(this.dataParams))
						let symbol = this.dataParams.params.symbol.toUpperCase();
						let title = uni.getLocalStr("tip_title");
						let content = "您确认用" + this.dataParams.params.value + symbol + "进行交易吗？";
						uni.showModal({
							title: title,
							content: content,
							cancelText: "取消",
							confirmText: "确认",
							success: function(res) {
								if (res.confirm) {
									this.showPasdPop();
								} else if (res.cancel) {
									this.onCancleTrans();
								}
							}.bind(this)
						})
					} else if (data.method == "eth_requestAccounts") {
						console.warn('===x=xxxxxxxx======data=')
						let item = this.dal.Dapp.getAllowDappByDeault()
						this.m_currentWebview.evalJS(
							"window.callBack3({method:'" + data.method + "',callbackid:'" + data.callbackid +
							"',accounts:['" + item.address + "'],err:null});"
						);
					} else if (data.method == "eth_accounts") {
						let item = this.dal.Dapp.getAllowDappByDeault()
						this.m_currentWebview.evalJS(
							"window.callBack3({method:'" + data.method + "',callbackid:'" + data.callbackid +
							"',accounts:['" + item.address + "'],err:null});"
						);
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
