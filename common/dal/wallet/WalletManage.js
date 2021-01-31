const bip39 = require('../../../node_modules/bip39')

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
	
	//获得助记词
	async getMnemonic{
		let mnemonic = this.createNewWords();
		return mnemonic;
	}
	
	//创建身份钱包
	async createMainWallet(words) {
		if (words && words.length > 0) {
			await vue.dal.BTC.createMain(mnemonic)
			await vue.dal.EOS.createWalletByWords(mnemonic)
			await vue.dal.ETH.createWalletByWords(mnemonic)
			await vue.dal.Lotus.createWalletByWords(mnemonic)
			await vue.dal.TRON.createWalletByWords(mnemonic)
		} else {
			console.error("==助记词无效=mnemonic===", mnemonic)
		}
	},

	//创建普通钱包
	async createNormalWallet(chaintype, importtype, strval) {
		if (chaintype == vue.entities.Metadata.ChainType.BTC) {
			await vue.dal.BTC.createNormal(importtype, importtype, strval)
		} else if (chaintype == vue.entities.Metadata.ChainType.EOS) {
			await vue.dal.EOS.createNormal(importtype, importtype, strval)
		} else if (chaintype == vue.entities.Metadata.ChainType.ETH) {
			await vue.dal.ETH.createNormal(importtype, importtype, strval)
		} else if (chaintype == vue.entities.Metadata.ChainType.Lotus) {
			await vue.dal.Lotus.createNormal(importtype, importtype, strval)
		} else if (chaintype == vue.entities.Metadata.ChainType.TRON) {
			await vue.dal.TRON.createNormal(importtype, importtype, strval)
		}
	},

	//创建助记词
	createNewWords: function() {
		vue.cclog("=============createNewWords============")
		var mnemonic = bip39.entropyToMnemonic('00000000000000000000000000000000')
		console.log("===mnemonic===", mnemonic)
		// reversible
		console.log(bip39.mnemonicToEntropy(mnemonic))
		var mnemonic = bip39.generateMnemonic()
		return mnemonic;
	},

	//钱包是否存在（身份钱包/普通钱包）
	isExistWallet: function(chaintype, privateKey) {
		//身份钱包中是否存在
		let isexist = vue.dal.MainWallet.isExistWallet(chaintype, privateKey);
		if (isexist) {
			return vue.Metadata.WalletType.MainType;
		}
		//普通钱包中是否存在
		isexist = vue.dal.NomalWallet.isExistWallet(chaintype, privateKey);
		if (isexist) {
			return vue.Metadata.WalletType.Normal;
		}
		return vue.Metadata.WalletType.UnKnow;
	}
}
export default WalletMange
