<template>
	<view class="searchPage">
			<bar ref="bar"></bar>
			<view class="search-header">
				<view class="search-frame">
					<uni-icons type="search" class="search-icon" size="20" color="#CCD3D9" @tap="gosearch"></uni-icons>
					<input type="text" placeholder-style="color: #a9b7c4;" placeholder="请输入token名称" v-model="keyword" confirm-type="search" @confirm="gosearch"/>
				</view>
				<text class="cancell-txt" @tap="btnBack">取消</text>
			</view>
			<scroll-view v-if="list.length" scroll-y="true" class="list-content" :style="'height:'+scrollHeight+'px'">
				<view class="title">搜索结果</view>
				<view class="list-item" v-for="(item,index) in list" :key="index" @tap="goCheck(item)">
					<image class="icon" :src="item.logo" mode=""></image>
					<view class="dapp-info">
						<view class="title">{{item.title}}</view>
						<view class="descrip">{{item.desciption}}</view>
					</view>
				</view>
			</scroll-view>
			<view class="hotSearch">
				<view class="title">热搜</view>
				<view class="hot-list">
					<view class="hot-item" v-for="(item,index) in hotList" :key="index" @tap="goCheck(item)">
						<image :src="item.logo" mode=""></image>
						<text>{{item.title}}</text>
					</view>
				</view>
			</view>
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
		name:"searchPage",
		components: {
			Bar
		},
		data() {
			return {
				scrollHeight:0,
				keyword:"",
				// 搜索到的结果列表
				list:[
					
				],
				//热搜列表
				hotList:[
					{
						logo:"../../static/image/index/wodeshouyi.png",
						title:"LON",
						desciption:"LON挖矿"
					},
					{
						logo:"../../static/image/index/wodeshouyi.png",
						title:"Snapshot治理",
						desciption:"参与所有DeFi项目的社区治理"
					},
				],
			    // 当前被点击的dapp
				currentDapp:{}
			};
		},
		onShow() {
				let _this = this;
				//获取高度
				uni.getSystemInfo({
					success(res) {
						_this.scrollHeight = res.windowHeight - res.statusBarHeight -44;
					}
				});
			},
			methods:{
				btnBack:function(){
					this.util.UiUtils.switchToPage("dapp-index", "dapp-search",{},"switchTab");
				},
				goCheck(item){
					// 打开访问说明
					this.currentDapp = item;
					this.$refs.popup.open();
				},
				goSearch(){
                  // 拿关键词keyword进行搜索匹配
				},
				cancell(){
					// 取消访问
					this.$refs.popup.close()
				},
				confirm(){
					// 确认访问
					//关闭弹框
					this.$refs.popup.close()
					//执行操作
					
				}
			}
	}
</script>

<style lang="scss" scoped>
.searchPage{
	width: 100%;
	min-height: 100vh;
	background-color: #fafbff;
	.title{
		font-size: 26rpx;
		color: #8e8e8e;
		margin-bottom: 30rpx;
	}
	.search-header{
		width: 100%;
		height: 88rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		background-color: #fafbff;
		.search-frame{
			width: 85%;
			height: 65rpx;
			border-radius: 30rpx;
			background-color: #FFFFFF;
			margin-right: 20rpx;
			display: flex;
			align-items: center;
			padding: 0 10rpx 0 30rpx;
			box-sizing: border-box;
			.search-icon{
				padding-right: 20rpx;
			}
			uni-input{
				font-size: 26rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
				color: #444444;
			}
		}
		.cancell-txt{
			font-size: 28rpx;
			color: #007AFF;
		}
	}
	.list-content{
		width: 100%;
		background-color: #fafbff;
		.list-item{
			width: 100%;
			height: 121rpx;
			padding: 22rpx 34rpx 16rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			background-color: #FFFFFF;
			border-bottom: 1rpx solid #ebebeb;
			.icon{
				width: 54rpx;
				height: 54rpx;
				margin-right: 22rpx;
			}
			.dapp-info{
				height: 83rpx;
				font-family: PingFang SC, PingFang SC-Bold;
				text-align: left;
				.title{
					font-size: 36rpx;
					font-weight: 600;					
					color: #071328;
					line-height: 20rpx;
				}
				.descrip{
					font-size: 26rpx;
					font-weight: 400;
					color: #8e8e8e;
					line-height: 20rpx;
				}
			}
			.right-arr{
				width: 13rpx;
				height: 24rpx;
				margin-left: auto;
			}
		}
	}
    .hotSearch{
		padding: 0 35rpx;
		box-sizing: border-box;
		.hot-list{
			width: 100%;	
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			align-items: center;
		    .hot-item{
				display: flex;
				align-items: center;
				flex: none;
				width: 48%;
				padding-left: 10rpx;
				box-sizing: border-box;
				height: 90rpx;
				background-color: #FFFFFF;
				image{
					width: 70rpx;
					height: 70rpx;
					margin-right: 30rpx;
				}
		 }
	   }
	}
    .tip-Pop{
    	width: 100%;
    	height: 580rpx;
    	text-align: center;
    	padding: 20rpx 10rpx;
    	box-sizing: border-box;
    	border-radius: 20rpx;
    	background-color: #D8D8D8;
    	.top-title{
    		font-size: 28rpx;
    	}
    	.tip-content{
    		width: 100%;
    		background-color: #FFFFFF;
    		border-radius: 20rpx;
    		text-align: center;
    		padding: 50rpx 50rpx 30rpx;
    		box-sizing: border-box;
    		image{
    			width: 80rpx;
    			height: 80rpx;
    		}
    		.act-title{
    			margin: 20rpx 0;
    			font-size: 30rpx;
    			color: #444444;
    		}
    		.tip-desc{
    			font-size: 24rpx;
    		}
    	}
    	.btns{
    		margin-top: 20rpx;
    		width: 100%;
    		display: flex;
    		align-items: center;
    		justify-content: space-between;
    		view{
    			width: 45%;
    			height: 80rpx;
    			line-height: 80rpx;
    			text-align: center;
    			color: #FFFFFF;
    			border-radius: 30rpx;
    		}
    		.cancell{
    			background-color: #00BFFF;
    		}
    		.confirm-ok{
    			background-color: #0000FF;
    		}
    	}
    }
}
</style>
