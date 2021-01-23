<!-- 沉浸式导航栏 设置top高度 -->
<template>
	<view>
		<view :style="{ height: titleHight + 'px' }" class="top-back-blue" ></view>
	</view>
</template>

<script> 
	export default {
		data() {
			return {
				titleHight:0
			}
		},
		methods:{
			getHeight(){
				let _this = this;
				//获取高度
				uni.getSystemInfo({
					success(res) {
						_this.titleHight = res.statusBarHeight;
					}
				});
			}
			
		},
		mounted(){
			this.getHeight();
		}
	}
</script>
<style>

.top-back-blue {
	 background-color: #FFFFFF;	
}

</style>
