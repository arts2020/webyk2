<template>
	<view class="wallet-index">
		<uni-nav-bar :statusBar="true" :fixed="true" left-icon="back" right-icon="plusempty" title="管理钱包" @clickLeft="btnBack" @clickRight="goAddWallet"></uni-nav-bar>
	    <view class="main-content">
			<scroll-view class="main-left" scroll-y="true" >
				<view class="nav-menu">
					<image :src="activeObj.chaintype==-1?'../../../static/image/index/hangqing-select.png':'../../../static/image/index/hangqing.png'" mode="" @tap="handleChecked({chaintype:-1})"></image>
					<image :src="activeObj.chaintype==item.chaintype?item.logo_act:item.logo" mode="" v-for="(item,index) in identity_wallets" :key="index" @tap="handleChecked(item)"></image>
				</view>
			</scroll-view>
			<scroll-view class="main-right" scroll-y="true" >
				<view class="current-c" v-if="currentList.length">
					<view class="list-item" v-for="(item,index) in currentList" :key="index" :style="'background: url('+item.bgcImg+') no-repeat center;'" @tap="goDetail(item)">
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
						<view class="list-item" v-for="(item,index) in identity_wallets" :key="index" :style="'background: url('+item.bgcImg+') no-repeat center;'" @tap="goDetail(item)">
							<view class="wallet-name">
								<text>{{item.name}}</text>
								<text>...</text>
							</view>
							<view class="wallet-addr">{{item.addr}}</view>
						</view>
						<view class="add-coin" @tap="goAddCoin">
							<view class="tip-msg">
								<view class="tip-title">添加币种</view>
								<view class="tip-content">
									<view class="dot"></view>
									<view class="content">支持EOS、TRX、CKB、KSM、FIL</view>
								</view>
							</view>
							<uni-icons type="plus" size="30" color="#444444"></uni-icons>
						</view>
					</view>
					<view class="imKey">
						<view class="top-title">imKey</view>
						<view class="imKey-main">配对imKey硬件钱包</view>
					</view>
					<view class="create-import" v-if="single_wallets.length">
						<view class="top-title">创建/导入</view>
						<view class="list-item" @tap="goDetail(item)" :style="'background: url('+item.bgcImg+') no-repeat center;'" v-for="(item,index) in single_wallets" :key="index">
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
						logo:"../../../static/image/index/index.png",
						logo_act:"../../../static/image/index/index-select.png",
						name:"ETH",
						alias:"Ethereum",
						addr:"ajdbiaeuudiiiiiiaaan ldjsn cjhf",
						bgcImg:"../../../static/image/index/index-bg.png"
					},
					{
						chaintype:2,
						logo:"../../../static/image/index/index.png",
						logo_act:"../../../static/image/index/index-select.png",
						name:"BTC",
						alias:"Bitcoin",
						addr:"ajdbiaeuudiiiiiiaaan ldjsn cjhf",
						bgcImg:"../../../static/image/safe/powerBg.png"
					},
				],
				single_wallets:[
					{
						chaintype:1,
						logo:"../../../static/image/index/index.png",
						logo_act:"../../../static/image/index/index.png",
						name:"lisa",
						addr:"ajdbiaeuudiiiiiiaaan ldjsn cjhf",
						bgcImg:"../../../static/image/index/index-bg.png"
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
		.main-content{
			width: 100%;
			height: 100%;
			display: flex;
			.main-left{
				width: 20%;
				height: 100%;
				
				.nav-menu{
					width: 100%;
					height: 100%;
					background-color: #F2F2F2;
					padding-top: 20rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					image{
						width: 60rpx;
						height: 60rpx;
						border-radius: 50%;
						margin-bottom: 30rpx;
					}
				}
			}
			.main-right{
				width: 80%;
				height: 100%;
				padding: 20rpx 40rpx;
				box-sizing: border-box;
				.top-title{
					font-size: 24rpx;
					color: #8e8e8e;
					display: flex;
					align-items: center;
					justify-content: space-between;
					image{
						width: 24rpx;
						height: 24rpx;
						border-radius: 50%;
					}
				}
			    .list-item{
					width: 100%;
					height: 120rpx;
					background-size: 100% 100%;
				    border-radius: 20rpx;
					margin-top: 20rpx;
					padding: 20rpx;
					box-sizing: border-box;
					
					.wallet-name{
						display: flex;
						align-items: center;
						justify-content: space-between;
						font: 28rpx bold;
						color: #FFFFFF;
						text:last-child{
							letter-spacing: 10rpx;
						}
					}
					.wallet-addr{
						font: 24rpx;
						color: #FFFFFF;
					}
				}
				.add-coin{
					width: 100%;
					height: 120rpx;
					border-radius: 20rpx;
					margin-top: 20rpx;
					padding: 20rpx;
					box-sizing: border-box;
					background-color: #ECECEC;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.tip-msg{
						width: calc(100% - 80rpx);
						.tip-title{
							
						}
						.tip-content{
							font-size: 24rpx;
							color: #8e8e8e;
							display: flex;
							align-items: center;
							.content{
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
						}
					}
				}
				.imKey-main{
					width: 100%;
					height: 120rpx;
					background: url(../../../static/image/index/index-bg.png);
					border-radius: 20rpx;
					margin-top: 20rpx;
					padding: 40rpx 20rpx;
					box-sizing: border-box;
					font: 28rpx bold;
					color: #fefefe;
				}
			    .create-import,.imKey{
					margin-top: 40rpx;
				}
			}
		}
	
	}
</style>
