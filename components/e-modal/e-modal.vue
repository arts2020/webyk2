<template>
	<view @touchmove.stop.prevent>
		<view  @click.self.stop="cancel" class="e-modal" :class="[visible?'e-modal_show':'e-modal_hidden',animation?'e-modal-action_animation':'']">
			<view class="e-modal-container" :style="{width}" @click.stop.prevent>
				<slot></slot>
			</view>
		</view>
		<view :class="['e-modal-mask',visible && mask ? 'e-modal-mask_show' : '',animation?'e-modal-action_animation':'']"></view>
	</view>
</template>

<script>
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			mask: {
				type: Boolean,
				default: true
			},
			width: {
				type: String,
				default: '75%'
			},
			animation: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			cancel() {
				this.$emit('update:visible', false)
				this.$nextTick(()=>{
					this.$emit('cancel')
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.e-modal,
	.e-modal-mask {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.e-modal-action_animation {
		transition: all 0.3s ease-in-out;
	}

	.e-modal {
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 997;
	}

	.e-modal_hidden {
		visibility: hidden;
		transform: scale(0);
	}

	.e-modal_show {
		visibility: visible;
		transform: scale(1);
	}

	.e-modal-container {
		background-color: #fff;
		border-radius: 6px;
	}

	.e-modal-mask {
		visibility: hidden;
		z-index: 996;
	}

	.e-modal-mask_show {
		background: rgba(0, 0, 0, 0.6);
		visibility: visible;
	}
</style>
