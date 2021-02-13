const web3 = require('../../../node_modules/web3/dist/web3.min.js');
import Vue from 'vue'
var vue = Vue.prototype

const Dapp = {
	// evtLogin: "EVENT_LOGIN", //登录响应
	
	evtGetDappList:"EVT_evtGetDappList",//Dapp列表
	
	m_Dapps:[],
	hot_dapp:[],
	
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
		vue.shared.Event.attach(vue.entities.RequestCode.GetDappList, this.handleGetDappList, "dal_dapp", this);
		// vue.shared.Event.attach(vue.entities.RequestCode.GetCaptcha, this.handleGetCaptcha, "dal_account", this);
	},

	onRemoveListener: function() {
		vue.shared.Event.removeByObserverName('dal_app');
	},
	onGetDapps(keyword){
		if(keyword){
			var params = {
				keyword,
			};
		}else{
			var params = {}
		}
		vue.dal.Net.request(vue.entities.RequestCode.GetDappList, params);
	},
	handleGetDappList(packetIn){
		if (packetIn.pktin.code == 200) {
			this.m_Dapps = packetIn.pktin.data;
			this.hot_dapp = packetIn.pktin.data.filter(el=>el.is_hot);
			vue.util.EventUtils.dispatchEventCustom(this.evtGetDappList, {
				data: packetIn.pktin.data
			});
		}else{
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},
	getAllDapp(){
	   return this.m_Dapps;	
	},
	getHotDapp(){
		return this.hot_dapp;
	},
	getWeb3:function(){
		// console.log("==web3==",web3)
		return web3;
	}
};

export default Dapp
