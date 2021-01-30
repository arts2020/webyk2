<template>
	<view class="wallet-index">
		<uni-nav-bar :status="true" :fixed="true" left-icon="back" right-icon="plusempty" title="管理钱包" @clickLeft="btnBack" @clickRight="goAdd"></uni-nav-bar>
	    <view class="main-content">
			<scroll-view class="main-left" scroll-y="true" >
				<view class="nav-menu">
					<image :src="active==-1?'../../../static/image/index/hangqing-select.png':'../../../static/image/index/hangqing.png'" mode="" @tap="handleChecked(-1)"></image>
					<image :src="active==item.id?item.logo_act:item.logo" mode="" v-for="(item,index) in identity_wallets" :key="index" @tap="handleChecked(item.id)"></image>
				</view>
			</scroll-view>
			<scroll-view class="main-right" scroll-y="true" >
				<view class="top-title">
					<text>身份钱包</text>
					<image src="../../../static/image/index/chanpin.png" mode=""></image>
				</view>
				<view class="menu-list">
					<view class="list-item" v-for="(item,index) in identity_wallets" :key="index" :style="'background: url('+item.bgcImg+') no-repeat center;'" @tap="goManage(item)">
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
					<view class="list-item" @tap="goManage(item)" :style="'background: url('+item.bgcImg+') no-repeat center;'" v-for="(item,index) in single_wallets" :key="index">
						<view class="wallet-name">
							<text>{{item.name}}</text>
							<text>...</text>
						</view>
						<view class="wallet-addr">{{item.addr}}</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		created() {
			this.util.EventUtils.addEventListenerCustom(this.dal.Wallter.evtGetWalletList, this.onGetWallet);
		},
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Wallter.evtGetWalletList, this.onGetWallet);
		},
		data() {
			return {
				scrollHeight: 0,
				active:-1,
				identity_wallets:[
					{
						id:1,
						logo:"../../../static/image/index/index.png",
						logo_act:"../../../static/image/index/index-select.png",
						name:"ETH-Wallet",
						addr:"ajdbiaeuudiiiiiiaaan ldjsn cjhf",
						bgcImg:"../../../static/image/index/index-bg.png"
					},
					{
						id:2,
						logo:"../../../static/image/index/index.png",
						logo_act:"../../../static/image/index/index-select.png",
						name:"ETH-Wallet",
						addr:"ajdbiaeuudiiiiiiaaan ldjsn cjhf",
						bgcImg:"../../../static/image/safe/powerBg.png"
					},
				],
				single_wallets:[
					{
						id:3,
						logo:"../../../static/image/index/index.png",
						logo_act:"../../../static/image/index/index.png",
						name:"ETH-Wallet",
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
				this.dal.Wallter.onGetWalletL()
			}.bind(this), 1000);
		},
		onPullDownRefresh() {
			this.dal.Wallter.onGetWalletL()
		},
		methods: {
			onGetWallet(data){
				uni.stopPullDownRefresh();
				// 拿到钱包数据后进行分类处理
			},
			// 去到管理钱包的界面
			goManage(item){
				
			},
			// 去添加钱包
			goAdd(){
				
			},			
			handleChecked(eId){
				this.active=eId;
				let curItem = this.identity_wallets.find(el=>el.id==eId);
				// 筛选选中的钱包类型加入到this.currentList中
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
