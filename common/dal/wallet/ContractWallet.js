import Vue from 'vue'
var vue = Vue.prototype

//合约钱包
const ContractWallet = {
	m_contractWallet: [],

	init: function() {
		uni.cclog("======ContractWallet init==========")
		let wallets = vue.util.StringUtils.getUserDefaults("contract_wallets_key");
		if (wallets && wallets.length > 0) {
			this.m_contractWallet = JSON.parse(wallets)
		}
		this.onAddListener();
		return true;
	},

	destroy: function() {
		this.onRemoveListener();
	},

	clear: function() {
		uni.cclog("======ContractWallet clear==========")
		this.m_mainWallet = {};
		vue.util.StringUtils.removeUserDefaults("contract_wallets_key");
	},

	onAddListener: function() {
		this.onRemoveListener();
	},

	onRemoveListener: function() {
		vue.shared.Event.removeByObserverName("dal_m_contractwallet");
	},

	getContractWallets: function(chaintype) {
		let items = [];
		if (chaintype == vue.entities.Metadata.ChainType.ETH) {
			for (let i = 0; i < this.m_contractWallet.length; i++) {
				let item = this.m_contractWallet[i];
				if (item.chaintype == chaintype) {
					items.push(item)
				}
			}
		}
		return items;
	},

	removeContractWallet: function(chaintype, address) {
		if (chaintype == vue.entities.Metadata.ChainType.ETH) {
			for (let i = 0; i < this.m_contractWallet.length; i++) {
				let item = this.m_contractWallet[i];
				if (item.chaintype == chaintype && item.address == address) {
					this.m_contractWallet.splice(i, 1)
					break;
				}
			}
		}
	},

	async addContractWallet(chaintype, address) {
		if (chaintype == vue.entities.Metadata.ChainType.ETH) {
			let iscontract = await vue.dal.Eth.isContract(address)
			if (iscontract) {
				this.addItem(chaintype, address)
				return true;
			}
		} else {
			this.addItem(chaintype, address)
			return true;
		}
		return false;
	},

	addItem: function(chaintype, address) {
		let ishave = false;
		for (let i = 0; i < this.m_contractWallet.length; i++) {
			let item = this.m_contractWallet[i];
			if (item.chaintype == chaintype && item.address == address) {
				ishave = true;
				break;
			}
		}
		if (!ishave) {
			let item = vue.dal.Chain.getAssetByAddress(chaintype, address)
			if (!item) {
				item = {
					chaintype: chaintype,
					contract: address,
					img: "",
					name: "",
				}
			}else{
				item.chaintype = chaintype;
			}
			console.log("==addItem=item==",item)
			this.m_contractWallet.push(item)
		}
		vue.util.StringUtils.setUserDefaults("contract_wallets_key", JSON.stringify(this.m_contractWallet));
	},

}
export default ContractWallet
