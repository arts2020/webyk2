<template>
	<view class="address-detail">
		<uni-nav-bar :status="true" :fixed="true" left-icon="back" title="地址本" @clickLeft="goBack">
			<view slot="right" :style="{'color':address?'#0000FF':'#8e8e8e'}" @tap="goSave">保存</view>
		</uni-nav-bar>
	    <view class="coin" @tap="goChioce">
			<image class="wallet-icon" :src="coinObj.logo" mode=""></image>
			<text>{{coinObj.short_name}}</text>
			<image class="right-arr" src="../../../static/image/mine/arrow-left.svg" mode=""></image>
		</view>
		<view class="addr_info">
			<view class="title">地址信息</view>
			<view class="addr_description">
				<view class="addr_item">
					<input type="text" placeholder="请输入地址" v-model="address" />
					<uni-icons type="scan" size="30" color="#444444"></uni-icons>
				</view>
				<view class="addr_item">
					<input type="text" placeholder="名称" v-model="addr_name" />
				</view>
				<view class="addr_item">
					<input type="text" placeholder="描述(选填)" v-model="addr_desc" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				coinObj:{
					logo:'../../../static/image/index/btc.png',
					short_name:"ETH"
				},
				address:"",
				addr_name:"",
				addr_desc:""
			};
		},
		onLoad(option) {
			if(option.query){
				this.coinObj=JSON.parse(option.query)
			}
		},
		onShow() {
			// let _this = this;
			uni.startPullDownRefresh();
			//获取高度
			// uni.getSystemInfo({
			// 	success:(res)=>{
			// 		this.scrollHeight = res.windowHeight - res.statusBarHeight - 54;
			// 	}
			// });
		},
		created() {
			this.util.EventUtils.addEventListenerCustom(this.dal.Setting.evtSaveAddress, this.onSetAddress);
		},
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Setting.evtSaveAddress, this.onSetAddress);
		},		
		methods:{
			goBack(){
				this.util.UiUtils.switchBackPage();
			},
			goSave(){
				if(!this.address){
					return;
				}
				if(!this.addr_name){
					uni.showToast({
						title:"名称不能为空",
						icon:"none"
					})
					return;
				}
				this.dal.Setting.onSetAddressInfo({
					address:this.address,
					addr_desc:this.addr_desc,
					addr_name:this.addr_name
				});
			},
			goChioce(){
				this.$openPage({name:"address-type",gotype:"redirectTo",query:{short_name:this.coinObj.short_name}})
			},
			onSetAddress(data){
				vue.util.UiUtils.showToast(data.msg);
			}
		}
	}
</script>

<style lang="scss" scoped>
.address-detail{
	min-height: 100vh;
	height: 100%;
	width: 100%;
	background-color: #F2F2F2;
	// /deep/ .uni-nav-bar-text{
	// 	color: #444444;
	// }
	.coin{
		margin: 0 10rpx;
		margin-top: 40rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		border-radius: 20rpx;
		background-color: #FFFFFF;
		width: calc(100% - 20rpx);
		height: 100rpx;
		display: flex;
		align-items: center;
		.wallet-icon{
			width: 48rpx;
			height: 48rpx;
			margin-right: 16rpx;
		}
		.right-arr{
			width: 32rpx;
			height: 20rpx;
			margin-left: auto;
		}
	}
    .addr_info{
		margin: 60rpx 10rpx;
		width: calc(100% - 20rpx);
		.title{
			font-size: 28rpx;
			font-weight: bold;
			color: #444444;
			margin-bottom: 30rpx;
		}
		.addr_description{
			width: 100%;
			background-color: #FFFFFF;
			border-radius: 20rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			.addr_item{
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 100rpx;
				border-bottom: 2rpx solid #F2F2F2;
				uni-input{
					width: 80%;
					font-size: 28rpx;
					color: #8e8e8e;
				}
			}
		}
	}
}
</style>
