<template>
	<view style="width: 100px;height: 60px;">
		<view :class="isselect== false ? 'itemStyle' : 'itemStyle2'" @click="selectItem">
			{{item.val}} 
		</view>
		<view @click="closeItem" v-if="item.iswron == true" style="position: relative;top: -80px;left:90px; border-radius: 50%;">
			<image style="height: 20px;width: 20px;" src="../../../static/image/wallet/guide_word.png"></image>
		</view>
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

<style lang="scss">
	.itemStyle {
		font-size: 20px;
		background-color: #f2f2f2;
		border-radius: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 50px;
		border: 1px solid #d5d4e0;
		width: 90px;
		margin-bottom: 20px;
		margin-left: 10px;
		color: #626682;
	}

	.itemStyle2 {
		font-size: 20px;
		background-color: #f2f2f2;
		border-radius: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 50px;
		border: 1px solid #d5d4e0;
		width: 90px;
		margin-bottom: 20px;
		margin-left: 10px;
		color: #c2bfc4;
	}
</style>
