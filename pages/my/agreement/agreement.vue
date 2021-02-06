<template>
	<view class="agreement">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" title="用户协议" @clickLeft="goBack"></uni-nav-bar>
		<view class="aggr-c">
			<view class="aggr-title">YouKey服务协议</view>
			
		</view>
	</view>
</template>

<script>
	import noData from '@/components/no-data/no-data.vue'
	export default {
		name:"agreement",
		components:{
			noData
		},
		onShow() {
			
		},
		data() {
			return {
				content:""
			};
		},
		methods:{
			goBack(){
				this.util.UiUtils.switchBackPage();
			},
			handleAgreement(data){
				this.content = data.data;
			}
		}
	}
</script>

<style lang="scss" scoped>
.agreement{
	width: 100%;
	background-color: #FFFFFF;
	.aggr-c{
		width: 100%;
		padding: 22rpx 30rpx;
		box-sizing: border-box;
		font-size: 30rpx;
		font-family: PingFang SC, PingFang SC-Regular;
		font-weight: 500;
		text-align: left;
		color: #333333;
		.aggr-title{
			font-size: 36rpx;
			font-family: PingFang SC, PingFang SC-Bold;
			font-weight: 700;
			text-align: center;
			color: #111111;
			margin-bottom: 25rpx;
		}
	}
}
</style>
