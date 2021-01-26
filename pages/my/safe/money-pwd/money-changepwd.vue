<template>
	<view class="money-pwd">
		<bar ref="bar" style="background-color: #FFFFFF;"></bar>
		<view @tap="btnBack()" class="safe-header">
			<image src="../../../../static/image/login/left.svg" />
			<text>修改资金密码</text>
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
					 <!-- <view @tap="btnYzm()" style="color: #007AFF;margin-left: 0px;width: 120px;">获取验证码</view> -->
					 <text @tap="btnYzm()" v-if="messageShow"  class="send-message">获取验证码</text>
					 <text class="doajishi" v-if="timeShow">倒计时{{timeValue}}S</text>
				</view>
			</view>
			
			<view class="type-list">
				<view class="list-title">
					原始资金密码
				</view>
				<view class="info-content">
					<QSInput :maxlength="20" fontSize="13px" name="password" placeholder="请输入原始密码" style="height: 30px;display: flex;justify-content: center;align-items: center;" :filterFc="oldPassWordFilterInput"
					 variableName="password" password title="" v-model="password" focusBorderColor="#FFFFFF" blurBorderColor="#FFFFFF"></QSInput>
				</view>
			</view>
			<view class="type-list">
				<view class="list-title">
					新密码
				</view>
				<view class="info-content">
				<QSInput :maxlength="20" fontSize="13px" name="newpassword" placeholder="请输入新密码" style="height: 30px;display: flex;justify-content: center;align-items: center;" :filterFc="newPassWordFilterInput"
					 variableName="newpassword" password title="" v-model="newpassword" focusBorderColor="#FFFFFF" blurBorderColor="#FFFFFF"></QSInput>
				</view>
			</view>
			<view class="type-list">
				<view class="list-title">
					确认密码
				</view>
				<view class="info-content">
					<QSInput :maxlength="20" fontSize="13px" name="againpawword" placeholder="请输入确认密码" style="height: 30px;display: flex;justify-content: center;align-items: center;" :filterFc="newAgainPassWordFilterInput"
						 variableName="againpawword" password title="" v-model="againpawword" focusBorderColor="#FFFFFF" blurBorderColor="#FFFFFF"></QSInput>
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
			this.util.EventUtils.addEventListenerCustom(this.dal.Setting.evtChangeCapitalPassword, this.onChangeCapitalPassword);
		},
			
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Setting.evtChangeCapitalPassword, this.onChangeCapitalPassword);
		},
		data(){
			return{
				password:"",
				newpassword:"",
				againpawword:"",
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
				oldPassWordFilterInput(value) {
					return value;
				},
				newPassWordFilterInput(value) {
					return value;
				},
				newAgainPassWordFilterInput(value){
					return value;
				}
			}
		},
		methods: {
			btnBack:function(){
				this.util.UiUtils.switchBackPage();
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
			onChangeCapitalPassword:function(){
				uni.showModal({
					title: this.getLocalStr("tip_title"),
					content: "资金密码修改成功!",
					confirmText: this.getLocalStr("btnstring_confirm"),
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							this.btnBack();
						}
					}.bind(this)
				});
			},
			
			btnConfirm: function() {
				console.log("=this.password=",this.password)
				console.log("=this.newpassword=",this.newpassword)
				console.log("=this.againpawword=",this.againpawword)
				let yzm = this.password.replace(new RegExp(/( )/g), "");
				let password = this.password.replace(new RegExp(/( )/g), "");
				let newpassword = this.newpassword.replace(new RegExp(/( )/g), "");
				let againpawword = this.againpawword.replace(new RegExp(/( )/g), "");
				if (password.length <= 0) {
					this.util.UiUtils.showToast("原始资经密码不能为空")
					return;
				}
				if (password.length < 6) {
					this.util.UiUtils.showToast("原始密码格式不正确")
					return;
				}
				if (newpassword.length <= 0) {
					this.util.UiUtils.showToast("新密码不能为空")
					return;
				}
				if (newpassword.length < 6) {
					this.util.UiUtils.showToast("新密码不能小于6位")
					return;
				}
				if (againpawword.length <= 0) {
					this.util.UiUtils.showToast("确认密码不能为空")
					return;
				}
				if (againpawword != newpassword) {
					this.util.UiUtils.showToast("两次输入的密码不致")
					return;
				}
				
				this.util.UiUtils.showLoading("设置中...")
				this.dal.Setting.onChangeCapitalPassword(password,againpawword)
			}
		}
	}
</script>

<style lang="scss">
	@import 'money-pwd.scss';
</style>
