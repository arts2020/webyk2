<template>
	<view class="wallet-index">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" title="管理钱包" @clickLeft="btnBack"></uni-nav-bar>
	    <view class="main-content">
			<scroll-view class="main-left" scroll-y="true" >
				<view class="nav-menu">
					<view class="menu-item" :class="{'activeClass':activeObj.chaintype==-1}">
						<image src="../../../static/image/index/all.png" mode="" @tap="handleChecked({chaintype:-1})"></image>
					</view>
					<view class="menu-item" :class="{'activeClass':activeObj.chaintype==item.chaintype}" v-for="(item,index) in identity_wallets" :key="index" @tap="handleChecked(item)">
						<image :src="item.logo" mode=""></image>
					</view>
				</view>
			</scroll-view>
			<scroll-view class="main-right" scroll-y="true" >
				<view class="current-c" v-if="currentList.length">
					<view class="list-item" v-for="(item,index) in currentList" :key="index" :style="'background: url('+item.bgcImg+') no-repeat;background-size: 100% 100%;'" @tap="goDetail(item)">
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
						<text @tap="goManage">管理</text>
					</view>
					<view class="menu-list">
						<view class="list-item" v-for="(item,index) in identity_wallets" :key="index" :style="'background: url('+item.bgcImg+') no-repeat;background-size: 100% 100%;'" @tap="goDetail(item)">
							<view class="wallet-name">
								<text>{{item.name}}</text>
								<text>...</text>
							</view>
							<view class="wallet-addr">{{item.addr}}</view>
						</view>
						<view class="add-coin" @tap="goAddCoin">
							<view class="tip-msg">
								<view class="tip-title">添加币种</view>
								<view class="content">支持EOS、TRX、CKB、KSM、FIL</view>
							</view>
							<uni-icons type="plus" size="20" color="#ffffff"></uni-icons>
						</view>
					</view>
					<view class="create-import" v-if="single_wallets.length">
						<view class="top-title">创建/导入</view>
						<view class="list-item" @tap="goDetail(item)" :style="'background: url('+item.bgcImg+') no-repeat;background-size: 100% 100%;'" v-for="(item,index) in single_wallets" :key="index">
							<view class="wallet-name">
								<text>{{item.name}}</text>
								<text>...</text>
							</view>
							<view class="wallet-addr">{{item.addr}}</view>
						</view>
					</view>

				</view>
			</scroll-view>
			<view class="btn-ok" @tap="goAddWallet">
				<uni-icons type="plusempty" size="30" color="#7C7C7C"></uni-icons>
				<text>添加钱包</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollHeight: 0,
				activeObj:{
					chaintype:-1,
				},
				identity_wallets:[
					{
						chaintype:1,
						logo:"../../../static/image/index/eth.png",
						logo_act:"../../../static/image/index/index-select.png",
						name:"ETH",
						alias:"Ethereum",
						addr:"ajdbiaeuudiiiiiiaaan ldjsn cjhf",
						bgcImg:"../../../static/image/mine/btcImg.png"
					},
					{
						chaintype:2,
						logo:"../../../static/image/index/btc.png",
						logo_act:"../../../static/image/index/index-select.png",
						name:"BTC",
						alias:"Bitcoin",
						addr:"ajdbiaeuudiiiiiiaaan ldjsn cjhf",
						bgcImg:"../../../static/image/mine/ethImg.png"
					},
				],
				single_wallets:[
					{
						chaintype:1,
						logo:"../../../static/image/index/index.png",
						logo_act:"../../../static/image/index/index.png",
						name:"lisa",
						addr:"ajdbiaeuudiiiiiiaaan ldjsn cjhf",
						bgcImg:"../../../static/image/mine/import-wallet.png"
					}
				],
				// 选中后钱包列表
				currentList:[]
			}
		},
		onLoad() {

		},
		onShow() {
			uni.startPullDownRefresh();
			setTimeout(function () {
				// this.dal.Wallter.onGetWalletL()
			}.bind(this), 1000);
		},
		onPullDownRefresh() {
			// this.dal.Wallter.onGetWalletL()
		},
		methods: {
			//添加币种
			goAddCoin(){
				this.util.UiUtils.switchToPage("wallet-add-coin", "creat-wallet-status",{backType:3});
			},
			//去到管理身份界面
            goManage(){
				this.$openPage({name:"status-wallet-index"})
			},
			// 去到钱包详情界面，钱包详情界面 身份钱包和普通钱包有区别，进行状态控制
			goDetail(item){
				this.$openPage({name:"my-wallet-detail",query:item})
			},
			// 去添加钱包
			goAddWallet(){
				this.$openPage({name:"wallet-add-wallet"})
			},			
			handleChecked(item){
			    this.currentList = [];		
				this.activeObj = item;
				if(item.chaintype!=-1){
					// 选中主链中一种,加入活动列表,并从普通钱包列表中筛选该类型的普通钱包加入活动列表
					let list = this.single_wallets.filter(el=>el.chaintype==item.chaintype);
					list.unshift(item);
					this.currentList = list;
				}
				console.log(item.chaintype,this.single_wallets.filter(el=>el.chaintype==item.chaintype))
			},
			onRefresh:function(){

			},
			btnBack: function() {
				this.util.UiUtils.switchToPage("mine-mine", "create-wallter", {});
			},			
		},
		onShow() {
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight - 44;
				}
			});
		}
	}
