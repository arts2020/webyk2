<template>
	<view class="searchPage">
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
		<scroll-view v-if="list.length" scroll-y="true" class="list-content" :style="'height:'+scrollHeight+'px'">
			<view class="title">搜索结果</view>
			<view class="list-item" v-for="(item,index) in list" :key="index" @tap="goCheck(item)">
				<image class="icon" :src="item.icon" mode=""></image>
				<view class="dapp-info">
					<view class="dapp-title">{{item.name}}</view>
					<view class="descrip">{{item.community}}</view>
				</view>
			</view>
		</scroll-view>
		<view class="hotSearch">
			<view class="title">热搜</view>
			<view class="hot-list">
				<view class="hot-item" v-for="(item,index) in hotList" :key="index" @tap="goCheck(item)">
					<image :src="item.icon" mode=""></image>
					<text>{{item.name}}</text>
				</view>
			</view>
		</view>
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
		name: "searchPage",
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
				scrollHeight: 0,
				keyword: "",
				// 搜索到的结果列表
				list: [
                   
				],
				//热搜列表
				hotList: [
					{
						icon: "../../static/image/index/wodeshouyi.png",
						name: "LON",
						community: "LON挖矿"
					},
					{
						icon: "../../static/image/index/wodeshouyi.png",
						name: "Snapshot治理",
						community: "参与所有DeFi项目的社区治理"
					},
					{
						icon: "../../static/image/index/wodeshouyi.png",
						name: "Snapshot治理",
						community: "参与所有DeFi项目的社区治理"
					},
				],
				// 当前被点击的dapp
				currentDapp: {}
			};
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
			clear(){
				this.keyword = "";
				this.list = []
			},
			btnBack: function() {
				this.util.UiUtils.switchToPage("dapp-index", "dapp-search", {}, "switchTab");
			},
			goCheck(item) {
				// 打开访问说明
				this.currentDapp = item;
				this.$refs.popup.open();
			},
			goSearch() {
				// 拿关键词keyword进行搜索匹配
				this.dal.Dapp.onGetDapps()
			},
			onGetDappList(data){
				data.data.forEach(el=>{
					if(!el.icon){
						el.icon = '../../static/image/chain/default.png'
					}
				})
				this.list = data.data;
			},
			cancell() {
				// 取消访问
				this.$refs.popup.close()
			},
			confirm() {
				// 确认访问
				//关闭弹框
				this.$refs.popup.close()
				//执行操作

			}
		}
	}
</script>

<style lang="scss" scoped>
	.searchPage {
		width: 100%;
		min-height: 100vh;
		background-color: #FFFFFF;

		.title {
			font-size: 28rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 600;
			color: #121212;
			margin-bottom: 15rpx;
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
			padding: 32rpx 34rpx;
			box-sizing: border-box;
			.list-item {
				width: 100%;
				height: 121rpx;
				display: flex;
				align-items: center;
				border-bottom: 1rpx solid #ebebeb;

				.icon {
					width: 54rpx;
					height: 54rpx;
					margin-right: 22rpx;
				}

				.dapp-info {
					height: 83rpx;
					font-family: PingFang SC, PingFang SC-Bold;
					text-align: left;

					.dapp-title {
						font-size: 36rpx;
						font-weight: 600;
						color: #071328;
						line-height: 45rpx;
					}

					.descrip {
						font-size: 26rpx;
						font-weight: 400;
						color: #8e8e8e;
						line-height: 35rpx;
					}
				}

				.right-arr {
					width: 13rpx;
					height: 24rpx;
					margin-left: auto;
				}
			}
		}

		.hotSearch {
			width: 100%;
			padding: 32rpx 34rpx;
			box-sizing: border-box;
			.hot-list {
				width: 100%;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				align-items: center;
				.hot-item {
					display: flex;
					align-items: center;
					flex: none;
					width: 48%;
					box-sizing: border-box;
					height: 81rpx;
                    margin-bottom: 23rpx;
					image {
						width: 81rpx;
						height: 81rpx;
						margin-right: 25rpx;
					}
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
