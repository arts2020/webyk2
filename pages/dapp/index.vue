<template>
	<view class="DApp">
		<bar ref="bar"></bar>
		<view class="navBar">
			<view class="nav-search" @tap="goSearch">
				<uni-icons type="search" size="20" color="#CCD3D9"></uni-icons>
				<input type="text" v-model="keyword" confirm-type="search" placeholder="搜索或输入DApp网址" placeholder-class="tipClass" />
			</view>
		</view>
		<scroll-view scroll-y="true" class="list-content" :style="'height:'+scrollHeight+'px'">
			<view class="list-item" v-for="(item,index) in list" :key="index" @tap="goCheck(item)">
				<image class="icon" :src="item.icon" mode=""></image>
				<view class="dapp-info">
					<view class="title">{{item.name}}</view>
					<view class="descrip">{{item.community}}</view>
				</view>
				<image class="right-arr" src="../../static/image/index/arrow-left.png" mode=""></image>
			</view>
		</scroll-view>
		<uni-popup type="bottom" ref="popup">
			<view class="tip-Pop">
				<view class="top-title">访问说明</view>
				<view class="tip-content">
					你正在访问第三方DApp，你在第三方DApp上的使用行为将适用于第三方DApp的《用户协议》和《隐私政策,有第三方DApp直接想你承担责任。
				</view>
				<view class="btns">
					<view class="cancell" @tap="cancell">退出</view>
					<view class="confirm-ok" @tap="confirm">确认</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	export default {
		name: "DApp",
		components: {
			Bar
		},
		created() {
			this.util.EventUtils.addEventListenerCustom(this.dal.Dapp.evtGetDappList, this.onGetDappList);
		},
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Dapp.evtGetDappList, this.onGetDappList);
		},
		data() {
			return {
				keyword: "",
				scrollHeight: 0,
				// 当前点击的dapp数据
				currentDapp: {},
				// 所有数据
				list: [
				],
			}
		},
		onShow() {
			this.onRefersh();
			uni.getSystemInfo({
				success: (res) => {
					this.scrollHeight = res.windowHeight - res.statusBarHeight - 54;
				}
			});
		},
		methods: {
			onRefersh(){
				this.list = [];
				this.currentDapp = {};
				//获取列表数据
				this.dal.Dapp.onGetDapps()
			},
			goCheck(item) {
				// 打开访问说明
				this.currentDapp = item;
				this.$refs.popup.open();
			},
			goSearch() {
				this.$openPage({
					name: "dapp-search"
				})
			},
			cancell() {
				// 取消访问
				this.$refs.popup.close()
			},
			confirm() {
				// 确认访问
				this.$openPage({
					name: "webui-webview",
					query: {
						url: "http://uniswap.token.im/#/pool?locale=zh-CN&utm_source=imtoken",
						title: "用户协议"
					}
				})
				//关闭弹框
				this.$refs.popup.close()

			},
			onGetDappList(data){
				data.data.forEach(el=>{
					if(!el.icon){
						el.icon = '../../static/image/chain/default.png'
					}
				})
				this.list = data.data;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.DApp {
		width: 100%;
        /deep/ .uni-popup{
				z-index: 999;
		}
		.navBar {
			width: 100%;
			height: 88rpx;
			opacity: 1;
			background: #fafbff;
			box-shadow: 0px 3rpx 10rpx 0px rgba(0, 0, 0, 0.06);
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #FAFBFF;
			margin-bottom: 10rpx;

			.nav-search {
				width: calc(100% - 70rpx);
				height: 65rpx;
				background: #ffffff;
				border: 1rpx solid #a9b7c4;
				border-radius: 34rpx;
				padding: 14rpx 26rpx;
				box-sizing: border-box;
				margin: 0 auto;
				display: flex;
				align-items: center;

				uni-input {
					margin-left: 10rpx;
					font-size: 26rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 500;
					color: #444444;
				}

				.tipClass {
					font-size: 26rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					color: #a9b7c4;
					line-height: 35rpx;
				}
			}
		}

		.list-content {
			width: 100%;
			padding: 0 35rpx 0 25rpx;
			box-sizing: border-box;
			background-color: #FFFFFF;

			.list-item {
				width: 100%;
				height: 155rpx;
				display: flex;
				align-items: center;
				border-bottom: 1rpx solid #ebebeb;

				.icon {
					width: 90rpx;
					height: 90rpx;
					border-radius: 10rpx;
					margin-right: 30rpx;
				}

				.dapp-info {
					font-family: PingFang SC, PingFang SC-Bold;
					text-align: left;

					.title {
						font-size: 32rpx;
						font-weight: 700;
						color: #121212;
					}

					.descrip {
						font-size: 28rpx;
						font-weight: 400;
						color: #989898;
					}
				}

				.right-arr {
					width: 13rpx;
					height: 24rpx;
					margin-left: auto;
				}
			}
		}

		.tip-Pop{
			width: 100%;
			height: 532rpx;
			background: #ffffff;
			border-radius: 33rpx 33rpx 0 0;
			text-align: center;
			padding: 55rpx 36rpx 61rpx;
			box-sizing: border-box;
			position: relative;
			
			.top-title{
				font-size: 32rpx;
				font-family: PingFang SC, PingFang SC-Bold;
				font-weight: 700;
				text-align: center;
				color: #121212;
				margin-bottom: 42rpx;
			}
			.tip-content{
				width: 100%;
			    font-size: 30rpx;
			    font-family: PingFang SC, PingFang SC-Bold;
			    font-weight: 700;
			    text-align: left;
			    color: #121212;
				margin-bottom: 97rpx;
			}
			.btns{
				margin-top: 20rpx;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				view{
					width: 292rpx;
					height: 88rpx;			
					border-radius: 14rpx;
					box-shadow: 0px 3rpx 26rpx 0px rgba(0,0,0,0.06); 
					line-height: 88rpx;
					text-align: center;
					color: #FFFFFF;
				}
				.cancell{
					background: #f57778;
				}
				.confirm-ok{
					background-color:#4C72EF;
				}
			}
		}
	}
</style>
