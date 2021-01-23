<template>
	<view>
		<view class="load-more">
			<view v-show="mShowLoad" class="load">
				<image class="image" :src="mImageSrc"></image>
				<view class="load-text">{{mLoadStr}}</view>
			</view>
			<view v-show="mShowContent" class="content">{{mContentStr}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {

		},

		data() {
			return {
				mShowLoad: true,
				mShowContent: false,
				mContentStr: "",
				mLoadStr: uni.getLocalStr("loading"),
				mImageSrc: this.util.GameUtils.fullPath("/static/image/common/loading.gif"),
			}
		},

		created() {

		},

		destroyed() {

		},

		methods: {
			// 显示提示语（比如：暂无记录，已显示今天全部数据）
			showContent: function(str) {
				this.mShowLoad = false;
				this.mShowContent = true;
				this.mContentStr = str;
			},

			// 显示加载中动画
			showLoad: function() {
				this.mShowLoad = true;
				this.mShowContent = false;
			},
		},
	}
</script>

<style lang="scss">
	.load-more {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 16px;
		padding-bottom: 16px;
	}

	.load {
		display: flex;
		justify-content: center;

		&-text {
			font-size: 15px;
			color: $Color_font1;
			margin-left: 8px;
		}
	}

	.image {
		width: 20px;
		height: 20px;
	}

	.content {
		justify-content: center;
		font-size: 15px;
		color: $Color_font2;
	}
</style>
