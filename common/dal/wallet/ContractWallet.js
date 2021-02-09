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

	getContractWallets: function(address) {
		let items = [];
		for (let i = 0; i < this.m_contractWallet.length; i++) {
			let item = this.m_contractWallet[i];
			if (item.address == address) {
				items.push(item)
			}
		}
		return items;
	},

	removeContractWallet: function(chaintype, contractaddress) {
		if (chaintype == vue.entities.Metadata.ChainType.ETH) {
			for (let i = 0; i < this.m_contractWallet.length; i++) {
				let item = this.m_contractWallet[i];
				if (item.chaintype == chaintype && item.contractaddress == contractaddress) {
					this.m_contractWallet.splice(i, 1)
					break;
				}
			}
		}
	},

	async addContractWallet(chaintype, address, contractaddress) {
		if (chaintype == vue.entities.Metadata.ChainType.ETH) {
			let iscontract = await vue.dal.Eth.isContract(contractaddress)
			if (iscontract) {
				this.addItem(chaintype, address, contractaddress)
				return true;
			}
		} else {
			this.addItem(chaintype, address, contractaddress)
			return true;
		}
		return false;
	},

	addItem: function(chaintype, address, contractaddress) {
		let ishave = false;
		for (let i = 0; i < this.m_contractWallet.length; i++) {
			let item = this.m_contractWallet[i];
			if (item.address == address && item.contractaddress == contractaddress) {
				ishave = true;
				break;
			}
		}
		if (!ishave) {
			let item = vue.dal.Chain.getAssetByContractAddress(chaintype, contractaddress)
			if (!item) {
				item = {
					chaintype: chaintype,
					address: address,
					contract: contractaddress,
					img: "",
					name: "",
				}
			} else {
				item.chaintype = chaintype;
			}
			console.log("==addItem=item==", item)
			this.m_contractWallet.push(item)
		}
		vue.util.StringUtils.setUserDefaults("contract_wallets_key", JSON.stringify(this.m_contractWallet));
	},

}
export default ContractWallet
