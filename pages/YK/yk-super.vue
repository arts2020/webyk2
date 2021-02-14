<template>
	<view class="yk-super">
		<view class="title">X3矩阵</view>
		<view class="menus">
			<view class="menu-item" v-for="(item,index) in menuList" :key="index">
				<view class="num">{{item.value}} <text style="font-size: 40rpx;">YK</text></view>
				<view :class="item.status=='开启'?'ongoing':item.status=='待开启'?'willing':'check-recrive'">{{item.status}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				menuList:[
					{
						status:"查看收益",
						value:"100",
					},
					{
						status:"查看收益",
						value:"200",
					},
					{
						status:"查看收益",
						value:"400",
					},
					{
						status:"查看收益",
						value:"800",
					},
					{
						status:"查看收益",
						value:"1600",
					},
					{
						status:"查看收益",
						value:"3200",
					},
					{
						value:"6400",
						status:"开启"
					},
					{
						value:"12800",
						status:"待开启"
					},
				]
			};
		}
	}
</script>

<style lang="scss" scoped>
.yk-super{
	width: 100%;
	min-height: 100vh;
	background-color: #F6F7F9;
	.title{
		font-size: 32rpx;
		font-family: PingFang SC, PingFang SC-Regular;
		font-weight: 400;
		color: #121212;
		width: 100%;
		line-height: 100rpx;
		padding-left: 48rpx;
		box-sizing: border-box;
	}
	.menus{
		width: 100%;
		padding: 0 36rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.menu-item{
			width: 48%;
			height: 220rpx;
			padding: 30rpx 0 27rpx 0;
			box-sizing: border-box;
			background: #ffffff;
			border-radius: 10rpx;
			text-align: center;
			margin-bottom: 25rpx;
			flex: none;
			.num{
				font-size: 66rpx;
				font-family: PingFang SC, PingFang SC-Medium;
				font-weight: 500;
				color: #292833;
			}
			.ongoing{
				width: 126rpx;
				height: 46rpx;
				line-height: 46rpx;
				margin: 0 auto;
				background: #4c72ef;
				border-radius: 8rpx;
				color: #FFFFFF;
				font-size: 26rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
			}
			.willing{
				width: 126rpx;
				height: 46rpx;
				line-height: 46rpx;
				margin: 0 auto;
				background: #FCBD30;
				border-radius: 8rpx;
				color: #FFFFFF;
				font-size: 26rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
			}
			.check-recrive{
				font-size: 26rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
				text-align: center;
				color: #4c72ef;
			}
		}
	}
}
</style>
