<template>
	<view class="about-us">
		<bar ref="bar"></bar>
		<view @tap="btnBack()" class="safe-header">
			<image src="../../../static/image/login/left.svg" />
			<text>关于我们</text>
		</view>
		<view class="banner">
			<image src="../../../static/image/index/index-bg1.png" />
		</view>
		<view class="about-content">
			    平台深度布局BTC,ETH和IPFS/Filecoin产业链,在使用集中采购和共建机制降低挖矿运行成本的同时,公司投入重金进行硬件建设、系统开发、算法优化等，利用矿机及矿场的分时共享模式降低客户参与挖矿行业的门槛,
				0最终为用户提供真实可靠、合规高效、响应积极、服务快捷的综合算力资产解决方案.
		</view>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	export default {
		components: {
			Bar
		},
		data(){
			return{
				scrollHeight:'',
			}
		},
		methods:{
			btnBack:function(){
				this.util.UiUtils.switchBackPage();
			},
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
	@import 'about-us.scss'
</style>
