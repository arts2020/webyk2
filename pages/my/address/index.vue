<template>
	<view class="address-list">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back"  title="地址本" @clickLeft="goBack">
			<view class="add-txt" slot="right" @tap="goAdd">增加</view>
		</uni-nav-bar>
	    <view class="addr-list">
	    	<view class="list-item" v-for="(item,index) in addresssList" :key="index" @click="handleChecked(item)">
	    		<image class="icon" :src="item.logo" mode=""></image>
	    		<view class="addr-info">
	    			<view class="user-N">{{item.addrName}}</view>
	    			<view class="user_addr">{{item.addrInfo}}</view>
					<view class="bak">{{item.bak}}</view>
	    	    </view>
	    	</view>
	    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 列表页点击返回方向,1返回转账界面,2去到地址详情页
				backType:2,
				addresssList:[
					{
						logo:"../../../static/image/index/eth.png",
						chaintype:1,
						name:"ETH",
						addrName:"lisa",
						addrInfo:"djbvduoqnjfsieioqnjddsuweomaknwoqndl bsdhao",
						bak:"备注信息"
					},
					{
						logo:"../../../static/image/index/btc.png",
						chaintype:2,
						name:"BTC",
						addrName:"wczx",
						addrInfo:"djbvduoqnjfsieioqnjddsuweomaknwoqndl bsdhao",
						bak:"备注信息"
					},
				]
			};
		},
		onLoad(option) {
			if(option.query){
				let params = JSON.parse(option.query);
				this.backType  = params.type || 2;
			}
		},
		onShow() {
			// let _this = this;
			uni.startPullDownRefresh();
			setTimeout(function () {
				// this.dal.Setting.onGetAddressList();
				uni.stopPullDownRefresh()
			}.bind(this), 1000);
			//获取高度
			// uni.getSystemInfo({
			// 	success:(res)=>{
			// 		this.scrollHeight = res.windowHeight - res.statusBarHeight - 54;
			// 	}
			// });
		},
		methods:{
			goBack(){
				this.util.UiUtils.switchBackPage();
			},
			goAdd(){
				this.$openPage({name:"address-detail"})
			},
			handleChecked(item){
				// 1返回转账界面,2去到地址详情页
				if(this.backType==1){
					// 跳到转账页面  转账页有之前页面传过来的参数  
					this.goBack();
				}else if(this.backType==2){
					this.$openPage({name:"address-detail",query:item})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.address-list{
	width: 100%;
	height: 100%;
	min-height: 100vh;
	background-color: #FFFFFF;
	.add-txt{
		font-size: 30rpx;
		font-family: PingFang SC, PingFang SC-Bold;
		font-weight: 700;
		color: #4c72ef;
	}
	.addr-list{
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		.list-item{
			width: 100%;
			height: 221rpx;
			display: flex;
			align-items: center;
			border-bottom:1rpx solid #ebebeb;
			.icon{
				width: 67rpx;
				height: 67rpx;
				border-radius: 50%;
				margin-right: 21rpx;
			}
			.addr-info{
				width: calc(100% - 143rpx);
				.user-N{
					font-size: 34rpx;
					font-family: PingFang SC, PingFang SC-Semibold;
					font-weight: 600;
					color: #121212;
					line-height: 48rpx;
				}
				.user_addr{
					font-size: 30rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 500;
					color: #121212;
					display: -webkit-box;    
					-webkit-box-orient: vertical;    
					-webkit-line-clamp: 2;    
					overflow: hidden; 
					line-height: 42rpx;
				}
				.bak{
					font-size: 26rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					color: #7c7c7c;
					line-height: 42rpx;
				}
			}
		}
	}
}
</style>
