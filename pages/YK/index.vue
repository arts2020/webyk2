<template>
	<view class="yk-index">
		<view class="blank"></view>
		<view class="box" @tap="goAdd">
			<view class="p1">
				<text style="font-size: 28rpx;color: #4C72EF;">已加入</text>
				<image style="width: 19rpx;height: 12rpx;margin-left: 20rpx;" src="../../static/image/index/yk-3.png" mode=""></image></view>
		    <view class="p2">
				<image src="../../static/image/index/yk-1.png" mode=""></image>
			</view>
			<view class="p3">超级联盟</view>
		</view>
		<view class="box" @tap="gocheckReceive">
		    <view class="p2">
				<image src="../../static/image/index/yk-2.png" mode=""></image>
			</view>
			<view class="p3">联盟收益</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			goAdd(){
				this.$openPage({name:"YK-super"})
			},
			gocheckReceive(){
				this.$openPage({name:"YK-receive"})
			}
		}
	}
</script>

<style lang="scss" scoped>
.yk-index{
	width: 100%;
	min-height: 100vh;
	background-color: #4C72EF;
	.blank{
		width: 100%;
		height: 40rpx;
	}
	.box{
		width: calc(100% - 60rpx);
		height: 335rpx;
		padding: 30rpx;
		box-sizing: border-box;
		text-align: center;
		margin: 0 auto;
		margin-bottom:30rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;		
		
		&:nth-child(2){
			.p1{
				text-align: right;
			}
			.p2{
				margin-bottom: 20rpx;
				image{
					width: 239rpx;
					height: 139rpx;
				}
			}
			.p3{
				font-size: 35rpx;
				font-weight: 500;
			}
		}
		&:nth-child(3){
			.p2{
				margin-bottom: 20rpx;
				image{
					width: 226rpx;
					height: 150rpx;
				}
			}
			.p3{
				font-size: 35rpx;
				font-weight: 500;
			}
		}
	}
}
</style>
