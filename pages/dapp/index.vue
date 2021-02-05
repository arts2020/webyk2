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
			<view class="list-item" v-for="(item,index) in showList" :key="index" @tap="goCheck(item)">
				<image class="icon" :src="item.logo" mode=""></image>
				<view class="dapp-info">
					<view class="title">{{item.title}}</view>
					<view class="descrip">{{item.desciption}}</view>
				</view>
				<image class="right-arr" src="../../static/image/index/arrow-left.png" mode=""></image>
			</view>
		</scroll-view>
		<uni-popup type="bottom" ref="popup">
			<view class="tip-Pop">
				<view class="top-title">访问说明</view>
				<view class="tip-content">
					<image :src="currentDapp.logo" mode=""></image>
					<view class="act-title">你正在访问第三方DApp</view>
					<view class="tip-desc">
						你在第三方DApp上的使用行为将适用该第三方DApp的《用户协议》和《隐私政策》，又{{currentDapp.title}}直接并单独向你承担责任
					</view>
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
		onShow() {
			uni.getSystemInfo({
				success: (res) => {
					this.scrollHeight = res.windowHeight - res.statusBarHeight - 54;
				}
			});
			//页面初始时显示全部数据
			this.showList = this.list;
		},
		data() {
			return {
				keyword: "",
				scrollHeight: 0,
				// 当前点击的dapp数据
				currentDapp: {},
				// 所有数据
				list: [{
						logo: "../../static/image/index/wodeshouyi.png",
						title: "LON",
						desciption: "LON挖矿"
					},
					{
						logo: "../../static/image/index/wodeshouyi.png",
						title: "Snapshot治理",
						desciption: "参与所有DeFi项目的社区治理"
					},
				],
			}
		},
		methods: {
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
				//执行操作

			}
		}
	}
</script>

<style lang="scss" scoped>
	.DApp {
		width: 100%;

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

		.tip-Pop {
			width: 100%;
			height: 680rpx;
			text-align: center;
			padding: 20rpx 10rpx;
			box-sizing: border-box;
			border-radius: 20rpx;
			background-color: #D8D8D8;

			.top-title {
				font-size: 28rpx;
			}

			.tip-content {
				width: 100%;
				background-color: #FFFFFF;
				border-radius: 20rpx;
				text-align: center;
				padding: 50rpx 50rpx 30rpx;
				box-sizing: border-box;

				image {
					width: 80rpx;
					height: 80rpx;
				}

				.act-title {
					margin: 20rpx 0;
					font-size: 30rpx;
					color: #444444;
				}

				.tip-desc {
					font-size: 24rpx;
				}
			}

			.btns {
				margin-top: 20rpx;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;

				view {
					width: 45%;
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
					color: #FFFFFF;
					border-radius: 30rpx;
				}

				.cancell {
					background-color: #00BFFF;
				}

				.confirm-ok {
					background-color: #0000FF;
				}
			}
		}
	}
</style>
