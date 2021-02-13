<template>
	<view class="market-search">
		<bar ref="bar"></bar>
		<view class="search-header">
			<view class="search-frame">
				<uni-icons type="search" class="search-icon" size="20" color="#CCD3D9" @tap="gosearch"></uni-icons>
				<input type="text" :placeholder="dapp_search_placeholder" v-model="keyword" confirm-type="search" @confirm="gosearch" placeholder-style="color: #a9b7c4;"/>
			</view>
			<text class="cancell-txt" @tap="btnBack">{{btnstring_cancle}}</text>
		</view>
		<view class="serach-content">
			<view class="content-list" v-if="hasData">
				<view class="list-item" v-for="(item,index) in coinList" :key="index">
					<view class="left_info">
						<view>{{item.name}}</view>
						<view>全网</view>
					</view>
					<view class="right_info">
						<text>￥{{item.price}}</text>
						<image v-if="item.isStar" src="../../../static/image/index/plus.png" mode="" @tap="addStar(item)"></image>
						<image v-else src="../../../static/image/index/plus-default.png" mode=""></image>
					</view>
				</view>
			</view>
			<noData v-else/>
		</view>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	import noData from '@/components/no-data/no-data.vue';
	export default {
		components: {
			Bar,
			noData
		},
		data() {
			return {
				scrollHeight:'',
				keyword:'',
				hasData:true,
				coinList:[
					{
						name:"BTC",
						price:"201.23",
						isStar:false
					},
					{
						name:"BTMX",
						price:"201.23",
						isStar:false
					},
					{
						name:"BTG",
						price:"201.23",
						isStar:false
					},
				]
			};
		},
        onLoad() {
        	this.initword()
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
			initword(){
			    this.dapp_search_placeholder = this.getLocalStr("dapp_search_placeholder");
			    this.btnstring_cancle = this.getLocalStr("btnstring_cancle");
			},
			btnBack:function(){
				this.util.UiUtils.switchBackPage();
			},
			gosearch(){
			},
			onGoSearch(data){
				this.coinList = data.data;
			},
			addStar(item){
			},
			onAddCollect(data){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
.market-search{
	min-height: calc(100vh);
	height: 100%;
	width: 100%;
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
    .serach-content{
		width: 100%;
		background-color: #FFFFFF;
		padding: 0 42rpx 0 34rpx;
		box-sizing: border-box;
		.list-item{
			width: 100%;
			height: 120rpx;
			border-bottom: 2rpx solid #F2F2F2;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.left_info{
				view:first-child{
					font-size: 36rpx;
					font-family: PingFang SC, PingFang SC-Semibold;
					font-weight: 600;
					color: #071328;
				}
				view:nth-child(2){
					font-size: 30rpx;
					color: #8e8e8e;
				}
			}
			.right_info{
				display: flex;
				align-items: center;
				text{
					font-size: 30rpx;
					font-family: PingFang SC, PingFang SC-Semibold;
					font-weight: 600;
					color: #071328;
				}
				image{
					width: 40rpx;
					height: 40rpx;
					margin-left: 30rpx;
				}
			}
		}
	}
}
</style>
