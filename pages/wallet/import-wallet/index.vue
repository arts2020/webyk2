<template>
	<view class="import-wallet-index">
		<uniNavBar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" title="导入身份&钱包" @clickLeft="btnBack"></uniNavBar>
		<view class="import-status" @tap="goRecoverStatus">
			<image class="status_icon" src="../../../static/image/index/hsWallet.png" mode=""></image>
			<text>导入身份钱包</text>
			<image class="right_arr" src="../../../static/image/mine/arrow-left.svg" mode=""></image>
		</view>
		<view class="single-wallet">
			<view class="title">导入单底层钱包</view>
			<view class="main-list">
				<view class="menu-item" @tap="goimport(item)" v-for="(item,index) in coinList" :key="index">
					<image class="menu-icon" :src="'../../../static/image/chain/'+item.img" mode=""></image>
					<view class="menu-msg">
						<view class="msg-title">{{item.name}}</view>
						<view class="msg-subT">{{item.alias}}</view>
					</view>
					<image class="right_arr" src="../../../static/image/mine/arrow-left.svg" mode=""></image>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	export default {
		name: 'import-wallet-index',
		components: {
			uniNavBar
		},
		created() {
			this.onRefresh();
		},
		data() {
			return {
				scrollHeight: 0,
				coinList: [],
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
		},
		methods: {
			onRefresh() {
				//检查是否有图标，没有就添加默认图标
				let list = this.dal.Chain.getChainList();
				list.forEach(el=>{
					if(!el.img){
						el.img = 'default.png';
					}
				})
				this.coinList = list;
				console.log("==this.coinList==", this.coinList)
			},
			goRecoverStatus() {
				this.$openPage({
					name: "import-wallet-recover"
				})
			},
			btnBack: function() {
				this.util.UiUtils.switchBackPage();
			},
			goimport(item) {
				this.$openPage({
					name: "import-wallet-style",
					query: item
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.import-wallet-index {
		width: 100%;
		height: 100%;
		min-height: 100vh;
		background-color: #FAFBFF;

		/deep/ .uni-navbar--border {
			border: 0;
		}

		.import-status {
			margin: 16rpx auto 35rpx;
			width: calc(100% - 72rpx);
			height: 113rpx;
			border-radius: 10rpx;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			padding: 0 29rpx 0 38rpx;
			box-sizing: border-box;
			font-size: 30rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 600;
			color: #121212;

			.status_icon {
				width: 57rpx;
				height: 51rpx;
				margin-right: 30rpx;
			}

			.right_arr {
				width: 13rpx;
				height: 24rpx;
				margin-left: auto;
			}
		}

		.single-wallet {
			width: calc(100% - 72rpx);
			margin: 0 auto;

			.title {
				font-size: 26rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 600;
				color: #121212;
				margin-bottom: 17rpx;
			}

			.main-list {
				width: 100%;
				background-color: #FFFFFF;
				border-radius: 10rpx;
				padding: 0rpx 29rpx 0 33rpx;
				box-sizing: border-box;

				.menu-item {
					width: 100%;
					height: 120rpx;
					display: flex;
					align-items: center;
					border-bottom: 1rpx solid #E7E6ED;

					&:last-child {
						border-bottom: 0rpx;
					}

					.menu-icon {
						width: 54rpx;
						height: 54rpx;
						margin-right: 30rpx;
					}

					.menu-msg {
						.msg-title {
							font-size: 36rpx;
							font-family: PingFang SC, PingFang SC-Semibold;
							font-weight: 600;
							text-align: left;
							color: #071328;
							line-height: 45rpx;
						}

						.msg-subT {
							font-size: 30rpx;
							color: #8e8e8e;
							line-height: 40rpx;
						}
					}

					.right_arr {
						width: 20rpx;
						height: 20rpx;
						margin-left: auto;
					}
				}
			}
		}
	}
</style>
