<template>
	<view class="notice-detail">
		<bar ref="bar"></bar>
		<view @tap="btnBack()" class="safe-header">
			<image src="../../../static/image/login/left.svg" />
			<text>公告详情</text>
		</view>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<view class="notice-content">
				<view class="notice-title">{{detailItem.title}}</view>
				<!-- <view class="content" v-html="detailItem.content"></view> -->
				<u-parse  style="display: flex;justify-content: center;flex-direction: column;" :content="detailItem.content" @preview="preview" @navigate="navigate" />
				<view class="notice-date">{{detailItem.created_at}}</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	import uParse from '@/components/gaoyia-parse/parse.vue'
	export default {
		components: {
			Bar,
			uParse
		},
		data() {
			return {
				scrollHeight: 0,
				detailItem:{},
			}
		},
		onLoad:function(option){
			console.log("==2222==option====",option)
			if(option && option.query){
				let query = JSON.parse(option.query)
				this.detailItem = this.dal.Common.getNoitceInfo(query.id);
			}else{
				this.detailItem = {}
			}
			console.log("==2222==this.detailItem====",this.detailItem)
			// this.detailItem = JSON.parse(decodeURIComponent(option.query));
			
		},
		methods: {
			btnBack: function() {
				this.util.UiUtils.switchBackPage2();
			},
			getData(){
				
			}
		},
		onShow() {
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight - 44;
				}
			});
		}
	}
</script>

<style lang="scss">
	@import "notice-detail.scss"
</style>
