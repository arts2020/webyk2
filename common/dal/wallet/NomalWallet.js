import Vue from 'vue'
var vue = Vue.prototype

//普通钱包
const NormalWallet = {
	m_normalWallet: {}, //普通钱包
	
	init: function() {
		uni.cclog("======NormalWallet init==========")
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
		let wallets = this.getNormalWallets(chaintype)
		let len = wallets.Length() + 1;
		let item = {
			idx: len,
			chaintype: chaintype,
			mnemonic: wallet.mnemonic,
			privateKey: wallet.privateKey,
			address: wallet.address,
			importtype: wallet.importtype
			password: wallet.password,
			passwordtip:wallet.passwordtip,
			name: wallet.name,//钱包名称
		}
		if (this.m_normalWallet[chaintype] == null) {
			this.m_normalWallet[chaintype] = [];
		}
		this.m_normalWallet[chaintype].push(item);
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
	getNormalWallets: function(chaintype) {
		let items = [];
		for (let key in this.m_normalWallet) {
			items = this.m_normalWallet[chaintype];
			break;
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
