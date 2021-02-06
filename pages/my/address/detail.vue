<template>
	<view class="address-detail">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" title="地址本" @clickLeft="goBack">
			<view slot="right" :style="{'color':coinObj.addrInfo?'#4C72EF':'#8e8e8e'}" @tap="goSave">保存</view>
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
					<input type="text" placeholder="请输入地址" placeholder-class="tipClass" v-model="coinObj.addrInfo" />
					<uni-icons type="scan" size="20" color="#000000"></uni-icons>
				</view>
				<view class="addr_item">
					<input type="text" placeholder="名称" placeholder-class="tipClass" v-model="coinObj.addrName" />
				</view>
				<view class="addr_item">
					<input type="text" placeholder="描述(选填)" placeholder-class="tipClass" v-model="coinObj.addr_bak" />
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
				this.$openPage({name:"address-type",query:{chaintype:this.coinObj.chaintype}})
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
	background-color: #FAFBFF;
	/deep/ .uni-navbar--border{
		border: 0;
	}
	.coin{
		margin: 22rpx auto 26rpx;
		padding: 0 17rpx;
		box-sizing: border-box;
		border-radius: 10rpx;
		background-color: #FFFFFF;
		width: calc(100% - 72rpx);
		height: 104rpx;
		display: flex;
		align-items: center;
		.wallet-icon{
			width: 67rpx;
			height: 67rpx;
			margin-right: 22rpx;
		}
		.right-arr{
			width: 13rpx;
			height: 24rpx;
			margin-left: auto;
		}
	}
    .addr_info{
		width: 100%;
		.title{
			font-size: 26rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 500;
			color: #121212;
			margin-bottom: 22rpx;
			padding-left: 56rpx;
			box-sizing: border-box;
		}
		.addr_description{
			margin: 0 auto;
			width: calc(100% - 72rpx);
			height: 324rpx;
			border-radius: 10rpx;
			background-color: #FFFFFF;
			.addr_item{
				width: 100%;
				height: 108rpx;
				border-bottom: 1rpx solid #ebebeb;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 30rpx 0 32rpx;
				box-sizing: border-box;
				uni-input{
					width: 80%;
					font-size: 26rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					color: #121212;
				}
				.tipClass{
					font-size: 26rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					color: #c2c2c2;
				}
			}
		}
	}
}
</style>
