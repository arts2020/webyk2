const bip39 = require('../../../node_modules/bip39')

import Vue from 'vue'
var vue = Vue.prototype

//钱包管理器
const WalletMange = {
	m_currChainType: 1, //当前钱包
	m_currWalletIdx: 0, //当前普通钱包ID
	m_currMainWallet: null,
	m_currNormalWallet: null,

	evtBalance: "EVT_BALANCE",
	evtCreateWallter: "EVT_CREATE_WALLTER",
	evtTransResult: "EVT_TRANSRESULT",

	init: function() {
		uni.cclog("======WalletMange init==========")
		this.m_currChainType = vue.entities.Metadata.ChainType.Normal, //当前钱包
			this.onAddListener();
		return true;
	},

	destroy: function() {
		this.onRemoveListener();
		this.clear();
	},

	clear: function() {
		this.m_currMainWallet = null;
		this.m_currNormalWallet = null;
		uni.cclog("======WalletMange clear==========")
	},

	onAddListener: function() {
		this.onRemoveListener();
	},

	onRemoveListener: function() {
		vue.shared.Event.removeByObserverName("dal_walletmangage");
	},

	//获得助记词
	async getMnemonic() {
		vue.cclog("=============getMnemonic============")
		let words = this.createNewWords();
		return words;
	},

	// name: "identity_name",
	// password: this.password,
	// tips: this.pasdTip,
	// words:this.words,
	// importtype:this.Metadata.ImportType.WordType
	//创建身份钱包
	async createMainWallet(walletInfo) {
		try {
			if (walletInfo.words && walletInfo.words.length > 0) {
				console.log("==Btc==")
				await vue.dal.Btc.createMain(walletInfo)
				console.log("==Eos==")
				await vue.dal.Eos.createMain(walletInfo)
				console.log("==Eth==")
				await vue.dal.Eth.createMain(walletInfo)
				console.log("==Lotus==")
				await vue.dal.Lotus.createMain(walletInfo)
				console.log("==Tron==")
				await vue.dal.Tron.createMain(walletInfo)
				return true;
			} else {
				console.error("==助记词无效=words===", words)
				return false;
			}
		} catch (e) {
			console.log("==e==", e)
			return false;
		}
	},

	//创建普通钱包
	async createNormalWallet(chaintype, importtype, strval) {
		if (chaintype == vue.entities.Metadata.ChainType.BTC) {
			await vue.dal.Btc.createNormal(importtype, strval)
		} else if (chaintype == vue.entities.Metadata.ChainType.EOS) {
			await vue.dal.Eos.createNormal(importtype, strval)
		} else if (chaintype == vue.entities.Metadata.ChainType.ETH) {
			await vue.dal.Eth.createNormal(importtype, strval)
		} else if (chaintype == vue.entities.Metadata.ChainType.Lotus) {
			await vue.dal.Lotus.createNormal(importtype, strval)
		} else if (chaintype == vue.entities.Metadata.ChainType.TRON) {
			await vue.dal.Tron.createNormal(importtype, strval)
		}
	},

	//创建合约钱包
	async createContractWallet(chaintype, address) {
		if (chaintype == vue.entities.Metadata.ChainType.BTC) {
			await vue.dal.Btc.createContract(address)
		} else if (chaintype == vue.entities.Metadata.ChainType.EOS) {
			await vue.dal.Eos.createContract(address)
		} else if (chaintype == vue.entities.Metadata.ChainType.ETH) {
			await vue.dal.Eth.createContract(address)
		} else if (chaintype == vue.entities.Metadata.ChainType.Lotus) {
			await vue.dal.Lotus.createContract(address)
		} else if (chaintype == vue.entities.Metadata.ChainType.TRON) {
			await vue.dal.Tron.createContract(address)
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

	//指定钱包是否存在（身份钱包/普通钱包）
	isExistWalletByChainType: function(chaintype, privateKey) {
		//身份钱包中是否存在
		let isexist = vue.dal.MainWallet.isExistWallet(chaintype, privateKey);
		if (isexist) {
			return vue.Metadata.WalletType.MainType;
		}
		//普通钱包中是否存在
		isexist = vue.dal.NormalWallet.isExistWallet(chaintype, privateKey);
		if (isexist) {
			return vue.Metadata.WalletType.Normal;
		}
		return vue.Metadata.WalletType.UnKnow;
	},

	//判断是否开通钱包
	isExistWallet: function() {
		let mainWallets = vue.dal.MainWallet.getMainWallets()
		let normalWallets = vue.dal.NormalWallet.getNormalWallets()
		if (mainWallets.length > 0 && normalWallets.length > 0) {
			return true;
		}
		return false;
	},

	//设置当前钱包
	setCurrWallet: function(chaintype, idx) {
		this.m_currChainType = chaintype;
		this.m_currWalletIdx = idx;
		this.m_currWallet = null;
		if (idx == 0) { //身份钱包
			this.m_currWallet = vue.dal.MainWallet.getMainWallet(chaintype)
		} else { //普通钱包
			this.m_currWallet = vue.dal.MainWallet.getNormalWallet(chaintype, idx)
		}
		if (chaintype == vue.entities.Metadata.ChainType.BTC) {
			vue.dal.Btc.initCurrChain();
		} else if (chaintype == vue.entities.Metadata.ChainType.EOS) {
			vue.dal.Eos.initCurrChain();
		} else if (chaintype == vue.entities.Metadata.ChainType.ETH) {
			vue.dal.Eth.initCurrChain();
		} else if (chaintype == vue.entities.Metadata.ChainType.Lotus) {
			vue.dal.Lotus.initCurrChain();
		} else if (chaintype == vue.entities.Metadata.ChainType.TRON) {
			vue.dal.Tron.initCurrChain();
		}
	},

	getCurrWallet: function() {
		return this.m_currWallet;
	},

}
export default WalletMange
