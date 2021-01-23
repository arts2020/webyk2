<template>
	<view>
		<uni-nav-bar leftIcon="back" :title="mTitle" :fixed="true" :status-bar="true"></uni-nav-bar>
		<view class="page-container">
			<rich-text class="rich-text" :nodes="mDesc"></rich-text>
			<rich-text class="rich-text" :nodes="mContent"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},

		data() {
			return {
				mTitle: "",
				mContent: "",
				mDesc: "",
			}
		},

		onLoad() {
			var info = this.dal.Utils.getRichTextInfo() || {};
			uni.cclog("rich info", info);
			this.mTitle = info.title || "";
			this.mDesc = info.desc || "";
			this.mContent = info.content || "";
		},

		methods: {

		}
	}
</script>

<style lang="scss">
	page {
		background: $Color_bg1;
	}

	.page-container {
		display: flex;
		flex-direction: column;
		padding-top: 20px;
		padding-bottom: 20px;
		background: $Color0;
	}

	.rich-text {
		font-size: 16px;
		color: $Color_font1;
		padding-left: 30rpx;
		padding-right: 30rpx;
	}
</style>
