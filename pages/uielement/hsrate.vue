<template>
	<view class="uni-rate">
		<view v-for="(star, index) in stars" :key="index" :style="{ marginLeft: margin + 'px' }" class="uni-rate-icon" @click="_onClick(index)">
			<HsIcon :size="size" :color="color" :type="isFill ? 'xingxing' : 'wuxing'" />
			<view v-if="star.activeWitch == '0'">
				<HsIcon :size="size" :color="activeColor" type="wuxing" />
			</view>
			<view v-else-if="star.activeWitch == '100%'">
				<HsIcon :size="size" :color="activeColor" type="xingxing" />
			</view>
			<view v-else>
				<HsIcon :size="size" :color="activeColor" type="banxing" />
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		// name: 'UniRate',
		// components: {
		// },
		props: {
			isFill: {
				// 星星的类型，是否镂空
				type: [Boolean, String],
				default: true
			},
			color: {
				// 星星的颜色
				type: String,
				default: '#ececec'
			},
			activeColor: {
				// 星星选中状态颜色
				type: String,
				default: '#ffca3e'
			},
			size: {
				// 星星的大小
				type: [Number, String],
				default: 24
			},
			value: {
				// 当前评分
				type: [Number, String],
				default: 0
			},
			max: {
				// 最大评分
				type: [Number, String],
				default: 5
			},
			margin: {
				// 星星的间距
				type: [Number, String],
				default: 0
			},
			disabled: {
				// 是否可点击
				type: [Boolean, String],
				default: false
			}
		},
		data() {
			return {
				valueSync: ''
			}
		},
		computed: {
			stars() {
				// uni.cclog("===this.value===",this.value)
				const value = Number(this.valueSync) ? Number(this.valueSync) : 0
				const starList = []
				const floorValue = Math.floor(value)
				const ceilValue = Math.ceil(value)
				
				// uni.cclog("===this.max===",this.max)
				// uni.cclog("===floorValue===",floorValue)
				// uni.cclog("===value===",value)
				
				for (let i = 0; i < this.max; i++) {
					if (floorValue > i) {
						starList.push({
							activeWitch: '100%'
						})
					} else if (ceilValue - 1 === i) {
						starList.push({
							activeWitch: (this.value - floorValue) * 100 + '%'
						})
					} else {
						starList.push({
							activeWitch: '0'
						})
					}
				}
				uni.cclog("===starList===",starList)
				return starList
			}
		},
		created() {
			this.valueSync = this.value
		},
		methods: {
			_onClick(index) {
				if (this.disabled) {
					return
				}
				this.valueSync = index + 1
				this.$emit('change', {
					value: this.valueSync
				})
			}
		}
	}
</script>

<style>
	@charset "UTF-8";

	.uni-rate {
		line-height: 0;
		font-size: 0;
		display: flex;
		flex-direction: row
	}

	.uni-rate-icon {
		display: flex;
		align-items: center;
		background: #F1505C;
		position: relative;
		line-height: 0;
		font-size: 0;
		display: inline-block
	}

	.uni-rate-icon-on {
		line-height: 1;
		position: absolute;
		top: 0;
		left: 0;
		overflow: hidden;
		/* margin-top: -20rpx; */
	}
</style>