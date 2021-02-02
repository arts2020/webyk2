<template>
	<view class="address-detail">
		<uni-nav-bar :statusBar="true" :fixed="true" left-icon="back" title="地址本" @clickLeft="goBack">
			<view slot="right" :style="{'color':coinObj.addrInfo?'#0000FF':'#8e8e8e'}" @tap="goSave">保存</view>
		</uni-nav-bar>
	    <view class="coin" @tap="goChioce">
			<image class="wallet-icon" :src="coinObj.logo" mode=""></image>
			<text>{{coinObj.name}}</text>
			<image class="right-arr" src="../../../static/image/mine/arrow-left.svg" mode=""></image>
		</view>
		<view class="addr_info">
			<view class="title">地址信息</view>
			<view class="addr_description">
				<view class="addr_item">
					<input type="text" placeholder="请输入地址" v-model="coinObj.addrInfo" />
					<uni-icons type="scan" size="30" color="#444444"></uni-icons>
				</view>
				<view class="addr_item">
					<input type="text" placeholder="名称" v-model="coinObj.addrName" />
				</view>
				<view class="addr_item">
					<input type="text" placeholder="描述(选填)" v-model="coinObj.addr_bak" />
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
					chaintype:1,
					name:"ETH",
					addrInfo:"",
					addrName:"",
					addr_bak:""
				},
				
			};
		},
		onLoad(option) {
			let params = JSON.parse(option.query);
			if(Object.keys(params).length!=0){
				this.coinObj=params;
			}
		},
		onShow() {
			
			// let _this = this;
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
			goSave(){
				if(!this.coinObj.addrInfo){
					return;
				}
				if(!this.coinObj.addrName){
					uni.showToast({
						title:"名称不能为空",
						icon:"none"
					})
					return;
				}
				// this.dal.Setting.onSetAddressInfo(this.coinObj);
				setTimeout(()=>{
					this.$openPage({name:"address-list"})
				},1000)
			},
			goChioce(){
				this.$openPage({name:"address-type",query:{name:this.coinObj.chaintype}})
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
