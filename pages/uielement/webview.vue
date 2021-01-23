<template>
	<view>
		<!-- <uni-nav-bar :title="m_title" leftIcon="back" :fixed="true" :status-bar="true"></uni-nav-bar> -->
		<web-view style="height: calc(100vh - 130px);" ref="scope" :webview-styles="webviewStyles" :src="m_url" @message="handleMessage"></web-view>

		<view style="width: 100%;position: absolute;bottom: 0px;z-index: 100000;background-color: #FFFFFF;">
			<view style="display: flex;justify-content: center;align-items: center;
			flex-direction: column;">
				<radio-group @change="radioChange">
					<label style="display: flex;align-items: center;justify-content: center;">
						<radio value="r1" />
						我已阅读并同意服务条款和Cookie说明
					</label>
					<button class="button-style" :disabled="isdisabled" @tap="onBtnClick">确认</button>
				</radio-group>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		components: {},
		
		onReady() {
			if(this.$scope){
				var currentWebview = this.$scope.$getAppWebview().children()[0];
				//监听注入的js
				currentWebview.addEventListener("loaded", function() {
					currentWebview.evalJS(
						"$('#burlcl .liveHeader').hide();"
					);
				});
				//设置高度样式
				currentWebview.setStyle({
					// top: 50,
					height: '79.5%',
					// scalable: true //webview的页面是否可以缩放，双指放大缩小
				})
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
