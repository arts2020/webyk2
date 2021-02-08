<template>
	<view class="backup-info">
		<uniNavBar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" title="备份助记词" @clickLeft="btnBack"></uniNavBar>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<view class="backup-title">请按顺序抄写助记词，确保备份正确</view>
			<view class="backup-content">
				<view class="list" v-for="(item,index) in words" :key="index">
					<view>{{item}}</view>
					<text>{{index+1}}</text>
					
				</view>
			</view>
			<view class="create-list">
				<view class="tip-list">
					<image src="../../../../static/image/index/warning.png" />
					<view>妥善保管助记词至隔离网络的安全地方</view>
				</view>
				<view class="tip-list">
					<image src="../../../../static/image/index/warning.png" />
					<view>请勿将助记词联网环境下存储或分享，如相册，邮件社会应用等</view>
				</view>
			</view>
			<view @tap="btnConfirm()" class="container-login">已确认备份</view>
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
			//获取助记词
			this.getMnemonic();
		},
		methods: {
			btnBack:function(){
				this.util.UiUtils.switchBackPage();
			},
			
			btnConfirm:function(){
				if (!this.words || this.words.length <= 0) {
					this.util.UiUtils.showToast("助记词异常")
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
					this.util.UiUtils.showToast("助记词获取失败!")
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
