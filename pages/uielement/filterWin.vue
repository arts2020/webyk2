<!-- 筛选窗口 -->
<template>
	<view>
		<view v-show="isShow" class="base-content" @click="onClickOutside" @touchmove.stop.prevent="moveHandle">
			<view class="top-nav-bar"></view>
			<view class="top-custom-bar"></view>
			<view class="main-content">
				<view class="win-content" :style="'height:'+mWinHeight+'px'" @click.stop>
					<scroll-view class="scroll-view" :style="'height:'+mScrollHeight+'px'" scroll-y :scroll-top="scrollTop">
						<view v-for="(typeData, typeIndex) in typeList" :key="typeData.type">
							<view class="title" v-if="typeData.title">
								{{typeData.title}}
							</view>
							<view class="btn-list">
								<view class="btn" v-for="(btn, btnIndex) in typeData.btnList" :key="btn.id" :class="btn.id===tempSelectList[typeIndex]?'btn-focus':'btn-normal'"
								 @click="onClickBtn(typeIndex, btn.id)">
									<text :class="btn.id===tempSelectList[typeIndex]?'btn-text-focus':'btn-text-normal'">{{btn.name}}</text>
								</view>
							</view>
						</view>
					</scroll-view>
					<view class="btn-filter" @click="onClickFilter">{{getLocalStr("game800_filter")}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<!-- 
	info数据结构
	info = {
		single: true, // 单选还是多选
		defaultId: 1, // 单选的默认项
		typeList: [{
			type: 1,
			title: "快3",
			btnList: [{
					id: 1,
					name: "江苏快三"
				},
				{
					id: 2,
					name: "幸运快3"
				},
				{
					id: 3,
					name: "极速快3"
				},
				{
					id: 4,
					name: "快乐快3"
				},
			]
		}, {
			type: 2,
			title: "时时彩",
			btnList: [{
					id: 13,
					name: "新疆时时彩"
				},
				{
					id: 14,
					name: "重庆时时彩"
				}
			]
		}]
	}
 -->

<script>
	export default {
		components: {

		},

		props: {
			info: {
				type: Object,
				default () {
					return {}
				}
			},
		},

		data() {
			return {
				isShow: false,
				mWinHeight: 0,
				mScrollHeight: 0,
				single: true, // true表示单选 false表示多选
				dataInfo: {}, // 数据
				typeList: [], // 类型列表
				selectList: [], // 选中的按钮（数据保存）
				tempSelectList: [], // 选中的按钮（样式控制）
				scrollTop: 0,
			}
		},

		watch: {
			info(newValue, oldValue) {
				this.parseInfo();
			}
		},

		mounted() {
			this.mWinHeight = 410;
			this.mScrollHeight = 335;
			this.parseInfo();
		},

		methods: {
			moveHandle: function() {

			},

			// 重置，回到起始状态(默认选中第一个)
			reInit: function() {
				this.tempSelectList = [];
				for (var i = 0; i < this.typeList.length; i++) {
					var typeData = this.typeList[i];
					this.tempSelectList.push(typeData.btnList[0].id);
				}
				if (this.single) {
					for (var i = 0; i < this.tempSelectList.length; i++) {
						if (i !== 0) {
							this.tempSelectList[i] = -1;
						}
					}
				}
				this.selectList = this.util.Utils.ccClone(this.tempSelectList);
			},

			parseInfo: function() {
				this.dataInfo = this.info;
				this.typeList = this.dataInfo.typeList || [];
				this.single = this.dataInfo.single;
				for (var i = 0; i < this.typeList.length; i++) {
					var typeData = this.typeList[i];
					this.tempSelectList.push(typeData.btnList[0].id);
				}
				if (this.single) {
					for (var i = 0; i < this.tempSelectList.length; i++) {
						if (i !== 0) {
							this.tempSelectList[i] = -1;
						}
					}
					if (this.dataInfo.defaultId !== undefined) {
						// 设置了默认选中项
						this.tempSelectList = [];
						for (var i = 0; i < this.typeList.length; i++) {
							var typeData = this.typeList[i];
							var id = -1;
							for (var j = 0; j < typeData.btnList.length; j++) {
								if (typeData.btnList[j].id === this.dataInfo.defaultId) {
									id = this.dataInfo.defaultId;
								}
							}
							this.tempSelectList.push(id);
						}
					}
				}
				this.selectList = this.util.Utils.ccClone(this.tempSelectList);

				// 计算窗口高度
				var titleNum = this.typeList.length;
				var btnNum = 0;
				var titleHeight = 40;
				var btnHeight = 50;
				var bottomBtnHeight = 80;
				for (var i = 0; i < this.typeList.length; i++) {
					btnNum = btnNum + this.typeList[i].btnList.length;
				}
				var winHeight = bottomBtnHeight + titleHeight * titleNum + btnHeight * Math.ceil(btnNum / 3);
				uni.cclog("win height", titleNum, btnNum, winHeight);
				if (winHeight < 410) {
					this.mWinHeight = winHeight;
					this.mScrollHeight = this.mWinHeight - 75;
				} else {
					this.mWinHeight = 410;
					this.mScrollHeight = this.mWinHeight - 75;
				}
			},

			onClickOutside: function() {
				this.hide();
				this.tempSelectList = this.util.Utils.ccClone(this.selectList);
				this.$emit("clickOutside");
			},

			onClickBtn: function(typeIndex, id) {
				if (this.single) {
					this.tempSelectList[typeIndex] = id;
					this.tempSelectList.splice(typeIndex, 1, id);
					for (var i = 0; i < this.tempSelectList.length; i++) {
						if (i !== typeIndex) {
							this.tempSelectList.splice(i, 1, -1);
						}
					}
				} else {
					this.tempSelectList.splice(typeIndex, 1, id);
				}
			},

			onClickFilter: function() {
				this.hide();
				this.selectList = this.util.Utils.ccClone(this.tempSelectList);

				if (this.single) {
					var select = 0;
					for (var i = 0; i < this.selectList.length; i++) {
						if (this.selectList[i] !== -1) {
							select = this.selectList[i];
						}
					}
					this.$emit("clickFilter", select);
				} else {
					this.$emit("clickFilter", this.selectList);
				}
			},

			show: function() {
				this.isShow = true;
				this.$emit("winShow");
			},

			hide: function() {
				this.isShow = false;
				this.$emit("winHide");
			}
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
		background: rgba(0, 0, 0, 0.3);
	}

	.win-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		box-sizing: border-box;
		background: $Color0;
		border-radius: 5px;
	}

	.btn-list {
		display: flex;
		width: 100%;
		flex-direction: row;
		flex-wrap: wrap;
		padding-left: 4%;
		margin-bottom: 20px;
	}

	.btn {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 35px;
		width: 28%;
		margin-top: 10px;
		margin-right: 4%;
		box-sizing: border-box;
		font-size: 14px;

		&-normal {
			border: 1px solid $Color_line1;
			border-radius: 5px;
		}

		&-focus {
			border: 1px solid $Color7;
			border-radius: 5px;
		}
	}

	.btn-text {
		font-size: 14px;

		&-normal {
			color: $Color_font3;
		}

		&-focus {
			color: $Color7;
		}
	}

	.btn-filter {
		margin-top: auto;
		width: 400rpx;
		height: 40px;
		line-height: 40px;
		background: $Color7;
		border-radius: 5px;
		text-align: center;
		margin-top: auto;
		margin-bottom: 15px;
		font-size: 15px;
		color: $Color0;
	}

	.scroll-view {
		width: 100%;
		margin-top: 10px;
	}

	.title {
		font-size: 15px;
		color: $Color_font1;
		margin-left: 4%;
	}
</style>
