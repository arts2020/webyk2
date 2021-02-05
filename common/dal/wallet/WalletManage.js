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
	async getMnemonic {
		let mnemonic = this.createNewWords();
		return mnemonic;
	}

	//创建身份钱包
	async createMainWallet(mnemonic) {
		if (mnemonic && mnemonic.length > 0) {
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
			await vue.dal.BTC.createNormal(importtype, strval)
		} else if (chaintype == vue.entities.Metadata.ChainType.EOS) {
			await vue.dal.EOS.createNormal(importtype, strval)
		} else if (chaintype == vue.entities.Metadata.ChainType.ETH) {
			await vue.dal.ETH.createNormal(importtype, strval)
		} else if (chaintype == vue.entities.Metadata.ChainType.Lotus) {
			await vue.dal.Lotus.createNormal(importtype, strval)
		} else if (chaintype == vue.entities.Metadata.ChainType.TRON) {
			await vue.dal.Tron.createNormal(importtype, strval)
		}
	},
	
	//创建合约钱包
	async createContractWallet(chaintype, address) {
		if (chaintype == vue.entities.Metadata.ChainType.BTC) {
			await vue.dal.BTC.createContract(address)
		} else if (chaintype == vue.entities.Metadata.ChainType.EOS) {
			await vue.dal.EOS.createContract(address)
		} else if (chaintype == vue.entities.Metadata.ChainType.ETH) {
			await vue.dal.ETH.createContract(address)
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
	},

	//设置当前钱包
	setCurrWallet: function(chaintype,idx) {
		this.m_currChainType = chaintype;
		this.m_currWalletIdx = idx;
		this.m_currWallet = null;
		if(idx == 0){//身份钱包
			this.m_currWallet = vue.dal.MainWallet.getMainWallet(chaintype)
		}else{//普通钱包
			this.m_currWallet = vue.dal.MainWallet.getNormalWallet(chaintype,idx)
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
	}
}
export default WalletMange
