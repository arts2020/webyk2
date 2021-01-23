<template>
	<view class="deal-index">
		<bar ref="bar"></bar>
		<view class="safe-header">
			<image src="../../static/image/login/left.svg" />
			<text>交易记录</text>
		</view>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px',paddingTop:8 +'px'}">
			<view class="power-bg">
				<view class="power-info">
					<view class="power-title">Filecoin</view>
					<view class="deal-list">
						<view class="list">   
							<text>可用</text>
							<view>0.0000000</view>
						</view>
						<view class="list">
							<text>折合(CNY）</text>
							<view>0.0000000</view>
						</view>
					</view>
				</view>
				<view class="btn-list">
					<view class="list">
						<image src="../../static/image/notice/chongbi.svg" />
						<text>充币</text>
					</view>
					<view class="list">
						<image src="../../static/image/notice/zhuanzhang.svg" />
						<text>转账</text>
					</view>
				</view>
			</view>
			<view class="deal-list-info">
				<view class="deal-title">
					<view class="title">Filecoin算力奖励</view>
					<view class="date">2020/11/25</view>
				</view>
				<view class="deal-data">0.0000712BTC</view>
			</view>
			<view class="deal-list-info">
				<view class="deal-title">
					<view class="title">充币</view>
					<view class="date">2020/11/25</view>
				</view>
				<view class="deal-data">0.0000712BTC</view>
			</view>
			<view class="deal-list-info">
				<view class="deal-title">
					<view class="title">转账</view>
					<view class="date">2020/11/25</view>
				</view>
				<view class="deal-data red">-0.0000712BTC</view>
			</view>
			<view class="deal-list-info">
				<view class="deal-title">
					<view class="title">Filecoin算力奖励</view>
					<view class="date">2020/11/25</view>
				</view>
				<view class="deal-data">0.0000712BTC</view>
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
	@import "deal-record.scss"
</style>
