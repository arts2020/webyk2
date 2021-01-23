<!-- 弹出框  选择确定还是取消  
最简单的是支持纯文字
复杂的 用view包裹好，传slot="content" 即可 , 例如:
		<comfirmPanel ref="comfirmdel" @clickResult = "onClickDelResult" >
			<view slot='content' style="width: 200px; height: 200px; background-color: red;">
			</view>
		</comfirmPanel>
通过传btnlist数组，自定义下排的按钮

按钮只有取消和确定两种，返回点击下标
-->

<template>
	<view class="container11" :style="getBGSytle" v-if="m_isshow">
		<view class="comfirm-section">
			<view class="tips-section">
				<text v-if="contents.length > 0">{{contents}}</text>
				<view :class="{'content' : contents.length == 0 }">
					<slot name="content" />
				</view>
			</view>
			<view class="btns-section">
				<view class="btn-item" :style="getItemStyle" :class="{'btn-item-left':index!=getBtnList.length-1}" v-for="(item , index) in getBtnList"
				 :key="index" @click="onClickResult(index)">
					<text class="text" :class="{'text-cancel':index!=getBtnList.length-1, 'text-ensure':index==getBtnList.length-1}">{{item}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<style lang="scss">
	.container11 {
		position: fixed;
		top: 0px;
		z-index: 10000;
		width: 100vw;
		height: 100vh;


		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.comfirm-section {
			width: 80%;
			background-color: white;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			// border: 1px solid black;
			border-radius: 12px;

			.tips-section {
				width: 100%;
				min-height: 80px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border-bottom: 1px solid $Color_font6;

				text {
					word-wrap: break-word;
					width: 90%;
					font-size: 16px;
					text-align: center;
					margin: 20px;
				}

				.content {
					margin: 20px;
				}
			}

			.btns-section {
				width: 100%;
				height: 40px;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;

				.btn-item {
					height: 100%;
					/* width: 50%; */
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;

					&-left {
						border-right: 1px solid $Color_font6;
					}

					.text {
						width: 100%;
						text-align: center;
						// font-weight: bolder;

						&-cancel {
							font-size: 16px;
							color: $Color_font1;
						}

						&-ensure {
							font-size: 16px;
							color: $Color_font7;
						}
					}
				}

			}
		}
	}
</style>


<script>
	export default {
		components: {

		},

		data() {
			return {
				m_isshow: false,

			}
		},

		props: {
			contents: {
				type: String,
				default: '',
			},
			isOnlyEnsure: {
				type: Boolean,
				default: false,
			},
			hasMastBG: {
				type: Boolean,
				default: true,
			},
			btnlist: {
				type: Array,
				default () {
					return [];
				}
			}
		},

		watch: {

		},

		computed: {
			getBtnList() {
				/* return function(){ */
				var list = [];
				if (this.btnlist.length > 0) {
					list = this.btnlist;
				} else {
					if (this.isOnlyEnsure) {
						list = [uni.getLocalStr("btnstring_confirm")];
					} else {
						list = [uni.getLocalStr("btnstring_cancle"), uni.getLocalStr("btnstring_confirm")];
					}
				}
				/* var list = [uni.getLocalStr("btnstring_cancle") , uni.getLocalStr("btnstring_confirm")]; */
				return list;
				/* } */
			},
			getBGSytle() {
				var str = ''
				if (this.hasMastBG) {
					str += "background-color: rgba(0,0,0,0.4);";
				} else {
					str += "background-color: rgba(0,0,0,0);";
				}
				return str;
			},
			getItemStyle(blist) {
				var str = "width:" + 100 / this.getBtnList.length + "%;";
				return str;
			}
		},

		methods: {
			onClickResult(evt) {
				/* 事件带的参数是所点的按钮下标 */
				this.$emit("clickResult", evt);
				this.hide();
			},

			open() {
				this.m_isshow = true;
			},
			hide() {
				this.m_isshow = false;
			},
		},

	}
</script>
