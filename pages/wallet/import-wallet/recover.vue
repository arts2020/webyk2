<template>
	<view class="recover-index">
		<uni-nav-bar left-icon="back" title="恢复身份" @clickLeft="btnBack"></uni-nav-bar>
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
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	
	export default {
		components: {
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
		created() {
			this.util.EventUtils.addEventListenerCustom(this.dal.Wallter.evtRecoverStatus, this.recoverWallet);
		},
		destroyed() {
			this.util.EventUtils.addEventListenerCustom(this.dal.Wallter.evtRecoverStatus, this.recoverWallet);
		},
		onLoad() {
			
		},
		methods: {
			btnBack:function(){
				this.util.UiUtils.switchBackPage();
			},
			bindTxtContent: function(e) {
				this.txtContent = e.detail.value
			},
			bindTxtPrivate: function(e) {
				this.txtPrivate = e.detail.value
			},
			btnRecover:function(){
				let privateval = this.txtPrivate.replace(' ', '').replace("0x", '')
				let content = this.txtContent					
				if (this.current == 0) {
					if (content.length <= 0) {
						this.util.UiUtils.showToast("助记词不能为空")
						return;
					}
					this.words = content.split(' ')
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
				
				this.dal.Wallter.onRecoverStatus();
				// this.util.UiUtils.switchToPage("tip-page-recover-tip", "create-wallter",{},'reLaunch');
			},
			recoverWallet(data){
				this.util.UiUtils.switchToPage("wallet-index", "import-wallet-recover",{},'switchTab');
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

<style lang="scss" scoped>
	.recover-index{
		height: 100%;
		width: 100%;
		overflow: hidden;
		background: linear-gradient(180deg,#f2f6fa, #ffffff);
		.safe-header{
			width: 100%;
			height: 44px;
			line-height: 44px;
			padding: 0 15px;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			border-bottom: 5px solid rgba(0,0,0,0.04);
			image{
				width: 18px;
				height: 18px;
			}
			text{
				font-size: 16px;
				font-weight: bolder;
				color: #111111;
				margin-left: 6px;
			}
		}
		.recover-title{
			padding: 20px 15px 10px 20px;
			font-size: 16px;
			font-family: PingFang SC, PingFang SC-Heavy;
			font-weight: 800;
			color: #071328;
		}
		uni-textarea{
			width: auto !important;
			margin: 0 15px;
			background: #ffffff;
			border: 1px solid #e7e6ed;
			border-radius: 3px;
			padding: 10px;
		}
		.container-login {
			width: 30%;
			height: 36px;
			line-height: 36px;
			border-radius: 4px;
			color: #FFFFFF;
			text-align: center;
			background: linear-gradient(to right, #3FA2FF, #5470FF);
			font-size: 13px;
			letter-spacing: 1px;
			position: fixed;
			bottom: 10%;
			left: 35%;
		}
	}
</style>
