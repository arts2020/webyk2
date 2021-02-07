<template>
	<view class="agreement">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" title="用户协议" @clickLeft="goBack"></uni-nav-bar>
		<view class="aggr-c">
			<rich-text :nodes="content"></rich-text>
		</view>
	</view>
</template>

<script>
	import noData from '@/components/no-data/no-data.vue'
	import agreeAndHelp from '@/static/js/agreeAndHelp.js'
	export default {
		name:"agreement",
		components:{
			noData
		},
		onShow() {
			this.content = agreeAndHelp.my_aggrement;
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
		font-size: 28rpx;
		font-family: PingFang SC, PingFang SC-Regular;
		font-weight: 500;
		text-align: left;
		color: #333333;
	}
}
</style>
