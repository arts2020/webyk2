import Vue from 'vue'
var vue = Vue.prototype

//钱包管理器
const WalletMange = {
	init: function() {
		uni.cclog("======WalletMange init==========")
		this.onAddListener();
		return true;
	},

	destroy: function() {
		this.onRemoveListener();
		this.clear();
	},

	clear: function() {
		uni.cclog("======WalletMange clear==========")
	},

	onAddListener: function() {
		this.onRemoveListener();
	},

	onRemoveListener: function() {
		vue.shared.Event.removeByObserverName("dal_walletmangage");
	},

	//===========================普通钱包=================================
	await initMainWallets: function() {
		let mnemonic = vue.dal.MainWallet.getMnemonic();
		if(mnemonic.length > 0){

		}
	},

	//获得所有普通钱包
	getWalletManges: function(chaintype) {
		let items = [];
		for (let key in this.m_normalWallet) {
			items = this.m_normalWallet[chaintype];
			break;
		}
		return items;
	}
}
export default WalletMange
