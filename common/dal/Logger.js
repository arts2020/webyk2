import Vue from 'vue'
var vue = Vue.prototype

// 日志模块 =>上报
const Logger = {
	init: function() {
		uni.cclog("======Logger init==========")
		this.onAddListener();
	},

	destroy: function() {
		this.onRemoveListener();
	},

	clear: function() {
		uni.cclog("======Logger clear==========")
	},

	onAddListener: function() {
		this.onRemoveListener();
	},

	onRemoveListener: function() {
		vue.shared.Event.removeByObserverName('dal_logger');
	},

	handleLoggerCnf: function(packetIn) {
		// uni.cclog("======handleLoggerCnf==========",packetIn)
	},

	// 日志类型，参考entry.LogKeys
	write: function(str, logType) {
		// uni.cclog("==Logger==write==", str)
		if (vue.PlatformInfo.node !== 'development') {
			// 开发模式不上报
			// return;
		}
		var type = logType;
		if (!type) {
			type = vue.entities.LogType.Type.Common;
		} else if (type === vue.entities.LogType.Error) {
			type = logType;
		}

		var platformInfo = "null"
		var playinfo = "null"
		var logininfo = "null";
		var sysinfo = uni.getSystemInfoSync();

		if (vue.PlatformInfo) {
			platformInfo = vue.PlatformInfo;
		}
		if (vue.dal.Character && vue.dal.Character.m_playerInfo) {
			playinfo = vue.dal.Character.m_playerInfo;
		}
		if (vue.dal.Account && vue.dal.Account.m_loginInfo) {
			logininfo = vue.dal.Account.m_loginInfo;
		}

		var content = {
			msg: str,
			logtype: type,
			sysinfo: sysinfo,
			platformInfo: platformInfo,
			playinfo: playinfo,
			logininfo: logininfo,
			currtime: vue.util.StringUtils.formatDate(),
			foretime: vue.util.StringUtils.getUserDefaults(vue.entities.EventKeys.APP_HOME_FORE) || "null",
			backtime: vue.util.StringUtils.getUserDefaults(vue.entities.EventKeys.APP_HOME_BACK) || "null",
		}

		content = JSON.stringify(content);
		var baseStr = vue.shared.Base64.encode(content);
		var logcontent = encodeURIComponent(baseStr);

		var params = {
			param: {
				type: type,
				content: logcontent
			}
		}
		// vue.dal.Net.request(vue.entities.RequestCode.Logger, params)
	}

}
export default Logger
