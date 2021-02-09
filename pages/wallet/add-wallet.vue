<template>
	<view class="addWallet">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" title="添加钱包" @clickLeft="goBack"></uni-nav-bar>
		<view class="coin-list">
			<view class="list-item" v-for="(item,index) in coinList" :key="index" @click="handleChecked(item)">
				<image class="icon" :src="'../../static/image/chain/'+item.img" mode=""></image>
				<view class="coin-name">
					<view class="short-N">{{item.name}}</view>
					<view class="full_N">{{item.alias}}</view>
				</view>
				<image class="checked-icon" src="../../static/image/mine/arrow-left.svg" mode=""></image>
			</view>
		</view>
		<uni-popup type="bottom" ref="popupS">
			<view class="main-c">
				<uni-icons @tap="cancell" type="closeempty" size="30" color="#000000" class="cancell-icon"></uni-icons>
				<view class="title">{{activeCoin.name}}</view>
				<view class="creat-wallet" @tap="goCreate">
					<image class="icon" src="../../static/image/index/creat-wallet.png" mode=""></image>
					<view class="coin-name">
						<view class="short-N">创建钱包</view>
						<view class="full_N">还未拥有钱包</view>
					</view>
					<image class="checked-icon" src="../../static/image/mine/arrow-left.svg" mode=""></image>
				</view>
				<view class="menu-list">
					<view class="menu-title">导入钱包</view>
					<view @tap="goRecover(index)" class="list-item" v-for="(item,index) in menuList" :key="index" @click="handleChecked(item)">
						<image class="icon" :src="item.logo" mode=""></image>
						<view class="coin-name">
							<view class="short-N">{{item.title}}</view>
							<view class="full_N">{{item.subTitle}}</view>
						</view>
						<image class="checked-icon" src="../../static/image/mine/arrow-left.svg" mode=""></image>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name: "addWallet",
		created() {
			this.onRefresh()
		},
		data() {
			return {
				menuList: [{
						logo: "../../static/image/index/word.png",
						title: "助记词",
						subTitle: "助记词由单词组成，以空格隔开"
					},
					{
						logo: "../../static/image/index/privateword.png",
						title: "私钥",
						subTitle: "明文私钥字符"
					},
				],
				activeCoin: {},
				coinList: []
			};
		},		
		methods: {
			onRefresh:function(){
				//添加默认图标
				let list = this.dal.Chain.getChainList();
				list.forEach(el=>{
					if(!el.img){
						el.img = 'default.png'
					}
				})
				this.coinList = list;
			},
			goBack: function() {
				this.util.UiUtils.switchBackPage();
			},
			handleChecked(item) {
				this.activeCoin = item;
				this.$refs.popupS.open();
			},
			cancell() {
				this.$refs.popupS.close()
			},
			goCreate() {
				this.$refs.popupS.close()
				this.$openPage({
					name: "creat-wallet-wallet",
					query: this.activeCoin
				})
			},
			goRecover(index) {
				this.$refs.popupS.close()
				this.activeCoin.type = index + 1;
				this.$openPage({
					name: "import-wallet-wallet",
					query: this.activeCoin
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.addWallet {
		width: 100%;
		background-color: #FFFFFF;
		/deep/ .uni-navbar--border {
			border: 0;
		}

		.coin-list {
			width: 100%;
			padding: 0 34rpx;
			box-sizing: border-box;

			.list-item {
				width: 100%;
				height: 120rpx;
				display: flex;
				align-items: center;
				border-bottom: 1rpx solid #E7E6ED;

				.icon {
					width: 54rpx;
					height: 54rpx;
					margin-right: 22rpx;
				}

				.coin-name {
					font-family: PingFang SC, PingFang SC-Semibold;

					.short-N {
						font-size: 36rpx;
						color: #071328;
						font-weight: 600;
						line-height: 40rpx;
					}

					.full-N {
						font-size: 24rpx;
						color: #7C7C7C;
						line-height: 30rpx;
					}
				}

				.checked-icon {
					margin-left: auto;
					width: 13rpx;
					height: 24rpx;
				}
			}
		}

		.main-c {
			width: 100%;
			height: 80vh;
			border-radius: 33rpx;
			position: relative;
			padding: 22rpx 36rpx;
			box-sizing: border-box;
			background-color: #F6F7F9;

			.cancell-icon {
				position: absolute;
				top: -10rpx;
				right:20rpx;
			}

			.title {
				font-size: 32rpx;
				font-family: PingFang SC, PingFang SC-Bold;
				font-weight: 700;
				color: #121212;
				text-align: center;
			}

			.creat-wallet {
				width: 100%;
				height: 135rpx;
				margin: 30rpx 0;
				padding: 0 29rpx 0 34rpx;
				box-sizing: border-box;
				border-radius: 10rpx;
				display: flex;
				align-items: center;
				background-color: #FFFFFF;

				.icon {
					width: 43rpx;
					height: 38rpx;
					margin-right: 50rpx;
				}

				.coin-name {
					.short-N {
						font-size: 30rpx;
						font-family: PingFang SC, PingFang SC-Semibold;
						font-weight: 700;
						color: #121212;
						line-height: 50rpx;
					}

					.full-N {
						font-size: 26rpx;
						font-family: PingFang SC, PingFang SC-Regular;
						font-weight: 500;
						color: #121212;
						line-height: 40rpx;
					}
				}

				.checked-icon {
					width: 13rpx;
					height: 24rpx;
					margin-left: auto;
				}
			}

			.menu-list {
				width: 100%;
				border-radius: 20rpx;

				.menu-title {
					font-size: 26rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					color: #121212;
					margin-bottom: 20rpx;
				}

				.list-item {
					width: 100%;
					height: 135rpx;
					margin: 30rpx 0;
					padding: 0 29rpx 0 34rpx;
					box-sizing: border-box;
					border-radius: 10rpx;
					display: flex;
					align-items: center;
					background-color: #FFFFFF;

					.icon {
						width: 43rpx;
						height: 38rpx;
						margin-right: 50rpx;
					}

					.coin-name {
						.short-N {
							font-size: 30rpx;
							font-family: PingFang SC, PingFang SC-Semibold;
							font-weight: 700;
							color: #121212;
							line-height: 50rpx;
						}

						.full-N {
							font-size: 26rpx;
							font-family: PingFang SC, PingFang SC-Regular;
							font-weight: 500;
							color: #121212;
							line-height: 40rpx;
						}
					}
					.checked-icon {
						width: 13rpx;
						height: 24rpx;
						margin-left: auto;
					}
			}
		}
	}
}
</style>
