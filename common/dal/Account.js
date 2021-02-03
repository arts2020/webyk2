import Vue from 'vue'
var vue = Vue.prototype

const Account = {
	evtLogin: "EVENT_LOGIN", //登录响应
	evtLoginErr: "EVENT_LOGIN_ERR", //登录失败
	evtLogOut: "EVENT_LOGOUT", //登出响应
	evtRegister: "EVENT_REGISTER", //注册响应
	evtForget: "EVENT_FORGET", //望记密码响应
	evtForgetErr: "EVENT_FORGET_ERR",
	evtGetCaptcha: "EVENT_GETCAPTCHA", //获取验证码响应
	evtAutoLogin: "EVNT_AUTOLOGIN", //自动登录
	evtAutoLoginTimeCount: "EVENT_AUTO_LOGIN_TIME_COUNT", //自动登录记时器
	
	init: function() {
		uni.cclog("======Account init==========")
		this.m_userId = null;
		this.m_loginInfo = null;
		this.m_loginType = vue.entities.Metadata.LoginType.LOGIN_TYPE_UNVALID; //--entities.LoginTyp
		this.m_autoLoginIng = false;
		this.m_loginSuccess = false;
		this.m_forgetdata = null;
		this.m_autoInterVal = null;
		this.getLoginInfo();

		this.onAddListener();
		this.m_loginTime = parseInt(new Date().getTime() / 1000);
		return true;
	},

	destroy: function() {
		this.onRemoveListener();
	},

	clear: function() {
		uni.cclog("======Account clear==========")
		vue.util.StringUtils.removeUserDefaults(vue.entities.LocalDataKeys.LOGIN_LOGININFO_KEY);
		this.m_userId = null;
		this.m_loginInfo = null;
		this.m_loginType = vue.entities.Metadata.LoginType.LOGIN_TYPE_UNVALID; //--entities.LoginTyp
		this.m_autoLoginIng = false;
		this.m_loginSuccess = false;
	},

	onAddListener: function() {
		this.onRemoveListener();
		vue.shared.Event.attach(vue.entities.RequestCode.GetCaptcha, this.handleGetCaptcha, "dal_account", this);
		vue.shared.Event.attach(vue.entities.RequestCode.Login, this.handleLogin, "dal_account", this);
		vue.shared.Event.attach(vue.entities.RequestCode.LogOut, this.handleLogOut, "dal_account", this);
		vue.shared.Event.attach(vue.entities.RequestCode.Register, this.handleRegister, "dal_account", this);
		vue.shared.Event.attach(vue.entities.RequestCode.Forget, this.handleForget, "dal_account", this);
	},

	onRemoveListener: function() {
		vue.shared.Event.removeByObserverName('dal_account');
	},

	//获取验证码 phone手机号，smstype:参考枚举SmsType
	onGetCaptcha: function(phonenumber,smstype) {
		uni.cclog("========onGetCaptcha=========")
		var params = {
			phonenumber:phonenumber,
			smstype:smstype
		}
		vue.dal.Net.request(vue.entities.RequestCode.GetCaptcha, params);
	},

	handleGetCaptcha: function(packetIn) {
		uni.cclog('==handleGetCapcha===',packetIn)
		if (packetIn.pktin.code === 200) {
			vue.util.EventUtils.dispatchEventCustom(this.evtGetCaptcha, {
				data: packetIn.pktin
			});
		} else {
			// vue.util.UiUtils.showToast(packetIn.pktin.msg);
			vue.util.UiUtils.showToast("您获取验证码超限，请稍后再试");
		}
		vue.util.UiUtils.hideLoading();
	},
	
	//自动登录
	onAutoLogin() {
		uni.cclog("======onAutoLogin======", this.m_loginInfo)
		
		let loginInfo = this.getLoginInfo()
		let playInfo = vue.dal.Character.getPlayerInfo();
		
		if(loginInfo && playInfo){
			this.m_loginSuccess = true;
			vue.dal.UserInfo.onGetUserInfo(playInfo.m_nUserId);
			vue.dal.onLoginSuccess();
			uni.redirectTo({url: '/pages/wallet/index.vue'});
		}else{
			// this.$openPage({name: "login-login",query: {},gotype:"reLaunch"})
			// uni.redirectTo({url: 'pages/login/login'});
		}
	},

	handleAutoLogin(packetIn) {
		uni.cclog("======handleAutoLogin======", packetIn)
		this.m_autoLoginIng = false;
		if (this.m_autoInterVal) {
			clearInterval(this.m_autoInterVal)
			this.m_autoInterVal = null;
		}

		if (packetIn.pktin.code === 200) {
			this.setLoginInfo(packetIn.pktin.data);
			vue.dal.Character.setPlayerInfo(packetIn.pktin.data);
			vue.dal.onLoginSuccess();

			vue.util.EventUtils.dispatchEventCustom(this.evtLogin);
		} else {
			uni.cclog("==vue.dal.Net.HttpServer==", vue.dal.Net)
			vue.dal.Net.clear();
			//vue.util.UiUtils.showToast(vue.dal.Utils.getSysErrorType(packetIn.pktin.m_nResult));
			vue.util.EventUtils.dispatchEventCustom(this.evtAutoLogin);
		}
		vue.util.UiUtils.hideLoading();
	},

	//登录   用户名（手机号）：username  密码:password 短信验证码:captcha 
	onLogin: function(username, password, captcha) {
		// password = vue.shared.MD5.md5(password).substr(0, 32);
		password = vue.util.Utils.AesEncrypt(password);
		var params = {
			username: username,//用户名（手机号）
			password: password,//密码
			captcha: captcha, //短信验证码 (可为空)
			devtype: vue.PlatformInfo.platform + "", //设备类型 PlatForm 枚举
			appversion: vue.PlatformInfo.vsn,//APP版本
			devdes: "",//设备描述
			sysinfo:uni.getSystemInfoSync(),//系统信息
		}
		vue.dal.Net.request(vue.entities.RequestCode.Login, params);
	},

	handleLogin: function(packetIn) {
		uni.cclog("======handleLogin=======", packetIn)
		if (packetIn.pktin.code === 200) {
		uni.cclog("======handleLogin====2===")
			this.setLoginInfo(packetIn.pktin.data);
		uni.cclog("======handleLogin====3==")
			// vue.dal.Character.setPlayerInfo(packetIn.pktin.data);
		uni.cclog("======handleLogin===4===")
			vue.dal.onLoginSuccess();
		uni.cclog("======handleLogin====5===")
			vue.util.EventUtils.dispatchEventCustom(this.evtLogin,{userid:packetIn.pktin.data.user_id});
		uni.cclog("======handleLogin====6===")
		} else {
			vue.util.EventUtils.dispatchEventCustom(this.evtLoginErr, packetIn.pktin);
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},
	
	onLogOut:function(from){
		uni.cclog("======onLogOut==from=",from)
		var params = {}
		vue.dal.Net.request(vue.entities.RequestCode.LogOut, params);
	},
	
	handleLogOut:function(packetIn){
		uni.cclog("======handleLogOut======", packetIn)
		if (packetIn.pktin.code === 200) {
			vue.util.EventUtils.dispatchEventCustom(this.evtLogOut);
		} else {
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},
	
	//注册 
	onRegister: function(reginfo) {
		// reginfo.password = vue.shared.MD5.md5(reginfo.password).substr(0, 32);
		reginfo.password = vue.util.Utils.AesEncrypt(reginfo.password);
		var params = {
			requestcode: reginfo.requestcode, //邀请码
			username: reginfo.username,//用户名(手机号)
			password: reginfo.password,//密码
			captcha: reginfo.captcha,//短信验证码
			devtype: vue.PlatformInfo.platform + "", //设备类型 PlatForm 枚举
			appversion: vue.PlatformInfo.vsn,//APP版本
			devdes: "",//设备描述
			sysinfo:uni.getSystemInfoSync(),//系统信息
		}
		vue.dal.Net.request(vue.entities.RequestCode.Register, params);
	},

	handleRegister: function(packetIn) {
		uni.cclog("======handleRegister======", packetIn)
		if (packetIn.pktin.code === 200) {
			this.setLoginInfo(packetIn.pktin.data);
			vue.dal.Character.setPlayerInfo(packetIn.pktin.data);
			vue.dal.onLoginSuccess();
			vue.util.EventUtils.dispatchEventCustom(this.evtRegister);
		} else {
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},

	// //登出
	// onLogout: function() {
	// 	vue.dal.Net.request(vue.entities.RequestCode.Logout, {});
	// },

	// handleLogout: function(packetIn) {
	// 	if (packetIn.pktin.code === 200) {
	// 		vue.dal.Net.clear();
	// 		vue.util.EventUtils.dispatchEventCustom(this.evtLogout);
	// 	} else {
	// 		vue.util.UiUtils.showToast(packetIn.pktin.msg);
	// 	}
	// 	vue.util.UiUtils.hideLoading();
	// },

	//忘记密码
	onForget: function(username,password,captcha) {
		// var password = vue.shared.MD5.md5(password).substr(0, 32);
		password = vue.util.Utils.AesEncrypt(password);

		var params = {
			username: username,
			password: password,
			captcha: captcha,
		}
		vue.dal.Net.request(vue.entities.RequestCode.Forget, params);
	},

	handleForget: function(packetIn) {
		uni.cclog("============handleForget===============", packetIn.pktin)
		if (packetIn.pktin.code === 200) {
			vue.util.EventUtils.dispatchEventCustom(this.evtForget);
			// vue.util.UiUtils.showToast(packetIn.pktin.msg);
		} else {
			vue.util.EventUtils.dispatchEventCustom(this.evtForgetErr);
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},

	getForgetData: function() {
		return this.m_forgetdata;
	},

	setLoginInfo: function(pktin) {
		console.log("setLoginInfo===pktin=",pktin)
		this.m_loginSuccess = true;
		this.m_loginInfo = {};
		this.m_loginInfo.m_systemtime = pktin.m_systemtime || new Date().getTime();
		this.m_loginInfo.m_logintime = new Date().getTime();
		this.m_loginInfo.m_sUserToken = pktin.token;
		this.m_loginInfo.m_nUserId = pktin.user_id;
		this.m_loginInfo.m_sUserName = pktin.username || "";

		var lasttime = vue.dal.Utils.getSysTimestamp(pktin.systemtime || this.m_loginInfo.m_logintime);
		this.m_loginInfo.m_systemtime = lasttime.timestamp;

		uni.cclog('==setLoginInfo=this.m_loginInfo===', this.m_loginInfo)
		vue.util.StringUtils.setUserDefaults(vue.entities.LocalDataKeys.LOGIN_LOGININFO_KEY, JSON.stringify(this.m_loginInfo));
	},

	getLoginInfo: function() {
		if (!this.m_loginInfo) {
			var data = vue.util.StringUtils.getUserDefaults(vue.entities.LocalDataKeys.LOGIN_LOGININFO_KEY);
			if (data) {
				this.m_loginInfo = JSON.parse(data)
			}
		}
		// uni.cclog("====this.m_loginInfo==", this.m_loginInfo)
		return this.m_loginInfo;
	},
	cancleAutoLogining: function() {
		this.m_autoLoginIng = false;
		uni.cclog("====cancleAutoLogining==", this.m_autoLoginIng)
		vue.dal.Net.clear();
	},
	getIsAutoLogining: function() {
		uni.cclog("====getIsAutoLogining==", this.m_autoLoginIng)
		return this.m_autoLoginIng;
	},

	getIsLoginSuccess: function() {
		return this.m_loginSuccess;
	}
};

export default Account
