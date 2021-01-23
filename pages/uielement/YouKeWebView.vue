<template>
	<view>
		<!-- <uni-nav-bar :title="m_title" leftIcon="back" :fixed="true" :status-bar="true"></uni-nav-bar> -->
		<web-view style="height: calc(100vh);" :webview-styles="webviewStyles" :src="m_url" @message="handleMessage"></web-view>
	</view>
</template>

<script>
	export default {
		components: {},

		data() {
			return {
				m_url: "",
				m_title:"",
				webviewStyles: {
					progress: {
						// color: '#FF6666'
					}
				}
			}
		},
	
		onLoad(option) {
			var query = JSON.parse(option.query);
			this.m_url = query.url;
			this.mm_title = query.title;
			uni.setNavigationBarTitle({
				title: query.title
			})
		},

		methods: {
			handleMessage(evt) {
				uni.cclog('接收到的消息：' + JSON.stringify(evt.detail.data));
			},
		}

	}
</script>

<style lang="scss">
	.button-style {
		margin-top: 15px;
		max-height: 60px;
		width: 650rpx;
		min-width: 300px;
		color: #FFFFFF;
		background: #007AFF;
	}
</style>
