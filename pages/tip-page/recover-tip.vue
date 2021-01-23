<template>
	<view class="recover-tip">
		<bar ref="bar"></bar>
		<view @tap="btnBack()" class="safe-header">
			<image src="../../static/image/login/left.svg" />
			<text>恢复身份</text>
		</view>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px'}">
			<view class="tip-content">
				<image src="../../static/image/tips/recover.svg" />
				<view class="tip-message">恭喜恢复身份成功！</view>
			</view>
			<view class="tip-btn">
				<view class="btn">
					<view @tap="btnHome()">回首页</view>
					<view @tap="btnWallet()">我的钱包</view>
				</view>
			</view>
		</scroll-view>
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
		onLoad() {
			
		},
		methods: {
			btnBack:function(){
				this.util.UiUtils.switchBackPage();
			},
			btnHome:function(){
				this.util.UiUtils.switchToPage("home-index", "recover-tip",{});
			},
			btnWallet:function(){
				this.util.UiUtils.switchToPage("mine-my-wallet-my-wallet", "recover-tip",{});
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
	@import "tip.scss"
</style>
