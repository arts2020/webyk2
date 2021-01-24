<template>
	<view class="create-index">
		<bar ref="bar"></bar>
		<view  @tap="btnBack()"  class="safe-header">
			<image src="../../static/image/login/left.svg" />
			<text>备份提示</text>
		</view>
		<view class="create-list">
			<view class="tip-title">备份提示</view>
			<view class="tip-cotent">获取助记词等于获取钱包资产所有权</view>
			<view class="tip-list">
				<image src="../../static/image/notice/warn.svg" />
				<view>助记词由英文单词组成，请抄写并妥善保管</view>
			</view>
			<view class="tip-list">
				<image src="../../static/image/notice/warn.svg" />
				<view>助记词丢失无法找回，请务必备份助记词</view>
			</view>
		</view>
		<view @tap="btnNext()" class="container-login" >下一步</view>
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
		created() {
			setTimeout(function(){
				this.dal.Wallter.createWallet();
			}.bind(this),100)
		},
		onLoad() {
			
		},
		methods: {
			btnBack:function(){
				this.util.UiUtils.switchBackPage();
			},
			btnNext:function(){
				this.util.UiUtils.switchToPage("backup-info-backup-info", "backup-tip",{});
			}
		},
		onShow() {
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
	@import "backup-tip.scss"
</style>
