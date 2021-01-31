//链相关
import Vue from 'vue'
var vue = Vue.prototype

//身份钱包
const Chain = {
	m_chains: [], //主链信息
	m_assets: [], //资产信息
	
	m_mineChains:[];//我选择的主链
	
	init: function() {
		uni.cclog("======Chain init==========")
		this.m_chains = vue.entities.Wallets.getChains();
		this.m_assets = vue.entities.Wallets.getAssets();
		this.onAddListener();
		return true;
	},

	destroy: function() {
		this.onRemoveListener();
		this.clear();
	},

	clear: function() {
		uni.cclog("======Chain clear==========")
		this.m_mainWallet = {};
		this.m_mnemonic = "";
	},

	onAddListener: function() {
		this.onRemoveListener();
	},

	onRemoveListener: function() {
		vue.shared.Event.removeByObserverName("dal_chain");
	},

	//获得主链列表
	getChainList: function() {
		return this.m_chains;
	},

	//获单条链的基础信息
	getChainInfo: function(chaintype) {
		for (let i = 0; i < this.m_chains.length; i++) {
			let item = this.m_chains[i];
			if (item.chaintype == chaintype) {
				return item;
			}
		}
		return null;
	},

	//获得单条链资产列表
	getAssets: function(chaintype) {
		let items = null;
		for (let i = 0; i < this.m_assets.length; i++) {
			let asset = this.m_assets[i];
			if (asset.chaintype == chaintype) {
				items = asset;
			}
		}
		return items;
	},
	
	//===================增加我选择的主链================
	addMineChainInfo:function(chaintype){
		let ishave = false;
		for(let i = 0; i < this.m_mineChains.length ;i++){
			let type = this.m_mineChains[i]
			if(type == chaintype){
				ishave = true;
				break;
			}
		}
		if(!ishave){
			this.m_mineChains.push(chaintype);
		}
	}
}
export default Chain
