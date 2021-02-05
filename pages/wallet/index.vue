<template>
	<view class="wallet-index">
		<uni-nav-bar v-if="hasWallet" background-color="#FAFBFF" :statusBar="true" :fixed="true" title="钱包" @clickLeft="openList">
		<view class="icon" slot="left"><image style="width: 34rpx;height: 29rpx;margin-left: 25rpx;" src="../../static/image/index/list.png" mode=""></image></view>
		</uni-nav-bar>
		<!-- 有钱包 -->
		<view class="has-wallet" v-if="hasWallet" :style="'height:'+scrollHeight+'px'">
			<view class="wallet" :style="'background: url('+currentWallet.bgcImg+') no-repeat center;'">
				<view class="p1">
					<text>{{currentWallet.name}}</text>
					<text @click="goDetail">...</text>
				</view>
				<view class="p2">
					<view class="word">{{currentWallet.addr}}</view>
					<image src="../../static/image/index/sqcode.png" mode=""></image>
				</view>
				<view class="p3">￥{{currentWallet.money}}</view>
			</view>
			<view class="asset">
				<view class="top-btn">
					<text>资产</text>
					<image src="../../static/image/index/plus.png" mode="" @click="goAddAsset"></image>
				</view>
				<scroll-view scroll-y="true" class="coin-list">
					<view class="coin-item" v-for="(item,index) in currentAsset" :key="index" @tap="goDealRecord(item)">
						<image class="icon" :src="item.img" mode=""></image>
						<text>{{item.name}}</text>
						<view class="kind-asset">
							<view class="b1">{{item.rmb}}</view>
							<view class="b2">￥{{item.money}}</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<uni-popup type="bottom" ref="walletPop">
				<view class="main-context">
					<view class="top-content">
						<view class="top-menu">
							<uni-icons type="closeempty" size="30" @tap="closePop"></uni-icons>
							<text>选择钱包</text>
							<text style="color: #0000FF;" @tap="goManage">管理</text>
						</view>
					</view>
					<view class="main-content">
						<scroll-view class="main-left" scroll-y="true">
							<view class="nav-menu">
								<image :src="activeObj.chaintype==-1?'../../static/image/index/hangqing-select.png':'../../static/image/index/hangqing.png'"
								 mode="" @tap="handleChecked({chaintype:-1})"></image>
								<image :src="activeObj.chaintype==item.chaintype?item.logo_act:item.logo" mode="" v-for="(item,index) in identity_wallets"
								 :key="index" @tap="handleChecked(item)"></image>
							</view>
						</scroll-view>
						<scroll-view class="main-right" scroll-y="true">
							<view class="current-c" v-if="currentList.length">
								<view class="list-item" v-for="(item,index) in currentList" :key="index" :style="'background: url('+item.bgcImg+') no-repeat center;'"
								 @tap="checkedItem(item)">
									<view class="wallet-name">
										<text>{{item.name}}</text>
										<text>...</text>
									</view>
									<view class="wallet-addr">{{item.addr}}</view>
								</view>
							</view>
							<view class="main-c" v-else>
								<view class="top-title">
									<text>身份钱包</text>
								</view>
								<view class="menu-list">
									<view class="list-item" v-for="(item,index) in identity_wallets" :key="index" :style="'background: url('+item.bgcImg+') no-repeat center;'"
									 @tap="checkedItem(item)">
										<view class="wallet-name">
											<text>{{item.name}}</text>
											<text>...</text>
										</view>
										<view class="wallet-addr">{{item.addr}}</view>
									</view>
								</view>
								<view class="imKey">
									<view class="top-title">imKey</view>
									<view class="imKey-main">配对imKey硬件钱包</view>
								</view>
								<view class="create-import" v-if="single_wallets.length">
									<view class="top-title">创建/导入</view>
									<view class="list-item" @tap="checkedItem(item)" :style="'background: url('+item.bgcImg+') no-repeat center;'"
									 v-for="(item,index) in single_wallets" :key="index">
										<view class="wallet-name">
											<text>{{item.name}}</text>
											<text>...</text>
										</view>
										<view class="wallet-addr">{{item.addr}}</view>
									</view>
								</view>

							</view>
						</scroll-view>
					</view>

				</view>
			</uni-popup>
		</view>
		<!-- 没有钱包 -->
		<view class="no-wallet" v-else>
			<view class="top-banner">
				<view class="top-word">多链钱包，资产自我掌控</view>
				<image class="bannerImg" src="../../static/image/index/top-banner.png" mode=""></image>
			</view>
			<view class="no-main-c">
				<view class="tips">
					<view class="title">数字资产钱包</view>
					<view class="tip-content">支持BTC、ETH、EOS、YKC、TRX、FIH......</view>
				</view>
				<view class="menu-nav">
					<view class="menu-item" @tap="importWallet">
						<image class="menu-icon" src="../../static/image/index/hsWallet.png" mode=""></image>
						<view class="menu-msg">
							<view class="msg-title">我有钱包</view>
							<view class="msg-subT">导入钱包</view>
						</view>
						<image class="right_arr" src="../../static/image/mine/arrow-left.svg" mode=""></image>
					</view>
					<view class="menu-item" @tap="createWallet">
						<image class="menu-icon" src="../../static/image/index/noWallet.png" mode=""></image>
						<view class="menu-msg">
							<view class="msg-title">我没有钱包</view>
							<view class="msg-subT">创建钱包</view>
						</view>
						<image class="right_arr" src="../../static/image/mine/arrow-left.svg" mode=""></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "wallet",
		data() {
			return {
				hasWallet: false,
				scrollHeight: 0,
				//当前使用的钱包
				currentWallet: {},
				currentAsset: [{
						img: "../../static/image/index/btc.png",
						name: "BTC",
						rmb: "23.03",
						money: "1234.65"
					},
					{
						img: "../../static/image/index/btc.png",
						name: "BTC",
						rmb: "23.03",
						money: "1234.65"
					},
					{
						img: "../../static/image/index/btc.png",
						name: "BTC",
						rmb: "23.03",
						money: "1234.65"
					},
					{
						img: "../../static/image/index/btc.png",
						name: "BTC",
						rmb: "23.03",
						money: "1234.65"
					},
					{
						img: "../../static/image/index/btc.png",
						name: "BTC",
						money: "1234.65"
					},
					{
						img: "../../static/image/index/btc.png",
						name: "BTC",
						money: "1234.65"
					}
				],

				//钱包管理页数据
				//当前选中钱包的类型
				activeObj: {
					chaintype: -1,
				},
				//钱包管理页类型一致钱包列表
				currentList: [],
				//身份钱包
				identity_wallets: [{
						chaintype: 1,
						logo: "../../static/image/index/index.png",
						logo_act: "../../static/image/index/index-select.png",
						name: "ETH",
						alias: "Ethereum",
						addr: "ajdbiaeuudiiiiiiaaan ldjsn cjhf",
						bgcImg: "../../static/image/index/index-bg.png",
						money: "12.54"
					},
					{
						chaintype: 2,
						logo: "../../static/image/index/index.png",
						logo_act: "../../static/image/index/index-select.png",
						name: "BTC",
						alias: "Bitcoin",
						addr: "ajdbiaeuudiiiiiiaaan ldjsn cjhf",
						bgcImg: "../../static/image/safe/powerBg.png",
						money: "12.54"
					},
				],
				//普通钱包
				single_wallets: [{
					chaintype: 1,
					logo: "../../static/image/index/index.png",
					logo_act: "../../static/image/index/index.png",
					name: "lisa",
					addr: "ajdbiaeuudiiiiiiaaan ldjsn cjhf",
					bgcImg: "../../static/image/index/index-bg.png",
					money: "12.54"
				}],
			}
		},
		onShow() {
			//页面显示时去获取身份钱包和普通钱包以及当前的钱包,当前钱包所对应的资产 获取所有资产链
			// this.identity_wallets = 
			// this.single_wallets = 
			//当前钱包先默认拿第一个身份钱包			
			this.currentWallet = this.identity_wallets[0];
			//根据当前钱包链的类型，筛选出该类型链下对应资产列表
			// this.currentAsset = 
			//判断有无钱包
			// this.hasWallet = this.identity_wallets.length || this.single_wallets.length;


			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight - 44;
				}
			});
		},
		methods: {
			closePop(){
				this.$refs.walletPop.close()
			},
			goAddAsset() {
				this.$openPage({
					name: "add-asset"
				})
			},
			goDealRecord(item) {
				this.$openPage({
					name: "deal-record",
					query: item
				})
			},
			goDetail() {
				this.$openPage({
					name: "my-wallet-detail",
					query: this.currentWallet
				})
			},
			importWallet() {
				this.$openPage({
					name: "import-wallet-index"
				})
			},
			createWallet() {
				this.$openPage({
					name: "creat-wallet-index"
				})
			},
			//有钱包
			goScan() {
				uni.scanCode({
					success: (res) => {
						console.log('条码内容：' + res.result);
					}
				});
			},
			openList() {
				this.$refs.walletPop.open()
			},
			cancell() {
				//关闭时清除之前状态
				this.activeObj.chaintype = -1;
				this.$refs.walletPop.close()
			},
			checkedItem(item) {
				//点击具体钱包时，先判断所点击的钱包类型是否和当前钱包类型一致，一致则不重新获取资产，不一致需重新获取；
				//更换当前钱包
				if (this.currentWallet.chaintype != item.chaintype) {
					// 根据点击的链类型获取资产 
					// this.currentAsset = 
				}
				this.currentWallet = item;
				this.$refs.walletPop.close()
			},
			//去到管理钱包
			goManage() {
				this.$refs.walletPop.close()
				this.$openPage({
					name: "my-wallet-index"
				})
			},
			handleChecked(item) {
				this.currentList = [];
				this.activeObj = item;
				if (item.chaintype != -1) {
					// 选中主链中一种,加入活动列表,并从普通钱包列表中筛选该类型的普通钱包加入活动列表
					let list = this.single_wallets.filter(el => el.chaintype == item.chaintype);
					list.unshift(item);
					this.currentList = list;
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.wallet-index {
		width: 100%;
		min-height: 100vh;
        /deep/ .uni-navbar--border{
			border: 0;
		}
		.no-wallet {
			width: 100%;
			height: 100%;
			background: #ffffff;
			.top-banner {
				width: 100%;
				height: 613rpx;
				background-color: #C3D4FE;
				text-align: center;
				padding-top: 160rpx;
				box-sizing: border-box;

				.top-word {
					font-size: 40rpx;
					font-family: PingFang SC, PingFang SC-Bold;
					font-weight: 700;
					color: #060e39;
					margin-bottom: 42rpx;
				}

				.bannerImg {
					width: 464rpx;
					height: 296rpx;
				}
			}
            .no-main-c{
				 width: 100%;
				 padding: 40rpx 35rpx 0 38rpx;
				 box-sizing: border-box;
				 border-radius: 20rpx;
				 margin-top: -20rpx;
				 background-color: #FFFFFF;
			 }
			.tips {
				width: 100%;
				margin-bottom: 13rpx;
				.title {
					font-size: 42rpx;
					font-family: PingFang SC, PingFang SC-Heavy;
					font-weight: 800;
					color: #121212;
				}

				.tip-content {
					font-size: 28rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					color: #989898;
				}
			}

			.menu-nav {
				width: 100%;
				.menu-item {
					width: 100%;
					height: 160rpx;
					display: flex;
					align-items: center;
					border-bottom: 1rpx solid #EBEBEB;
					&:nth-child(2){
						border: 0;
					}
					.menu-icon {
						width: 57rpx;
						height: 50rpx;
						margin-right: 31rpx;
					}

					.menu-msg {
						.msg-title {
							font-size: 32rpx;
							font-family: PingFang SC, PingFang SC-Bold;
							font-weight: 700;
							color: #121212;
						}

						.msg-subT {
							font-size: 28rpx;
							font-family: PingFang SC, PingFang SC-Regular;
							font-weight: 400;
							color: #989898;
						}
					}

					.right_arr {
						width: 13rpx;
						height: 24rpx;
						margin-left: auto;
					}
				}
			}
		}

		.has-wallet {
			width: 100%;
			background-color: #ffffff;
			padding: 20rpx 28rpx;
			box-sizing: border-box;

			.wallet {
				width: 100%;
				height: 287rpx;
				border-radius: 20rpx;
				background-size: 100%;
				padding: 20rpx 30rpx;
				box-sizing: border-box;
				color: #FFFFFF;
				.p1 {
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 46rpx;
					font-family: PingFang SC, PingFang SC-Semibold;
					font-weight: 600;

					text:nth-child(2) {
						letter-spacing: 10rpx;
					}
				}

				.p2 {
					width: 100%;
					display: flex;
					align-items: center;
					font-size: 36rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					.word{
						width: 270rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					image{
						width: 30rpx;
						height: 30rpx;
						margin-right: 39rpx;
					}
				}

				.p3 {
					font-size: 28rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					margin-top: 69rpx;
				}
			}

			.asset {
				width: 100%;
				margin-top: 30rpx;

				.top-btn {
					width: 100%;
					padding: 20rpx ;
					box-sizing: border-box;
					display: flex;
					justify-content: space-between;
					align-items: center;
					text{
						font-size: 30rpx;
						font-family: PingFang SC, PingFang SC-Regular;
						font-weight: 400;
						color: #121212;
					}
					image{
						width: 38rpx;
						height: 38rpx;
					}
				}

				.coin-list {
					width: 100%;
					height: 714rpx;

					.coin-item {
						width: 100%;
						height: 158rpx;
						background: #ffffff;
						border-radius: 10rpx;
						box-shadow: 0px 7rpx 27rpx 0rpx rgba(231,234,242,0.80); 
						display: flex;
						align-items: center;
                        padding: 52rpx 27rpx 52rpx 31rpx;
						box-sizing: border-box;
						margin-bottom: 33rpx;
						.icon {
							width: 54rpx;
							height: 54rpx;
							margin-right: 53rpx;
						}

						text {
							font-size: 36rpx;
							font-family: PingFang SC, PingFang SC-Semibold;
							font-weight: 600;
							color: #334779;
						}

						.kind-asset {
							margin-left: auto;
							text-align: right;

							.b1 {
								font-size: 36rpx;
								font-family: PingFang SC, PingFang SC-Semibold;
								font-weight: 600;
								text-align: right;
								color: #334779;
							}

							.b2 {
								font-size: 30rpx;
								font-family: PingFang SC, PingFang SC-Regular;
								font-weight: 400;
								text-align: right;
								color: #bcbcbc;
							}
						}
					}
				}
			}
		}

		.main-context {
			width: 100%;
			height: 80vh;
			background-color: #ECECEC;
			padding: 20rpx;
			box-sizing: border-box;
			border-radius: 20rpx;
			position: relative;

			.top-content {
				width: calc(100% - 40rpx);
				height: 60rpx;
				position: fixed;
				top: 20rpx;

				.top-menu {
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 28rpx;
					height: 60rpx;
				}

			}

			.main-content {
				width: 100%;
				height: 100%;
				margin-top: 80rpx;
				border-radius: 20rpx;
				display: flex;
				background-color: #F8F8F8;

				.main-left {
					width: 20%;
					height: 100%;

					.nav-menu {
						width: 100%;
						height: 100%;
						padding-top: 20rpx;
						display: flex;
						flex-direction: column;
						align-items: center;

						image {
							width: 60rpx;
							height: 60rpx;
							border-radius: 50%;
							margin-bottom: 30rpx;
						}
					}
				}

				.main-right {
					width: 80%;
					height: 100%;
					padding: 20rpx 40rpx 0 0;
					box-sizing: border-box;

					.top-title {
						font-size: 24rpx;
						color: #8e8e8e;
						display: flex;
						align-items: center;
						justify-content: space-between;

						image {
							width: 24rpx;
							height: 24rpx;
							border-radius: 50%;
						}
					}

					.list-item {
						width: 100%;
						height: 120rpx;
						background-size: 100% 100%;
						border-radius: 20rpx;
						margin-top: 20rpx;
						padding: 20rpx;
						box-sizing: border-box;

						.wallet-name {
							display: flex;
							align-items: center;
							justify-content: space-between;
							font: 28rpx bold;
							color: #FFFFFF;

							text:last-child {
								letter-spacing: 10rpx;
							}
						}

						.wallet-addr {
							font: 24rpx;
							color: #FFFFFF;
						}
					}

					.imKey-main {
						width: 100%;
						height: 120rpx;
						background: url(../../static/image/index/index-bg.png);
						border-radius: 20rpx;
						margin-top: 20rpx;
						padding: 40rpx 20rpx;
						box-sizing: border-box;
						font: 28rpx bold;
						color: #fefefe;
					}

					.create-import,
					.imKey {
						margin-top: 40rpx;
					}
				}
			}
		}
	}
</style>
