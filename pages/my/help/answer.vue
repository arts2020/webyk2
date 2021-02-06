<template>
	<view class="answer">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" title="帮助中心" @clickLeft="btnBack"></uni-nav-bar>
	    <view class="aggr-c">
	    	<rich-text :nodes="contentObj.content"></rich-text>
	    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//['快速入门','初阶教程','钱包管理','备份&恢复','代币管理','转账收款'],
				contentObj:""
			};
		},
		onLoad(option) {
			let params = JSON.parse(option.query);
			if(Object.keys(params).length!=0){
				this.initContent(params.index,params.type);
			}
		},
		methods:{
			btnBack(){
				this.$openPage({name: "help-help",gotype:"redirectTo",query: {}})
			},
			initContent(index,type){
				index = parseInt(index);
				let list = [];
				if(type==2){
					list = uni.getLocalStr("help_question_kind");
				}else if(type==1){
					list = uni.getLocalStr("help_hotQuestion");
				}
				this.contentObj = list[index];
			}
		}
	}
</script>

<style lang="scss" scoped>
.answer{
	width: 100%;
	min-height: 100vh; 
	background-color: #FAFBFF; 
	/deep/ .uni-navbar--border{
		border: 0;
	}
	.aggr-c{
		width: 100%;
		padding: 40rpx 30rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		font-family: PingFang SC, PingFang SC-Regular;
		font-weight: 500;
		text-align: left;
		color: #333333;
	}
}
</style>
