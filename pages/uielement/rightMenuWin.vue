<!-- 导航栏右上角的菜单窗口 -->
<template>
	<view>
		<view v-show="isShow" class="base-content" @click="onClickOutside" @touchmove.stop.prevent="moveHandle">
			<view class="top-nav-bar"></view>
			<view class="top-custom-bar"></view>
			<view class="main-content">
				<view class="win-content" @click.stop>
					<view class="item-list">
						<view class="btn-item" :class="{'btn-item-line':index!==nameList.length-1}" v-for="(name, index) in nameList"
						 :key="index" @click="onClickItem(index)">
							<text class="btn-text">{{name}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 名称列表
			nameList: {
				type: Array,
				default () {
					return []
				}
			},

			// 类型列表，可以不传
			typeList: {
				type: Array,
				default () {
					return []
				}
			}
		},

		data() {
			return {
				isShow: false,
			}
		},

		created() {

		},

		methods: {
			moveHandle: function() {

			},

			onClickOutside: function() {
				this.hide();
				this.$emit("clickOutside");
			},

			onClickItem: function(index) {
				this.hide();
				var type = null;
				if (this.typeList.length > index) {
					type = this.typeList[index];
				}
				this.$emit("clickItem", {
					index: index,
					type: type
				});
			},

			show: function() {
				this.isShow = true;
			},

			hide: function() {
				this.isShow = false;
			},
		}
	}
</script>

<style lang="scss">
	.base-content {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: $Z_Index_Win;
		// background: rgba(0, 0, 0, 0.3);
	}

	.top-nav-bar {
		width: 100%;
		height: var(--status-bar-height);
	}

	.top-custom-bar {
		width: 100%;
		height: 44px;
	}

	.main-content {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		// background: rgba(0, 0, 0, 0.3);
	}

	.win-content {
		display: flex;
		box-sizing: border-box;
		justify-content: center;
		align-items: center;
		width: 220rpx;
		background: $Color0;
		border-radius: 5px;
		margin-left: auto;
		box-shadow: 0px 2px 10px $Color_line1;
	}

	.item-list {
		display: flex;
		width: 100%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.btn-item {
		display: flex;
		width: 100%;
		box-sizing: border-box;
		justify-content: center;
		align-items: center;
		height: 50px;

		&-line {
			border-bottom: 1px solid $Color_bg1;
		}
	}

	.btn-text {
		color: $Color_font1;
		font-size: 14px;
	}
</style>
