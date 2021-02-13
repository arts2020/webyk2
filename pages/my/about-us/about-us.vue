<template>
	<view class="about-us">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" :title="about_us_title" @clickLeft="btnBack"></uni-nav-bar>
		<view class="banner">
			<image src="../../../static/image/mine/logo.png" />
		    <view class="youkey">YouKey</view>
			<view class="currentVersion">
				{{about_us_str1}}：{{info.version}}
			</view>
		</view>
		<view class="about-menu">
			<text>{{about_us_str2}}</text>
			<text>{{info.website}}</text>
		</view>
		<view class="about-menu">
			<text>{{about_us_str3}}</text>
			<text>{{info.forum}}</text>
		</view>
		<view class="about-menu">
			<text>{{about_us_str4}}</text>
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
		onLoad() {
			this.initword()
		},
		methods:{
			initword(){
				this.about_us_title = this.getLocalStr("about_us_title");
				this.about_us_str1 = this.getLocalStr("about_us_str1");
				this.about_us_str2 = this.getLocalStr("about_us_str2");
				this.about_us_str3 = this.getLocalStr("about_us_str3");
				this.about_us_str4 = this.getLocalStr("about_us_str4");
			},
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
	       this.info.version = this.dal.Common.onGetConfigInfo('app_version')?this.dal.Common.onGetConfigInfo('app_version').value:"no data";
		   this.info.website = this.dal.Common.onGetConfigInfo('app_website')?this.dal.Common.onGetConfigInfo('app_website').value:"no data"
		   this.info.twitter = this.dal.Common.onGetConfigInfo('app_connect_twitter')?this.dal.Common.onGetConfigInfo('app_connect_twitter').value:"no data"
		   this.info.forum = this.dal.Common.onGetConfigInfo('app_connect_forum')?this.dal.Common.onGetConfigInfo('app_connect_forum').value:"no data"
		   this.info.wechat = this.dal.Common.onGetConfigInfo('app_connect_wechat')?this.dal.Common.onGetConfigInfo('app_connect_wechat').value:"no data"
		   
		}
	}
</script>

<style lang="scss">
	@import 'about-us.scss'
</style>
