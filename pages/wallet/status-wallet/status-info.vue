<template>
	<view class="status-info">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" :title="walllet_status_title" @clickLeft="goBack"></uni-nav-bar>
	    <!-- <view class="identityID">
			 <view class="p1">{{walllet_status_ID}}</view>
			 <view class="p2">{{statusInfo.identityId}}</view>
		 </view> -->
		 <view class="statusName" @tap="goChange">
			 <text>{{walllet_status_name}}</text>
			 <text>{{statusInfo.name}}</text>
			 <image src="../../../static/image/index/arrow-left.png" mode=""></image>
		 </view>
		 <uni-popup type="center" ref="pasdPop" class="pasdTip">
		 	<view class="main-content">
		 		<view class="title">{{walllet_status_name_update}}</view>
		 		<view class="input-box">
		 			<input type="text" :placeholder="oldStatusName" v-model="newStatusName" />
		 		</view>
		 		<view class="btns">
		 			<view class="cancell" @click="cancell">{{btnstring_cancle}}</view>
		 			<view class="ok" @click="confirmOk">{{btnstring_confirm}}</view>
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
					name:""
				},
				oldStatusName:"",
				newStatusName:""
			};
		},
		onLoad(option) {
			
			this.initword()
			this.statusInfo = this.dal.MainWallet.getMainInfo();
		},
		methods:{
			initword(){
				this.btnstring_cancle = this.getLocalStr("btnstring_cancle");
				this.btnstring_confirm = this.getLocalStr("btnstring_confirm");
				this.walllet_status_name_update = this.getLocalStr("walllet_status_name_update");
				this.walllet_status_name = this.getLocalStr("walllet_status_name");
				this.walllet_status_ID = this.getLocalStr("walllet_status_ID");
				this.walllet_status_title = this.getLocalStr("walllet_status_title");
				this.err_tip_str12 = this.getLocalStr("err_tip_str12")
			},
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
					this.util.UiUtils.showToast(this.err_tip_str12)
					return;
				}
				this.statusInfo.name = this.newStatusName;
				this.dal.MainWallet.setMainInfo(this.statusInfo)
				
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
	background-color: #FAFBFF;
	.identityID{
		width: 100%;
		height: 160rpx;
		padding: 30rpx 43rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		margin: 16rpx 0 24rpx;
		font-family: PingFang SC, PingFang SC-Regular;
		.p1{
			font-size: 34rpx;	
			font-weight: 600;
			color: #121212;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.p2{
			font-size: 30rpx;
			font-weight: 400;
			color: #999999;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	.statusName{
		width: 100%;
		height: 106rpx;
		padding: 30rpx 34rpx 30rpx 43rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		font-size: 34rpx;
		font-weight: 600;
		color: #121212;
		font-family: PingFang SC, PingFang SC-Regular;
		text:nth-child(2){
			margin-left: auto;
			font-size: 30rpx;
			font-weight: 400;
			color: #999999;
		}
		image{
			width: 13rpx;
			height: 24rpx;
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
