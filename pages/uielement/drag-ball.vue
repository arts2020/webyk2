// 聊天的悬浮球
<template>
	<view>
		<view v-show="mShowBall" class="ball" :style="ballStyle" @click="onClickBall" @touchstart="touchStart"
		 @touchmove.stop.prevent="touchMove" @touchend="touchEnd" @touchcancel="touchCancel">
			<HsIcon type="liaotian" :size="'28px'" color="#ffffff" :bgcolor="mBallColor" :bgsize="'42px'"></HsIcon>
			<view v-show="mShowDot" class="red-dot"></view>
		</view>
		<view v-show="mShowSector" class="sector" :class="{'sector-act': mShowSector}" :style="sectorStyle">
			<HsIcon class="icon-remove" :type="'yichu'" :size="'40px'" />
			<view class="text-remove">{{getLocalStr("cancel_ball")}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {

		},

		data() {
			return {
				start: [0, 0],
				posX: 0,
				posY: 0,
				ballWidth: 60,
				ballHeight: 60,
				sectorWidth: 150,
				sectorHeight: 150,
				screenWidth: uni.getSystemInfoSync().windowWidth,
				screenHeight: uni.getSystemInfoSync().windowHeight,
				mShowSector: false,
				mShowBall: false,
				mShowDot: true,
				mBallType: 1, // 1:私聊 2:群聊
				mBallIcon: "",
				mBallColor: "",
				mBallBgColor: "",
				mChatInfo: null, // 从聊天出来带的信息，进入聊天时需要
				mEdge: 10,
			}
		},

		computed: {
			ballStyle() {
				var style =
					`left:${this.posX}px; top:${this.posY}px; width:${this.ballWidth}px; height:${this.ballHeight}px; background-color:${this.mBallBgColor}`;
				return style;
			},

			sectorStyle() {
				var style =
					`width:${this.sectorWidth}px; height:${this.sectorHeight}px; border-top-left-radius:${this.sectorWidth}px;`;
				return style;
			},
		},

		created() {
			var pos = this.util.UiUtils.getDragBallPos();
			this.posX = pos.x;
			this.posY = pos.y;
			this.mShowBall = this.util.UiUtils.getDragBallVisible();
			this.mShowDot = this.util.UiUtils.getDragBallDotVisible();
			this.mBallType = this.util.UiUtils.getDragBallType();
			this.mChatInfo = this.util.UiUtils.getDragBallChatInfo();
			this.refreshBall();
			this.addListener();
		},

		destroyed() {
			this.removeListener();
		},

		methods: {
			addListener: function() {
				this.util.EventUtils.addEventListenerCustom(this.entities.EventKeys.UI.DragBall_Show, this.onBallShow);
				this.util.EventUtils.addEventListenerCustom(this.entities.EventKeys.UI.DragBall_Hide, this.onBallHide);
				this.util.EventUtils.addEventListenerCustom(this.entities.EventKeys.UI.DragBall_Move, this.onBallMove);
				this.util.EventUtils.addEventListenerCustom(this.dal.Account.evtLogout, this.onLogout);
				this.util.EventUtils.addEventListenerCustom(this.entities.EventKeys.SOCKECT_CONNECT_CLOSE, this.onCloseConnet);
			},

			removeListener: function() {
				this.util.EventUtils.removeEventCustom(this.entities.EventKeys.UI.DragBall_Show, this.onBallShow);
				this.util.EventUtils.removeEventCustom(this.entities.EventKeys.UI.DragBall_Hide, this.onBallHide);
				this.util.EventUtils.removeEventCustom(this.entities.EventKeys.UI.DragBall_Move, this.onBallMove);
				this.util.EventUtils.removeEventCustom(this.dal.Account.evtLogout, this.onLogout);
				this.util.EventUtils.removeEventCustom(this.entities.EventKeys.SOCKECT_CONNECT_CLOSE, this.onCloseConnet);
			},

			// 显示悬浮球
			onBallShow: function(e) {
				this.mShowBall = true;
				this.util.UiUtils.setDragBallVisible(true);
				this.mShowDot = false;
				this.util.UiUtils.setDragBallDotVisible(false);
				if (e) {
					this.mBallType = e.type || 1;
					this.mChatInfo = e.info;
					this.util.UiUtils.setDragBallChatInfo(this.mChatInfo);
				}
				this.util.UiUtils.setDragBallType(this.mBallType);
				this.refreshBall();
			},

			// 隐藏悬浮球
			onBallHide: function() {
				this.mShowBall = false;
				this.util.UiUtils.setDragBallVisible(false);
			},

			// 退出登录
			onLogout: function() {
				this.onBallHide();
			},

			onCloseConnet: function() {
				this.cclog("====onCloseConnetonLogout===")
				this.onBallHide();
			},

			onBallMove: function() {
				var pos = this.util.UiUtils.getDragBallPos();
				this.posX = pos.x;
				this.posY = pos.y;
			},

			refreshBall: function() {
				if (this.mBallType === 1) {
					this.mBallColor = "#11c036";
					this.mBallBgColor = "rgba(17, 192, 54, 0.25)";
				} else {
					this.mBallColor = "#e99800";
					this.mBallBgColor = "rgba(233, 152, 0, 0.25)";
				}
			},

			touchStart: function(event) {
				this.start[0] = event.touches[0].clientX - event.currentTarget.offsetLeft;
				this.start[1] = event.touches[0].clientY - event.currentTarget.offsetTop;
			},

			touchMove: function(event) {
				this.mShowSector = true;
				var tag = event.touches;
				this.posX = tag[0].clientX - this.start[0];
				this.posY = tag[0].clientY - this.start[1];
				var edge = this.mEdge;
				if (this.posX < 0 + edge) {
					this.posX = 0 + edge;
				}
				if (this.posX > this.screenWidth - this.ballWidth - edge) {
					this.posX = this.screenWidth - this.ballWidth - edge;
				}
				if (this.posY < 0 + edge) {
					this.posY = 0 + edge;
				}
				if (this.posY > this.screenHeight - this.ballHeight - edge) {
					this.posY = this.screenHeight - this.ballHeight - edge;
				}

				if (this.isInRemoveRange()) {
					this.sectorWidth = 160;
					this.sectorHeight = 160;
				} else {
					this.sectorWidth = 150;
					this.sectorHeight = 150;
				}

				this.util.UiUtils.setDragBallPos({
					x: this.posX,
					y: this.posY
				});
				this.util.EventUtils.dispatchEventCustom(this.entities.EventKeys.UI.DragBall_Move);
			},

			touchEnd: function(event) {
				this.mShowSector = false;
				if (this.isInRemoveRange()) {
					this.util.EventUtils.dispatchEventCustom(this.entities.EventKeys.UI.DragBall_Hide);
					// 回到原始位置
					var edge = this.mEdge;
					var pos = {
						x: uni.getSystemInfoSync().windowWidth - this.ballWidth - edge,
						y: uni.getSystemInfoSync().windowHeight / 2 - 25,
					};
					this.util.UiUtils.setDragBallPos(pos);
					this.util.EventUtils.dispatchEventCustom(this.entities.EventKeys.UI.DragBall_Move);
				}
			},

			touchCancel: function(event) {
				this.touchEnd();
			},

			// 判断悬浮球是否在移除范围
			isInRemoveRange: function() {
				var result = false;
				var offsetX = 20;
				var offsetY = 20;
				if (this.posX >= this.screenWidth - this.sectorWidth + offsetX &&
					this.posY >= this.screenHeight - this.sectorHeight + offsetY) {
					result = true
				}
				return result;
			},

			// 点击悬浮球
			onClickBall: function() {
				uni.cclog("onClickBall");
				this.mShowDot = false;
				this.mShowBall = false;
				this.util.UiUtils.setDragBallVisible(false);
				this.util.UiUtils.setDragBallDotVisible(false);
				this.util.EventUtils.dispatchEventCustom(this.entities.EventKeys.UI.DragBall_Click);

				if (this.dal.Net.SocketConnectMgr.isConnectState()) {
					this.cclog("===onClickBall===00===")
					if (this.mBallType === 2) {
						this.cclog("===onClickBall===11===")
						this.dal.GroupChat.setCurGroupInfo(this.mChatInfo);
						this.$openPage({
							name: "groupCenter",
						})
					} else if (this.mBallType === 1) {
						this.cclog("===onClickBall===22===")
						this.$openPage({
							name: "PrivateChat",
							query: this.mChatInfo
						})
					}
				} else {

				}

			}
		}
	}
</script>

<style lang="scss">
	.ball {
		display: flex;
		/* background: linear-gradient(to bottom, #F8F8FF, #87CEFA); */
		border-radius: 50%;
		// box-shadow: 0 0 8px #87CEFA;
		justify-content: center;
		align-items: center;
		position: fixed;
		z-index: 10000000000 !important;
		background: #ffffff;
	}

	.red-dot {
		position: absolute;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #ff0000;
		top: 2px;
		right: 2px;
	}

	.sector {
		position: fixed;
		right: 0px;
		bottom: 0px;
		z-index: 999999;
		display: flex;
		flex-direction: column;
		border-radius: 0 0 0 0;
		background: $Color7;
		justify-content: center;
		align-items: center;
	}

	.icon-remove {
		padding-left: 40px;
		padding-top: 20px;
	}

	.text-remove {
		font-size: 14px;
		padding-left: 40px;
		padding-top: 5px;
		color: $Color_font8;
	}

	.sector-act {
		animation: fadeIn 0.2s;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translate(100%, 100%);
		}

		to {
			opacity: 1;
			transform: translate(0, 0);
		}
	}
</style>
