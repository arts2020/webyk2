const ethers = require("../../../../node_modules/ethers")
const EthUtils = require('../utils/eth-utils.js').EthUtils;
const web3 = require("../../../../node_modules/web3")

import Vue from 'vue'
var vue = Vue.prototype

const Ethers = {
	m_balance: 0,
	m_reqUrl: "",
	init: function() {
		vue.cclog("=========Ethers===初始化===============")
		this.m_reqUrl = "https://mainnet.infura.io/v3/033fa6dd066c48d99c6b43c0b6da4dd7";
	},

	destroy: function() {

	},

	//创建身份钱包
	async createMain(words) {
		let ethwallet = vue.dal.MainWallet.getMainWallet(vue.entities.Metadata.ChainType.ETH)
		if (!ethwallet) {
			ethWallet = await this.createWalletByWords(words)
			vue.dal.MainWallet.addMainWallet(vue.entities.Metadata.ChainType.ETH, ethWallet);
		}
	},

	//创建合约钱包
	async createContract(address) {
		let iscontract = this.isContract(address);
		if (iscontract) {
			vue.dal.ContractWallet.addContractWallet(vue.entities.Metadata.ChainType.ETH, address)
			return true;
		}
		return false;
	},

	//创建普通钱包
	async createNormal(importtype, strval) {
		if (importtype == vue.Metadata.ImportType.WordType) {
			let ethWallet = await this.createWalletByWords(strval)
			ethWallet.importtype = vue.Metadata.ImportType.WordType;
			vue.dal.NomalWallet.addNormalWallet(vue.entities.Metadata.ChainType.ETH, ethWallet);
		} else if (importtype == vue.Metadata.ImportType.PrivateType) {
			let ethWallet = await this.createWalletByPrivateKey(strval)
			ethWallet.importtype = vue.Metadata.ImportType.PrivateType;
			vue.dal.NomalWallet.addNormalWallet(vue.entities.Metadata.ChainType.ETH, ethWallet);
		}
	},

	async createWalletByWords(words) {
		vue.cclog("========ETH===创建节点请求===============")
		try {
			//根据助记词找回钱包信息
			// var monic = "peace mouse scrap chase order guess volume unit riot save reopen nation"
			var mnemonic = ethers.Wallet.fromMnemonic(words);
			let privateKey = mnemonic.privateKey;
			console.log("找回-钱包私钥：", privateKey)
			//获取path
			var path = mnemonic.path;
			let publicKey = mnemonic.publicKey;
			//根据私钥找回钱包地址
			var wallet = new ethers.Wallet(privateKey);
			//钱包地址
			let address = wallet.address;

			return {
				privateKey: privateKey,
				publicKey: publicKey,
				address: address.address
			}
		} catch (e) {
			console.log("===createWalletByWords=e==", e)
			return false;
		}
	},

	async createWalletByPrivateKey(privateKey) {
		try {
			//根据私钥找回钱包地址
			var wallet = new ethers.Wallet(privateKey);
			//钱包地址
			let address = wallet.address;
			return {
				privateKey: privateKey,
				publicKey: null,
				address: address
			}
		} catch (e) {
			console.log("===createWalletByPrivateKey=e==", e)
			return false;
		}
	},

	async initCurrChain(){
		let walletInfo = vue.dal.WalletMange.getCurrWallet();
		this.m_privateKey = walletInfo.privateKey;
		this.fromAddress = walletInfo.address;
	},
	
	// 记录交易
	async sendTransaction(to, amount, gas) {
		let pedings = await EthUtils.ethTransactionCountByPending(this.fromAddress, this.m_reqUrl)

		let gcout = await EthUtils.ethTransactionCount(this.fromAddress, this.m_reqUrl)
		let txid = await EthUtils.ethTransferAsync(privateKey, this.fromAddress, to, amount, pedings, this.m_reqUrl, gas);
		if (txid && txid.length == 66) {
			this.onBalance();
			vue.cclog("=====Ethers===sendTransaction===1=", txid);
			vue.util.UiUtils.showToast("转帐已提交");

			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletMange.evtTransResult, {
				tx: txid
			});
		} else {
			vue.cclog("=====Ethers===sendTransaction==2==", txid);
			vue.util.UiUtils.showToast("转帐失败，您的余额不变");
		}
		vue.util.UiUtils.hideLoading();
		vue.cclog("=====Ethers===sendTransaction====", txid);
	},

	async sendTokenTransaction(to, amount, gas, contractAddress) {

		let pedings = await EthUtils.ethTransactionCountByPending(this.fromAddress, this.m_reqUrl)
		console.log("===pedings=", pedings)
		console.log("===this.fromAddress=", this.fromAddress)
		console.log("===to=", to)
		let txid = await EthUtils.tokenTransferAsync(privateKey, contractAddress, this.fromAddress, to, amount, 6, pedings,
			this.m_reqUrl, gas)
		console.log("====txid=====", txid)
		if (txid && txid.length == 66) {
			this.onTokenBalance(contractAddress);
			vue.util.UiUtils.showToast("转帐已提交");
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletMange.evtTransResult, {
				tx: txid
			});
		} else {
			vue.util.UiUtils.showToast("转帐失败，您的余额不变");
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletMange.evtTransResult, {
				tx: false
			});
		}
		vue.util.UiUtils.hideLoading();
		vue.cclog("=========usdterc20===sendTransaction=====2==========", txid)
	},

	getBalance: function() {
		vue.cclog("=====Ethers===m_balance====", this.m_balance);
		return this.m_balance;
	},

	onBalance: function() {
		EthUtils.getETHBalanceAsync(this.fromAddress, this.m_reqUrl).then((balance) => {
			vue.cclog("=====this.Ethers===balance====", balance);
			this.m_balance = balance;
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletMange.evtBalance);
		})
	},

	onTokenBalance: function(contractAddress) {
		EthUtils.getTokenBalanceAsync(contractAddress, this.fromAddress, this.m_reqUrl).then((balance) => {
			vue.cclog("=====this.m_usdtErc20===balance===", balance);
			this.m_balance = balance;
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletMange.evtBalance,{balance:balance});
		})
	},

	isContract: function(address) {
		let code = web3.eth.getCode(this.fromAddress)
		console.log("==isContract====code===", code)
		if (code == '0x') {
			console.log('普通账户')
			return false;
		} else {
			console.log('合约账户')
			return true;
		}
	}
};

export default Ethers
