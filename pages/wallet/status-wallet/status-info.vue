<template>
	<view class="status-info">
		<uni-nav-bar :statusBar="true" :fixed="true" left-icon="back" title="身份信息" @clickLeft="goBack"></uni-nav-bar>
	     <view class="identityID">
			 <view class="p1">身份ID</view>
			 <view class="p2">{{statusInfo.identityId}}</view>
		 </view>
		 <view class="statusName" @tap="goChange">
			 <text>身份名</text>
			 <text>{{statusInfo.name}}</text>
			 <image src="../../../static/image/index/arrow-left.png" mode=""></image>
		 </view>
		 <uni-popup type="center" ref="pasdPop" class="pasdTip">
		 	<view class="main-content">
		 		<view class="title">修改身份名</view>
		 		<view class="input-box">
		 			<input type="text" :placeholder="oldStatusName" v-model="newStatusName" />
		 		</view>
		 		<view class="btns">
		 			<view class="cancell" @click="cancell">取消</view>
		 			<view class="ok" @click="confirmOk">确定</view>
		 		</view>
		 	</view>
		 </uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusInfo:{
					identityId:'ashdgy1234bhsgyauyeibsja794a8sadc5sd',
					name:"identityluke"
				},
				oldStatusName:"",
				newStatusName:""
			};
		},
		methods:{
			goBack(){
				this.util.UiUtils.switchBackPage();
			},
			goChange(){
				this.oldStatusName = this.statusInfo.name;
				this.$refs.pasdPop.open()
			},
			confirmOk(){
				//修改身份名并关闭弹框
				if(!this.newStatusName){
					this.util.UiUtils.showToast('身份名不能为空')
					return;
				}
                //执行修改
				this.newStatusName="";
				this.$refs.pasdPop.close()
			},
			cancell(){
				this.newStatusName="";
				this.$refs.pasdPop.close()
			}
		}
	}
</script>

<style lang="scss" scoped>
.status-info{
	width: 100%;
	min-height: 100vh;
	background-color: #F2F2F2;
	.identityID{
		width: 100%;
		// height: 150rpx;
		padding: 20rpx 35rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		margin-top: 30rpx;
	}
	.statusName{
		width: 100%;
		// height: 150rpx;
		padding: 20rpx 35rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		margin-top: 60rpx;
		display: flex;
		align-items: center;
		text:nth-child(2){
			margin-left: auto;
		}
		image{
			width: 30rpx;
			height: 30rpx;
			margin-left: 30rpx;
		}
	}
	.main-content{
		width: 569rpx;
		height: 320rpx;
		background: #ffffff;
		border: 1rpx solid #707070;
		border-radius: 21rpx;
		padding-top: 26rpx;
		box-sizing: border-box;
		.title{
			font-size: 30rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			color: #071328;
			text-align: center;
			font-weight: bold;
		}
		.input-box{
			width: 505rpx;
			height: 77rpx;	
			background: #f6f5f8;
			margin: 42rpx auto 49rpx;
			uni-input{
				width: 100%;
				height: 77rpx;
				line-height: 77rpx;
				border-radius: 10rpx;
				padding-left: 20rpx;
				box-sizing: border-box;
				background: #f6f5f8;
				font-size: 30rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
				color: #c2c2c2;
			}
		}
		.btns{
			width: 100%;
			font-size: 26rpx;
			color: #007AFF;
			font-weight: bold;
			text-align: center;
			border-top: 1rpx solid #E7E6ED;
			display: flex;
			align-items: center;
			font-size: 30rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			.cancell{
				color: #C2C2C2;
				width: 50%;
				line-height: 60rpx;
				border-right: 1rpx solid #E5E5E5;
			}
			.ok{
				color: #4C72EF;
				width: 50%;
				line-height: 60rpx;
			}
		}
	}
}
</style>
