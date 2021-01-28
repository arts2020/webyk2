<template>
	<view class="create-index">
		<bar ref="bar"></bar>
		<view @tap="btnBack()" class="safe-header">
			<image src="../../../static/image/login/left.svg" />
			<text>创建钱包</text>
		</view>
		<view @tap="btnCreate()" class="create-list">
			<view  class="create-title">
				<text>创建身份</text>
				<view class="tips">第一次使用钱包</view>
			</view>
			<image src="../../../static/image/notice/right.svg" />
		</view>
		
		<view @tap="btnRecover()" class="create-list">
			<view class="create-title">
				<text>恢复身份</text>
				<view class="tips">已拥有身份</view>
			</view>
			<image src="../../../static/image/notice/right.svg" />
		</view>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	export default {
		components: {
			Bar
		},
		data() {
			return {
				scrollHeight: 0,
			}
		},
		
		methods: {
			btnBack:function(){
				this.util.UiUtils.switchBackPage();
			},
			btnCreate:function(){
				this.util.UiUtils.showLoading("钱包初始化...");
				this.util.UiUtils.switchToPage("backup-tip-backup-tip", "create-wallter",{});
			},
			btnRecover:function(){
				this.util.UiUtils.switchToPage("recover-identify-recover", "create-wallter",{});
			}
			
		},
		onShow() {
			this.dal.Wallter.clear();
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight -44;
				}
			});
		}
	
	}
</script>

<style lang="scss" scoped>
	.create-index{
		height: 100%;
		width: 100%;
		overflow: hidden;
		background: linear-gradient(180deg,#f2f6fa, #ffffff);
		.safe-header{
			width: 100%;
			height: 44px;
			line-height: 44px;
			padding: 0 15px;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			border-bottom: 5px solid rgba(0,0,0,0.04);
			image{
				width: 18px;
				height: 18px;
			}
			text{
				font-size: 16px;
				font-weight: bolder;
				color: #111111;
				margin-left: 6px;
			}
		}
		.create-list{
			margin: 15px;
			background-color: #FFFFFF;
			border-radius: 15px;
			padding: 8px 0px 8px 15px;
			border: 1px solid #e7e6ed;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.create-title{
				text{
					font-size: 17px;
					font-family: PingFang SC, PingFang SC-Heavy;
					font-weight: bolder;
					color: #071328;
				}
				.tips{
					font-size: 13px;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					color: #071328;
				}
			}
			image{
				width: 38px;
				height: 38px;
				border-radius: 10px;
				margin-top: 10px;
			}
		}
	}
</style>
