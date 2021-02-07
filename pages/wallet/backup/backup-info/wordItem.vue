<template>
	<view :class="isselect== false ? 'itemStyle' : 'itemStyle2'" @click="selectItem">
		<text>{{item.val}} </text>
		<image @click.stop="closeItem" v-if="item.iswron == true" class="warn-icon" src="../../../../static/image/wallet/guide_word.png"></image>
	</view>
</template> 

<script>
	export default {
		props: {
			selectFun: {
				type: Function,
				default: null
			},
			closeFun: {
				type: Function,
				default: null
			},
			item: {
				type: Object,
				default: {

				},
			},

			iswron: {
				type: Boolean,
				default: false,
			},

			isselect: {
				type: Boolean,
				default: false,
			}
		},
		model: {
			prop: 'isselect',
		},
		
		watch: {
			isselect(val) {
				this.cclog("=====watch=isselect====22===")
				if (this.isselect !== val) {
					this.isselect = val
				}
			},

			iswron(val) {
				this.cclog("===watch===iswron====22===")
				if (this.m_wron !== val) {
					this.m_wron = val
				}
			}
		},
		data() {
			return {
				m_isselect: false,
				m_wron: false,
			}
		},
		methods: {
			setSelect(){
				this.m_isselect = false
			},
			
			selectItem() {
				if(this.item.type == 1){
					// this.m_isselect = true;
					if (this.selectFun) {
						this.selectFun(this.item.idx,this.item.type,this.item.val);
					}
				}else{
					this.closeItem();
				}
			},
			closeItem() {
				if (this.closeFun) {
					this.closeFun(this.item.idx);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
        .warn-icon{ 
			width: 40rpx;
			height: 40rpx;
			position: absolute;
			top: -20rpx;
			right: -20rpx;
		}
		.itemStyle {
			position: relative;
			opacity: 1;
			line-height: 92rpx;
			width: fit-content;
			height: 92rpx;
			padding: 0 20rpx;
			box-sizing: border-box;
			background: #ffffff;
			border: 3rpx solid #e7e6ed;
			border-radius: 13rpx;
			font-size: 36rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 500;
			text-align: center;
			color: #333333;
			margin-right: 22rpx;
			margin-bottom: 20rpx;
		}
		
		.itemStyle2 {
			position: relative;
			opacity: 0.2;
			line-height: 92rpx;
			width: fit-content;
			height: 92rpx;
			padding: 0 20rpx;
			box-sizing: border-box;
			background: #ffffff;
			border: 3rpx solid #e7e6ed;
			border-radius: 13rpx;
			font-size: 36rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 500;
			text-align: center;
			color: #333333;
			margin-right: 22rpx;
			margin-bottom: 20rpx;
		}
</style>
