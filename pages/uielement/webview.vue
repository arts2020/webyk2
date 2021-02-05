<template>
	<view>
		<!-- <uni-nav-bar :title="m_title" leftIcon="back" :fixed="true" :status-bar="true"></uni-nav-bar> -->
		<web-view ref="scope" :webview-styles="webviewStyles" :src="m_url" @message="handleMessage"></web-view>
	</view>
	</view>
</template>

<script>
	export default {
		components: {},

		onReady() {
			console.log("==onReady====2222222== ==")
			if (this.$scope) {
				console.log("==onReady====333333== ==")
				let Web3 = this.dal.Dapp.getWeb3()
				console.log("==onReady====44444== ==", Web3)
				var currentWebview = this.$scope.$getAppWebview().children()[0];
				//监听注入的js
				// currentWebview.addEventListener('loaded', function() {
				let window = require('../../common/dal/dapp/window.js')
				console.log("==window==", JSON.stringify(window))
				currentWebview.evalJS(window);
			}
		},
		data() {
			return {
				m_url: "",
				isdisabled: true,
				webviewStyles: {
					progress: {
						color: '#FF6666',
					}
				}
			}
		},
		onLoad(option) {
			var data = JSON.parse(option.query);
			this.m_title = data.title;
			this.m_url = data.url;
			uni.setNavigationBarTitle({
				title: this.m_title
			})
		},
		methods: {
			handleAccountsChanged: function() {
				console.log('=====handleAccountsChanged=========');
			},

			handleChainChanged: function() {
				console.log('=====handleChainChanged=========');
			},
			
			handleMessage(evt) {
				uni.cclog('接收到的消息：' + JSON.stringify(evt.detail.data));
			},
			radioChange: function(evt) {
				this.isdisabled = false;
			},
			onBtnClick: function() {
				this.util.StringUtils.setUserDefaults("guide_agree_key", "true");
				uni.navigateBack({
					delta: 1
				});
			}
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
