<template>
	<view class="backup-sure">
     <uniNavBar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" title="确认助记词" @clickLeft="btnBack"></uniNavBar>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<view class="top-title">
			    请按顺序点击助记词，以确定您正确备份。
			</view>
			<view class="sure-content">
				<view class="top-box">
					<wordItem v-for="item in seletItems" :key="item.index" :keyvalue="menuKey" :item='item' :closeFun="closeFun" :iswron="item.iswron"></wordItem>
				</view>
				<view class="botto-box">
					<wordItem v-for="item in tmpwords" :key="item.index" :ref="item.idx" :item='item' :selectFun="selectFun" :isselect="item.isselect"></wordItem>
				</view>
			</view>
			<view @tap="btnConfirm()" class="container-login">已确认备份</view>
		</scroll-view>
		<uni-popup ref="popup" type="message">
		    <uni-popup-message type="error" :message="errMsg" :duration="2000"></uni-popup-message>
		</uni-popup>
		<uni-popup type="center" ref="successPop">
			<view class="success-c">
				<image src="../../../../static/image/index/readlly.png" mode=""></image>
			    <view>助记词正确</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
    import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message'
	import wordItem from "./wordItem"
	export default {
		components: {
			wordItem,
			uniPopup,
			uniPopupMessage
		},
	
		created() {
			// let wordStr = this.dal.Wallter.m_MnemonicInfo;
			// this.words = wordStr.split(' ')
				this.words = ["asdwc",'asdddddh','dfgrehyt',"asdwc",'asdddddh','dfgrehyt',"asdwc",'asdddddh','dfgrehyt',"asdwc",'asdddddh','dfgrehyt']	
			var ws = [];
			for (var i = 0; i < this.words.length; i++) {
				var a = {
					idx: i,
					val: this.words[i],
					type: 1,
				}
				ws.push(a)
			}
			this.tmpwords = ws;
			this.randomWords();
		},
		
		data() {
			return {
				errMsg:"",
				scrollHeight: 0,
				words: [],
				seletItems: [],
				tmpwords:[],
				menuKey: 0,
				isok: true,
				wrongIndex: 0,
				removeSelect: function(key) {
					for (var i = 0; i < this.seletItems.length; i++) {
						var item = this.seletItems[i];
						if (item.idx == key) {
							this.seletItems.splice(i, 1);
						}
					}
				}.bind(this),
		
				updateWords: function(key) {
					for (var i = 0; i < this.tmpwords.length; i++) {
						var item = this.tmpwords[i];
						if (item.idx == key) {
							item.isselect = false;
						}
					}
				}.bind(this),
		
				selectFun: function(key, type, val) {
					if (type == 2) {
						this.closeFun();
						return;
					} else {
						for (var i = 0; i < this.seletItems.length; i++) {
							var item = this.seletItems[i];
							if (item.idx == key) {
								return;
							}
						}
						this.isok = this.issameWord(key, val);
						if (this.isok == false) {
							this.errMsg = '助记词顺序不正确，请校对';
							this.$refs.popup.open()
							// this.util.UiUtils.showToast("助记词顺序不正确，请校对");
						}
		
						for (var i = 0; i < this.tmpwords.length; i++) {
							var item = this.tmpwords[i];
							if (item.idx == key) {
								item.isselect = true;
								var tmp = {};
								tmp.idx = item.idx;
								tmp.val = item.val;
								tmp.iswron = !this.isok;
								tmp.type = 2
								this.seletItems.push(tmp)
							}
						}
					}
				}.bind(this),
		
				closeFun: function(key) {
					this.removeSelect(key);
					this.updateWords(key);
				}.bind(this)
			};
		},
		methods: {
			btnBack:function(){
				this.util.UiUtils.switchBackPage();
			},
			
			onRefresh() {
				var ws = this.dal.Wallter.getMnemonic();
				this.words = ws.split(' ')
			},
			
			randomWords: function() {
				var randomNumber = function() {
					return 0.5 - Math.random()
				}
				this.tmpwords.sort(randomNumber)
			},
			btnConfirm() {
				if (this.seletItems.length <= 0) {
					this.errMsg = '助记词不能为空';
					this.$refs.popup.open()
					// this.util.UiUtils.showToast("助记词不能为空");
					return;
				}
				if (this.seletItems.length != this.words.length) {
					this.errMsg = '助记词不正确';
					this.$refs.popup.open()
					// this.util.UiUtils.showToast("助记词不正确");
					return;
				}
				for (var i = 0; i < this.seletItems.length; i++) {
					var item = this.seletItems[i];
					var tword = this.words[i]
					if (item.val != tword) {
						this.errMsg = '助记词顺序错误';
						this.$refs.popup.open()
						// this.util.UiUtils.showToast("助记词顺序错误");
						return;
					}
				}
			
				// uni.showModal({
				// 	title: this.getLocalStr("tip_title"),
				// 	content: "助记词正确,进入您的钱包",
				// 	confirmText: this.getLocalStr("btnstring_confirm"),
				// 	showCancel: false,
				// 	success: function(res) {
				// 		if (res.confirm) {
				// 			this.util.UiUtils.switchToPage("wallet-index", "backup-info-sure",{},"switchTab");
				// 		}
				// 	}.bind(this)
				// });
				
				// 打开成功的弹框 1s后关掉并跳转
				this.$refs.successPop.open();
				setTimeout(()=>{
					this.$refs.successPop.close();
					this.util.UiUtils.switchToPage("wallet-index", "backup-info-sure",{},"switchTab");
				},1000)
			
			},
			bindTextAreaBlur: function(e) {
				console.log(e.detail.value)
			},
			
			issameWord: function(key, val) {
				var skey = this.seletItems.length;
				var tval = this.words[skey];
				if (tval == val) {
					return true;
				}
				return false;
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
.backup-sure{
	width: 100%;
	background-color: #FFFFFF;
	/deep/ .uni-navbar--border{
		border: 0;
	}
	/deep/ .uni-popup{
		z-index: 999;
	}
	/deep/ .uni-popup__error{
		background-color: #F5777A;
	}
	/deep/ .uni-popup__error-text{
		color: #FFFFFF;
	}
	/deep/ .uni-transition{
		background-color: rgba(0, 0, 0, 0)!important;
	}
	.uni-content{
		width: 100%;
		padding: 50rpx 25rpx;
		box-sizing: border-box;
		.top-title{
			padding-left: 30rpx;
			box-sizing: border-box;
			margin-bottom: 36rpx;
			font-size: 28rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			color: #071328;
		}
		.sure-content{
			width: 100%;
			.top-box{
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				align-content: flex-start;
				height: 480rpx;
				background: #fafbfd;
				border: 3rpx solid #e7e6ed;
				border-radius: 13rpx;
				margin-bottom: 36rpx;
				padding: 28rpx 24rpx;
				box-sizing: border-box;
			}
			.botto-box{
				width: 100%;
				display: flex;
				flex-wrap: wrap;
			}
		}
		.container-login{
			width: 647rpx;
			height: 88rpx;
			background: #4c72ef;
			border-radius: 14rpx;
			box-shadow: 0px 3rpx 26rpx 0px rgba(0,0,0,0.06); 
			line-height: 88rpx;
			position: fixed;
			bottom: 47rpx;
			left: 50%;
			transform: translateX(-50%);
			font-size: 32rpx;
			font-family: PingFang SC, PingFang SC-Bold;
			font-weight: 700;
			text-align: center;
			color: #ffffff;
		}
	}
    .success-c{
		width: 314rpx;
		height: 287rpx;
		background: #10bb92;
		border-radius: 20rpx;
		text-align: center;
		image{
			width: 111rpx;
			height: 111rpx;
			border-radius: 50%;
			margin: 49rpx 0 31rpx;
		}
		view{
			font-size: 32rpx;
			font-family: PingFang SC, PingFang SC-Bold;
			font-weight: 700;
			text-align: center;
			color: #ffffff;
		}
	}
}
</style>
