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
			<view class="list-item"@tap="goCheck(-1)">
				<image class="icon" src="../../static/image/icons/1024x1024.png" mode=""></image>
				<view class="dapp-info">
					<view class="title">YK联盟</view>
					<view class="descrip">YK联盟</view>
				</view>
				<image class="right-arr" src="../../static/image/index/arrow-left.png" mode=""></image>
			</view>
			<view class="list-item" v-for="(item,index) in list" :key="index" @tap="goCheck(item)">
				<image class="icon" :src="item.icon" mode=""></image>
				<view class="dapp-info">
					<view class="title">{{item.name}}</view>
					<view class="descrip">{{item.short_desc}}</view>
				</view>
				<image class="right-arr" src="../../static/image/index/arrow-left.png" mode=""></image>
			</view>
		</scroll-view>
		<uni-popup type="bottom" ref="popup">
			<view class="tip-Pop">
				<view class="top-title">{{dapp_tip_title}}</view>
				<view class="tip-content">{{dapp_tip_content}}
				</view>
				<view class="btns">
					<view class="cancell" @tap="cancell">{{btnstring_logout}}</view>
					<view class="confirm-ok" @tap="confirm">{{btn_confirms}}</view>
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
			this.util.EventUtils.addEventListenerCustom(this.dal.Setting.evtGetLanguage, this.initWord);
			this.util.EventUtils.addEventListenerCustom(this.dal.Dapp.evtGetDappList, this.onGetDappList);
		},
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Setting.evtGetLanguage, this.initWord);
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
		onLoad() {
			this.onRefersh();
			
			this.initWord()
		},
		onShow() {
			uni.getSystemInfo({
				success: (res) => {
					this.scrollHeight = res.windowHeight - res.statusBarHeight - 54;
				}
			});
			this.initWord();
			
		},
		onPullDownRefresh() {
			this.onRefersh();
		},
		methods: {
			initWord(){
				//获取所有中文文字
				this.btn_confirms = this.getLocalStr("btnstring_confirm");
				this.btnstring_logout = this.getLocalStr("btnstring_logout");
				this.dapp_tip_title = this.getLocalStr("dapp_tip_title");
				this.dapp_tip_content = this.getLocalStr("dapp_tip_content");
				
			},
			onRefersh(){
				this.list = [];
				this.currentDapp = {};
				//获取列表数据
				uni.startPullDownRefresh()
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
				if(this.currentDapp==-1){
					this.$openPage({name:"YK-index"})
					this.$refs.popup.close()
					return;
				}
				// 确认访问
				this.$openPage({
					name: "webui-webview",
					query: {
						// url: "http://192.168.2.44:8081/",//this.currentDapp.app_url,
						// url: "http://192.168.3.30:8082/",  
						// url: "https://consenlabs.github.io/dapp-sdk-doc/index.html",//t
						url: this.currentDapp.app_url,
						title: this.currentDapp.name,
						bgcolor:this.currentDapp.color
					}
				})
				//关闭弹框
				this.$refs.popup.close()

			},
			onGetDappList(data){
				uni.stopPullDownRefresh()
				data.data.forEach(el=>{
					if(!el.icon){
						el.icon = '../../static/image/chain/default.png'
					}
				})
				this.list = data.data;
				console.log('===================================',this.list)
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
