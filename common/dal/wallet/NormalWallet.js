import Vue from 'vue'
var vue = Vue.prototype

//普通钱包
const NormalWallet = {
	m_normalWallet: {}, //普通钱包
	
	init: function() {
		uni.cclog("======NormalWallet init==========")
		let normalWallet =  vue.util.StringUtils.getUserDefaults("normal_wallets_key");
		if (normalWallet && normalWallet.length > 0) {
			this.m_normalWallet = JSON.parse(normalWallet)
		}
		this.onAddListener();
		return true;
	},

	destroy: function() {
		this.onRemoveListener();
		this.clear();
	},

	clear: function() {
		uni.cclog("======NormalWallet clear==========")
		this.m_normalWallet = {};
	},

	onAddListener: function() {
		this.onRemoveListener();
	},

	onRemoveListener: function() {
		vue.shared.Event.removeByObserverName("dal_normalwallet");
	},

	//===========================普通钱包=================================
	//增加普通钱包
	addNormalWallet: function(chaintype, wallet) {
		let wallets = this.getNormalWalletsByType(chaintype)
		console.log("=addNormalWallet==wallets==",wallets)
		for (let i = 0; i < wallets.length; i++) {
			let item = wallets[i];
			if (item.privateKey == wallet.privateKey) {
				return;
			}
		}
		let len = wallets.length + 1;
		let item = {
			idx: len,
			chaintype: chaintype,
			mnemonic: wallet.mnemonic,
			privateKey: wallet.privateKey,
			address: wallet.address,
			importtype: wallet.importtype,
			password: wallet.password,
			passwordtip:wallet.passwordtip,
			name: wallet.name,//钱包名称
		}
		if (this.m_normalWallet[chaintype] == null) {
			this.m_normalWallet[chaintype] = [];
		}
		this.m_normalWallet[chaintype].push(item);
		vue.util.StringUtils.setUserDefaults("normal_wallets_key", JSON.stringify(this.m_normalWallet));
	},

	//删除普通钱包
	deleteNormalWallet: function(chaintype, idx) {
		let items = this.m_normalWallet[chaintype]
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			if (item.idx == idx) {
				items.splice(i, 1)
				break;
			}
		}
	},

	//获得所有普通钱包
	getNormalWallets: function() {
		let items = [];
		for (let key in this.m_normalWallet) {
			let wallets = this.m_normalWallet[key];
			for(let i = 0; i < wallets.length ; i++){
				let walletinfo = wallets[i]
				items.push(walletinfo);
			}
		}
		return items;
	},
	
	//获得所有普通钱包
	getNormalWalletsByType: function(chaintype) {
		let items = this.m_normalWallet[chaintype];
		if(!items){
			items = [];
		}
		return items;
	},
	
	//获得指定钱包
	getNormalWallet:function(chaintype,idx){
		let items = this.getNormalWallets(chaintype);
		for (let i = 0; i < this.m_normalWallet.length ; i++) {
			let item = this.m_normalWallet[i];
			if(item.idx == idx){
				return item;
			}
		}
		return null;
	},

	//私钥是否被普通钱包使用过
	isExistWallet: function(chaintype, privateKey) {
		let isexist = false;
		let items = this.getNormalWallets(chaintype);
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			if (item.privateKey == privateKey) {
				isexist = true;
				break;
			}
		}
		return isexist;
	}
}

export default NormalWallet
