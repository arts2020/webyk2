const web3 = require('../../../node_modules/web3/dist/web3.min.js');
import Vue from 'vue'
var vue = Vue.prototype

const Dapp = {
	// evtLogin: "EVENT_LOGIN", //登录响应
	init: function() {
		uni.cclog("======Dapp init========web3==")
		this.onAddListener();
		return true;
	},

	destroy: function() {
		this.onRemoveListener();
	},

	clear: function() {
		uni.cclog("======Account clear==========")
		// vue.util.StringUtils.removeUserDefaults(vue.entities.LocalDataKeys.LOGIN_LOGININFO_KEY);
	},

	onAddListener: function() {
		this.onRemoveListener();
		// vue.shared.Event.attach(vue.entities.RequestCode.GetCaptcha, this.handleGetCaptcha, "dal_account", this);
	},

	onRemoveListener: function() {
		vue.shared.Event.removeByObserverName('dal_app');
	},
	
	getWeb3:function(){
		// console.log("==web3==",web3)
		return web3;
	}
};

export default Dapp
