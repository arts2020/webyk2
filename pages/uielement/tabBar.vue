// 自定义底部导航栏
<template>
	<view>
		<view class="tab-bar-placeholder"></view>
		<view class="tab-bar-fixed" :style="tabHeigth1" @click.stop @touchmove.stop.prevent="moveHandle">
			<view class="tab-item" :style="tabHeigth2" v-for="(item, index) in tabList" :key="index" @tap="switchTab(index)">
				<view class="icon">
					<HsIcon :type="item.icon" :size="'28px'" :color="currentTabIndex === index ? focusColor : normalColor" />
					<view v-if="item.badge" class="badge">{{item.badge}}</view>
					<view v-if="item.redDot" class="red-dot"></view>
				</view>
				<view class="text" :style="[currentTabIndex === index ? {'color': focusColor} : {'color': normalColor}]">{{item.text}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			page: {
				type: String,
				default: ""
			},
		},

		data() {
			return {
				tabList: [],
				currentTabIndex: 0,
				normalColor: this.Color.Color_font3,
				focusColor: this.Color.Color_font4,
				tabHeigth1: "",
				tabHeigth2: "",
				m_height: 0,
			}
		},

		created() {
			uni.cclog("custom tab bar created");
			this.refreshTabList();
			this.addListener();
			this.onResizess();
		},

		destroyed() {
			this.removeListener();
		},

		methods: {
			moveHandle: function() {

			},

			addListener: function() {
				this.util.EventUtils.addEventListenerCustom(this.entities.EventKeys.UI.TabBar_Update, this.onUpdate);
				this.util.EventUtils.addEventListenerCustom(this.entities.EventKeys.UI.TabBar_Badge_Update, this.onBadgeUpdate);
				this.util.EventUtils.addEventListenerCustom(this.entities.EventKeys.UI.TabBar_RedDot_Update, this.onRedDotUpdate);
				this.util.EventUtils.addEventListenerCustom(this.entities.EventKeys.APP_WINDOW_RESIZE_KEY, this.onResizess);
				this.util.EventUtils.addEventListenerCustom(this.dal.Game.g800.Game.evtGetHomePage, this.onHomePage);
			},

			removeListener: function() {
				this.util.EventUtils.removeEventCustom(this.entities.EventKeys.UI.TabBar_Update, this.onUpdate);
				this.util.EventUtils.removeEventCustom(this.entities.EventKeys.UI.TabBar_Badge_Update, this.onBadgeUpdate);
				this.util.EventUtils.removeEventCustom(this.entities.EventKeys.UI.TabBar_RedDot_Update, this.onRedDotUpdate);
				this.util.EventUtils.removeEventCustom(this.entities.EventKeys.APP_WINDOW_RESIZE_KEY, this.onResizess);
				this.util.EventUtils.removeEventCustom(this.dal.Game.g800.Game.evtGetHomePage, this.onHomePage);
			},

			onResizess: function() {
				// if (this.m_height == 0) {
				// 	this.m_height = 50
				// 	this.tabHeigth1 = "height:50px;";
				// 	// this.tabHeigth2 = "bottom:0px";
				// } else {
				// 	this.m_height = 0
				// 	this.tabHeigth1 =
				// 		"height:calc('50px' + clonstant('safe-area-inset-bottom'));height: calc(50px + env(safe-area-inset-bottom))";
				// 	// this.tabHeigth2 = "margin-bottom:10px";
				// }
				// uni.showModal({
				// 	content: this.m_height.toString(),
				// 	showCancel: false
				// });
			},

			onHomePage: function() {
				this.refreshTabList();
			},

			onUpdate: function() {
				uni.cclog("onUpdate");
				this.refreshTabList();
			},

			// 刷新tab列表
			refreshTabList: function() {
				uni.cclog("refreshTabList");
				var tempList = this.entities.TplTabBar.getTabList();
				this.tabList = [];
				for (var i = 0; i < tempList.length; i++) {
					this.tabList.push(tempList[i]);
				}

				this.currentTabIndex = this.entities.TplTabBar.getTabIndex(this.page);
			},

			// 更新右上角文本
			onBadgeUpdate: function(e) {
				uni.cclog("onBadgeUpdate", e);
				for (var i = 0; i < this.tabList.length; i++) {
					if (this.tabList[i].page === e.page) {
						var item = this.tabList[i];
						item.badge = e.text;
						this.tabList.splice(i, 1, item);
						break;
					}
				}
			},

			// 更新右上角红点
			onRedDotUpdate: function(e) {
				uni.cclog("onRedDotUpdate", e);
				for (var i = 0; i < this.tabList.length; i++) {
					if (this.tabList[i].page === e.page) {
						var item = this.tabList[i];
						item.redDot = e.show;
						this.tabList.splice(i, 1, item);
						break;
					}
				}
			},

			// 切换标签
			switchTab: function(index) {
				uni.cclog("switch tab", index);
				var tab = this.tabList[index];
				if (tab.page === "interact") {
					var centerInfo = this.dal.GroupChat.getGroupSetInfo();
					if (centerInfo && !centerInfo.m_bClubCenterOpen) {
						// 互动中心暂未开放
						this.util.UiUtils.showToast(uni.getLocalStr("interact_not_open"));
						return;
					}
				}

				this.$openPage({
					name: this.tabList[index].page,
					type: "switchTab",
					query: {},
				})
				this.util.UiUtils.setTitle();
			}
		},
	}
</script>

<style lang="scss">
	.tab-bar-fixed {
		position: fixed;
		z-index: 998;
		bottom: 0px;
		display: flex;
		width: 100%;
		height: calc(60px + clonstant(safe-area-inset-bottom));
		height: calc(60px + env(safe-area-inset-bottom));
		background: $Color0;
		box-sizing: border-box;
		border-top: 1px solid $Color_line1;
		max-height: 75px;
		min-height: 60px;
	}

	.tab-bar-placeholder {
		height: calc(60px + clonstant(safe-area-inset-bottom));
		height: calc(60px + env(safe-area-inset-bottom));
		max-height: 75px;
		min-height: 60px;
	}

	.tab-item {
		flex: 1;
		height: 60px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.icon {
		position: relative;
	}

	.badge {
		position: absolute;
		width: 15px;
		height: 15px;
		line-height: 15px;
		border-radius: 50%;
		background: #FF0000;
		top: 0px;
		right: -10px;
		font-size: 10px;
		text-align: center;
		color: $Color0;
	}

	.red-dot {
		position: absolute;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #FF0000;
		top: 0px;
		right: -6px;
	}

	.text {
		font-size: 12px;
	}
</style>
