<template>
	<view class="money-pwd">
		<bar ref="bar" style="background-color: #FFFFFF;"></bar>
		<view @tap="btnBack()" class="safe-header">
			<image src="../../../static/image/login/left.svg" />
			<text>设置资金密码</text>
		</view>
		<view class="mine-type">
			<view class="type-list">
				<view class="list-title">
					手机号
				</view>
				<view class="info-content">
					<label style="color: #8e9098;">{{m_phonenumber}}</label>
				</view>
			</view>
			<view class="type-list">
				<view class="list-title">
					验证码
				</view>
				<view class="info-content"  style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
					<QSInput :maxlength="6" inputwidth="120px" fontSize="13px" name="yzm" placeholder="请输入验证码" :filterFc="yzmWordFilterInput"
					 variableName="yzm" style="height: 30px;justify-content: center;align-items: center;" title="" v-model="yzm" focusBorderColor="#FFFFFF" blurBorderColor="#FFFFFF"></QSInput>
					 <!-- <view @tap="btnYzm()" v-if="messageShow" style="color: #007AFF;margin-left: 0px;width: 120px;">获取验证码</view> -->
					 <text @tap="btnYzm()" v-if="messageShow"  class="send-message">获取验证码</text>
					 <text class="doajishi" v-if="timeShow">倒计时{{timeValue}}S</text>
				</view>
			</view>
			<view class="type-list">
				<view class="list-title">
					资金密码
				</view>
				<view class="info-content">
				<QSInput :maxlength="20" fontSize="13px" name="zjpassword" placeholder="请输入资金密码" style="height: 30px;display: flex;justify-content: center;align-items: center;" :filterFc="zjPassWordFilterInput"
					 variableName="zjpassword" password title="" v-model="zjpassword" focusBorderColor="#FFFFFF" blurBorderColor="#FFFFFF"></QSInput>
				</view>
			</view>
			<view class="type-list">
				<view class="list-title">
					确认密码
				</view>
				<view class="info-content">
					<QSInput :maxlength="20" fontSize="13px" name="zjagainpawword" placeholder="请输入确认密码" style="height: 30px;display: flex;justify-content: center;align-items: center;" :filterFc="zjAgainPassWordFilterInput"
						 variableName="zjagainpawword" password title="" v-model="zjagainpawword" focusBorderColor="#FFFFFF" blurBorderColor="#FFFFFF"></QSInput>
				</view>
			</view>
		</view>
		<view @tap="btnConfirm()" class="container-login">确定</view>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	export default {
		components: {
			Bar
		},
		created() {
			if(this.dal.Character.m_playerInfo.phone){
				let phone = this.dal.Character.m_playerInfo.phone.replace(this.dal.Character.m_playerInfo.phone.substring(3, 7), "****")
				this.m_phonenumber = phone;
			}
			this.util.EventUtils.addEventListenerCustom(this.dal.Setting.evtCapitalPassword, this.onCapitalPassword);
		},
	
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Setting.evtCapitalPassword, this.onCapitalPassword);
		},
		data(){
			return{
				password:"",
				zjpassword:"",
				zjagainpawword:"",
				m_phonenumber:"",
				yzm:"",
				timer:null,
				messageShow:true,
				timeShow:false,
				timeValue:60,
				yzmWordFilterInput(value) {
					value = value.replace(/[^\d]/g,'')
					return value;
				},
				zjPassWordFilterInput(value) {
					return value;
				},
				zjAgainPassWordFilterInput(value){
					return value;
				}
			}
		},
		methods: {
			btnBack:function(){
				this.util.UiUtils.switchBackPage();
			},	
			onCapitalPassword:function(){
				uni.showModal({
					title: this.getLocalStr("tip_title"),
					content: "资金密码设置成功",
					confirmText: this.getLocalStr("btnstring_confirm"),
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							this.btnBack();
						}
					}.bind(this)
				});
			},
			btnYzm:function(){
				if(this.dal.Character.m_playerInfo.phone){
					if(!this.timer){
						this.messageShow =false;
						this.timeShow = true;
						this.timer = setInterval(()=>{
							if(this.timeValue > 0 && this.timeValue <= 60){
								this.timeValue--;
							}else{
								this.messageShow = true;
								this.timeShow = false;
								clearInterval(this.timer);
								this.timer = null;
								this.timeValue = 60
							}
						},1000)
					}
					
					this.dal.Account.onGetCaptcha(this.dal.Character.m_playerInfo.phone,this.entities.Metadata.SmsType.XXBG)
				}
			},
			btnConfirm: function() {
				console.log("=this.password=",this.password)
				console.log("=this.zjpassword=",this.zjpassword)
				console.log("=this.zjagainpawword=",this.zjagainpawword)
				// useryzm
				let yzm = this.yzm.replace(new RegExp(/( )/g), "");
				let zjpassword = this.zjpassword.replace(new RegExp(/( )/g), "");
				let zjagainpawword = this.zjagainpawword.replace(new RegExp(/( )/g), "");
				if (yzm.length <= 0) {
					this.util.UiUtils.showToast("请输入手机验证码")
					return;
				}
				if (yzm.length < 6) {
					this.util.UiUtils.showToast("手机验证码密码格式不正确")
					return;
				}
				if (zjpassword.length <= 0) {
					this.util.UiUtils.showToast("资金密码不能为空")
					return;
				}
				if (zjpassword.length < 6) {
					this.util.UiUtils.showToast("资金密码不能小于6位")
					return;
				}
				if (zjagainpawword.length <= 0) {
					this.util.UiUtils.showToast("确认密码不能为空")
					return;
				}
				if (zjagainpawword != zjpassword) {
					this.util.UiUtils.showToast("两次输入的密码不致")
					return;
				}
				
				this.util.UiUtils.showLoading("设置中...")
				this.dal.Setting.onCapitalPassword(zjpassword,this.dal.Character.m_playerInfo.phone,yzm)
			}
		}
	}
</script>

<style lang="scss">
	@import 'money-pwd.scss';
</style>
