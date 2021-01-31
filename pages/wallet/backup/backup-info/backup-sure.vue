<template>
	<view class="backup-info">
     <uniNavBar :statusBar="true" :fixed="true" left-icon="back" title="确认助记词" @clickLeft="btnBack"></uniNavBar>
		<view style="margin-top: 20px;">
			<label style="font-size: 16px;display: flex;margin-left: 30px;color: #007AFF;">
				请按顺序点击助记词，以确定您正确备份。</label>
		</view>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<view class="sure-content">
				<view style="width: 100%; display: flex;justify-content: center;margin-top: 0px;">
					<view style="width: 96%;height: 250px;background-color: #F2F2F2;border-radius: 10px;display: flex;justify-content: center;">
						<view style="display: flex;flex-wrap: wrap;margin-top: 10px;">
							<view v-for="item in seletItems" :key="item.index">
								<wordItem :keyvalue="menuKey" :item='item' :closeFun="closeFun" :iswron="item.iswron"></wordItem>
							</view>
						</view>
					</view>
				</view>
				<view style="width: 100%;display: flex;justify-content: center;">
					<view style="display: flex;flex-wrap: wrap;margin-top: 10px;margin-left: -10px;justify-content: center;width: 100%;">
						<view v-for="item in tmpwords" :key="item.index">
							<wordItem :ref="item.idx" :item='item' :selectFun="selectFun" :isselect="item.isselect"></wordItem>
						</view>
					</view>
					
				</view>
			</view>
			
			<view @tap="btnConfirm()" class="container-login">已确认备份</view>
		</scroll-view>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	import wordItem from "./wordItem"
	export default {
		components: {
			Bar,
			wordItem
		},
	
		created() {
			let wordStr = this.dal.Wallter.m_MnemonicInfo;
			this.words = wordStr.split(' ')
					
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
							this.util.UiUtils.showToast("助记词顺序不正确，请校对");
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
					this.util.UiUtils.showToast("助记词不能为空");
					return;
				}
				if (this.seletItems.length != this.words.length) {
					this.util.UiUtils.showToast("助记词不正确");
					return;
				}
				for (var i = 0; i < this.seletItems.length; i++) {
					var item = this.seletItems[i];
					var tword = this.words[i]
					if (item.val != tword) {
						console.log("===item.val==", item.val)
						console.log("===tword.val==", tword)
						this.util.UiUtils.showToast("助记词顺序错误");
						return;
					}
				}
			
				uni.showModal({
					title: this.getLocalStr("tip_title"),
					content: "助记词正确,进入您的钱包",
					confirmText: this.getLocalStr("btnstring_confirm"),
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							this.util.UiUtils.switchToPage("wallet-index", "backup-info-sure",{},"switchTab");
						}
					}.bind(this)
				});
			
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
	@import "backup-info.scss"
</style>
