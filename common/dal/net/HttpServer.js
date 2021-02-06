import Vue from 'vue'
var vue = Vue.prototype

const HttpServert = {
	init: function() {
		uni.cclog("-==========HttpServert====init========", vue.dal)
		this._request = null;
		this._components = [];
		this._components.push(vue.dal.Setting); // 
		this._components.push(vue.dal.Account); // 账户
		this._components.push(vue.dal.UserInfo); // 用户信息
		this._components.push(vue.dal.Character); // 个人
		this._components.push(vue.dal.Logger); // 			
		this._components.push(vue.dal.Dapp); // 			
		
		this._components.push(vue.dal.Common); // 			
		this._components.push(vue.dal.Chain); //	
		this._components.push(vue.dal.MainWallet); // /
		this._components.push(vue.dal.NormalWallet); // 	 		
		this._components.push(vue.dal.ContractWallet); // 	 		

		this._components.push(vue.dal.Btc); // 
		this._components.push(vue.dal.Eos); // 
		this._components.push(vue.dal.Eth); // 
		this._components.push(vue.dal.Lotus); // 
		this._components.push(vue.dal.Tron); // 
	
		this.initComps();

		vue.shared.Http.setEvtHandler({
			obj: this,
			onReceive: this._onReceive,
			onClose: this._onClose,
			onError: this._onError,
			onFailed: this._onFailed
		});

		return true;
	},

	destroy: function() {
		for (var i = 0; i < this._components.length; ++i) {
			var c = this._components[i];
			if (c.destroy) {
				c.destroy();
			}
		}
	},

	clear: function() {
		for (var i = 0; i < this._components.length; ++i) {
			var c = this._components[i];
			if (c.clear) {
				c.clear();
			}
		}
	},

	initComps: function() {
		for (var i = 0; i < this._components.length; ++i) {
			var c = this._components[i];
			c.init();
		}
	},

	_onClose: function() {
		this.close();
		this._request = null;
		for (var i = this._components.length - 1; i >= 0; --i) {
			var c = this._components[i];
			if (c.onClose !== undefined) {
				c.onClose();
			}
		}
	},

	_onReceive: function(data) {
		// uni.cclog("===http======_onReceive=====data=", data);
		try {
			if (data.code === 10) { //"TOKEN失效",
				vue.util.UiUtils.hideLoading();
				vue.dal.Net.clear();
				uni.showModal({
					title: vue.getLocalStr("tip_title"),
					content: vue.getLocalStr("login_err"),
					confirmText: vue.getLocalStr("btnstring_confirm"),
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							vue.util.UiUtils.switchToPage("login", "_onReceive_http", {}, "reLaunch");
						}
					}.bind(vue)
				});
				return;
			} else if (data.code === 9) { //SYS_ERR_9: "TOKEN不对，请重新登陆",
				vue.dal.Net.clear();
				return;
			}
			console.log("===data.act====", data.act)
			vue.shared.Event.trigger(data.act, {
				pktin: data
			});
		} catch (e) {
			console.warn(e);
			if (data.act !== vue.entities.RequestCode.Logger) {
				vue.dal.Logger.write("=http数据返回处理异常==e=" + e, vue.entities.LogType.HttpDataError);
			}
		}
	},

	_onError: function(reason) {
		uni.cclog("==========_onError========" + reason);
		vue.shared.Event.trigger(vue.entities.EventKeys.HTTP_REQUEST_ERROR, reason);
		vue.util.UiUtils.hideLoading();
		vue.util.UiUtils.showToast(vue.getLocalStr('request_err'));
	},

	_onFailed: function(reason) {
		uni.cclog("==========_onFailed========" + reason);
		vue.shared.Event.trigger(vue.entities.EventKeys.HTTP_REQUEST_FAILED, reason);
		vue.util.UiUtils.hideLoading();
		vue.util.UiUtils.showToast(vue.getLocalStr('request_fail'));
	},

	close: function(from) {
		if (this._request) {
			this._request.close(from);
			this._request = null;
		}
	},

	request: function(code, params, host) {
		var route = vue.entities.Routes.getRoute(code);
		//检测请求是否需要权限权限
		var logininfo = vue.dal.Account.getLoginInfo();
		// console.warn("=request=logininfo===", logininfo)
		if (route.islogin && code != vue.entities.RequestCode.AutoLogin) {
			if (!vue.dal.Character.isValidLogin()) {
				console.warn("=没登录禁请求==isLoginCache==request=code===", code)
				// vue.util.UiUtils.switchToPage("login", "http_request==code=" + code);
				return;
			}
		}
		if (!params) {
			params = {};
		}

		params.act = code;
		if (!route.islogin) {
			params.userid = "0";
			params.token = "0";
			if (logininfo) {
				params.userid = logininfo.m_nUserId;
				params.token = logininfo.m_sUserToken;
			}
		} else {
			if (!logininfo) {
				uni.cclog("=====登录信息不存在，请重新登录==", code)
				return;
			}
			params.userid = logininfo.m_nUserId;
			params.token = logininfo.m_sUserToken;
		}
		// uni.cclog("=====params==", params)
		// uni.cclog("=====host==", host)
		// uni.cclog("=====route.path==", route.path)
		var url = host + route.path
		// uni.cclog("=====url==", url)
		vue.shared.Http.request(url, route.method, params, code);
	},
	
	async asyncRequest(code, params, host) {
		var route = vue.entities.Routes.getRoute(code);
		//检测请求是否需要权限权限
		var logininfo = vue.dal.Account.getLoginInfo();
		// console.warn("=request=logininfo===", logininfo)
		if (route.islogin && code != vue.entities.RequestCode.AutoLogin) {
			if (!vue.dal.Character.isValidLogin()) {
				console.warn("=没登录禁请求==isLoginCache==request=code===", code)
				// vue.util.UiUtils.switchToPage("login", "http_request==code=" + code);
				return;
			}
		}
		if (!params) {
			params = {};
		}
	
		params.act = code;
		if (!route.islogin) {
			params.userid = "0";
			params.token = "0";
			if (logininfo) {
				params.userid = logininfo.m_nUserId;
				params.token = logininfo.m_sUserToken;
			}
		} else {
			if (!logininfo) {
				uni.cclog("=====登录信息不存在，请重新登录==", code)
				return;
			}
			params.userid = logininfo.m_nUserId;
			params.token = logininfo.m_sUserToken;
		}
		// uni.cclog("=====params==", params)
		// uni.cclog("=====host==", host)
		// uni.cclog("=====route.path==", route.path)
		var url = host + route.path
		// uni.cclog("=====url==", url)
		return await vue.shared.Http.asyncRequest(url, route.method, params, code);
	}
}

export default HttpServert
