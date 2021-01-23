<template>
	<view class="no-data-content">
		<image class="no-img" src="../../static/image/index/nodata.png" />
		<view class="data-tips">暂无内容</view>
	</view>
</template>

<script>
</script>

<style lang="scss">
	.no-data-content{
		.no-img{
			width: 300px;
			height: 180px;
			display: block;
			margin: 0 auto;
			margin-top: 20px;
		}
		.data-tips{
			font-size: 13px;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			color: #909090;
			text-align: center;
			margin-top: 10px;
		}
	}
</style>