</script>

<style lang="scss" scoped>
	.wallet-index{
		width: 100%;
		height: 100%;
		min-height: 100vh;
		background-color: #FFFFFF;
		/deep/ .uni-navbar--border{
			border: 0;
		}
		.main-content{
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: space-between;
			.main-left{
				width: 122rpx;
				height: 100%;
				.nav-menu{
					width: 100%;
					height: 100%;
					padding-top: 20rpx;
					.menu-item{
						width: 100%;
						height: 71rpx;	
						margin-bottom: 39rpx;
						position: relative;
						text-align: center;
						&.activeClass::after{
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
						image{
							width: 71rpx;
							height: 71rpx;
							border-radius: 50%;
						}
					}
				}
			}
			.main-right{
				width: 605rpx;
				height: 100%;
				padding: 36rpx 36rpx 0 0;
				box-sizing: border-box;
				.top-title{
					margin-bottom: 22rpx;
					font-size: 30rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 500;
					color: #121212;
					display: flex;
					align-items: center;
					justify-content: space-between;
					text:last-child{
						font-size: 26rpx;
						font-weight: 400;
						color: #4c72ef;
					}
				}
			    .list-item{
			    	width: 100%;
			    	height: 122rpx;
			    	margin-bottom: 27rpx;
			        border-radius: 20rpx;
			    	padding: 17rpx 27rpx 0 32rpx;
			    	box-sizing: border-box;
			    	color: #FFFFFF;
			    	.wallet-name{
			    		display: flex;
			    		align-items: center;
			    		justify-content: space-between;
			    		font-size: 36rpx;
			    		font-family: PingFang SC, PingFang SC-Semibold;
			    		font-weight: 600;
			    		line-height: 50rpx;
			    		text:last-child{
			    			letter-spacing: 10rpx;
			    		}
			    	}
			    	.wallet-addr{
			    		font-size: 30rpx;
			    		font-family: PingFang SC, PingFang SC-Regular;
			    		font-weight: 400;
			    		line-height: 37rpx;
			    	}
			    }
			    
				.add-coin{
					width: 100%;
					height: 122rpx;
					margin-bottom: 27rpx;
					background: url(../../../static/image/mine/add-icon.png) no-repeat center;
					background-size: 100% 100%;
					border-radius: 20rpx;
					padding: 17rpx 27rpx 0 32rpx;
					box-sizing: border-box;
					color: #FFFFFF;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.tip-msg{
						width: calc(100% - 80rpx);
						font-family: PingFang SC, PingFang SC-Semibold;
						color: #ffffff;
						.tip-title{
							font-size: 36rpx;
							font-weight: 600;
							line-height: 50rpx;
						}
						.content{
							font-size: 30rpx;
							font-weight: 400;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							line-height: 42rpx;
						}
					}
				}

			}
		    .btn-ok{
		    	width: 100%;
		    	height: 104rpx;
				line-height: 104rpx;
				text-align: center;
		    	background: #ffffff;
		    	box-shadow: 0px -3rpx 16rpx 0px rgba(0,0,0,0.06);
				font-size: 30rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
				color: #7c7c7c;
				position: fixed;
				bottom: 0;
				
		    }
		}
	
	}
</style>
