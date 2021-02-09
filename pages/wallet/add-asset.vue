<template>
	<view class="add-asset">
		<bar ref="bar"></bar>
		<view class="search-header">
			<view class="search-frame">
				<uni-icons type="search" class="search-icon" size="20" color="#CCD3D9" @tap="goSearch"></uni-icons>
				<input type="text" placeholder-style="color: #a9b7c4;" placeholder="请输入token名称" v-model="keyword" confirm-type="search"
				 @confirm="goSearch" />
				<uni-icons v-if="keyword" type="closeempty" size="20" style="font-weight: 600;" color="#444444" @tap="clear"></uni-icons>
			</view>
			<text class="cancell-txt" @tap="btnBack">取消</text>
		</view>
		<scroll-view scroll-y="true" class="list-content" :style="'height:'+scrollHeight+'px'">
			<view class="list-item" v-for="(item,index) in showList" :key="index" @tap="goAdd(item)">
				<image class="icon" :src="'../../static/image/chain/'+item.img" mode=""></image>
				<view class="dapp-info">
					<view class="title">{{item.name}}</view>
					<view class="descrip">{{item.contract}}</view>
				</view>
				<image class="right-icon" src="../../static/image/index/plus.png" mode=""></image>
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
		data() {
			return {
				scrollHeight: 0,
				chaintype: 1,
				keyword: "",
				currentAssetList: [],
				// 当前链下全部资产的列表
				allAssetList: [{
						logo: "../../static/image/index/btc.png",
						title: "LON",
						desciption: "LON挖矿"
					},
					{
						logo: "../../static/image/index/btc.png",
						title: "Snapshot治理",
						desciption: "参与所有DeFi项目的社区治理"
					},
				],

			};
		},
		computed: {
			showList() {
				if (this.keyword) {
					//有搜索词时根据搜索词匹配
					return this.allAssetList.filter(el => el.name.includes(this.keyword))
				} else {
					return this.allAssetList;
				}
			}
		},
		onLoad(option) {
			let params = JSON.parse(option.query);
			if (Object.keys(params).length != 0) {
				this.chaintype = params.chaintype
				this.address = params.address
			}
		},
		onShow() {
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight - 44;
				}
			});

			this.allAssetList = this.dal.Chain.getAssets(this.chaintype).assets;
			this.currentAssetList = this.dal.ContractWallet.getContractWallets(this.address);
		},
		methods: {
			btnBack: function() {
				this.util.UiUtils.switchToPage("wallet-index", "add-asset", {}, "switchTab");
			},
			clear() {
				this.keyword = ""
			},
			goSearch() {
				// 拿关键词keyword进行搜索匹配
			},
			goAdd(item) {
				//当前链下我已选的资产列表
				// 检查是否已经添加
				let i = this.currentAssetList.findIndex(el => el.idx == item.idx);
				if (i != -1) {
					// 说明已经添加过了
					this.util.UiUtils.showToast('已添加至首页资产')
					return;
				}
				// 添加资产
				this.dal.ContractWallet.addContractWallet(this.chaintype, this.address, item.contract).then(result => {
					console.log("====addContractWallet==result===", result);
					if (result) {
						this.util.UiUtils.showToast('添加成功');
					} else {
						this.util.UiUtils.showToast("添加失败")
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
