<template>
	<view class="record-detail">
		<uni-nav-bar backgroundColor="#F6F7F9" :statusBar="true" :fixed="true" left-icon="back" title="详情" @clickLeft="goBack"></uni-nav-bar>
	    <view class="banner" v-if="!isFailed">
			<image src="../../../static/image/index/success.png" mode=""></image>
		    <view class="status">成功！</view>
			<view class="time">2021年1月30日  11:24</view>
		</view>
		<view class="banner" v-else>
			<image src="../../../static/image/index/failed.png" mode=""></image>
		    <view class="status">失败！</view>
			<view class="time">2021年1月30日  11:24</view>
		</view>
		<view class="box-1">
			<text>金额</text>
			<text>+100 &nbsp;USDT</text>
		</view>
		<view class="box-2">
			<view class="p1">
				<text>矿工费</text>
				<view class="right-box">
					<view>0.0060013079ETH</view>
					<view>GasPrice(107.00GWEI)*Gas(56,197)</view>
				</view>
			</view>
			<view class="p2">
				<view class="addr-item">
					<text>收款地址</text>
					<view>uwefgshfajhgfsdfasgfdsfdgdfwefsgsgdsgsdg</view>
				</view>
				<view class="addr-item">
					<text>付款地址</text>
					<view>uwefgshfajhgfsdfasgfdsfdgdfwefsgsgdsgsdg</view>
				</view>
			</view>
		</view>
		<view class="box-3">
			<text>交易号</text>
			<view>uwefgshfajhgfsdfasgfdsfdgdfwefsgsgdsgsdg</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isFailed:false,
				//交易信息
				recordInfo:{
					
				}
			};
		},
		onLoad(option) {
			let params = JSON.parse(option.query)
			if(Object.keys(params).length!=0){
				this.recordInfo = params;
			}
		},
		methods:{
			goBack(){
				this.util.UiUtils.switchBackPage();
			},
		}
	}
</script>

<style lang="scss" scoped>
.record-detail{
	width: 100%;
	min-height: 100vh;
	background-color: #F6F7F9;
	/deep/ .uni-navbar--border{
		border: 0;
	}
	.banner{
		text-align: center;
		margin-bottom: 47rpx;
		image{
			width: 245rpx;
			height: 240rpx;
			margin: 24rpx 0 14rpx;
		}
		.status{
			font-size: 40rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			color: #020526;
			margin-bottom: 14rpx;
		}
		.time{
			font-size: 26rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			color: #7c7c7c;
		}
	}
    .box-1{
		width: calc(100% - 72rpx);
		height: 104rpx;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 29rpx 30rpx 32rpx;
		box-sizing: border-box;
		font-size: 30rpx;
		font-family: PingFang SC, PingFang SC-Regular;
		font-weight: 400;
		color: #020526;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		text:last-child{
			font-size: 32rpx;
			font-weight: 600;
		}
	}
	
	.box-2{
		width: calc(100% - 72rpx);
		margin: 25rpx auto;
		
		background-color: #FFFFFF;
		border-radius: 10rpx;
		.p1{
			padding: 0 27rpx 0 32rpx;
			box-sizing: border-box;
			width: 100%;
			height: 140rpx;
			border-bottom: 1rpx solid #e7e6ed;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 30rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			color: #020526;
			.right-box{
				width: 80%;				
				view{
					text-align: right;
					font-size: 32rpx;
					font-family: PingFang SC, PingFang SC-Semibold;
					font-weight: 600;
					color: #020526;
				}
				view:last-child{
					font-size: 26rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					color: #7c7c7c;
				}
			}
		}
		.p2{
			padding: 0 27rpx 0 32rpx;
			box-sizing: border-box;
			width: 100%;
			font-size: 30rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			color: #020526;
			.addr-item{
				display: flex;
				justify-content: space-between;
				padding: 25rpx 0;
				text{
					font-size: 30rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					color: #020526;
				}
				view{
					text-align: right;
					width: 70%;
					word-break: break-all;
				}
			}
		}
	}
	.box-3{
		width: calc(100% - 72rpx);
		margin: 0 auto;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 25rpx 0;
		background-color: #FFFFFF;
		text{
			font-size: 30rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			color: #020526;
			padding-left: 32rpx;
		}
		view{
			text-align: right;
			width: 70%;
			word-break: break-all;
			margin-right: 27rpx;
		}
	}
}
</style>
