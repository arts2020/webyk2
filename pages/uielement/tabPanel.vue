<!-- 标签切换组件 
	支持设置整个标签的高度，宽度；
	支持设置单个标签的宽度（固定宽度，如果需要将组件放入scrollview需要这么设置）；
-->
<template>
	<view class="segmented-control" :style="wrapStyle">
		<view class="segmented-control-item-parent" :style="itemFixStyle">
			<view v-for="(item, index) in values" class="segmented-control-item" :class="styleType" :key="index" :style="index === currentIndex ? activeStyle : itemStyle"
			 @click="onClick(index)">
				{{item}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 默认选中第几个标签
			current: {
				type: Number,
				default: 0
			},

			// 标签名称列表
			values: {
				type: Array,
				default () {
					return [];
				}
			},

			// 未选中颜色
			normalColor: {
				type: String,
				default: '#969696'
			},

			// 选中颜色
			activeColor: {
				type: String,
				default: '#cd1818'
			},

			// 选中文本颜色
			activeTextColor: {
				type: String,
				default: '#ffffff'
			},

			// 标签样式：button or text
			styleType: {
				type: String,
				default: 'text'
			},

			// 标签高度(例如：30px)
			panelHeight: {
				type: String,
				default: ''
			},

			// 单个标签宽度(例如：150rpx)
			panelWidth: {
				type: String,
				default: ''
			},
		},

		data() {
			return {
				currentIndex: this.current,
				itemFixStyle: "", // 固定高度等样式
			}
		},

		watch: {
			current(val) {
				if (val !== this.currentIndex) {
					this.currentIndex = val;
				}
			}
		},

		computed: {
			wrapStyle() {
				let styleString = '';
				switch (this.styleType) {
					case 'text':
						styleString = `border:0;`;
						break;
					default:
						styleString = `border-color: ${this.activeColor};`;
						break;
				}

				if (this.panelWidth !== "") {
					styleString = styleString + `justify-content:flex-start;overflow:auto;`;
				}

				return styleString;
			},
			itemStyle() {
				let styleString = '';
				switch (this.styleType) {
					case 'text':
						styleString = `color:${this.normalColor};border-left:0;`;
						break;
					default:
						styleString = `color:${this.activeColor};border-color:${this.activeColor};`;
						break;
				}

				if (this.panelWidth !== "") {
					styleString = styleString + `width:${this.panelWidth};`;
				}

				return styleString;
			},
			activeStyle() {
				let styleString = '';
				switch (this.styleType) {
					case 'text':
						styleString = `color:${this.activeColor};border-left:0;border-bottom-style:solid;`;
						break;
					default:
						styleString =
							`color:${this.activeTextColor};border-color:${this.activeColor};background-color:${this.activeColor}`;
						break;
				}

				if (this.panelWidth !== "") {
					styleString = styleString + `width:${this.panelWidth};`;
				}

				return styleString;
			}
		},

		created() {
			this.itemFixStyle = "";
			if (this.panelHeight !== "") {
				this.itemFixStyle = `height:${this.panelHeight};`;
			}
			if (this.panelWidth !== "") {
				// this.itemFixStyle = this.itemFixStyle + `flex:initial;`;
			}
		},

		methods: {
			onClick(index) {
				if (this.currentIndex !== index) {
					this.currentIndex = index;
					this.$emit('clickTab', index);
				}
			},

			setIndex(index) {
				if (this.currentIndex !== index) {
					this.currentIndex = index;
					this.$emit('clickTab', index);
				}
			},

			// 不通知上层
			setIndexStatic(index) {
				if (this.currentIndex !== index) {
					this.currentIndex = index;
				}
			}
		},
	}
</script>

<style>
	.segmented-control {
		display: flex;
		flex-direction: row;
		justify-content: center;
		width: 100%;
		box-sizing: border-box;
		margin: 0 auto;
		overflow: hidden;
	}

	.button {
		border: 1px solid;
		box-sizing: border-box;
	}

	.segmented-control.text {
		border: 0;
		border-radius: 0px;
	}

	.segmented-control-item-parent {
		display: flex;
		flex: 1;
		text-align: center;
		line-height: 32px;
		box-sizing: border-box;
	}

	.segmented-control-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		text-align: center;
		box-sizing: border-box;
	}

	.segmented-control-item.button {
		font-size: 15px;
	}

	.segmented-control-item.text {
		border-left: 0;
		font-size: 15px;
	}

	.button:first-child {
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
	}

	.button:last-child {
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
	}

	.button:not(:first-of-type) {
		border-left-width: 0;
	}
</style>
