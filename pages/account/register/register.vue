<template>
	<view class="login-index">
		<bar ref="bar"></bar>
		<view class="login-back" @tap="btnBack">
			<image src="../../static/image/login/back.svg" />
		</view>
		<view class="login-content">
			<view class="login-title">
				<view class="title">注册</view>
				<view class="create-user" @tap="btnBackLogin">
					<text>已有珀芯账号，去登录</text>
					<image src="../../static/image/mine/back.svg" />
				</view>
			</view>
			
			<view class="from-content">
				<view class="container-account">
					<view class="label-font">请输入手机号</view>
					<view class="input" :class="{'active':isActive}">
						<input
							@focus="clearInput"
							@blur="focuOutOne"
							:value="username"
							@input="clearInput"
							type="number"
							maxlength="20"
							style="color: #071328;"
						/>
						<image class="cha" v-if="showClearIcon" @click.stop="clearIcon()" src="../../static/image/login/cha.png" />
					</view>
				</view>
				<view class="container-account">
					<view class="label-font" >
						<text>输入验证码</text>
						<image src="../../static/image/login/regIcon.svg" />
						<text @tap="btnYzm" v-if="messageShow"  class="send-message">发送验证码</text>
						<text class="doajishi" v-if="timeShow">倒计时{{timeValue}}S</text>
					</view>
					<view class="input" :class="{'active':isActiveYzm}">
						<input
							@focus="clearInputYzm"
							@blur="focuOutOneYzm"
							:value="useryzm"
							@input="clearInputYzm"
							type="text"
							maxlength="6"
							style="color: #071328;"
						/>
						<image class="cha" v-if="showClearIconYzm" @click.stop="clearIconYzm" src="../../static/image/login/cha.png" />
					</view>
				</view>
				<view class="container-pwd">
					<view class="label-font">
						<text>输入密码</text>
						<image @tap="btnEye1" class="eye" :src="eyeImg1" />
					</view>
					<view class="input" :class="{'active':isActivePwd}">
						<input 
							@blur="focuOutSecond" 
							@focus="clearPwdInput" 
							:value="password"                          
							@input="clearPwdInput" 
							style="color: #071328;"
							type="text" :password="!isShowPassword1" maxlength="20" />
							<image class="cha" v-if="showPwdClearIcon" @click="clearPwdIcon" src="../../static/image/login/cha.png" />
					</view>
				</view>
				<view class="container-pwd">
					<view class="label-font">
						<text>确认密码</text>
						<image @tap="btnEye2" class="eye" :src="eyeImg2" />
					</view>
					<view class="input" :class="{'active':isActivePwdAgain}">
						<input 
							@blur="focuOutSecondAgain" 
							@focus="clearPwdInputAgain" 
							:value="passwordAgain"                          
							@input="clearPwdInputAgain" 
							style="color: #071328;"
							type="text" :password="!isShowPassword2" maxlength="20" />
							<image class="cha" v-if="showPwdClearIconAgain" @click="clearPwdIconAgain" src="../../static/image/login/cha.png" />
					</view>
				</view>
				<view class="check-box">
					<checkbox  value="cb"  @click="ischecked = !ischecked" :checked="ischecked" style="transform:scale(0.6)" />
					<text @tap="btnAgree">我已经阅读并同意</text>
					<text class="xieyi" @tap="toAgree()">《用户服务协议》</text><text>和</text>
					<text class="xieyi" @tap="toHide()">《隐私条款》</text>
				</view>
				<view class="container-login" @tap="btnRegister" >注册</view>
			</view>
			
			
		</view>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	export default {
		components: {
			Bar
		},
		created() {
			this.util.EventUtils.addEventListenerCustom(this.dal.Account.evtGetCaptcha, this.onGetCaptcha);
			this.util.EventUtils.addEventListenerCustom(this.dal.Account.evtRegister, this.onRegister);
		},
		
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Account.evtGetCaptcha, this.onGetCaptcha);
			this.util.EventUtils.removeEventCustom(this.dal.Account.evtRegister, this.onRegister);
		},
		data() {
			return {
				username: '',
				password: '',
				useryzm:'',
				passwordAgain:'',
				checkValue:'',
				ischecked:false,
				showClearIcon: false, //清除按钮
				showPwdClearIcon: false,
				showClearIconYzm:false,
				showPwdClearIconAgain:false,
				isFirst: true, //防止重复点击登录
				isActive:false,//点击样式
				isActivePwd:false,//密码点击样式
				isActiveYzm:false,//验证码点击样式
				isActivePwdAgain:false,
				eyeImg1:'../../static/image/login/closeEye.png',
				eyeImg2:'../../static/image/login/closeEye.png',
				isShowPassword1:false,
				isShowPassword2:false,
				messageShow:true,
				timeShow:false,
				timeValue:60,
				timer:null
			}
		},
		onLoad() {
		},
		methods: {
			focuOutOne() {
				// this.showClearIcon = false;
			},
			focuOutSecond() {
				// this.showPwdClearIcon = false;
			},
			focuOutOneYzm(){
				// this.showClearIconYzm = false;
			},
			focuOutSecondAgain(){
				// this.showPwdClearIconAgain = false;
			},
			// 清除按钮
			clearInput: function(event) {
				this.username = event.target.value;
				this.isActive = true;
				this.isActivePwd = false;
				this.isActiveYzm = false;
				this.isActivePwdAgain = false;
				if (this.username != '') {
					this.showClearIcon = true;
				} else {
					this.showClearIcon = false;
				}
			},
		
			clearInputYzm:function(event){
				this.useryzm = event.target.value;
				this.isActive = false;
				this.isActivePwd = false;
				this.isActiveYzm = true;
				this.isActivePwdAgain = false;
				if(this.useryzm != ''){
					this.showClearIconYzm = true;
				}else{
					this.showClearIconYzm = false;
				}
			},
			clearPwdInput: function(event) {
				console.log(event.target.value)
				this.password = event.target.value;
				this.isActive = false;
				this.isActiveYzm = false;
				this.isActivePwd = true;
				this.isActivePwdAgain = false;
				if (this.password != '') {
					this.showPwdClearIcon = true;
				} else {
					this.showPwdClearIcon = false;
				}
			},
			clearPwdInputAgain: function(event){
				this.passwordAgain = event.target.value;
				this.isActive = false;
				this.isActiveYzm = false;
				this.isActivePwd = false;
				this.isActivePwdAgain = true;
				console.log(this.isActivePwdAgain)
				if (this.passwordAgain != '') {
					this.showPwdClearIconAgain = true;
				} else {
					this.showPwdClearIconAgain = false;
				}
			},
			clearIcon: function() {
				setTimeout(() => {
					this.username = '';
					this.showClearIcon = false;
				}, 10);
			},
			clearPwdIcon: function() {
				setTimeout(() => {
					this.password = '';
					this.showPwdClearIcon = false;
				}, 10);
			},
			clearIconYzm:function(){
				setTimeout(() => {
					this.useryzm = '';
					this.showClearIconYzm = false;
				}, 10);
			},
			clearPwdIconAgain:function(){
				setTimeout(() => {
					this.passwordAgain = '';
					this.showPwdClearIconAgain = false;
				}, 10);
			},
			
			usernameisValid:function(){
				let username = this.username.replace(new RegExp(/( )/g),"");
				if(username.length <= 0){
					this.util.UiUtils.showToast("手机号不能为空")
					return false;
				}
				let ismobile = this.util.StringUtils.isMobile(username);
				if(!ismobile){
					this.util.UiUtils.showToast("请输入正确的手机号")
					return false;
				}
				
				return true;
			},
			btnEye1:function(){
				console.log("========")
				this.isShowPassword1 = !this.isShowPassword1;
				if(this.isShowPassword1){
					this.eyeImg1 = "../../static/image/login/eye.png"
				}else{
					this.eyeImg1 = "../../static/image/login/closeEye.png"
				}
			},
			btnEye2:function(){
				console.log("========")
				this.isShowPassword2 = !this.isShowPassword2;
				if(this.isShowPassword2){
					this.eyeImg2 = "../../static/image/login/eye.png"
				}else{
					this.eyeImg2 = "../../static/image/login/closeEye.png"
				}
			},
			btnYzm:function(){
				console.log("======btnYzm=======")
				if(!this.usernameisValid()){
					return;
				}
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
				this.useryzm = "";
				let username = this.username.replace(new RegExp(/( )/g),"");
				this.util.UiUtils.showLoading("获取验证码...")
				this.dal.Account.onGetCaptcha(username,this.entities.Metadata.SmsType.YFYZ)
			},
			
			btnRegister:function(){
				if(!this.usernameisValid()){
					return;
				}
				let username = this.username.replace(new RegExp(/( )/g),"");
				let useryzm = this.useryzm.replace(new RegExp(/( )/g),"");
				let password = this.password.replace(new RegExp(/( )/g),"");
				let passwordAgain = this.passwordAgain.replace(new RegExp(/( )/g),"");
				if(useryzm.length <=0){
					this.util.UiUtils.showToast("验证码不能为空")
					return;
				}
				if(this.useryzm.length != 6){
					this.util.UiUtils.showToast("请输入正确的验证码")
					return;
				}
				if(password.length <= 0){
					this.util.UiUtils.showToast("密码不能为空")
					return;
				}
				if(password.length < 6){
					this.util.UiUtils.showToast("密码不能小于6位")
					return;
				}
				if(passwordAgain.length <= 0){
					this.util.UiUtils.showToast("确认密码不能为空")
					return;
				}
				if(passwordAgain != password){
					this.util.UiUtils.showToast("两次输入的密码不致")
					return;
				}
				if(!this.ischecked){
					this.util.UiUtils.showToast("请阅读并同意用户服务协议和隐私条款")
					return;
				}
				let reg = {
					requestcode: "", //邀请码
					username: username,//用户名(手机号)
					password: password,//密码
					captcha: useryzm,//短信验证码
				}
				this.util.UiUtils.showLoading("用户注册中...")
				this.dal.Account.onRegister(reg)
			},
			
			btnBackLogin:function(){
				this.$openPage({name: "login-login",query: {},gotype:"reLaunch"})
			},
			btnBack:function(){
				this.util.UiUtils.switchBackPage2();
			},	
			onGetCaptcha:function(data){
				console.log("==3333=onGetCaptcha==data=",data)
			},
			onRegister:function(data){
				console.log("==3333=onRegister==data=",data)
			},
			checkboxChange: function (e) {
				console.log("==3333=checkboxChange==data=",e)
			},
			btnAgree:function(){
				this.ischecked = !this.ischecked;
			},
			toAgree(){
				this.$openPage({
					name: "agreement-page",
					query: {},
					
				})
			},
			toHide(){
				this.$openPage({
					name: "hide-page",
					query: {},
					
				})
			}
		},
	}
</script>

<style lang="scss">
	@import 'register.scss';
</style>
