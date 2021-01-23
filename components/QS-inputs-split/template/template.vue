<template>
	<view class="flex_row padding_8px_0rpx" :style="'font-size:' + fontSize + ';width:' + width + ';'">
		<text class="flex_row_e_c fontColor282828 text_nowrap maxWidth40" :style="'flex:' + (titleFlex||2) + ';' + (titleStyle||'')" v-if="title&&!titleHide">
			<text class="fontColorF1505C" v-if="required">
				{{requiredSign}}
			</text> 
			{{title}}
		</text>
		<view :style="'width: 100%;flex:' + (contentFlex||4) + ';' + (contentStyle||'')">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ''
			},
			titleHide: {
				type: Boolean,
				default: false
			},
			fontSize: {
				type: String,
				default: "16px"
			},
			width: {
				type: String,
				default: '100%'
			},
			titleFlex: {
				type: Number,
				default: 1
			},
			contentFlex: {
				type: Number,
				default: 4
			},
			titleStyle: {
				type: String,
				default: ''
			},
			contentStyle: {
				type: String,
				default: ''
			},
			required: {
				type: Boolean,
				default: false
			},
			requiredSign: {
				type: String,
				default: '*'
			}
		}
	}
</script>

<style scoped>
	@import url("../css/inputs.css");
</style>
