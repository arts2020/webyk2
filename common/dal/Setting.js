import Vue from 'vue'
var vue = Vue.prototype

const Setting = {
	evtCapitalPassword: "evt_CapitalPassword",
	evtChangeCapitalPassword: "evt_ChangeCapitalPassword",
	evtAuthentication: "evt_Authentication",
	evtGetAuthentication: "evt_evtGetAuthentication",
	evtChangePassword: "evt_ChangePassword",
	evtCheckCapitalPassword: "evt_CheckCapitalPassword",
	init: function() {
		uni.cclog("=======Setting====init============")
		this.onAddListener();
		return true;
	},

	destroy: function() {
		this.onRemoveListener();
	},

	clear: function() {
		uni.cclog("=======Setting====clear============")
	},

	onAddListener: function() {
		this.onRemoveListener();
		vue.shared.Event.attach(vue.entities.RequestCode.ChangePassword, this.handleChangePassword, "dal_setting", this);
		vue.shared.Event.attach(vue.entities.RequestCode.Authentication, this.handleAuthentication, "dal_setting", this);
		vue.shared.Event.attach(vue.entities.RequestCode.CapitalPassword, this.handleCapitalPassword, "dal_setting", this);
		vue.shared.Event.attach(vue.entities.RequestCode.ChangeCapitalPassword, this.handleChangeCapitalPassword,
			"dal_setting", this);
		vue.shared.Event.attach(vue.entities.RequestCode.CheckCapitalPassword, this.handleCheckCapitalPassword,
			"dal_setting", this);	
			
	},

	onRemoveListener: function() {
		vue.shared.Event.removeByObserverName("dal_setting");
	},

	//修改用户密码接口
	onChangePassword: function(oldPassword, newPassowrd) {
		oldPassword = vue.util.Utils.AesEncrypt(oldPassword);
		newPassowrd = vue.util.Utils.AesEncrypt(newPassowrd);
		var params = {
			old_password: oldPassword,
			new_passowrd: newPassowrd,
		}
		vue.dal.Net.request(vue.entities.RequestCode.ChangePassword, params);
	},

	handleChangePassword: function(packetIn) {
		uni.cclog("======handleChangePassword======", packetIn)
		if (packetIn.pktin.code === 200) {
			vue.util.EventUtils.dispatchEventCustom(this.evtChangePassword);
		} else {
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},

	// 身份认证接口
	onAuthentication: function(imgurl1, imgurl2) {
		var params = {
			imgurl: imgurl1,
			imgurl2: imgurl2,
		}
		vue.dal.Net.request(vue.entities.RequestCode.Authentication, params);
	},

	handleAuthentication: function(packetIn) {
		uni.cclog("======handleAuthentication======", packetIn)
		if (packetIn.pktin.code === 200) {
			vue.dal.UserInfo.onGetUserInfo(vue.dal.Character.m_playerInfo.m_nUserId)
			vue.util.EventUtils.dispatchEventCustom(this.evtAuthentication);
		} else {
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},

	//获取身份证信息
	getAuthentication: function() {
		var params = {}
		vue.dal.Net.request(vue.entities.RequestCode.GetAuthentication, params);
	},

	handleGetAuthentication: function(packetIn) {
		uni.cclog("======handleGetAuthentication======", packetIn)
		if (packetIn.pktin.code === 200) {
			vue.util.EventUtils.dispatchEventCustom(this.evtGetAuthentication);
		}
		vue.util.UiUtils.hideLoading();
	},

	//设置资金密码接口
	onCapitalPassword: function(password, phone, captcha) {
		password = vue.util.Utils.AesEncrypt(password);
		var params = {
			password: password,
			captcha: captcha,
			phone: phone,
		}
		vue.dal.Net.request(vue.entities.RequestCode.CapitalPassword, params);
	},

	handleCapitalPassword: function(packetIn) {
		uni.cclog("======handleCapitalPassword======", packetIn)
		if (packetIn.pktin.code === 200) {
			vue.dal.UserInfo.onGetUserInfo(vue.dal.Character.m_playerInfo.m_nUserId)
			vue.util.EventUtils.dispatchEventCustom(this.evtCapitalPassword);
		} else {
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},

	// 修改资金密码接口
	onChangeCapitalPassword: function(oldPassword, newPassowrd, phone, captcha) {
		oldPassword = vue.util.Utils.AesEncrypt(oldPassword);
		newPassowrd = vue.util.Utils.AesEncrypt(newPassowrd);
		var params = {
			captcha: captcha,
			phone: phone,
			old_password: oldPassword,
			new_passowrd: newPassowrd,
		}
		vue.dal.Net.request(vue.entities.RequestCode.ChangeCapitalPassword, params);
	},

	handleChangeCapitalPassword: function(packetIn) {
		uni.cclog("======handleCapitalPassword======", packetIn)
		if (packetIn.pktin.code === 200) {

			vue.util.EventUtils.dispatchEventCustom(this.evtChangeCapitalPassword);
		} else {
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},
	// 检测资金密码接口
	onCheckCapitalPassword: function(password) {
		password = vue.util.Utils.AesEncrypt(password);
		var params = {
			password: password,
		}
		vue.dal.Net.request(vue.entities.RequestCode.CheckCapitalPassword, params);
	},

	handleCheckCapitalPassword: function(packetIn) {
		uni.cclog("======handleCapitalPassword======", packetIn)
		if (packetIn.pktin.code === 200) {
			vue.util.EventUtils.dispatchEventCustom(this.evtCheckCapitalPassword);
		} else {
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
			vue.util.UiUtils.hideLoading();
		}
	},

};

export default Setting
