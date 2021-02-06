<template>
	<view class="about-us">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" title="关于我们" @clickLeft="btnBack"></uni-nav-bar>
		<view class="banner">
			<image src="../../../static/image/mine/logo.png" />
		    <view class="youkey">YouKey</view>
			<view class="currentVersion">
				当前版本：{{info.version}}
			</view>
		</view>
		<view class="about-menu">
			<text>官网</text>
			<text>{{info.website}}</text>
		</view>
		<view class="about-menu">
			<text>论坛</text>
			<text>{{info.forum}}</text>
		</view>
		<view class="about-menu">
			<text>微信公众号</text>
			<text>{{info.wechat}}</text>
		</view>
		<view class="about-menu">
			<text>Twitter</text>
			<text>{{info.twitter}}</text>
		</view>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	export default {
		components: {
			Bar
		},
		data(){
			return{
				scrollHeight:'',
				info:{
					version:"1.1.8",
					website:"https//www.youkey.com",
					twitter:"https//bbs.youkey.com",
					forum:"youkey",
					wechat:"youkey"
				}
			}
		},
		methods:{
			btnBack:function(){
				this.util.UiUtils.switchBackPage();
			},
		},
		onShow() {
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight -44;
				}
			});
		}
	}
</script>

<style lang="scss">
	@import 'about-us.scss'
</style>
