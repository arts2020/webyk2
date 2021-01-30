<template>
	<view class="address-list">
		<uni-nav-bar :status="true" :fixed="true" left-icon="back"  title="地址本" right-icon="plusempty" @clickLeft="goBack" @clickRight="goAdd"></uni-nav-bar>
	    <view class="addr-list">
	    	<view class="list-item" v-for="(item,index) in addresssList" :key="index" @click="handleChecked(item)">
	    		<image class="icon" :src="item.logo" mode=""></image>
	    		<view class="addr-info">
	    			<view class="user-N">{{item.name}}</view>
	    			<view class="user_addr">{{item.addr}}</view>
	    	    </view>
	    	</view>
	    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addresssList:[
					{
						logo:"../../../static/image/index/eth.png",
						name:"lisa",
						addr:"djbvduoqnjfsieioqnjddsuweomaknwoqndl bsdhao"
					},
					{
						logo:"../../../static/image/index/btc.png",
						name:"wczx",
						addr:"djbvduoqnjfsieioqnjddsuweomaknwoqndl bsdhao"
					},
				]
			};
		},
		onShow() {
			// let _this = this;
			uni.startPullDownRefresh();
			setTimeout(function () {
				this.dal.Setting.onGetAddressList();
			}.bind(this), 1000);
			//获取高度
			// uni.getSystemInfo({
			// 	success:(res)=>{
			// 		this.scrollHeight = res.windowHeight - res.statusBarHeight - 54;
			// 	}
			// });
		},
		created() {
			this.util.EventUtils.addEventListenerCustom(this.dal.Setting.evtGetAddressList, this.onGetAddressList);
		},
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Setting.evtGetAddressList, this.onGetAddressList);
		},
		methods:{
			goBack(){
				this.util.UiUtils.switchBackPage();
			},
			goAdd(){
				this.$openPage({name:"address-detail"})
			},
			onGetAddressList(data){
				uni.stopPullDownRefresh();
				this.addresssList = data.data;
			}
		}
	}
</script>

<style lang="scss" scoped>
.address-list{
	width: 100%;
	height: 100%;
	min-height: 100vh;
	background-color: #F2F2F2;
	.addr-list{
		width: 100%;
		background-color: #FFFFFF;
		padding: 0 30rpx;
		box-sizing: border-box;
		.list-item{
			width: 100%;
			height: 160rpx;
			display: flex;
			align-items: center;
			.icon{
				width: 90rpx;
				height: 90rpx;
				border-radius: 50%;
				margin-right: 40rpx;
			}
			.addr-info{
				width: calc(100% - 130rpx);
				border-bottom: 2rpx solid #F2F2F2;
				.user-N{
					font-size: 28rpx;
					font-weight: bold;
					color: #444444;
					line-height: 40rpx;
				}
				.user_addr{
					font-size: 26rpx;
					color: #444444;
					line-height: 35rpx;
					display: -webkit-box;    
					-webkit-box-orient: vertical;    
					-webkit-line-clamp: 2;    
					overflow: hidden; 	
				}
			}
		}
	}
}
</style>
