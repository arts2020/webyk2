<template>
	<view class="backup-info">
		
		<uniNavBar :status="true" :fixed="true" left-icon="back" title="备份助记词" @clickLeft="btnBack"></uniNavBar>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<view class="backup-title">请按顺序抄写助记词，确保备份正确</view>
			<view class="backup-content">
				<view class="backup-list">
					<view class="list">
						<text>1</text>
						<view>{{words[0]}}</view>
					</view>
					<view class="list">
						<text>2</text>
						<view>{{words[1]}}</view>
					</view>
					<view class="list">
						<text>3</text>
						<view>{{words[2]}}</view>
					</view>
				</view>
				<view class="backup-list">
					<view class="list">
						<text>4</text>
						<view>{{words[3]}}</view>
					</view>
					<view class="list">
						<text>5</text>
						<view>{{words[4]}}</view>
					</view>
					<view class="list">
						<text>6</text>
						<view>{{words[5]}}</view>
					</view>
				</view>
				<view class="backup-list">
					<view class="list">
						<text>7</text>
						<view>{{words[6]}}</view>
					</view>
					<view class="list">
						<text>8</text>
						<view>{{words[7]}}</view>
					</view>
					<view class="list">
						<text>9</text>
						<view>{{words[8]}}</view>
					</view>
				</view>
				<view class="backup-list">
					<view class="list">
						<text>10</text>
						<view>{{words[9]}}</view>
					</view>
					<view class="list">
						<text>11</text>
						<view>{{words[10]}}</view>
					</view>
					<view class="list">
						<text>12</text>
						<view>{{words[11]}}</view>
					</view>
				</view>
			</view>
			<view class="create-list">
				<view class="tip-list">
					<image src="../../../../static/image/notice/warn.svg" />
					<view>妥善保管助记词至隔离网络的安全地方</view>
				</view>
				<view class="tip-list">
					<image src="../../../../static/image/notice/warn.svg" />
					<view>请勿将助记词联网环境下存储或分享，如相册，邮件社会应用等</view>
				</view>
			</view>
			<view @tap="btnConfirm()" class="container-login">已确认备份</view>
		</scroll-view>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	export default {
		components: {
			Bar
		},
		created() {
			// this.util.EventUtils.addEventListenerCustom(this.dal.Wallter.evtGetMnemonic, this.getMnemonic);
		},
		destroyed() {
			// this.util.EventUtils.removeEventCustom(this.dal.Wallter.evtGetMnemonic, this.getMnemonic);
		},
		
		data() {
			return {
				words: [],
				scrollHeight: 0,
			}
		},
		onLoad() {
			
		},
		methods: {
			btnBack:function(){
				this.util.UiUtils.switchBackPage();
			},
			
			btnConfirm:function(){
				// if (!this.words || this.words.length <= 0) {
				// 	this.util.UiUtils.showToast("助记词异常")
				// 	return;
				// }
				this.util.UiUtils.switchToPage("backup-info-sure", "backup-info",{});
			},
			getMnemonic(data){
				// this.words = data.data.split(' ')
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
			// this.dal.Wallter.onGetMnemonic();
		}
	}
</script>

<style lang="scss" scoped>
	@import "backup-info.scss"
</style>
