import Vue from 'vue'
var vue = Vue.prototype

const Setting = {
	// evtCapitalPassword: "evt_CapitalPassword",
	init: function() {
		this.m_currLangeType = vue.entities.Metadata.GameLanguage.CN;
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
		// vue.shared.Event.attach(vue.entities.RequestCode.ChangePassword, this.handleChangePassword, "dal_setting", this);
	},

	onRemoveListener: function() {
		vue.shared.Event.removeByObserverName("dal_setting");
	},

	getSysLanguage: function() {
		return this.m_currLangeType
	},

	setSysLanguage: function(type) {
		this.m_currLangeType = type;
		vue.entities.LocalStrMgr.init();
	}
};

export default Setting
