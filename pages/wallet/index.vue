<template>
	<view class="wallet-index">
		<uni-nav-bar v-if="hasWallet" background-color="#FAFBFF" :statusBar="true" :fixed="true" :title="wallet_index_title" @clickLeft="openList">
			<view class="icon" slot="left">
				<image style="width: 34rpx;height: 29rpx;margin-left: 25rpx;" src="../../static/image/index/list.png" mode=""></image>
			</view>
		</uni-nav-bar>
		<!-- 有钱包 -->
		<view class="has-wallet" v-if="hasWallet" :style="'height:'+scrollHeight+'px'">

			<view class="wallet" :style="'background: url(../../static/image/chain/'+currentWallet.bgcImg+') no-repeat center;background-size: 100% 100%;'">
				<view class="p1">
					<text>{{currentWallet.name}}</text>
					<image @click="goDetail()" src="../../static/image/index/goin.png" mode=""></image>
				</view>
				<view class="p2" @tap="goRechange">
					<view class="word">{{currentWallet.showAddress}}</view>
					<image src="../../static/image/index/sqcode.png" mode=""></image>
				</view>
				<view class="p3">￥{{currentWallet.allRmb}}</view>
			</view>
			<view class="asset">
				<view class="top-btn">
					<text>{{wallet_index_asset}}</text>
					<image v-if="m_chain.isaddassets" src="../../static/image/index/plus.png" mode="" @click="goAddAsset"></image>
				</view>
				<scroll-view scroll-y="true" class="coin-list" :show-scrollbar="false">
					<view class="coin-item" v-for="(item,index) in currentAsset" :key="index" @tap="goDealRecord(item)">
						<image class="icon" :src="'../../static/image/chain/'+item.img" mode=""></image>
						<text>{{item.name}}</text>
						<view class="kind-asset">
							<view class="b1">{{item.money}}</view>
							<view class="b2">￥{{item.rmb}}</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<uni-popup type="bottom" ref="walletPop">
				<view class="main-context">
					<view class="top-content">
						<uni-icons type="closeempty" size="30" @tap="closePop"></uni-icons>
						<text>{{wallet_title_str7}}</text>
						<text style="color: #4c72ef;font-size: 30rpx;" @tap="goManage">{{btnstring_manage}}</text>
					</view>
					<view class="main-content">
						<scroll-view class="main-left" scroll-y="true">
							<view class="nav-menu">
								<view class="menu-item" :class="{'activeClass':active==-1}">
									<image src="../../static/image/index/all.png" mode="" @tap="handleChecked(-1)"></image>
								</view>
								<view class="menu-item" :class="{'activeClass':active==item.chaintype}" v-for="(item,index) in m_mychains" :key="index"
								 @tap="handleChecked(item.chaintype)">
									<image :src="'../../static/image/chain/'+item.img" mode=""></image>
								</view>
							</view>
						</scroll-view>
						<scroll-view class="main-right" scroll-y="true">
							<view class="current-c" v-if="active!=-1">
								<view class="list-item" v-show="currentList.length" v-for="(item,index) in currentList" :key="index" :style="'background: url(../../static/image/chain/'+item.bgcImg+') no-repeat center;background-size: 100% 100%;'"
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
									<view class="list-item" v-for="(item,index) in identity_wallets" :key="index" :style="'background: url(../../static/image/chain/'+item.bgcImg+') no-repeat center;background-size: 100% 100%;'"
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
									<view class="list-item" @tap="checkedItem(item)" :style="'background: url(../../static/image/chain/'+item.bgcImg+') no-repeat center;background-size: 100% 100%;'"
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
		<!-- 没有钱包 -->
		<view class="no-wallet" v-else>
			<view class="top-banner">
				<view class="top-word">{{wallet_index_nodata_str1}}</view>
				<image class="bannerImg" src="../../static/image/index/top-banner.png" mode=""></image>
			</view>
			<view class="no-main-c">
				<view class="tips">
					<view class="title">{{wallet_index_nodata_str2}}</view>
					<view class="tip-content">{{wallet_title_str4}} ...</view>
				</view>
				<view class="menu-nav">
					<view class="menu-item" @tap="importWallet">
						<image class="menu-icon" src="../../static/image/index/hsWallet.png" mode=""></image>
						<view class="menu-msg">
							<view class="msg-title">{{wallet_index_nodata_str3}}</view>
							<view class="msg-subT">{{wallet_index_nodata_str4}}</view>
						</view>
						<image class="right_arr" src="../../static/image/mine/arrow-left.svg" mode=""></image>
					</view>
					<view class="menu-item" @tap="createWallet">
						<image class="menu-icon" src="../../static/image/index/noWallet.png" mode=""></image>
						<view class="menu-msg">
							<view class="msg-title">{{wallet_index_nodata_str5}}</view>
							<view class="msg-subT">{{wallet_index_nodata_str6}}</view>
						</view>
						<image class="right_arr" src="../../static/image/mine/arrow-left.svg" mode=""></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import noData from '@/components/no-data/no-data.vue';
	export default {
		name: "wallet",
		components:{
			noData
		},
		created() {
			this.initword();
			this.util.EventUtils.addEventListenerCustom(this.dal.WalletManage.evtBalance, this.onRefresh);
			this.util.EventUtils.addEventListenerCustom(this.dal.WalletManage.evtToKenBalance, this.onRefresh);
		},
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.WalletManage.evtBalance, this.onRefresh);
			this.util.EventUtils.removeEventCustom(this.dal.WalletManage.evtToKenBalance, this.onRefresh);
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
				active: -1,
				//钱包管理页类型一致钱包列表
				currentList: [],
				//身份钱包
				identity_wallets: [],
				// 普通钱包
				single_wallets: [ ],
				m_mychains: [],
				//所有链
				chains:[],
				//当前链的信息
				m_chain:{},
				//汇率配置
				configInfo:{
					value:''
				}
			}
		},
		onShow() {
           // 清空之前数据
		   Object.assign(this.$data, this.$options.data());

			this.initData();
			this.onRefresh();
			this.onTokenBalance();
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight - 44;
				}
			});
		},
		methods: {
			initword(){
			    this.btnstring_manage = this.getLocalStr("btnstring_manage");
				this.wallet_index_title = this.getLocalStr("wallet_index_title");
				this.wallet_title_str2 = this.getLocalStr("wallet_title_str2");
				this.wallet_index_asset = this.getLocalStr("wallet_index_asset");
				this.wallet_title_str7 = this.getLocalStr("wallet_title_str7");
				this.btnstring_create = this.getLocalStr("btnstring_create");
				this.btnstring_import = this.getLocalStr("btnstring_import");
				this.wallet_index_asset = this.getLocalStr("wallet_index_asset");
				
				this.wallet_title_str4 = this.getLocalStr("wallet_title_str4");
				this.wallet_index_nodata_str1 = this.getLocalStr("wallet_index_nodata_str1");
				this.wallet_index_nodata_str2 = this.getLocalStr("wallet_index_nodata_str2");
				this.wallet_index_nodata_str3 = this.getLocalStr("wallet_index_nodata_str3");
				this.wallet_index_nodata_str4 = this.getLocalStr("wallet_index_nodata_str4");
				this.wallet_index_nodata_str5 = this.getLocalStr("wallet_index_nodata_str5");
				this.wallet_index_nodata_str6 = this.getLocalStr("wallet_index_nodata_str6");
			},
			goRechange() {
				this.$openPage({
					name: "recharge-currency"
				})
			},

			initData: function() {
				//判断有无钱包  有钱包时获取钱包数据
				if (this.dal.WalletManage.isExistWallet()) {
					//页面显示时去获取身份钱包和普通钱包以及当前的钱包,当前钱包所对应的资产 获取所有资产链
					this.hasWallet = true;
				} else {
					return;
				}

				console.log('=======initData==========')
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
						this.m_mychains.push(temp)
					}
				})
				// 身份钱包数据
				let mineChains = this.dal.MainWallet.getMainWallets();
				//添加logo图标和背景图
				mineChains.forEach(el => {
					let item = this.chains.find(e => e.chaintype == el.chaintype);
					el.img = item.img || 'default.png';
					el.bgcImg = item.img.split('.')[0] + 'bg.png';
					el.showAddress = el.address ? el.address.substring(0, 7) + '...' + el.address.substring(el.address.length - 7) :
						"no address"
				})
				this.identity_wallets = mineChains;

				//普通钱包数据
				let normalWallets = this.dal.NormalWallet.getNormalWallets();
				console.log("==normalWallets==",normalWallets)
				//添加logo图标和背景图
				normalWallets.forEach(el => {
					let item = this.chains.find(e => e.chaintype == el.chaintype);
					el.img = item.img || 'default.png';
					el.bgcImg = item.img.split('.')[0] + 'bg.png';
					el.showAddress = el.address ? el.address.substring(0, 7) + '...' + el.address.substring(el.address.length - 7) :
						"no address"
				})
				this.single_wallets = normalWallets;
			},

			onRefresh: function() {
				if (this.dal.WalletManage.isExistWallet()) {
					//页面显示时去获取身份钱包和普通钱包以及当前的钱包,当前钱包所对应的资产 获取所有资产链
					this.hasWallet = true;
				} else {
					return;
				}
				this.configInfo = this.dal.Common.onGetCommonConfigInfo('exchange_key');
				//当前钱包默认优先拿第一个身份钱包，没有身份钱包时默认用第一个普通钱包
				this.currentWallet = this.dal.WalletManage.getCurrWallet();
				if (!this.currentWallet) {
					this.currentWallet = this.identity_wallets.length ? this.identity_wallets[0] : this.single_wallets[0];
					console.log('==this.currentWallet==', this.currentWallet)
					this.dal.Chain.setCurrChainType(this.currentWallet.chaintype);
					this.dal.WalletManage.setCurrWallet(this.currentWallet.chaintype, this.currentWallet.idx)
				}
				//
				this.m_chain = this.dal.Chain.getChainInfo(this.currentWallet.chaintype);
				console.log("当前链的基础信息",this.m_chain)
				//根据当前钱包链的类型，筛选出该类型链下对应的我已选择的资产列表  默认将当前钱包放在第一个显示
				let list = this.dal.ContractWallet.getContractWallets(this.currentWallet.idx, this.currentWallet.address)
				
				//添加当前链的代币
				let temp = JSON.parse(JSON.stringify(this.currentWallet))
				let item = this.chains.find(el=>el.chaintype==temp.chaintype);
				temp.name = item.name;
				list.unshift(temp)
				
				//计算总人民币
				let sum = 0
				list.forEach(el => {
					//币兑换人民币					
					if (!el.img) {
						el.img = 'default.png';
					}
					sum+=el.rmb || 0;
				})
				this.currentWallet.allRmb = sum;
				this.currentAsset = list;
				console.log('=====钱包和资产列表=====',this.configInfo,list, this.currentAsset, this.m_mychains)
			},
			getCommonConfig(data){
				console.log(data)
			},
			onTokenBalance: function() {
				if (this.dal.WalletManage.isExistWallet()) {
					//页面显示时去获取身份钱包和普通钱包以及当前的钱包,当前钱包所对应的资产 获取所有资产链
					this.hasWallet = true;
				} else {
					return;
				}
				for (let i = 0; i < this.currentAsset.length; i++) {
					let item = this.currentAsset[i];
					console.log("===item=", item)
					if(item.idx == 0){
						this.dal.WalletManage.onBalance(item.contract)
					}else{
						this.dal.WalletManage.onTokenBalance(item.contract)
					}
				}
			},

			closePop() {
				this.$refs.walletPop.close();
			},
			goAddAsset() {
				this.$openPage({
					name: "add-asset",
					query: {
						chaintype: this.currentWallet.chaintype,
						address: this.currentWallet.address,
						idx: this.currentWallet.idx
					}
				})
			},
			goDealRecord(item) {
				this.$openPage({
					name: "deal-record",
					query:item
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
				this.dal.Chain.setCurrChainType(item.chaintype);
				this.dal.WalletManage.setCurrWallet(item.chaintype, item.idx);
					
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
					let list1 = this.single_wallets.filter(el => el.chaintype == chaintype);
					let list2 = this.identity_wallets.filter(el => el.chaintype == chaintype);

					this.currentList = [...list2, ...list1];
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
	}
</style>
