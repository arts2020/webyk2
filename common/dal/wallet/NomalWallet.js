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
	addNormalWallet: function(chaintype, mnemonic, privateKey, address) {
		let wallets = this.getNormalWallets(chaintype)
		let len = wallets.Length() + 1;
		let item = {
			idx: len,
			chaintype: chaintype,
			mnemonic: mnemonic,
			privateKey: privateKey,
			address: address
		}
		if (this.m_normalWallet[chaintype] == null) {
			this.m_normalWallet[chaintype] = [];
		}
		this.m_normalWallet[chaintype].push(item);
	},

	//删除普通钱包
	deleteNormalWallet:function(chaintype,idx){
		let normalWallet = this.m_normalWallet[chaintype]
		for(let i = 0; i < normalWallet.length ;i++){
			let item =  normalWallet[i];
			if(item.idx == idx){
				normalWallet.splice(i,1)
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
	}
}
export default NormalWallet
