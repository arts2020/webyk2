<template>
	<view class="recover-tip">
		<bar ref="bar"></bar>
		<view @tap="btnBackHome()" class="safe-header">
			<image src="../../static/image/login/left.svg" />
			<text>支付</text>
		</view>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px'}">
			<view class="tip-content">
				<image src="../../static/image/tips/pay-tip.svg" />
				<view class="tip-message">恭喜订单提交成功,待管理员审核后生效！</view>
				<view class="tip-order">订单号：83657354623564236</view>
			</view>
			<view class="tip-btn">
				<view class="btn">
					<view @tap="btnBackHome()">回首页</view>
					<view @tap="btnOrder()">订单列表</view>
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
			btnOrder:function(){
				this.util.UiUtils.switchToPage("order-list", "pay-tip",{from:2},"redirectTo");
			},
			btnBackHome:function(){
				this.util.UiUtils.switchToPage("home-index", "pay-tip",{});
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
