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
		if (this.m_contractWallet) {
			for (let i = 0; i < this.m_contractWallet.length; i++) {
				let item = this.m_contractWallet[i];
				if (item) {
					item.money = 0;
				}
			}
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
		vue.shared.Event.removeByObserverName("dal_contractwallet");
	},

	setContractMoney: function(address, contractaddress, money) {
		for (let i = 0; i < this.m_contractWallet.length; i++) {
			let item = this.m_contractWallet[i];
			console.log("==setContractMoney==item===", item)
			if (item.address.toLowerCase() == address.toLowerCase() && item.contract.toLowerCase() == contractaddress.toLowerCase()) {
				item.money = money;
				item.rmb = money * 6.45;
			}
		}
	},

	getContractMoney: function(address, contractaddress) {
		console.log("=getContractMoney=address==", address)
		console.log("=getContractMoney=contractaddress==", contractaddress)
		for (let i = 0; i < this.m_contractWallet.length; i++) {
			let item = this.m_contractWallet[i];
			console.log("=getContractMoney=item==", item)
			if (item.address.toLowerCase() == address.toLowerCase() && item.contract.toLowerCase() == contractaddress.toLowerCase()) {
				return item;
			}
		}
		return null;
	},

	getContractWallets: function(idx, address) {
		console.log("=getContractWallets=idx==", idx)
		console.log("==address==", address)
		let items = [];
		for (let i = 0; i < this.m_contractWallet.length; i++) {
			let item = this.m_contractWallet[i];
			if (item.address.toLowerCase() == address.toLowerCase() && item.idx == idx) {
				items.push(item)
			}
		}
		console.log("==items==", items)
		return items;
	},

	removeContractWallet: function(chaintype, idx, contractaddress) {
		if (chaintype == vue.entities.Metadata.ChainType.ETH) {
			for (let i = 0; i < this.m_contractWallet.length; i++) {
				let item = this.m_contractWallet[i];
				if (item.chaintype == chaintype && item.contract.toLowerCase() == contractaddress.toLowerCase() && item.idx ==
					idx) {
					this.m_contractWallet.splice(i, 1)
					break;
				}
			}
		}
	},

	async addContractWallet(chaintype, idx, address, contractaddress) {
		if (chaintype == vue.entities.Metadata.ChainType.ETH) {
			let iscontract = await vue.dal.Eth.isContract(contractaddress)
			if (iscontract) {
				this.addItem(chaintype, idx, address, contractaddress)
				return true;
			}
		} else {
			this.addItem(chaintype, idx, address, contractaddress)
			return true;
		}
		return false;
	},

	addItem: function(chaintype, idx, address, contractaddress) {
		console.log("==addItem=idx==", idx)
		let ishave = false;
		for (let i = 0; i < this.m_contractWallet.length; i++) {
			let item = this.m_contractWallet[i];
			console.log("===item==",item)
			if (idx && item.idx && item.address.toLowerCase() == address.toLowerCase() && item.contract.toLowerCase() ==
				contractaddress.toLowerCase()) {
				ishave = true;
				break;
			}
		}
		if (!ishave) {
			let item = vue.dal.Common.getTokenByContractAddress(contractaddress)
			if (!item) {
				item = {
					idx: idx,
					chaintype: chaintype,
					address: address,
					contract: contractaddress,
					img: "",
					name: "",
					money: 0,
				}
			} else {
				item.idx = idx;
				item.address = address;
				item.chaintype = chaintype;
				item.contract = contractaddress;
				item.money = 0;
			}
			console.log("==addItem=item==", item)
			this.m_contractWallet.push(item)
		}
		vue.util.StringUtils.setUserDefaults("contract_wallets_key", JSON.stringify(this.m_contractWallet));
	},

}
export default ContractWallet
