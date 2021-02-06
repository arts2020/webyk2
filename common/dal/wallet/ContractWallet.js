import Vue from 'vue'
var vue = Vue.prototype

//合约钱包
const ContractWallet = {
	m_contractWallet: [],

	init: function() {
		uni.cclog("======ContractWallet init==========")
		this.onAddListener();
		return true;
	},

	destroy: function() {
		this.onRemoveListener();
		this.clear();
	},

	clear: function() {
		uni.cclog("======ContractWallet clear==========")
		this.m_mainWallet = {};
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
				if (item.chaintype == chaintype ) {
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

	addContractWallet: function(chaintype, address) {
		if (chaintype == vue.entities.Metadata.ChainType.ETH) {
			let iscontract = vue.dal.Ethers.isContract(address)
			if (iscontract) {
				this.addItem(chaintype, address)
			}
		}
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
			let contractWallet = {
				chaintype: chaintype,
				address: address
			}
			this.m_contractWallet.push(contractWallet)
		}
	},

}
export default ContractWallet
