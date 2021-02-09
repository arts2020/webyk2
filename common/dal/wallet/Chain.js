//链相关
import Vue from 'vue'
var vue = Vue.prototype

//身份钱包
const Chain = {
	m_chains: [], //主链信息
	m_assets: [], //资产信息

	m_mineChains: [], //我选择的主链
	m_currChainType: 0, //当前链

	init: function() {
		uni.cclog("======Chain init==========")
		this.m_chains = vue.entities.Wallets.getChains();
		this.m_assets = vue.entities.Wallets.getAssets();

		let minechain = vue.util.StringUtils.getUserDefaults("chain_mine_key");
		if (minechain && minechain.length > 0) {
			this.m_mineChains = JSON.parse(minechain)
		} else {
			this.addMineChainInfo(vue.entities.Metadata.ChainType.ETH)
			this.addMineChainInfo(vue.entities.Metadata.ChainType.TRON)
		}
		this.onAddListener();
		return true;
	},

	destroy: function() {
		this.onRemoveListener();
	},

	clear: function() {
		uni.cclog("======Chain clear==========")
		this.m_mainWallet = {};
		this.m_mnemonic = "";
		vue.util.StringUtils.removeUserDefaults("chain_mine_key");
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

	getAssetByContractAddress: function(chaintype, contractaddress) {
		for (let i = 0; i < this.m_assets.length; i++) {
			let asset = this.m_assets[i];
			if (asset.chaintype == chaintype) {
				for (let k = 0; k < asset.assets.length; k++) {
					let item = asset.assets[k];
					if(item.contract == contractaddress){
						return item;
					}
				}
			}
		}
		return null;
	},

	//===================增加我选择的主链================
	addMineChainInfo: function(chaintype) {
		console.log('==this.m_mineChains==',this.m_mineChains)
		console.log('==chaintype==',chaintype)
		let ishave = false;
		for (let i = 0; i < this.m_mineChains.length; i++) {
			let type = this.m_mineChains[i]
			if (type == chaintype) {
				ishave = true;
				break;
			}
		}
		if (!ishave) {
			this.m_mineChains.push(chaintype);
		}
		vue.util.StringUtils.setUserDefaults("chain_mine_key", JSON.stringify(this.m_mineChains));
	},

	getMineChains: function() {
		return this.m_mineChains;
	},

	//当前链
	setCurrChainType: function(chaintype) {
		this.m_currChainType = chaintype;
	},

	getCurrChainType: function() {
		return this.m_currChainType;
	}

}
export default Chain
