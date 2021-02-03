<template>
	<view class="add-asset">
		<bar ref="bar"></bar>
		<view class="search-header">
			<view class="search-frame">
				<uni-icons type="search" class="search-icon" size="20" color="#CCD3D9" @tap="gosearch"></uni-icons>
				<input type="text" placeholder-style="color: #a9b7c4;" placeholder="请输入token名称" v-model="keyword" confirm-type="search" @confirm="gosearch"/>
			</view>
			<text class="cancell-txt" @tap="btnBack">取消</text>
		</view>
		<scroll-view scroll-y="true" class="list-content" :style="'height:'+scrollHeight+'px'">
			<view class="list-item" v-for="(item,index) in showList" :key="index" @tap="goAdd(item)">
				<image class="icon" :src="item.logo" mode=""></image>
				<view class="dapp-info">
					<view class="title">{{item.title}}</view>
					<view class="descrip">{{item.desciption}}</view>
				</view>
				<image class="right-icon" src="../../static/image/index/plus.png" mode=""></image>
			</view>
		</scroll-view>
		
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
				// 全部资产的列表
				list:[
					{
						logo:"../../static/image/index/btc.png",
						title:"LON",
						desciption:"LON挖矿"
					},
					{
						logo:"../../static/image/index/btc.png",
						title:"Snapshot治理",
						desciption:"参与所有DeFi项目的社区治理"
					},
				], 
				
			};
		},
		computed:{
			showList(){
				if(this.keyword){
					//有搜索词时根据搜索词匹配
					return this.list.filter(el=>el.title.includes(this.keyword))
				}else{
					return this.list;
				}
			}
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
					this.util.UiUtils.switchToPage("wallet-index", "add-asset",{},"switchTab");
				},
				
				goSearch(){
                  // 拿关键词keyword进行搜索匹配
				},
				goAdd(item){
					// 添加资产
					
					//完成时跳转到首页
					this.util.UiUtils.switchToPage("wallet-index", "add-asset",{},"switchTab");
				},
			}
	}
</script>

<style lang="scss" scoped>
.add-asset{
	width: 100%;
	min-height: 100vh;
	background-color: #fafbff;
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
			padding: 22rpx 42rpx 16rpx 34rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			background-color: #FFFFFF;
			border-bottom: 1rpx solid #E7E6ED;
			.icon{
				width: 54rpx;
				height: 54rpx;
				margin-right: 22rpx;
			}
			.dapp-info{
				font-family: PingFang SC, PingFang SC-Bold;
				text-align: left;
				
				.title{
					font-size: 36rpx;
					font-weight: 600;					
					color: #071328;
					line-height: 41rpx;
				}
				.descrip{
					font-size: 26rpx;
					font-weight: 400;
					color: #8e8e8e;
					line-height: 41rpx;
				}
			}
			.right-icon{
				width: 38rpx;
				height: 38rpx;
				margin-left: auto;
			}
		}
	}
	
}
</style>
