<template>
	<view class="backup-info">
		<uniNavBar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" :title="bak_title_str1" @clickLeft="btnBack"></uniNavBar>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<view class="backup-title">{{bak_title_str2}}</view>
			<view class="backup-content">
				<view class="list" v-for="(item,index) in words" :key="index">
					<view>{{item}}</view>
					<text>{{index+1}}</text>
					
				</view>
			</view>
			<view class="create-list">
				<view class="tip-list">
					<image src="../../../../static/image/index/warning.png" />
					<view>{{bak_title_str3}}</view>
				</view>
				<view class="tip-list">
					<image src="../../../../static/image/index/warning.png" />
					<view>{{bak_title_str4}}</view>
				</view>
			</view>
			<view @tap="btnConfirm()" class="container-login">{{bak_title_str5}}</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				words: [],
				scrollHeight: 0,
				paramsObj:{}
			}
		},
		onLoad(option) {
			if(option.query){
				let params = JSON.parse(option.query);
				this.paramsObj = params;
			}
			this.initword();
			//获取助记词
			this.getMnemonic();
		},
		methods: {
			initword(){
				this.bak_title_str1 = this.getLocalStr("bak_title_str1")
				this.bak_title_str2 = this.getLocalStr("bak_title_str2")
				this.bak_title_str3 = this.getLocalStr("bak_title_str3")
				this.bak_title_str4 = this.getLocalStr("bak_title_str4");
				this.bak_title_str5 = this.getLocalStr("bak_title_str5");
				
				this.err_tip_str16 = this.getLocalStr("err_tip_str16");
				this.err_tip_str17 = this.getLocalStr("err_tip_str17");
			},
			btnBack:function(){
				this.util.UiUtils.switchBackPage();
			},
			
			btnConfirm:function(){
				if (!this.words || this.words.length <= 0) {
					this.util.UiUtils.showToast(this.err_tip_str16)
					return;
				}
				let params ={
					...this.paramsObj,
					words:this.words.join(' ')
				}
				this.$openPage({name:'backup-info-sure',query:params});
			},
			async getMnemonic(){
				let res = await this.dal.WalletManage.getMnemonic();
	            if(res){
					 this.words = res.split(' ');
				}else{
					this.util.UiUtils.showToast(this.err_tip_str17)
				}
			}
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

<style lang="scss" scoped>
	@import "backup-info.scss"
</style>
