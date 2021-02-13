const bip39 = require('../../../node_modules/bip39')

import Vue from 'vue'
var vue = Vue.prototype

//钱包管理器
const WalletManage = {
	m_currChainType: 1, //当前钱包
	m_currWalletIdx: 0, //当前普通钱包ID
	m_currMainWallet: null,
	m_currNormalWallet: null,
	m_currWallet: null,

	evtBalance: "EVT_BALANCE",
	evtToKenBalance: "EVT_evtToKenBalance",
	evtCreateWallter: "EVT_CREATE_WALLTER",
	evtTransResult: "EVT_TRANSRESULT",

	init: function() {
		uni.cclog("======WalletManage init==========")
		let currchaintype = vue.util.StringUtils.getUserDefaults("walletmanage_currwallet_key");
		let idx = vue.util.StringUtils.getUserDefaults("walletmanage_currwallet_idx_key");
		if (currchaintype) {
			this.m_currChainType = parseInt(currchaintype)
			this.m_currWalletIdx = parseInt(idx)
			console.log("==2=this.m_currChainType====", this.m_currChainType)
			console.log("==3=this.m_currWalletIdx====", this.m_currWalletIdx)
			this.setCurrWallet(this.m_currChainType, this.m_currWalletIdx)
		} else {
			this.m_currChainType = vue.entities.Metadata.ChainType.Normal; //当前钱包
		}

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
		vue.util.StringUtils.removeUserDefaults("walletmanage_currwallet_key");
		vue.util.StringUtils.removeUserDefaults("walletmanage_currwallet_idx_key");
		uni.cclog("======WalletManage clear==========")
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

	//创建指定链的身份钱包
	async createMainWallets(walletInfo, chains) {
		try {
			if (walletInfo.words && walletInfo.words.length > 0) {
				for (let i = 0; i < chains.length; i++) {
					let chaintype = chains[i];
					if (chaintype == vue.entities.Metadata.ChainType.BTC) {
						await vue.dal.Btc.createMain(walletInfo)
					} else if (chaintype == vue.entities.Metadata.ChainType.EOS) {
						await vue.dal.Eos.createMain(walletInfo)
					} else if (chaintype == vue.entities.Metadata.ChainType.ETH) {
						await vue.dal.Eth.createMain(walletInfo)
					} else if (chaintype == vue.entities.Metadata.ChainType.Lotus) {
						await vue.dal.Lotus.createMain(walletInfo)
					} else if (chaintype == vue.entities.Metadata.ChainType.TRON) {
						await vue.dal.Tron.createMain(walletInfo)
					}
				}
				// vue.dal.MainWallet.setMainInfo(walletInfo);
				return true;
			} else {
				console.error("==助记词无效=words===", words)
				return false;
			}
		} catch (e) {
			console.log("=createMainWallets=e==", e)
			return false;
		}
	},

	//创建所有身份钱包
	async createMainWallet(walletInfo) {
		try {
			if (walletInfo.words && walletInfo.words.length > 0) {
				let chaintype = vue.entities.Metadata.ChainType.BTC;
				let ret = false;

				console.log("==Btc==")
				ret = await vue.dal.Btc.createMain(walletInfo)

				if (ret) {
					console.log("==Eos==")
					vue.dal.Chain.addMineChainInfo(chaintype);
					chaintype = vue.entities.Metadata.ChainType.EOS;
					ret = await vue.dal.Eos.createMain(walletInfo)
				}

				if (ret) {
					console.log("==Eth==")
					vue.dal.Chain.addMineChainInfo(chaintype);
					chaintype = vue.entities.Metadata.ChainType.ETH;
					ret = await vue.dal.Eth.createMain(walletInfo)
				}

				// if (ret) {
				// 	console.log("==Lotus==")
				// 	vue.dal.Chain.addMineChainInfo(chaintype);
				// 	chaintype = vue.entities.Metadata.ChainType.LOTUS;
				// 	ret = await vue.dal.Lotus.createMain(walletInfo)
				// }

				if (ret) {
					console.log("==Tron==")
					vue.dal.Chain.addMineChainInfo(chaintype);
					chaintype = vue.entities.Metadata.ChainType.TRON;
					ret = await vue.dal.Tron.createMain(walletInfo)
				}
				if (!ret) {
					return false;
				}
				vue.dal.Chain.addMineChainInfo(chaintype);
				vue.dal.MainWallet.setMainInfo(walletInfo);
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

	//创建普通钱包 chaintype, importtype, strval
	async createNormalWallet(walletInfo) {
		let isok = false;
		if (walletInfo.chaintype == vue.entities.Metadata.ChainType.BTC) {
			isok = await vue.dal.Btc.createNormal(walletInfo)
		} else if (walletInfo.chaintype == vue.entities.Metadata.ChainType.EOS) {
			isok = await vue.dal.Eos.createNormal(walletInfo)
		} else if (walletInfo.chaintype == vue.entities.Metadata.ChainType.ETH) {
			isok = await vue.dal.Eth.createNormal(walletInfo)
		} else if (walletInfo.chaintype == vue.entities.Metadata.ChainType.Lotus) {
			isok = await vue.dal.Lotus.createNormal(walletInfo)
		} else if (walletInfo.chaintype == vue.entities.Metadata.ChainType.TRON) {
			isok = await vue.dal.Tron.createNormal(walletInfo)
		}
		if (isok) {
			vue.dal.Chain.addMineChainInfo(walletInfo.chaintype);
		}
		return isok;
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

		// reversible
		console.log(bip39.mnemonicToEntropy(mnemonic))
		var mnemonic = bip39.generateMnemonic()
		console.log("===mnemonic===", mnemonic)
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

	getGasPrice: function() {
		console.log("==this.m_currWallet.chaintype==", this.m_currWallet.chaintype)
		let res = {}
		if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.BTC) {
			res = vue.dal.Btc.getGasPrice();
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.EOS) {
			res = vue.dal.Eos.getGasPrice();
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.ETH) {
			res = vue.dal.Eth.getGasPrice();
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.Lotus) {
			res = vue.dal.Lotus.getGasPrice();
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.TRON) {
			res = vue.dal.Tron.getGasPrice();
		}
		return res;
	},

	//判断是否开通钱包
	isExistWallet: function() {
		let mainWallets = vue.dal.MainWallet.getMainWallets()
		let normalWallets = vue.dal.NormalWallet.getNormalWallets()
		if (mainWallets.length > 0 || normalWallets.length > 0) {
			return true;
		}
		return false;
	},

	//设置当前钱包
	setCurrWallet: function(chaintype, idx) {
		console.log("==setCurrWallet=333333333=", chaintype)
		this.m_currChainType = chaintype;
		this.m_currWalletIdx = idx;
		this.m_currWallet = null;
		if (idx == 0) { //身份钱包
			this.m_currWallet = vue.dal.MainWallet.getMainWalletByType(chaintype)
		} else { //普通钱包
			this.m_currWallet = vue.dal.NormalWallet.getNormalWallet(chaintype, idx)
		}
		console.log("==chaintype==", chaintype)
		console.log("==idx==", idx)
		console.log("==this.m_currWallet==", this.m_currWallet)
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
		vue.util.StringUtils.setUserDefaults("walletmanage_currwallet_key", chaintype);
		vue.util.StringUtils.setUserDefaults("walletmanage_currwallet_idx_key", idx);

		this.onBalance();
	},

	setCurrWalletMoney: function(money, rmb) {
		console.log("=====setCurrWalletMoney=====", money)
		this.m_currWallet.money = money;
	},

	getCurrWallet: function() {
		console.log("=====getCurrWallet=====", this.m_currWallet)
		let priceInfo = vue.dal.Common.getAssetPriceInfo("ETH");
		let configinfo = vue.dal.Common.onGetCommonConfigInfo("exchange_key");
		if (configinfo && priceInfo) {
			let rmb = priceInfo.price_usd * this.m_currWallet.money * configinfo.value;
			console.log("==rmb==", rmb)
			this.m_currWallet.rmb = rmb;
		}

		return this.m_currWallet;
	},

	//========================交易相关======================
	async sendTransaction(to, amount, gas) {
		if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.BTC) {
			await vue.dal.Btc.sendTransaction(to, amount, gas);
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.EOS) {
			await vue.dal.Eos.sendTransaction(to, amount, gas);
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.ETH) {
			await vue.dal.Eth.sendTransaction(to, amount, gas);
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.Lotus) {
			await vue.dal.Lotus.sendTransaction(to, amount, gas);
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.TRON) {
			await vue.dal.Tron.sendTransaction(to, amount, gas);
		}
	},

	async sendTokenTransaction(to, amount, contractAddress, gas) {
		if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.BTC) {
			await vue.dal.Btc.sendTokenTransaction(to, amount, gas, contractAddress);
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.EOS) {
			await vue.dal.Eos.sendTokenTransaction(to, amount, gas, contractAddress);
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.ETH) {
			await vue.dal.Eth.sendTokenTransaction(to, amount, gas, contractAddress);
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.Lotus) {
			await vue.dal.Lotus.sendTokenTransaction(to, amount, gas, contractAddress);
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.TRON) {
			await vue.dal.Tron.sendTokenTransaction(to, amount, gas, contractAddress);
		}
	},

	getBalance: function() {
		let balance = 0;
		if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.BTC) {
			balance = vue.dal.Btc.getBalance();
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.EOS) {
			balance = vue.dal.Eos.getBalance();
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.ETH) {
			balance = vue.dal.Eth.getBalance();
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.Lotus) {
			balance = vue.dal.Lotus.getBalance();
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.TRON) {
			balance = vue.dal.Tron.getBalance();
		}
		return balance;
	},

	onBalance: function() {
		if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.BTC) {
			vue.dal.Btc.onBalance();
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.EOS) {
			vue.dal.Eos.onBalance();
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.ETH) {
			vue.dal.Eth.onBalance();
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.Lotus) {
			vue.dal.Lotus.onBalance();
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.TRON) {
			vue.dal.Tron.onBalance();
		}
	},

	onTokenBalance: function(contractAddress) {
		console.log('==333=contractAddress==', contractAddress)
		if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.BTC) {
			vue.dal.Btc.onTokenBalance(contractAddress);
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.EOS) {
			vue.dal.Eos.onTokenBalance(contractAddress);
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.ETH) {
			vue.dal.Eth.onTokenBalance(contractAddress);
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.Lotus) {
			vue.dal.Lotus.onTokenBalance(contractAddress);
		} else if (this.m_currWallet.chaintype == vue.entities.Metadata.ChainType.TRON) {
			vue.dal.Tron.onTokenBalance(contractAddress);
		}
	},
}
export default WalletManage
