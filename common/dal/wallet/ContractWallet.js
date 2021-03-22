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
					item.rmb = 0;
				}
			}
		}
		
		uni.cclog("====this.m_contractWallet.length=====",this.m_contractWallet.length)
		// this.onGetTokenList();
		this.onAddListener();
		return true;
	},

	destroy: function() {
		this.onRemoveListener();
	},

	clear: function() {
		uni.cclog("======ContractWallet clear==========")
		this.m_contractWallet = [];
		vue.util.StringUtils.removeUserDefaults("contract_wallets_key");
	},

	onAddListener: function() {
		this.onRemoveListener();
	},

	onRemoveListener: function() {
		vue.shared.Event.removeByObserverName("dal_contractwallet");
	},

	onGetTokenList: function() {
		if (this.m_contractWallet) {
			let ishave = false;
			// uni.cclog("======this.m_contractWallet.length======",this.m_contractWallet.length)
			for (let i = 0; i < this.m_contractWallet.length; i++) {
				let item = this.m_contractWallet[i];

				ishave = true;
				// uni.cclog("======item.idx======", item)
				//item.contract
				let contractItem = vue.dal.Common.getTokenByContractAddress(item.contract)
				// uni.cclog("====contractItem===", contractItem)
				if (contractItem) {
					item.icon = contractItem.icon;
				}
			}
			if (ishave) {
				vue.util.StringUtils.setUserDefaults("contract_wallets_key", JSON.stringify(this
					.m_contractWallet));
			}
		}
	},

	setContractMoney: function(address, contractaddress, money) {
		for (let i = 0; i < this.m_contractWallet.length; i++) {
			let item = this.m_contractWallet[i];
			// console.log("==setContractMoney==item===", item)
			if (item.address.toLowerCase() == address.toLowerCase() && item.contract.toLowerCase() ==
				contractaddress.toLowerCase()) {
				item.money = money;
				item.rmb = money * 6.45;
			}
		}
	},

	getContractMoney: function(address, contractaddress) {
		// console.log("=getContractMoney=address==", address)
		// console.log("=getContractMoney=contractaddress==", contractaddress)
		for (let i = 0; i < this.m_contractWallet.length; i++) {
			let item = this.m_contractWallet[i];
			// console.log("=getContractMoney=item==", item)
			if (item.address.toLowerCase() == address.toLowerCase() && item.contract.toLowerCase() ==
				contractaddress.toLowerCase()) {
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
		for (let i = 0; i < this.m_contractWallet.length; i++) {
			let item = this.m_contractWallet[i];
			if (item.chaintype == chaintype && item.contract.toLowerCase() == contractaddress.toLowerCase() &&
				item.idx ==
				idx) {
				this.m_contractWallet.splice(i, 1)
				break;
			}
		}
	},

	removeContractWalletByIdx: function(chaintype, idx) {
		for (let i = 0; i < this.m_contractWallet.length; i++) {
			let item = this.m_contractWallet[i];
			if (item.chaintype == chaintype && item.idx == idx) {
				this.m_contractWallet.splice(i, 1)
			}
		}
	},

	async addContractWallet(chaintype, idx, address, contractaddress) {
		if (chaintype == vue.entities.Metadata.ChainType.ETH) {
			let iscontract = await vue.dal.Eth.isContract(contractaddress)
			if (iscontract) {
				return this.addItem(chaintype, idx, address, contractaddress)
			}
		} else {
			return this.addItem(chaintype, idx, address, contractaddress)
		}
		return false;
	},

	addItem: function(chaintype, idx, address, contractaddress) {
		console.log("==addItem=idx==", idx)
		console.log("==this.m_contractWallet==", this.m_contractWallet)
		let ishave = false;
		for (let i = 0; i < this.m_contractWallet.length; i++) {
			let item = this.m_contractWallet[i];
			if (idx && item.idx && item.address.toLowerCase() == address.toLowerCase() && item.contract
				.toLowerCase() ==
				contractaddress.toLowerCase()) {
				ishave = true;
				break;
			}
		}
		console.log("==addItem=ishave==", ishave)
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
			vue.util.StringUtils.setUserDefaults("contract_wallets_key", JSON.stringify(this.m_contractWallet));
			return true;
		} else {
			return false;
		}
	},

	setContractItem: function(contractItem) {
		for (let i = 0; i < this.m_contractWallet.length; i++) {
			let item = this.m_contractWallet[i];
			// console.log("==setContractMoney==item===", item)
			if (item.address.toLowerCase() == contractItem.address.toLowerCase() &&
				item.contract.toLowerCase() == contractItem.contract.toLowerCase()) {
				item.name = contractItem.name;
				item.id = contractItem.id;
				// item.idx = contractItem.idx;
			}
		}
		vue.util.StringUtils.setUserDefaults("contract_wallets_key", JSON.stringify(this.m_contractWallet));
	},
}
export default ContractWallet
