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
		width: 500rpx;
		background-color: #efefef;
		border-radius: 20rpx;
		padding-top: 30rpx;
		.title{
			font-size: 26rpx;
			color: #444444;
			font-weight: bold;
			text-align: center;
		}
		.input-box{
			width: 100%;
			uni-input{
				width: 90%;
				height: 60rpx;
				line-height: 60rpx;
				border-radius: 10rpx;
				padding-left: 20rpx;
				box-sizing: border-box;
				background-color: #FFFFFF;
				margin: 10rpx auto 30rpx;
				font-size: 24rpx;
				color: #8e8e8e;
			}
		}
		.btns{
			width: 100%;
			font-size: 26rpx;
			color: #007AFF;
			font-weight: bold;
			text-align: center;
			border-top: 2rpx solid #F2F2F2;
			display: flex;
			align-items: center;
			.cancell{
				width: 50%;
				line-height: 60rpx;
				border-right: 2rpx solid #F2F2F2;
			}
			.ok{
				width: 50%;
				line-height: 60rpx;
			}
		}
	}
}
</style>
