<template>
	<view class="wallet-index">
		<uni-nav-bar v-if="hasWallet" background-color="#FAFBFF" :statusBar="true" :fixed="true" title="钱包" @clickLeft="openList">
			<view class="icon" slot="left">
				<image style="width: 34rpx;height: 29rpx;margin-left: 25rpx;" src="../../static/image/index/list.png" mode=""></image>
			</view>
		</uni-nav-bar>
		<!-- 有钱包 -->
		<view class="has-wallet" v-if="hasWallet" :style="'height:'+scrollHeight+'px'">

			<view class="wallet" :style="'background: url(../../static/image/chain/'+currentWallet.bgcImg+') no-repeat;background-size: 100% 100%;'">
				<view class="p1">
					<text>{{currentWallet.name}}</text>
					<image @click="goDetail()" src="../../static/image/index/goin.png" mode=""></image>
				</view>
				<view class="p2" @tap="goRechange">
					<view class="word">{{currentWallet.address}}</view>
					<image src="../../static/image/index/sqcode.png" mode=""></image>
				</view>
				<view class="p3">￥{{currentWallet.money}}</view>
			</view>
			<view class="asset">
				<view class="top-btn">
					<text>资产</text>
					<image src="../../static/image/index/plus.png" mode="" @click="goAddAsset"></image>
				</view>
				<scroll-view scroll-y="true" class="coin-list" :show-scrollbar="false">
					<view class="coin-item" v-for="(item,index) in currentAsset" :key="index" @tap="goDealRecord(item)">
						<image class="icon" :src="'../../static/image/chain/'+item.img" mode=""></image>
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
						<uni-icons type="closeempty" size="30" @tap="closePop"></uni-icons>
						<text>选择钱包</text>
						<text style="color: #4c72ef;font-size: 30rpx;" @tap="goManage">管理</text>
					</view>
					<view class="main-content">
						<scroll-view class="main-left" scroll-y="true">
							<view class="nav-menu">
								<view class="menu-item" :class="{'activeClass':active==-1}">
									<image src="../../static/image/index/all.png" mode="" @tap="handleChecked(-1)"></image>
								</view>
								<view class="menu-item" :class="{'activeClass':active==item.chaintype}" v-for="(item,index) in m_mychains"
								 :key="index" @tap="handleChecked(item.chaintype)">
									<image :src="'../../static/image/chain/'+item.img" mode=""></image>
								</view>
							</view>
						</scroll-view>
						<scroll-view class="main-right" scroll-y="true">
							<view class="current-c" v-if="currentList.length">
								<view class="list-item" v-for="(item,index) in currentList" :key="index" :style="'background: url(../../static/image/chain/'+item.bgcImg+') no-repeat;background-size: 100% 100%;'"
								 @tap="checkedItem(item)">
									<view class="wallet-name">
										<text>{{item.name}}</text>
										<text>...</text>
									</view>
									<view class="wallet-addr">{{item.address}}</view>
								</view>
							</view>
							<view class="main-c" v-else>
								<view class="top-title">
									<text>身份钱包</text>
								</view>
								<view class="menu-list">
									<view class="list-item" v-for="(item,index) in identity_wallets" :key="index" :style="'background: url(../../static/image/chain/'+item.bgcImg+') no-repeat;background-size: 100% 100%;'"
									 @tap="checkedItem(item)">
										<view class="wallet-name">
											<text>{{item.name}}</text>
											<text>...</text>
										</view>
										<view class="wallet-addr">{{item.address}}</view>
									</view>
								</view>
								<view class="create-import" v-if="single_wallets.length">
									<view class="top-title">创建/导入</view>
									<view class="list-item" @tap="checkedItem(item)" :style="'background: url(../../static/image/chain/'+item.bgcImg+') no-repeat;background-size: 100% 100%;'"
									 v-for="(item,index) in single_wallets" :key="index">
										<view class="wallet-name">
											<text>{{item.name}}</text>
											<text>...</text>
										</view>
										<view class="wallet-addr">{{item.address}}</view>
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
					<view class="tip-content">支持BTC、ETH、EOS、TRX、FIL ...</view>
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
		created() {
			this.util.EventUtils.addEventListenerCustom(this.dal.WalletManage.evtBalance, this.onRefresh);
		},
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.WalletManage.evtBalance, this.onRefresh);
		},
		
		data() {
			return {
				hasWallet: false,
				scrollHeight: 0,
				//当前使用的钱包
				currentWallet: {},
				currentAsset: [{
						img: "../../static/image/index/btc.png",
						name: "BTC",
						rmb: "12.36",
						money: "1234.65"
					},
					{
						img: "../../static/image/index/btc.png",
						name: "BTC",
						rmb: "12.36",
						money: "1234.65"
					}
				],

				//钱包管理页数据
				//当前选中钱包的类型
				active:-1,
				//钱包管理页类型一致钱包列表
				currentList: [],
				//身份钱包
				identity_wallets: [],
				// 普通钱包
				single_wallets: [],
				m_mychains:[]
			}
		},
		onShow() {
			//判断有无钱包  有钱包时获取钱包数据
			if (this.dal.WalletManage.isExistWallet()) {
				//页面显示时去获取身份钱包和普通钱包以及当前的钱包,当前钱包所对应的资产 获取所有资产链
				this.hasWallet = true;
				this.onRefresh();
			}
            
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight - 44;
				}
			});
		},
		methods: {
			goRechange() {
				this.$openPage({
					name: "recharge-currency"
				})
			},
			
			initData:function(){
				
			},
			
			onRefresh: function() {

				this.identity_wallets = [];
				this.single_wallets=[];
				this.m_mychains = [];
				this.currentList = [];
				let chains = this.dal.Chain.getChainList();
                //获取当前已经有的链
                let mychains = this.dal.Chain.getMineChains();
                mychains.forEach(el=>{
                	 if(typeof el != 'object'){
                		 let item = chains.find(e=>e.chaintype==el);
                		let temp = {
                			chaintype:el,
                			img:item.img
                		}
                		this.m_mychains.push(temp)
                	 }
                })
				// 身份钱包数据
				let mineChains = this.dal.MainWallet.getMainWallets();
				//添加logo图标和背景图
				mineChains.forEach(el => {
					let item = chains.find(e => e.chaintype == el.chaintype);
					el.logo = item.img;
					el.bgcImg = item.img.split('.')[0] + 'bg.png';
				})
				this.identity_wallets = mineChains;

				//普通钱包数据
				let normalWallets = this.dal.NormalWallet.getNormalWallets();
				//添加logo图标和背景图
				normalWallets.forEach(el => {
					let item = chains.find(e => e.chaintype == el.chaintype);
					el.logo = item.img;
					el.bgcImg = item.img.split('.')[0] + 'bg.png';
				})
				this.single_wallets = normalWallets;

				//当前钱包默认优先拿第一个身份钱包，没有身份钱包时默认用第一个普通钱包
				this.currentWallet = this.dal.WalletManage.getCurrWallet();
				if (!this.currentWallet) {
					this.currentWallet = this.identity_wallets.length ? this.identity_wallets[0] : this.single_wallets[0];
					console.log('==this.currentWallet==', this.currentWallet)
					this.dal.WalletManage.setCurrWallet(this.currentWallet.chaintype, this.currentWallet.idx)
				}
				
				
				//根据当前钱包链的类型，筛选出该类型链下对应资产列表
				this.currentAsset = this.dal.ContractWallet.getContractWallets(this.currentWallet.idx, this.currentWallet.address)
				console.log('=====钱包和资产列表=====', this.currentAsset,this.m_mychains)
			},
			closePop() {
				this.$refs.walletPop.close();
			},
			goAddAsset() {
				this.$openPage({
					name: "add-asset",
					query: {
						chaintype: this.currentWallet.chaintype,
						address:this.currentWallet.address
					}
				})
			},
			goDealRecord(item) {
				this.$openPage({
					name: "deal-record",
				})
			},
			goDetail() {
				console.log('=== 当前钱包===', this.currentWallet)
				this.dal.WalletManage.setCurrWallet(this.currentWallet.chaintype, this.currentWallet.idx)
				this.$openPage({
					name: "my-wallet-detail",
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
			openList() {
				this.$refs.walletPop.open()
			},
			cancell() {
				//关闭时清除之前状态
				this.$refs.walletPop.close()
			},
			checkedItem(item) {
				//点击具体钱包时，先判断所点击的钱包类型是否和当前钱包类型一致，一致则不重新获取资产，不一致需重新获取；
				//更换当前钱包
				if (this.currentWallet.chaintype != item.chaintype) {
					// 根据点击的链类型获取资产 
					// this.currentAsset = 
				}
				if(item.idx){
					this.dal.WalletManage.setCurrWallet(item.chaintype,item.idx);
				}else{
					this.dal.WalletManage.setCurrWallet(item.chaintype,0);
				}
				this.$refs.walletPop.close()
				this.onRefresh();
			},
			//去到管理钱包
			goManage() {
				this.$refs.walletPop.close()
				this.$openPage({
					name: "my-wallet-index"
				})
			},
			handleChecked(chaintype) {
				this.currentList = [];
				this.active = chaintype;
				if (chaintype != -1) {
					// 选中主链中一种,加入活动列表,并从普通钱包列表中筛选该类型的普通钱包加入活动列表
					let list1 = this.single_wallets.filter(el=>el.chaintype==chaintype);
					let list2 = this.identity_wallets.filter(el=>el.chaintype==chaintype);
					
					this.currentList = [...list2,...list1];
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.wallet-index {
		width: 100%;
		min-height: 100vh;

		/deep/ .uni-navbar--border {
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

			.no-main-c {
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

					&:nth-child(2) {
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

					image {
						width: 34rpx;
						height: 34rpx;
					}
				}

				.p2 {
					width: 100%;
					display: flex;
					align-items: center;
					font-size: 36rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;

					.word {
						width: 270rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					image {
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
					padding: 20rpx;
					box-sizing: border-box;
					display: flex;
					justify-content: space-between;
					align-items: center;

					text {
						font-size: 30rpx;
						font-family: PingFang SC, PingFang SC-Regular;
						font-weight: 400;
						color: #121212;
					}

					image {
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
						box-shadow: 0px 7rpx 27rpx 0rpx rgba(231, 234, 242, 0.80);
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
			background-color: #FFFFFF;
			border-radius: 33rpx;
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
	}
</style>
