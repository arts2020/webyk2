<template>
	<view>
		<view v-if="isShowBg == true" class="circle" :style="{background:bgcolor,'width': bgSize ,'height':bgSize}">
			<view class="iconfont iconfont-stype" :class="['icon-'+type]" :style="{color:color,'font-size':  fontSize}" @click="onClick()"></view>
		</view>
		<view v-else>
			<view class="iconfont" :class="['icon-'+type]" :style="{color:color,'font-size':  fontSize}" @click="onClick()"></view>
		</view>
	</view>
</template>

<script>
	export default {
		created() {
			this.isShowBg = this.bgcolor.length > 0;
		},
		props: {
			//背景圆色
			bgcolor: {
				type: String,
				default: "",
			},

			//背景圆直径大小
			bgsize: String,
			/**
			 * 图标类型
			 */
			type: String,
			/**
			 * 图标颜色
			 */
			color: String,
			/**
			 * 图标大小
			 */
			size: [Number, String]
		},
		computed: {
			fontSize() {
				// return `${this.size}px`
				return this.size
			},

			bgSize() {
				return this.bgsize
			}
		},

		data() {
			return {
				isShowBg: false
			}
		},
		methods: {
			onClick() {
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss">
	.circle {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		z-index: 0;
	}
</style>
