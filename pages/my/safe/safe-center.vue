<template>
	<view class="safe-center">
		<bar ref="bar"></bar>
		<view @tap="btnBack()" class="safe-header">
			<image src="../../static/image/login/left.svg" />
			<text>安全中心</text>
		</view>
		<view class="mine-type">
			<view @tap="btnMoneyPassWord()" class="type-list">
				<view class="list-title">
					设置资金密码
				</view>
				<image class="right-icon" src="../../static/image/mine/arrow-left.svg" />
			</view>
			<view @tap="btnLoginPassWord()" class="type-list">
				<view class="list-title">
					修改登录密码
				</view>
				<image class="right-icon" src="../../static/image/mine/arrow-left.svg" />
			</view>
			<view @tap="btnPrivate(3)" class="type-list">
				<view class="list-title">
					导出钱包助记词
				</view>				
				<image class="right-icon" src="../../static/image/mine/arrow-left.svg" />
			</view>
			<view  class="type-list"  @click="changeContent()">
				<view class="list-title">
					导出钱包私钥
				</view>
				<image class="right-icon" :src="imgUrl" />
			</view>
			<view class="type-content" v-show="showContent">
				<view class="content-list" @tap="btnPrivate(1)">
					导出ETH私钥
				</view>
				<view class="content-list" @tap="btnPrivate(2)">
					导出FILECOIN私钥
				</view>
			</view>
			
		</view>
		<e-modal :visible.sync="visible" @cancel="handleCancel">
			<view style="width: 100%;height: 220px;display: flex;justify-content: center;flex-direction: column;align-items: center;">
				<view style="font-weight: 800;font-size: 20px;margin-bottom: 20px;">资金密码</view>
				<QSInput :maxlength="12" inputwidth="93%" name="password" placeholder="请输入资金密码" :filterFc="passWordFilterInput"
				 variableName="password" password title="" v-model="password" focusBorderColor="#cddce6" blurBorderColor="#cddce6"></QSInput>
				<view style="margin-bottom: 15px;display: flex;flex-direction: row;width: 80%;">
					<button class="button-style" @tap="btnCancel">取消</button>
					<button class="button-style" @tap="btnConfirm">导出</button>
				</view>
			</view>
		
		</e-modal>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	export default {
		components: {
			Bar
		},
		created() {
			this.util.EventUtils.addEventListenerCustom(this.dal.Setting.evtCheckCapitalPassword, this.onCheckCapitalPassword);
		},
			
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Setting.evtCheckCapitalPassword, this.onCheckCapitalPassword);
		},
		data(){
			return{
				visible: false,
				password: "",
				m_type : 0,
				passWordFilterInput(value) {
					return value;
				},
				imgUrl:'../../static/image/mine/arrow-left.svg',
				showContent:false
			}
		},
		methods: {
			btnBack:function(){
				this.$openPage({name: "mine-mine",query: {}})
			},	
			btnMoneyPassWord:function(){
				console.log("===this.dal.Character.m_playerInfo====",this.dal.Character.m_playerInfo.isset_capital_pwd);
				if(this.dal.Character.m_playerInfo.isset_capital_pwd == 1){
					this.$openPage({name: "safe-money-changepwd",query: {}})
				}else{
					this.$openPage({name: "safe-money-pwd",query: {}})
				}
			},
			btnLoginPassWord:function(){
				this.$openPage({name: "safe-money-pwd-sure-pwd",query: {type:2}})
			},
			btnPrivate:function(type){
				this.password = "";
				this.m_type = type;
				// this.isWallet = this.dal.Wallter.isValidWallet();
				// if(this.isWallet){
				// 	this.visible = true;
				// }else{
					let mne = this.dal.Wallter.getMnemonic();
					if(!mne || mne.length <= 0){
						this.util.UiUtils.showToast("您没通过助记词导出钱包，无法导出");
						return;
					}
					
					// this.util.UiUtils.showToast("请先开启钱包");
					uni.showModal({
						title: this.getLocalStr("tip_title"),
						content: "您的钱包暂未开启，请问去开启您的钱包吗？",
						confirmText: this.getLocalStr("btnstring_confirm"),
						showCancel: true,
						success: function(res) {
							if (res.confirm) {
								this.util.UiUtils.switchToPage("mine-creat-wallet", "mine-mine", {});
							}
						}.bind(this)
					});
				// }
			},
			
			handleCancel() {
				console.log('cancel')
			},
			btnCancel: function() {
				this.visible = false;
			},
	
			btnConfirm: function(e) {
				console.log("=====dddd=====",this.password);
				console.log("==m_password=",this.dal.Wallter.m_password)
				let psw = this.password.replace(new RegExp(/( )/g), "");
				if(this.password.length <= 0){
					this.util.UiUtils.showToast("请输入您的资金密码");
					return;
				}
				this.util.UiUtils.showLoading("检测中...");
				this.dal.Setting.onCheckCapitalPassword(psw);
				this.visible = false;
			},
			onCheckCapitalPassword:function(data){
				console.log("==onCheckCapitalPassword==data=",data)
				// this.util.UiUtils.showToast("您的资金密码错误，私钥导出失败!");
				let self = this;
				let pkey = "";
				
				if(this.m_type == 1){
					pkey = self.dal.Wallter.getPrivateKey();
				}else if(this.m_type == 2){
					pkey = self.dal.LotusWallter.getPrivateKey();
				}else if(this.m_type == 3){
					pkey = self.dal.Wallter.getMnemonic();
				}
				if(pkey.length <= 0){
					if(this.m_type== 3){
						self.util.UiUtils.showToast("您没有通过助记词恢复钱包，无法备份注记词");
					}else{
						self.util.UiUtils.showToast("复制失败");
					}
					return;
				}
				
				if(pkey.substring(0,2) == "0x"){
					pkey = pkey.substring(2,pkey.length);
				}
				console.log('==self.dal.Wallet.getPrivateKey=',pkey)
				uni.setClipboardData({
					data: pkey,
					success: function(data) {
						self.util.UiUtils.showToast("私钥复制成功");
					},
					fail: function(err) {},
					complete: function(res) {}
				});
			},
			changeContent(){
				this.showContent = !this.showContent
				if(this.showContent == false){
					this.imgUrl = '../../static/image/mine/arrow-left.svg'
				}else{
					this.imgUrl = '../../static/image/index/dowm.svg'
				}
			}
		}
		
	}
</script>

<style lang="scss">
	@import 'safe-center.scss';
	.button-style {
		transform: scale(0.7);
		margin-top: 30px;
		max-height: 45px;
		width: 150px;
		color: #FFFFFF;
		border: 1px solid #007AFF;
		background: #FFFFFF;
		color: #007AFF;
	}
</style>