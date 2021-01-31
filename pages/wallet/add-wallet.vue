<template>
	<view class="addWallet">
		<uni-nav-bar :statusBar="true" :fixed="true" left-icon="back" title="添加钱包" @clickLeft="goBack"></uni-nav-bar>
		<view class="coin-list">
			<view class="list-item" v-for="(item,index) in coinList" :key="index" @click="handleChecked(item)">
				<image class="icon" :src="item.logo" mode=""></image>
				<view class="coin-info">
					<view class="coin-name">
						<view class="short-N">{{item.name}}</view>
						<view class="full_N">{{item.alias}}</view>
					</view>
					<image class="checked-icon" src="../../static/image/mine/arrow-left.svg" mode=""></image>
				</view>
			</view>
		</view>
		<uni-popup type="bottom" ref="popupS">
			<view class="main-c">
				<uni-icons @tap="cancell" type="closeempty" size="30" class="cancell-icon"></uni-icons>
			    <view class="title">{{activeCoin.name}}</view>
				<view class="creat-wallet" @tap="goCreate">
					<image class="icon" src="../../static/image/index/chanpin-select.png" mode=""></image>
					<view class="coin-info">
						<view class="coin-name">
							<view class="short-N">创建钱包</view>
							<view class="full_N">还未拥有钱包</view>
						</view>
						<image class="checked-icon" src="../../static/image/mine/arrow-left.svg" mode=""></image>
					</view>
				</view>
				<view class="menu-list">
					<view class="menu-title">导入钱包</view>
					<view @tap="goRecover(index)" class="list-item" v-for="(item,index) in menuList" :key="index" @click="handleChecked(item)">
						<image class="icon" :src="item.logo" mode=""></image>
						<view class="coin-info">
							<view class="coin-name">
								<view class="short-N">{{item.title}}</view>
								<view class="full_N">{{item.subTitle}}</view>
							</view>
							<image class="checked-icon" src="../../static/image/mine/arrow-left.svg" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name: "addWallet",
		data() {
			return {
				menuList:[
					{
						logo:"../../static/image/index/no-list.png",
						title:"助记词",
						subTitle:"助记词由单词组成，以空格隔开"
					},
					{
						logo:"../../static/image/index/no-list.png",
						title:"私钥",
						subTitle:"明文私钥字符"
					},
				],
				activeCoin: {},
				coinList: [{
						chaintype: 1,
						logo: "../../static/image/index/eth.png",
						name: "ETH",
						alias: "Ethereum"
					},
					{
						chaintype: 2,
						logo: "../../static/image/index/btc.png",
						name: "BTC",
						alias: "Btcoin"
					},
					{
						chaintype: 3,
						logo: "../../static/image/index/fil.png",
						name: "ATOM",
						alias: "Cosmos"
					},
				]
			};
		},
		methods: {
			goBack: function() {
				this.util.UiUtils.switchBackPage();
			},
			handleChecked(item) {
				this.activeCoin = item;
                this.$refs.popupS.open();
			},
			cancell(){
				this.$refs.popupS.close()
			},
			goCreate(){
				this.$refs.popupS.close()
				this.$openPage({name:"creat-wallet-wallet",query:this.activeCoin})
			},
			goRecover(index){
				this.$refs.popupS.close()
				this.activeCoin.type = index+1;
				this.$openPage({name:"import-wallet-wallet",query:this.activeCoin})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.addWallet {
		width: 100%;

		.coin-list {
			width: 100%;
			padding: 0 30rpx;
			box-sizing: border-box;
			background-color: #FFFFFF;

			.list-item {
				width: 100%;
				height: 150rpx;
				display: flex;
				align-items: center;

				.icon {
					width: 80rpx;
					height: 80rpx;
					margin-right: 30rpx;
					border-radius: 50%;
				}

				.coin-info {
					width: calc(100% - 110rpx);
					border-bottom: 2rpx solid #F2F2F2;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.coin-name {
						.short-N {
							font-size: 28rpx;
							color: #444444;
							font-weight: bold;
						}

						.full-N {
							font-size: 24rpx;
							color: #8e8e8e;
						}
					}

					.checked-icon {
						width: 40rpx;
						height: 40rpx;
						border-radius: 50%;
						margin-left: auto;
					}
				}
			}
		}
		.main-c{
			width: 100%;
			height: 80vh;
			border-radius: 20rpx;
			position: relative;
			padding: 30rpx 20rpx;
			box-sizing: border-box;
			background-color: #efefef;
			.cancell-icon{
				position: absolute;
				top: 0rpx;
				left: 0rpx;
			}
			.title{
				font-size: 28rpx;
				font-weight: bold;
				color: #444444;
				text-align: center;
			}
			.creat-wallet{
				width: 100%;
				height: 150rpx;
				margin: 30rpx 0 50rpx;
				padding: 0 20rpx;
				box-sizing: border-box;
				border-radius: 20rpx;
				display: flex;
				align-items: center;
				background-color: #FFFFFF;
				.icon {
					width: 80rpx;
					height: 80rpx;
					margin-right: 40rpx;
					border-radius: 50%;
				}
				
				.coin-info {
					width: calc(100% - 110rpx);
					border-bottom: 2rpx solid #F2F2F2;
					display: flex;
					align-items: center;
					justify-content: space-between;
				
					.coin-name {
						.short-N {
							font-size: 28rpx;
							color: #444444;
							font-weight: bold;
						}
				
						.full-N {
							font-size: 24rpx;
							color: #8e8e8e;
						}
					}
				
					.checked-icon {
						width: 40rpx;
						height: 40rpx;
						border-radius: 50%;
						margin-left: auto;
					}
				}
			}
		    .menu-list {
		    	width: 100%;
				border-radius: 20rpx;
				.menu-title{
					margin-bottom: 20rpx;
				}
		    	.list-item {
		    		width: 100%;
		    		height: 150rpx;
					padding: 0 30rpx;
					box-sizing: border-box;
		    		display: flex;
		    		align-items: center;
		            background-color: #FFFFFF;
		    		.icon {
		    			width: 80rpx;
		    			height: 80rpx;
		    			margin-right: 30rpx;
		    			border-radius: 50%;
		    		}
		    
		    		.coin-info {
		    			width: calc(100% - 110rpx);
		    			border-bottom: 2rpx solid #F2F2F2;
		    			display: flex;
		    			align-items: center;
		    			justify-content: space-between;
		    
		    			.coin-name {
		    				.short-N {
		    					font-size: 28rpx;
		    					color: #444444;
		    					font-weight: bold;
		    				}
		    
		    				.full-N {
		    					font-size: 24rpx;
		    					color: #8e8e8e;
		    				}
		    			}
		    
		    			.checked-icon {
		    				width: 40rpx;
		    				height: 40rpx;
		    				border-radius: 50%;
		    				margin-left: auto;
		    			}
		    		}
		    	}
		    }
		}
	}
</style>
