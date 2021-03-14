import Vue from 'vue'
var vue = Vue.prototype

const Dapp = {
	// evtLogin: "EVENT_LOGIN", //登录响应

	evtGetDappList: "EVT_evtGetDappList", //Dapp列表

	m_Dapps: [],
	hot_dapp: [],
	dappRegists: [],

	init: function() {
		uni.cclog("======Dapp init========web3==")
		let items = vue.util.StringUtils.getUserDefaults("dapp_select_wallets_key");
		if(items){
			this.dappRegists = JSON.parse(items);
		}
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

	onGetDapps(keyword) {
		console.log("=========onGetDapps=======")
		if (keyword) {
			var params = {
				keyword,
			};
		} else {
			var params = {}
		}
		vue.dal.Net.request(vue.entities.RequestCode.GetDappList, params);
	},
	handleGetDappList(packetIn) {
		console.log("=====handleGetDappList===packetIn=",packetIn.pktin.data)
		if (packetIn.pktin.code == 200) {
			this.m_Dapps = packetIn.pktin.data.filter(el => el.ishow);
			this.hot_dapp = this.m_Dapps.filter(el => el.is_hot);
			vue.util.EventUtils.dispatchEventCustom(this.evtGetDappList, {
				data: this.m_Dapps
			});
		} else {
			// vue.util.UiUtils.showToast(packetIn.pktin.msg);
			vue.util.UiUtils.showToast(vue.dal.Utils.getSysErrorType(packetIn.pktin.code));
		}
		vue.util.UiUtils.hideLoading();
	},
	getAllDapp() {
		return this.m_Dapps;
	},
	getHotDapp() {
		return this.hot_dapp;
	},
	getWeb3: function() {
		// console.log("==web3==",web3)
		return web3;
	},
	
	addAllowDapp:function(key,address){
		let it = this.getAllowDapp(key,address);
		if(!it){
			let item = {
				key:key,
				address:address
			}
			this.dappRegists.push(item)
		}
		vue.util.StringUtils.setUserDefaults("dapp_select_wallets_key", JSON.stringify(this.dappRegists));
	},
	
	getAllowDapp:function(key,address){
		console.log('==this.dappRegists==',JSON.stringify(this.dappRegists))
		let item = null;
		for(let i = 0; i < this.dappRegists.length ;i++){
			let it = this.dappRegists[i]
			if(it.key == key && it.address == address){
				item = it;
			}
		}
		return item;
	}
};

export default Dapp
