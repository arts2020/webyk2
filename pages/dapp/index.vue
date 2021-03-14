<template>
	<view class="DApp">
		<bar ref="bar"></bar>
		<view class="navBar">
			<view class="nav-search" @tap="goSearch">
				<uni-icons type="search" size="20" color="#CCD3D9"></uni-icons>
				<input type="text" v-model="keyword" confirm-type="search" placeholder="搜索或输入DApp网址"
					placeholder-class="tipClass" />
			</view>
		</view>
		<scroll-view scroll-y="true" class="list-content" :style="'height:'+scrollHeight+'px'">
			<!-- 			<view class="list-item"@tap="goCheck(-1)">
				<image class="icon" src="../../static/image/icons/1024x1024.png" mode=""></image>
				<view class="dapp-info">
					<view class="title">YK联盟</view>
					<view class="descrip">YK联盟</view>
				</view>
				<image class="right-arr" src="../../static/image/index/arrow-left.png" mode=""></image>
			</view> -->
			<view class="list-item" v-for="(item,index) in list" :key="index" @tap="goCheck(item)">
				<image class="icon" :src="item.icon" mode=""></image>
				<view class="dapp-info">
					<view class="title">{{item.name}}</view>
					<view class="descrip">{{item.short_desc}}</view>
				</view>
				<image class="right-arr" src="../../static/image/index/arrow-left.png" mode=""></image>
			</view>
		</scroll-view>
		<uni-popup type="bottom" ref="popup">
			<view class="tip-Pop">
				<view class="top-title">{{dapp_tip_title}}</view>
				<view class="tip-content">{{dapp_tip_content}}
				</view>
				<view class="btns">
					<view class="cancell" @tap="cancell">{{btnstring_logout}}</view>
					<view class="confirm-ok" @tap="confirm">{{btn_confirms}}</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup type="bottom" ref="walletPop">
			<view class="main-context">
				<view class="top-content">
					<uni-icons type="closeempty" size="30" @tap="closePop"></uni-icons>
					<text>{{wallet_title_str7}}</text>
					<text style="color: #4c72ef;font-size: 30rpx;"></text>
				</view>
				<view class="main-content">
					<scroll-view class="main-left" scroll-y="true">
						<view class="nav-menu">
							<view class="menu-item" :class="{'activeClass':active==item.chaintype}"
								v-for="(item,index) in m_mychains" :key="index" @tap="handleChecked(item.chaintype)">
								<image :src="'../../static/image/chain/'+item.img" mode=""></image>
							</view>
						</view>
					</scroll-view>
					<scroll-view class="main-right" scroll-y="true">
						<view class="current-c" v-if="active!=-1">
							<view class="list-item" v-show="currentList.length" v-for="(item,index) in currentList"
								:key="index"
								:style="'background: url(../../static/image/chain/'+item.bgcImg+') no-repeat center;background-size: 100% 100%;'"
								@tap="checkedItem(item)">
								<view class="wallet-name">
									<text>{{item.name}}</text>
									<text>...</text>
								</view>
								<view class="wallet-addr">{{item.showAddress}}</view>
							</view>
							<no-data v-show="!currentList.length"></no-data>
						</view>
						<view class="main-c" v-else>
							<view class="top-title">
								<text>{{wallet_title_str2}}</text>
							</view>
							<view class="menu-list">
								<view class="list-item" v-for="(item,index) in identity_wallets" :key="index"
									:style="'background: url(../../static/image/chain/'+item.bgcImg+') no-repeat center;background-size: 100% 100%;'"
									@tap="checkedItem(item)">
									<view class="wallet-name">
										<text>{{item.name}}</text>
										<text>...</text>
									</view>
									<view class="wallet-addr">{{item.showAddress}}</view>
								</view>
							</view>
							<view class="create-import" v-if="single_wallets.length">
								<view class="top-title">{{btnstring_create}}/{{btnstring_import}}</view>
								<view class="list-item" @tap="checkedItem(item)"
									:style="'background: url(../../static/image/chain/'+item.bgcImg+') no-repeat center;background-size: 100% 100%;'"
									v-for="(item,index) in single_wallets" :key="index">
									<view class="wallet-name">
										<text>{{item.name}}</text>
										<text>...</text>
									</view>
									<view class="wallet-addr">{{item.showAddress}}</view>
								</view>
							</view>

						</view>
					</scroll-view>
				</view>

			</view>
		</uni-popup>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	export default {
		name: "DApp",
		components: {
			Bar
		},
		created() {
			this.util.EventUtils.addEventListenerCustom(this.dal.Setting.evtGetLanguage, this.initWord);
			this.util.EventUtils.addEventListenerCustom(this.dal.Dapp.evtGetDappList, this.onGetDappList);
		},
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Setting.evtGetLanguage, this.initWord);
			this.util.EventUtils.removeEventCustom(this.dal.Dapp.evtGetDappList, this.onGetDappList);
		},
		data() {
			return {
				keyword: "",
				scrollHeight: 0,
				// 当前点击的dapp数据
				currentDapp: {},
				// 所有数据
				list: [],
				//钱包管理页类型一致钱包列表
				currentList: [],
				//身份钱包
				identity_wallets: [],
				// 普通钱包
				single_wallets: [],
				m_mychains: [],
				//当前链的信息
				m_chain: {},
				//当前选中钱包的类型
				active: -1,
			}
		},
		onLoad() {
			this.initWord()


		},
		onShow() {
			uni.getSystemInfo({
				success: (res) => {
					this.scrollHeight = res.windowHeight - res.statusBarHeight - 54;
				}
			});
			this.initData()
			this.onRefersh();
		},
		onPullDownRefresh() {
			this.onRefersh();
		},
		methods: {
			initWord() {
				//获取所有中文文字
				this.btn_confirms = this.getLocalStr("btnstring_confirm");
				this.btnstring_logout = this.getLocalStr("btnstring_logout");
				this.dapp_tip_title = this.getLocalStr("dapp_tip_title");
				this.dapp_tip_content = this.getLocalStr("dapp_tip_content");
				this.wallet_title_str7 = this.getLocalStr("wallet_title_str7");
				this.btnstring_create = this.getLocalStr("btnstring_create");
				this.btnstring_import = this.getLocalStr("btnstring_import");
				this.wallet_index_asset = this.getLocalStr("wallet_index_asset");
				this.btnstring_manage = this.getLocalStr("btnstring_manage");
				this.wallet_index_title = this.getLocalStr("wallet_index_title");
				this.wallet_title_str2 = this.getLocalStr("wallet_title_str2");
				this.dapp_select_wallet = this.getLocalStr("dapp_select_wallet");
			},
			initData: function() {
				this.m_mychains = []
				this.chains = this.dal.Chain.getChainList();
				//获取当前已经有的链
				let mychains = this.dal.Chain.getMineChains();
				mychains.forEach(el => {
					if (typeof el != 'object') {
						let item = this.chains.find(e => e.chaintype == el);
						let temp = {
							chaintype: el,
							img: item.img || 'default.png'
						}
						if (item.chaintype == this.entities.Metadata.ChainType.ETH) {
							this.m_mychains.push(temp)
						}
					}
				})
				// 身份钱包数据
				let mineChains = this.dal.MainWallet.getMainWalletsByChaintype(this.entities.Metadata.ChainType.ETH);
				//添加logo图标和背景图
				mineChains.forEach(el => {
					let item = this.chains.find(e => e.chaintype == el.chaintype);
					el.name = el.name ? el.name : item.name;
					el.img = item.img || 'default.png';
					el.bgcImg = item.img.split('.')[0] + 'bg.png';
					el.showAddress = el.address ? el.address.substring(0, 7) + '...' + el.address.substring(el
							.address.length - 7) :
						"no address"
				})
				this.identity_wallets = mineChains;

				//普通钱包数据
				let normalWallets = this.dal.NormalWallet.getNormalWalletsByChaintype(this.entities.Metadata.ChainType
					.ETH);
				//添加logo图标和背景图
				normalWallets.forEach(el => {
					let item = this.chains.find(e => e.chaintype == el.chaintype);
					el.img = item.img || 'default.png';
					el.bgcImg = item.img.split('.')[0] + 'bg.png';
					el.showAddress = el.address ? el.address.substring(0, 7) + '...' + el.address.substring(el
							.address.length - 7) :
						"no address"
				})
				this.single_wallets = normalWallets;

				this.handleChecked(this.entities.Metadata.ChainType.ETH);
			},

			onRefersh() {

				this.list = [];
				this.currentDapp = {};

				//获取列表数据
				uni.startPullDownRefresh()
				this.dal.Dapp.onGetDapps()
			},
			goCheck(item) {
				// 打开访问说明  
				this.currentDapp = item;
				if(item.id == 2){
					this.util.UiUtils.showToast(this.getLocalStr("tip_not_open"));
					return;
				}
						console.log("=item==this.category=", this.currentDapp)
				if (this.currentDapp.category.toLowerCase() == 'eth') {
					let wallet = this.dal.WalletManage.getCurrWallet();
					if(wallet){
						let item = this.dal.Dapp.getAllowDapp(this.currentDapp.id,wallet.address)
						console.log("=item==item=", item)
						if (item) {
							this.active = this.entities.Metadata.ChainType.ETH;
							this.confirm();
						} else {
							this.$refs.walletPop.open();
						}
					}else{
						this.$refs.walletPop.open();
						// this.util.UiUtils.showToast(this.dapp_select_wallet)
					}
				} else {
					return;
				}
			},
			goSearch() {
				this.$openPage({
					name: "dapp-search"
				})
			},
			closePop() {
				this.active = -1;
				this.$refs.walletPop.close();
			},
			cancell() {
				// 取消访问
				this.$refs.popup.close();

			},
			confirm() {
				console.log("==confirm==")
				// if (this.currentDapp == -1) {
				// 	this.$openPage({
				// 		name: "YK-index"
				// 	})
				// 	this.$refs.popup.close()
				// 	return;
				// }
				// 确认访问
				this.$openPage({
					name: "webui-webview",
					query: {
						// url: "http://192.168.2.44:8081/",//this.currentDapp.app_url,
						// url: "http://192.168.3.30:8082/",  
						// url: "https://consenlabs.github.io/dapp-sdk-doc/index.html",//t
						url: this.currentDapp.app_url,
						title: this.currentDapp.name,
						bgcolor: this.currentDapp.color
					}
				})
				//关闭弹框
				this.$refs.popup.close()

			},
			checkedItem(item) {
				console.log("==33==item==",item)
				this.dal.Chain.setCurrChainType(item.chaintype);
				this.dal.WalletManage.setCurrWallet(item.chaintype, item.idx);
				
				this.dal.Dapp.addAllowDapp(this.currentDapp.id,item.address)
					
				this.$refs.walletPop.close();
				this.$refs.popup.open();
			},
			handleChecked(chaintype) {
				this.currentList = [];
				this.active = chaintype;
				if (chaintype != -1) {
					// 选中主链中一种,加入活动列表,并从普通钱包列表中筛选该类型的普通钱包加入活动列表
					let list1 = this.single_wallets.filter(el => el.chaintype == chaintype);
					let list2 = this.identity_wallets.filter(el => el.chaintype == chaintype);

					this.currentList = [...list2, ...list1];
				}
			},
			//去到管理钱包
			goManage() {
				this.$refs.walletPop.close()
				this.$openPage({
					name: "my-wallet-index"
				})
			},
			onGetDappList(data) {
				uni.stopPullDownRefresh()
				data.data.forEach(el => {
					if (!el.icon) {
						el.icon = '../../static/image/chain/default.png'
					}
				})
				this.list = data.data;
				console.log('===================================', this.list)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.DApp {
		width: 100%;

		/deep/ .uni-popup {
			z-index: 999;
		}

		.navBar {
			width: 100%;
			height: 88rpx;
			opacity: 1;
			background: #fafbff;
			box-shadow: 0px 3rpx 10rpx 0px rgba(0, 0, 0, 0.06);
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #FAFBFF;
			margin-bottom: 10rpx;

			.nav-search {
				width: calc(100% - 70rpx);
				height: 65rpx;
				background: #ffffff;
				border: 1rpx solid #a9b7c4;
				border-radius: 34rpx;
				padding: 14rpx 26rpx;
				box-sizing: border-box;
				margin: 0 auto;
				display: flex;
				align-items: center;

				uni-input {
					margin-left: 10rpx;
					font-size: 26rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 500;
					color: #444444;
				}

				.tipClass {
					font-size: 26rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					color: #a9b7c4;
					line-height: 35rpx;
				}
			}
		}

		.list-content {
			width: 100%;
			padding: 0 35rpx 0 25rpx;
			box-sizing: border-box;
			background-color: #FFFFFF;

			.list-item {
				width: 100%;
				height: 155rpx;
				display: flex;
				align-items: center;
				border-bottom: 1rpx solid #ebebeb;

				.icon {
					width: 90rpx;
					height: 90rpx;
					border-radius: 10rpx;
					margin-right: 30rpx;
				}

				.dapp-info {
					font-family: PingFang SC, PingFang SC-Bold;
					text-align: left;

					.title {
						font-size: 32rpx;
						font-weight: 700;
						color: #121212;
					}

					.descrip {
						font-size: 28rpx;
						font-weight: 400;
						color: #989898;
					}
				}

				.right-arr {
					width: 13rpx;
					height: 24rpx;
					margin-left: auto;
				}
			}
		}

		.main-context {
			width: 100%;
			height: 80vh;
			background-color: #FFFFFF;
			border-radius: 33rpx 33rpx 0 0;
			position: relative;

			.top-content {
				width: 100%;
				padding: 0 30rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 32rpx;
				font-family: PingFang SC, PingFang SC-Bold;
				font-weight: 600;
				color: #121212;
				margin-bottom: 20rpx;
			}

			.main-content {
				width: 100%;
				height: calc(80vh - 228rpx);
				display: flex;
				justify-content: space-between;

				.main-left {
					width: 122rpx;
					height: 100%;

					.nav-menu {
						width: 100%;
						height: 100%;

						.menu-item {
							width: 100%;
							height: 71rpx;
							margin-bottom: 39rpx;
							position: relative;
							text-align: center;

							&.activeClass::after {
								content: '';
								display: block;
								width: 4rpx;
								height: 40rpx;
								background-color: #3981F3;
								position: absolute;
								top: 50%;
								right: 0;
								transform: translateY(-50%);
							}

							image {
								width: 71rpx;
								height: 71rpx;
								border-radius: 50%;
							}
						}
					}
				}

				.main-right {
					width: 605rpx;
					height: 100%;
					padding: 0rpx 36rpx 0 0;
					box-sizing: border-box;

					.top-title {
						margin-bottom: 22rpx;
						font-size: 30rpx;
						font-family: PingFang SC, PingFang SC-Regular;
						font-weight: 500;
						color: #121212;
					}

					.list-item {
						width: 100%;
						height: 122rpx;
						margin-bottom: 27rpx;
						border-radius: 20rpx;
						padding: 17rpx 27rpx 0 32rpx;
						box-sizing: border-box;
						color: #FFFFFF;

						.wallet-name {
							display: flex;
							align-items: center;
							justify-content: space-between;
							font-size: 36rpx;
							font-family: PingFang SC, PingFang SC-Semibold;
							font-weight: 600;
							line-height: 50rpx;

							text:last-child {
								letter-spacing: 10rpx;
							}
						}

						.wallet-addr {
							width: 80%;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							font-size: 30rpx;
							font-family: PingFang SC, PingFang SC-Regular;
							font-weight: 400;
							line-height: 37rpx;
						}
					}

				}
			}

		}

		.tip-Pop {
			width: 100%;
			height: 552rpx;
			background: #ffffff;
			border-radius: 33rpx 33rpx 0 0;
			text-align: center;
			padding: 55rpx 36rpx 61rpx;
			box-sizing: border-box;
			position: relative;

			.top-title {
				font-size: 32rpx;
				font-family: PingFang SC, PingFang SC-Bold;
				font-weight: 700;
				text-align: center;
				color: #121212;
				margin-bottom: 42rpx;
			}

			.tip-content {
				width: 100%;
				font-size: 30rpx;
				font-family: PingFang SC, PingFang SC-Bold;
				font-weight: 700;
				text-align: left;
				color: #121212;
				margin-bottom: 40rpx;
			}

			.btns {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;

				view {
					width: 292rpx;
					height: 88rpx;
					border-radius: 14rpx;
					box-shadow: 0px 3rpx 26rpx 0px rgba(0, 0, 0, 0.06);
					line-height: 88rpx;
					text-align: center;
					color: #FFFFFF;
				}

				.cancell {
					background: #f57778;
				}

				.confirm-ok {
					background-color: #4C72EF;
				}
			}
		}
	}
</style>
