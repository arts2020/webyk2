<template>
	<view class="login-index">
		<bar ref="bar"></bar>
		<view class="login-back">
			<!-- <image src="../../static/image/login/back.svg" /> -->
		</view>
		<view class="login-content">
			<view class="login-title">
				<view class="title">登录</view>
				<view class="create-user" @tap="btnRegister">
					<text>创建账号</text>
					<image src="../../../static/image/login/right.svg" />
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
							type="text"
							maxlength="20"
							style="color: #071328;"
						/>
						<image class="cha" v-if="showClearIcon" @click.stop="clearIcon" src="../../../static/image/login/cha.png" />
					</view>
				</view>
				<view class="container-pwd">
					<view class="label-font">
						<text>输入密码</text>
						<image @tap="btnEye" class="eye" :src="eyeImg" />
					</view>
					<view class="input" :class="{'active':isActivePwd}">
						<input 
							@blur="focuOutSecond" 
							@focus="clearPwdInput" 
							:value="password"                          
							@input="clearPwdInput" 
							style="color: #071328;"
							type="text" :password="!isShowPassword" maxlength="20" />
							<image class="cha" v-if="showPwdClearIcon" @click="clearPwdIcon" src="../../../static/image/login/cha.png" />
					</view>
				</view>
				<view @tap="btnForget" class="forget-pwd">忘记密码？</view>
				<view class="container-login" @tap="btnLogin" >登录</view>
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
			this.util.EventUtils.addEventListenerCustom(this.dal.Account.evtLogin, this.onLogin);
			this.util.EventUtils.addEventListenerCustom(this.dal.Character.evtCharacterUpdate, this.onCharacterUpdate);
		},
		
		destroyed() {
			console.log("====login destroyed======")
			this.util.EventUtils.removeEventCustom(this.dal.Account.evtLogin, this.onLogin);
			this.util.EventUtils.removeEventCustom(this.dal.Account.evtCharacterUpdate, this.onCharacterUpdate);
		},
		data() {
			return {
				eyeImg:'../../../static/image/login/closeEye.png',
				username: '',
				password: '',
				showClearIcon: false, //清除按钮
				showPwdClearIcon: false,
				isFirst: true, //防止重复点击登录
				isActive:false,//点击样式
				isActivePwd:false,//密码点击样式
				isShowPassword:false,
			}
		},
		onLoad() {
			console.log("====login onLoad======")
		},
		
		onShow() {
			console.log("====login onShow======")
			if (this.dal.Character.isValidLogin() === false) {
				setTimeout(()=>{
					// #ifdef APP-PLUS 
					plus.navigator.closeSplashscreen()
					// #endif
				}, 500)
			}
		},
		
		methods: {
			focuOutOne() {
				// this.showClearIcon = false;
			},
			focuOutSecond() {
				// this.showPwdClearIcon = false;
			},
			// 清除按钮
			clearInput: function(event) {
				this.username = event.target.value;
				this.isActive = true;
				this.isActivePwd = false;
				if (this.username != '') {
					this.showClearIcon = true;
				} else {
					this.showClearIcon = false;
				}
			},
			clearPwdInput: function(event) {
				this.password = event.target.value;
				this.isActive = false;
				this.isActivePwd = true
				if (this.password != '') {
					this.showPwdClearIcon = true;
				} else {
					this.showPwdClearIcon = false;
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
			
			onCharacterUpdate:function(){
				console.log('11==onCharacterUpdate=',this.dal.Character.m_playerInfo)
				this.$openPage({name: "wallet-index",query: {}})
			},
			
			onLogin:function(data){
				console.log('222==this.dal.Character.m_playerInfo.m_nUserID=',data.userid)
				this.dal.UserInfo.onGetUserInfo(data.userid)
			},
			
			btnLogin:function(){
				if(this.username.length <= 0){
					this.util.UiUtils.showToast("手机号不能为空")
					return false;
				}
				let username = this.username.replace(new RegExp(/( )/g),"");
				let password = this.password.replace(new RegExp(/( )/g),"");
				
				let ismobile = this.util.StringUtils.isMobile(username);
				if(!ismobile){
					this.util.UiUtils.showToast("请输入正确的手机号")
					return false;
				}
				if(password.length <= 0){
					this.util.UiUtils.showToast("密码不能为空")
					return;
				}
				if(password.length < 6){
					this.util.UiUtils.showToast("密码不能小于6位")
					return;
				}
				this.util.UiUtils.showLoading("登录中...")
				this.dal.Account.onLogin(username,password)
			},
			btnRegister:function(){
				this.$openPage({name: "register-register",query: {}})
			},
			
			btnEye:function(){
				console.log("========")
				this.isShowPassword = !this.isShowPassword;
				if(this.isShowPassword){
					this.eyeImg = "../../../static/image/login/eye.png"
				}else{
					this.eyeImg = "../../../static/image/login/closeEye.png"
				}
			},
			btnForget:function(){
				this.$openPage({name: "safe-pwd-back",query: {type:1}})
			}
		},
	}
</script>

<style lang="scss">
	@import 'login.scss';
</style>
