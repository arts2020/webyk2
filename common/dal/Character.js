import Vue from 'vue'
var vue = Vue.prototype

const Character = {
	evtCharacterUpdate: "evt_CharacterUpdate", //角色信息更新

	init: function() {
		this.m_playerInfo = null;
		this.onAddListener();

		this.getPlayerInfo();

		return true;
	},

	destroy: function() {
		this.m_playerInfo = null;
		this.onRemoveListener();
	},

	clear: function() {
		uni.cclog("======Character clear==========")
		this.m_playerInfo = null;
		vue.util.StringUtils.removeUserDefaults(vue.entities.LocalDataKeys.CHARACTER_PLYAERINFO_KEY);
	},

	onAddListener: function() {
		this.onRemoveListener();
	},

	onRemoveListener: function() {
		vue.shared.Event.removeByObserverName("dal_character");
	},

	setPlayerInfo: function(data) {
		// uni.cclog("==setPlayerInfo==data==", data)
		
		data.m_systemtime = data.systemtime || new Date().getTime();
		data.m_logintime = new Date().getTime();
		data.m_sUserToken = data.token;
		data.m_nUserId = data.user_id || data.id;
		data.user_id = data.m_nUserId;
		data.m_sUserName = data.username || "";
		
		this.m_playerInfo = data;

		vue.util.StringUtils.setUserDefaults(vue.entities.LocalDataKeys.CHARACTER_PLYAERINFO_KEY, JSON.stringify(this.m_playerInfo));

		vue.util.EventUtils.dispatchEventCustom(this.evtCharacterUpdate);
	},

	getPlayerInfo: function() {
		if (!this.m_playerInfo) {
			var playinfo = vue.util.StringUtils.getUserDefaults(vue.entities.LocalDataKeys.CHARACTER_PLYAERINFO_KEY);
			if (playinfo) {
				this.m_playerInfo = JSON.parse(playinfo);
			}
		}
		return this.m_playerInfo;
	},

	

	isLoginCache: function() {
		var logininfo = vue.dal.Account.getLoginInfo();
		var isloginSuccess = vue.dal.Account.getIsLoginSuccess();
		if (this.m_playerInfo && logininfo) {
			return true;
		}
		return false;
	},

	//登录是否有效
	isValidLogin: function() {
		var isloginSuccess = vue.dal.Account.getIsLoginSuccess();
		if (isloginSuccess) {
			return true;
		}
		return false;
	}
}

export default Character
