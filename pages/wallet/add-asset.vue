<template>
	<view class="add-asset">
		<bar ref="bar"></bar>
		<view class="search-header">
			<view class="search-frame">
				<uni-icons type="search" class="search-icon" size="20" color="#CCD3D9" @tap="goSearch"></uni-icons>
				<input type="text" placeholder-style="color: #a9b7c4;" :placeholder="dapp_search_placeholder"
					v-model="keyword" confirm-type="search" @confirm="goSearch" />
				<uni-icons v-if="keyword" type="closeempty" size="20" style="font-weight: 600;" color="#444444"
					@tap="clear"></uni-icons>
			</view>
			<text class="cancell-txt" @tap="btnBack">{{btnstring_cancle}}</text>
		</view>
		<scroll-view scroll-y="true" class="list-content" :style="'height:'+scrollHeight+'px'">
			<view class="list-item" v-for="(item,index) in showList" :key="index">
				<image class="icon" :src="item.icon" mode=""></image>
				<view class="dapp-info">
					<view class="title">{{item.name}}</view>
					<view class="descrip">{{item.showContract}}</view>
				</view>
				<image v-if="item.isCollect" class="right-icon" src="../../static/image/index/bianjiwancheng.png"
					mode=""></image>
				<image @tap="goAdd(item)" v-else class="right-icon" src="../../static/image/index/plus.png" mode="">
				</image>
			</view>
		</scroll-view>

	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	export default {
		name: "searchPage",
		components: {
			Bar
		},
		created() {
			this.initword();
			this.util.EventUtils.addEventListenerCustom(this.dal.Common.evtGetContract, this.onContract);
		},
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Common.evtGetContract, this.onContract);
		},
		data() {
			return {
				scrollHeight: 0,
				//当前链的类型和名字
				chaintype: 1,
				name: "",
				keyword: "",
				m_idx: "",
				showList: [],
				//我已选的资产
				currentAssetList: [],
				// 当前链下全部资产的列表
				allAssetList: [],

			};
		},
		onLoad(option) {
			let params = JSON.parse(option.query);
			if (Object.keys(params).length != 0) {
				this.chaintype = params.chaintype
				this.address = params.address
				this.m_idx = params.idx
			}
			this.initword();
		},
		onShow() {
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight - 44;
				}
			});
			this.onRefersh()
		},
		methods: {
			initword() {
				this.dapp_search_placeholder = this.getLocalStr("dapp_search_placeholder");
				this.btnstring_cancle = this.getLocalStr("btnstring_cancle");
				this.wallet_tip_str1 = this.getLocalStr("wallet_tip_str1");
				this.err_tip_str22 = this.getLocalStr("err_tip_str22");
				this.tip_title_str1 = this.getLocalStr("tip_title_str1");
				this.tip_title_str2 = this.getLocalStr("tip_title_str2");
			},
			btnBack: function() {
				this.util.UiUtils.switchToPage("wallet-index", "add-asset", {}, "switchTab");
			},
			onRefersh() {
				//清空之前并重获取  'default.png'
				this.currentAssetList = [];
				this.allAssetList = [];

				let chains = this.dal.Chain.getChainList();
				let item = chains.find(el => el.chaintype == this.chaintype);
				this.name = item.name;

				this.currentAssetList = this.dal.ContractWallet.getContractWallets(this.m_idx, this.address);
				//获取所有币
				let list = this.dal.Common.onGetTokenListData() || [];
				//筛选当前链下的
				list = list.filter(el => el.category.toUpperCase() == this.name.toUpperCase());
				console.log('=================', list, this.currentAssetList)
				for (let i = 0; i < list.length; i++) {
					let el = list[i]

					if (!el.icon) {
						el.icon = '../../static/image/chain/default.png';
					}

					if (this.currentAssetList.some(e => e.name == el.name)) {
						el.isCollect = true;
					} else {
						el.isCollect = false;
					}

					el.showContract = el.address ? el.address.substring(0, 7) + '...' + el.address.substring(el.address
						.length - 7) : "no address";

				}

				this.allAssetList = list;
				this.showList = this.allAssetList;

			},
			clear() {
				this.keyword = "";
				this.showList = this.allAssetList;
			},

			onContract(data) {
				console.log("==onContract==data==", data)
				if (data.status == '1') {
					let address = this.keyword.replace(/ /g, "");
					let result = data.result[0];
					let t = new Date().getTime()
					let item = {
						"id": t,
						"idx": t,
						"category": "ETH",
						"name": result.ContractName,
						"icon": '../../static/image/chain/default.png',
						"website": "",
						"address": address,
						"white_book": result.ContractName,
						"community": result.ContractName,
						"desc": "<p>"+result.ContractName+"</p>",
						"state": 1,
						"release_at": "2021-02-26 00:00:00",
						"is_hot": 0,
						"remark": null,
						"created_at": "2021-02-14 09:38:18",
						"updated_at": "2021-02-14 10:03:15"
					}
					this.showList.push(item)
				console.log("====this.showList==", this.showList)
				}
			},

			async goSearch() {
				console.log("====this.keyword==", this.keyword)
				let address = this.keyword.replace(/ /g, "");
				let res = ''
				if (this.chaintype == 1) {
					//ETH
					res = await this.dal.Eth.isContract(address)
				} else if (this.chaintype == 2) {
					//以后其他的
				}

				if (res) {
					//地址有效   先再app已有的代币中找
					this.showList = this.allAssetList.filter(el => el.address == address);
					console.log("=this.showList==", this.showList)
					if (this.showList && this.showList.length <= 0) {
						this.dal.Common.onGetContract(address)
					}
				} else {
					this.util.UiUtils.showToast(this.wallet_tip_str1);
				}
			},
			goAdd(item) {
				//当前链下我已选的资产列表
				// 检查是否已经添加
				console.log("====addContractWallet==item===", item);
				let i = this.currentAssetList.findIndex(el => el.name.toUpperCase() == item.name.toUpperCase());
				if (i != -1) {
					// 说明已经添加过了
					this.util.UiUtils.showToast(this.err_tip_str22)
					return;
				}
				this.util.UiUtils.showLoading()
				console.log("====addContractWallet==this.address=", this.address);
				console.log("====addContractWallet==item.address=", item.address);
				console.log("====addContractWallet==this.m_idx=", this.m_idx);
				console.log("====addContractWallet==this.chaintype=", this.chaintype);
				// if()
				// 添加资产
				let self = this;
				this.dal.ContractWallet.addContractWallet(this.chaintype, this.m_idx, this.address, item.address).then(
					result => {
						console.log("====addContractWallet==result===", result);
						if (result) {
							console.log("=222===addContractWallet==item===", item);
							self.util.UiUtils.showToast(self.tip_title_str1);
							if(item.idx > 16000000){
								let contractItem = {};
								contractItem.id = item.id;
								contractItem.idx = item.idx;
								contractItem.address = self.address;
								contractItem.chaintype = self.chaintype;
								contractItem.contract = item.address;
								contractItem.name = item.name;
								self.dal.ContractWallet.setContractItem(contractItem)
							}
							self.onRefersh()
						} else {
							self.util.UiUtils.showToast(self.tip_title_str2)
						}
					})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.add-asset {
		width: 100%;
		min-height: 100vh;
		background-color: #fafbff;

		/deep/ .uni-navbar--border {
			border: 0;
		}

		.search-header {
			width: 100%;
			height: 88rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			background-color: #fafbff;

			.search-frame {
				width: 85%;
				height: 65rpx;
				border-radius: 30rpx;
				background-color: #FFFFFF;
				margin-right: 20rpx;
				display: flex;
				align-items: center;
				padding: 0 10rpx 0 30rpx;
				box-sizing: border-box;

				.search-icon {
					padding-right: 20rpx;
				}

				uni-input {
					width: 80%;
					font-size: 26rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					color: #444444;
				}
			}

			.cancell-txt {
				font-size: 28rpx;
				color: #007AFF;
			}
		}

		.list-content {
			width: 100%;
			background-color: #fafbff;

			.list-item {
				width: 100%;
				height: 121rpx;
				padding: 22rpx 42rpx 16rpx 34rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				background-color: #FFFFFF;
				border-bottom: 1rpx solid #E7E6ED;

				.icon {
					width: 54rpx;
					height: 54rpx;
					margin-right: 22rpx;
				}

				.dapp-info {
					width: 60%;
					font-family: PingFang SC, PingFang SC-Bold;
					text-align: left;

					.title {
						font-size: 36rpx;
						font-weight: 600;
						color: #071328;
						line-height: 41rpx;
					}

					.descrip {

						font-size: 26rpx;
						font-weight: 400;
						color: #8e8e8e;
						line-height: 41rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}

				.right-icon {
					width: 38rpx;
					height: 38rpx;
					margin-left: auto;
				}
			}
		}

	}
</style>
