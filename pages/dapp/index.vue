<template>
	<view class="DApp">
		<bar ref="bar"></bar>
		<view class="navBar">
			<view class="nav-search">
				<uni-icons type="search" size="20" color="#CCD3D9" @tap="goSearch"></uni-icons>
				<input type="text" v-model="keyword" confirm-type="search" placeholder="搜索或输入DApp网址" placeholder-class="tipClass" @con="goSearch"/>
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
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	export default {
		name:"DApp",
		components: {
			Bar
		},
		onShow() {
			uni.getSystemInfo({
				success:(res)=>{
					this.scrollHeight = res.windowHeight - res.statusBarHeight -54;
				}
			});
			//页面初始时显示全部数据
			this.showList = this.list;
		},
		data(){
			return{
				keyword:"",
				scrollHeight:0,
				// 所有数据
				list:[
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
				//要在页面上显示的数据
				showList:[]
			}
		},
		methods:{
			goCheck(item){
				
			},
			goSearch(){
				//搜索时显示搜索到的数据
				if(this.keyword){
					this.showList = this.list.filter(el=>el.title.includes(this.keyword))
				}else{
					this.showList = this.list;
				}
				console.log(this.showList)
			}
		}
	}
</script>

<style lang="scss" scoped>
.DApp{
	width: 100%;
	
	.navBar{
		width: 100%;
		height: 88rpx;
		opacity: 1;
		background: #fafbff;
		box-shadow: 0px 3rpx 10rpx 0px rgba(0,0,0,0.06); 
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #FAFBFF;
		margin-bottom: 10rpx;
		.nav-search{
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
			uni-input{
				margin-left: 10rpx;
				font-size: 26rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 500;
				color: #444444;
			}
			.tipClass{
				font-size: 26rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
				color: #a9b7c4;
				line-height: 35rpx;
			}
		}
	}
	
    .list-content{
		width: 100%;
		padding: 0 35rpx 0 25rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		.list-item{
			width: 100%;
			height: 155rpx;
			display: flex;
			align-items: center;
			border-bottom: 1rpx solid #ebebeb;
			.icon{
				width: 90rpx;
				height: 90rpx;
				border-radius: 10rpx;
				margin-right: 30rpx;
			}
			.dapp-info{
				font-family: PingFang SC, PingFang SC-Bold;
				text-align: left;
				.title{
					font-size: 32rpx;
					font-weight: 700;					
					color: #121212;
				}
				.descrip{
					font-size: 28rpx;
					font-weight: 400;
					color: #989898;
				}
			}
			.right-arr{
				width: 13rpx;
				height: 24rpx;
				margin-left: auto;
			}
		}
	}
}
</style>
