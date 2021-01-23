import Vue from 'vue'
var vue = Vue.prototype
const LocalStrMgr = {
	init: function() {
		this.m_localStrList = {};
		this.initData();
	},

	initData: function() {
		var gameLanguage = vue.entities.Metadata.GameLanguage.CN; //dal.GameSetting.getGameLanguage();
		if (gameLanguage === vue.entities.Metadata.GameLanguage.CN) {
			this.addStrStruct(vue.language.LocalStrCN);
		} else if (gameLanguage === vue.entities.Metadata.GameLanguage.TW) {
			this.addStrStruct(vue.language.LocalStrTW);
		}
	},

	// isLanguage为true时表示多语言资源，默认不设置表示公共资源
	clear: function() {
		this.m_localStrList = {};
	},

	//-----取值
	getLocalStr: function(keyv, gameid, tag) {
		var gid = gameid;
		if (!gameid) {
			gid = 0
		}
		var tid = tag
		if (!tag) {
			tid = 0
		}
		var savekey = this.getComKeyName(keyv, gid, tid);
		if(!this.m_localStrList){
			uni.cclog("==savekey==" + savekey)
		}
		if (this.m_localStrList && this.m_localStrList.hasOwnProperty(savekey)) {
			return this.m_localStrList[savekey].datav;
		}
		uni.cclog('===重要BUGBUG=>>>>>>>>=getLocalStr=is NULLLLLLL====' + keyv)
		return savekey
	},

	getComKeyName: function(prekey, gameid, tag) {
		var gid = gameid ? gameid : 0;
		var tid = tag ? tag : 0;
		var comkey = prekey + '_' + gameid + '_' + tag;
		return comkey;
	},

	addStrStruct: function(fileObj) {
		if (fileObj && fileObj.hasOwnProperty("data")) {
			var localstrObj = fileObj.data;
			uni.cclog("=====localstrObj====",localstrObj)
			var gameid = fileObj.gameid ? fileObj.gameid : 0;
			var tag = fileObj.tag ? fileObj.tag : 0;

			for (var skey in localstrObj) {
				var savekey = this.getComKeyName(skey, gameid, tag);
				var savevar = localstrObj[skey];

				if (this.m_localStrList && !this.m_localStrList.hasOwnProperty(savekey)) {
					this.m_localStrList[savekey] = {
						key: savekey,
						datav: savevar
					};
				}
			}
		}
	},

	removeStrStruct: function(fileObj) {
		if (fileObj && fileObj.hasOwnProperty("data")) {
			var localstrObj = fileObj.data;
			var gameid = fileObj.gameid ? fileObj.gameid : 0;
			var tag = fileObj.tag ? fileObj.tag : 0;

			for (var skey in localstrObj) {
				var savekey = this.getComKeyName(skey, gameid, tag);
				var savevar = localstrObj[skey];

				if (this.m_localStrList.hasOwnProperty(savekey)) {
					this.m_localStrList[savekey] = undefined;
				}
			}
		}
	},
}
export default LocalStrMgr
