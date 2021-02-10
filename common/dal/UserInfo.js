import Vue from 'vue'
var vue = Vue.prototype

//用于存放 用户列表
const UserInfo = {
	evtGetUserInfo: "EVT_GETUSERINFO",
	init: function() {
		uni.cclog("=====UserInfo===init============")
		this.m_UserInfos = {};
		this.userinfo_overtime = 120 * 1000;
		this.onAddListener();
		return true;
	},

	destroy: function() {
		this.m_UserInfos = {};
		this.onRemoveListener();
	},

	clear: function() {
		this.m_UserInfos = {};
	},
	
	onAddListener: function() {
		this.onRemoveListener();
		// vue.shared.Event.attach(vue.entities.RequestCode.GetUserInfo, this.handleGetUserInfo, "dal_userinfo", this);
	},

	onRemoveListener: function() {
		vue.shared.Event.removeByObserverName('dal_userinfo');
	},

	//--信息下来超过了self.USERINFO_UPDATE_INTERVEL时长，视为过期，需要更新
	getUserInfoIsOverTime: function(userid) {
		if (!userid) {
			return true;
		} else if (vue.dal.Character.m_playerInfo.m_nUserId == userid) {
			return false;
		} else {
			var userifno = this.m_UserInfos['' + userid];
			if (userifno && Date.now() - userifno.updateTime < this.userinfo_overtime) {
				return false
			}
		}
		return true;
	},

	getUserInfo: function(userid) {
		return this.m_UserInfos[userid.toString()];
	},

	//获取用户信息 userids=["1111","2222","33333"]
	onGetUserInfo: function(userid) {
		uni.cclog("44==========onGetUserInfo==========userid====", userid)
		var params = {
			userid: userid
		};
		vue.dal.Net.request(vue.entities.RequestCode.GetUserInfo, params);
	},

	handleGetUserInfo: function(packetIn) {
		uni.cclog("55==========handleGetUserInfo==========packetIn====", packetIn)
		if (packetIn.pktin.code == 200) {
			var userinfo = packetIn.pktin.data;
			userinfo.updateTime = new Date().getTime();
			userinfo.m_nUserId = userinfo.id;
			this.m_UserInfos['' + userinfo.m_nUserId] = userinfo;
			uni.cclog("==1========handleGetUserInfo==============",vue.dal.Character.m_playerInfo)
			if (vue.dal.Character.m_playerInfo == null || userinfo.m_nUserId === vue.dal.Character.m_playerInfo.id || userinfo.m_nUserId === vue.dal.Character.m_playerInfo.user_id) {
				uni.cclog("==2========handleGetUserInfo==============")
				vue.dal.Character.setPlayerInfo(userinfo)
			}
			vue.util.EventUtils.dispatchEventCustom(this.evtGetUserInfo);
		}
	}
}

export default UserInfo;
