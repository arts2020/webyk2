<template>
	<view class="uni-navbar">
		<view :class="{'uni-navbar--fixed': fixed,'uni-navbar--shadow':border,'uni-navbar--border':border}" :style="{'background-color':backgroundColor}"
		 class="uni-navbar__content">
			<uni-status-bar v-if="statusBar" />
			<view :style="{color:color}" class="uni-navbar__header uni-navbar__content_view">
				<view class="uni-navbar__header-btns uni-navbar__content_view" @tap="onClickLeft">
					<view v-if="leftIcon.length" class="uni-navbar__content_view" style="margin-left: 10px;">
						<HsIcon :type="leftIcon" :color="color" size="22px" />
					</view>
					<view v-if="leftText.length" :class="{'uni-navbar-btn-icon-left':!leftIcon.length}" class="uni-navbar-btn-text uni-navbar__content_view">{{ leftText }}</view>
					<slot name="left" />
				</view>
				<view class="uni-navbar__header-container uni-navbar__content_view">
					<view v-if="title.length" class="uni-navbar__header-container-inner uni-navbar__content_view" :style="'font-size:' + this.fontSize.nav + ';'">{{ title }}</view>
					<!-- 标题插槽 -->
					<slot name="center" />
				</view>
				<view class="uni-navbar__header-btns uni-navbar__content_view" @tap="onClickRight">
					<view v-if="rightIcon.length" class="uni-navbar__content_view">
						<HsIcon class="right-icon" :type="rightIcon" :color="color" size="22px" />
					</view>
					<!-- 优先显示图标 -->
					<view v-if="rightText.length&&!rightIcon.length" class="uni-navbar-btn-text uni-navbar__content_view">{{ rightText }}</view>
					<slot name="right" />
				</view>
			</view>
		</view>
		<view v-if="fixed" class="uni-navbar__placeholder">
			<uni-status-bar v-if="statusBar" />
			<view class="uni-navbar__placeholder-view" />
		</view>

		<drag-ball></drag-ball>
	</view>
</template>

<script>
	import uniStatusBar from '../uni-status-bar/uni-status-bar.vue';
	
	export default {
		name: 'UniNavBar',
		components: {
			uniStatusBar,
		},
		props: {
			title: {
				type: String,
				default: ''
			},
			leftText: {
				type: String,
				default: ''
			},
			rightText: {
				type: String,
				default: ''
			},
			leftIcon: {
				type: String,
				default: ''
			},
			rightIcon: {
				type: String,
				default: ''
			},
			fixed: {
				type: Boolean,
				default: false
			},
			color: {
				type: String,
				default: '#000000'
			},
			backgroundColor: {
				type: String,
				default: "#FFFFFF"
			},
			statusBar: {
				type: Boolean,
				default: false
			},
			shadow: {
				type: Boolean,
				default: false
			},
			border: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			onClickLeft() {
				// uni.cclog("==this.leftIcon=", this.leftIcon);
				if (this.leftIcon === "back") {
					let pages = getCurrentPages();
					// uni.cclog("==pages.length=", pages);
					var isok = true;
					if (this.title == "登录") {
						isok = this.dal.Character.isLoginCache()
					}
					if (pages.length <= 1 || !isok) {
						uni.switchTab({
							url: '/pages/game/index'
						});
					} else {
						uni.navigateBack({
							delta: 1
						});
					}
				} else {
					this.$emit('click-left')
				}

			},
			onClickRight() {
				this.$emit('click-right')
			}
		}
	}
</script>

<style>
	@charset "UTF-8";

	.uni-navbar__content {
		display: block;
		position: relative;
		width: 100%;
		/* 		min-width: 350px;
		max-height: 64px; */
		background-color: #fff;
		overflow: hidden
	}

	.uni-navbar__content .uni-navbar__content_view {
		line-height: 44px;
	}

	.uni-navbar__header {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 44px;
		line-height: 44px;
		font-size: 16px
	}

	.uni-navbar__header-btns {
		display: inline-flex;
		flex-wrap: nowrap;
		flex-shrink: 0;
		width: 120upx;
		padding: 0 12upx;
	}

	.uni-navbar__header-btns:first-child {
		padding-left: 0
	}

	.uni-navbar__header-btns:last-child {
		width: 60upx
	}

	.uni-navbar__header-container {
		width: 100%;
		margin: 0 10upx
	}

	.uni-navbar__header-container-inner {
		font-size: 18px;
		text-align: center;
		padding-right: 60upx
	}

	.uni-navbar__placeholder-view {
		height: 44px
	}

	.uni-navbar--fixed {
		position: fixed;
		z-index: 998
	}

	.uni-navbar--shadow {
		box-shadow: 0 1px 6px #ccc
	}

	.uni-navbar--border:after {
		position: absolute;
		z-index: 3;
		bottom: 0;
		left: 0;
		right: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc
	}

	.right-icon {
		position: fixed;
		right: 0px;
		margin-right: 10px;
	}
</style>
