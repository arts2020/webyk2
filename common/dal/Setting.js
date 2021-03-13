import Vue from 'vue'
var vue = Vue.prototype

const Setting = {
	// evtCapitalPassword: "evt_CapitalPassword",
	evtGetLanguage:"evt_evtGetLanguage",
	
	init: function() {
		this.m_currLangeType = vue.util.StringUtils.getUserDefaults("LangeType_key");
		if(!this.m_currLangeType){
			this.m_currLangeType = vue.entities.Metadata.GameLanguage.CN;
		}
		
		console.log("=======Setting===this.m_currLangeType=========" + this.m_currLangeType)
		this.onAddListener();
		return true;
	},

	destroy: function() {
		this.onRemoveListener();
	},

	clear: function() {
		console.log("=======Setting====clear============")
	},

	onAddListener: function() {
		this.onRemoveListener();
		// vue.shared.Event.attach(vue.entities.RequestCode.ChangePassword, this.handleChangePassword, "dal_setting", this);
	},

	onRemoveListener: function() {
		vue.shared.Event.removeByObserverName("dal_setting");
	},

	getSysLanguage: function() {
		console.log("==222222222=this.m_currLangeType==" + this.m_currLangeType)
		if(!this.m_currLangeType){
			this.m_currLangeType = vue.util.StringUtils.getUserDefaults("LangeType_key");
		}
		if(!this.m_currLangeType){
			this.m_currLangeType = vue.entities.Metadata.GameLanguage.CN;
		}
		return this.m_currLangeType
	},

	setSysLanguage: function(type) {
		this.m_currLangeType = type;
		vue.util.StringUtils.setUserDefaults("LangeType_key", this.m_currLangeType);
		vue.entities.LocalStrMgr.init();
		vue.util.EventUtils.dispatchEventCustom(vue.dal.Setting.evtGetLanguage);
	}
};

export default Setting
