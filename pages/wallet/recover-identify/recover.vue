<template>
	<view class="recover-index">
		<bar ref="bar"></bar>
		<view @tap="btnBack()" class="safe-header">
			<image src="../../static/image/login/left.svg" />
			<text>恢复身份</text>
		</view>
		<view style="height: 10px;"></view>
		<view style="width: 100%;display: flex;justify-content: center;">
			<view style="display: flex;justify-content: left;margin-bottom: 20px;margin-top: 10px;width: 90%;">
				<uni-segmented-control style="width: 230px;" :current="current" :values="items" @clickItem="onClickItem" style-type="text"
				 active-color="#007AFF"></uni-segmented-control>
			</view>
		</view>
		<scroll-view v-show="current == 0"  class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<textarea @blur="bindTxtContent" placeholder-style="color:#909090;font-size:13px;" placeholder="请输入助记词单词，并用空格分隔" />
			</scroll-view>
		<scroll-view v-show="current == 1" class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<textarea @blur="bindTxtPrivate" placeholder-style="color:#909090;font-size:13px;" placeholder="请输入私钥"/>
		</scroll-view>
		<view @tap="btnRecover()" :disabled="isdisabled" class="container-login">恢复身份</view>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	
	export default {
		components: {
			Bar,
			uniSegmentedControl
		},
		data() {
			return {
				items: ['助记词恢复', '私钥恢复'],
				scrollHeight: 0,
				current: 0,
				txtPrivate:"",
				txtContent:"",
				isdisabled:false,
			}
		},
		onLoad() {
			
		},
		methods: {
			btnBack:function(){
				this.util.UiUtils.switchBackPage();
			},
			bindTxtContent: function(e) {
				this.txtContent = e.detail.value
				console.log("==this.txtContent====", this.txtContent)
			},
			bindTxtPrivate: function(e) {
				this.txtPrivate = e.detail.value
				console.log("==this.txtContent====", this.txtPrivate)
			},
			btnRecover:function(){
				console.log("=22===this.txtPrivate=", this.txtPrivate)
				let privateval = this.txtPrivate.replace(' ', '').replace("0x", '')
				let content = this.txtContent					
				console.log("=22===privateval=", privateval)
				console.log("=22===content=", content)
				if (this.current == 0) {
					if (content.length <= 0) {
						this.util.UiUtils.showToast("助记词不能为空")
						return;
					}
					this.words = content.split(' ')
					console.log("=22===ws=", this.words)
					if (this.words.length < 12) {
						this.util.UiUtils.showToast("助记词长度不正确")
						return;
					}
					var isValid = this.dal.Wallter.findPassword(content);
					if (!isValid) {
						this.util.UiUtils.showToast("助记词不正确")
						return;
					}
					var Mnemonic = this.dal.Wallter.getMnemonic()
					if (!Mnemonic || Mnemonic.length <= 0) {
						this.util.UiUtils.showToast("助记词不正确")
						return;
					}
				} else {
					if (privateval.length <= 0) {
						this.util.UiUtils.showToast("私钥不能为空")
						return;
					}
					let res = this.dal.Wallter.recoveryEthWallter(privateval);
					if (!res) {
						this.util.UiUtils.showToast("私钥不正确，请重新输入")
						return;
					}
				}
				this.isdisabled = true;
				this.dal.Wallter.m_password = this.password;
				this.dal.Wallter.m_passTip = this.passtips;
				this.dal.Wallter.addKey();
				this.util.UiUtils.switchToPage("tip-page-recover-tip", "create-wallter",{},'reLaunch');
			},
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex;
				}
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
	@import "recover.scss"
</style>
