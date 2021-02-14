<template>
	<view class="yk-receive">
		<view class="box-1">
			<text>X3开启等级：6级</text><text>X6开启等级：2级</text>
		</view>
		<view class="box-2">
			<view class="item-box">
				<view class="p1">累计收益</view>
				<view class="p2">600YKC</view>
			</view>
			<view class="line"></view>
			<view class="item-box">
				<view class="p1">今日收益</view>
				<view class="p2">100YKC</view>
			</view>
		</view>
		<view class="list">
			<view class="list-item" v-for="(item,index) in list" :key="index">
				<view class="top-box">
					<image src="../../static/image/index/yk-4.png" mode=""></image>
				    <text>{{item.address}}</text>
				</view>
				<view class="botto-box">
					<view>
						<view class="title">收益</view>
						<view class="value">{{item.receive}}<text style="font-size: 32rpx;">YK</text></view>
					</view>
					<view>
						<view class="title">来源</view>
						<view class="value" style="font-size: 32rpx;">{{item.origin}}</view>
					</view>
					<view>
						<view class="title">日期</view>
						<view class="value" style="font-size: 32rpx;">{{item.time}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[
					{
						address:"sadsfdsggfkjgfgijghdfjgdfjkg",
						receive:"400",
						origin:"X3-3",
						time:"2021.01.07 20:08:07"
					},
					{
						address:"sadsfdsggfkjgfgijghdfjgdfjkg",
						receive:"400",
						origin:"X3-3",
						time:"2021.01.07 20:08:07"
					},
					{
						address:"sadsfdsggfkjgfgijghdfjgdfjkg",
						receive:"400",
						origin:"X3-3",
						time:"2021.01.07 20:08:07"
					},
				]
			};
		}
	}
</script>

<style lang="scss" scoped>
.yk-receive{
	width: 100%;
	min-height: 100vh;
	background-color: #FAFBFF;
	.box-1{
		width: 100%;
		height: 90rpx;
		padding: 0 40rpx;
		box-sizing: border-box;
		line-height: 90rpx;
		font-size: 32rpx;
		font-family: PingFang SC, PingFang SC-Regular;
		font-weight: 400;
		color: #121212;
	}
	.box-2{
		width: calc(100% - 60rpx);
		height: 278rpx;
		background-color: #4C72EF;
		margin: 0 auto;
		border-radius: 20rpx;
		margin-bottom: 50rpx;
		padding: 50rpx 0rpx;
		box-sizing: border-box;
		text-align: center;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.line{
			width: 1rpx;
			height: 46rpx;
			background-color: #FFFFFF;
		}
		.item-box{
			width: 49%;
			.p1{
				font-size: 30rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
			}
			.p2{
				font-size: 46rpx;
				font-family: PingFang SC, PingFang SC-Semibold;
				font-weight: 500;
			}
		}
	}
	.list{
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		.list-item{
			width: 100%;
			height: 213rpx;
			margin-bottom: 22rpx;
			background: #ffffff;
			border-radius: 10rpx;
			box-shadow: 0px 7rpx 27rpx 0px rgba(231,234,242,0.80); 
			.top-box{
				width: 100%;
				padding-left: 17rpx;
				box-sizing: border-box;
				line-height: 72rpx;
				height: 72rpx;
				border-bottom: 1rpx solid #EBEBEB;
				image{
					width: 32rpx;
					height: 34rpx;
					margin-right: 16rpx;
				}
				text{
					font-size: 32rpx;
					font-family: PingFang SC, PingFang SC-Semibold;
					font-weight: 600;
					color: #334779;
				}
			}
			.botto-box{
				display: flex;
				align-items: center;
				width: 100%;
				padding-left: 22rpx;
				box-sizing: border-box;
				>view{
			       width: 25%;
					&:last-child{
						width: 50%;
					}
				}
				.value{
					font-size: 40rpx;
					font-family: PingFang SC, PingFang SC-Medium;
					font-weight: 500;
					color: #292833;
				}
				.title{
					font-size: 28rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					color: #a9b7c4;
				}
			}
		}
	}
}
</style>
