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

<style lang="scss">
	@import "creat-wallet.scss"
</style>
