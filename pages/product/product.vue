<template>
	<view class="prodect-index">
		<bar ref="bar" style="background-color: #FFFFFF;"></bar>
		<view class="prodect-title">产品</view>
		
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	import noData from '@/components/no-data/no-data.vue';
	export default {
		components: {
			Bar,
			noData
		},
		created() {
		},
		
		destroyed() {
		},
		
		data() {
			return {
				
			}
		},
		onLoad() {
			
		},
		methods: {
			
		},
		onShow() {
			
		}
	}
</script>

<style lang="scss">
	@import 'product.scss';
</style>
