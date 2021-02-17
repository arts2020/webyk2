const TronWeb = require("../../../../node_modules/tronweb")
const bip39 = require('../../../../node_modules/bip39')
const bip32 = require('../../../../node_modules/bip32')

import Vue from 'vue'
var vue = Vue.prototype

const Tron = {
	init: function() {
		console.log("========Tron===初始化===============")
		let HttpProvider = TronWeb.providers.HttpProvider;
		this.m_fullNode = new HttpProvider("https://api.trongrid.io");
		this.m_solidityNode = new HttpProvider("https://api.trongrid.io");
		this.m_eventServer = new HttpProvider("https://api.trongrid.io");
	},

	destroy: function() {

	},

	clear: function() {
		uni.cclog("======Tron clear==========")
	},

	//创建身份钱包
	async createMain(walletInfo) {
		let wallet = vue.dal.MainWallet.getMainWalletByType(vue.entities.Metadata.ChainType.TRON)
		if (!wallet) {
			wallet = await this.createWalletByWords(walletInfo.words)
			wallet.password = walletInfo.password;
			wallet.passwordtip = walletInfo.tips;
			wallet.importtype = vue.entities.Metadata.ImportType.WordType;
			vue.dal.MainWallet.addMainWallet(vue.entities.Metadata.ChainType.TRON, wallet);
		}
		return true;
	},
	//创建普通钱包
	async createNormal(walletInfo) {
		if (walletInfo.importtype == vue.entities.Metadata.ImportType.WordType) {
			let wallet = await this.createWalletByWords(walletInfo.strval)
			if (wallet) {
				wallet.name = walletInfo.name;
				wallet.password = walletInfo.password;
				wallet.passwordtip = walletInfo.passwordtip;
				wallet.chaintype = walletInfo.chaintype;
				wallet.importtype = vue.entities.Metadata.ImportType.WordType;
				return vue.dal.NormalWallet.addNormalWallet(vue.entities.Metadata.ChainType.TRON, wallet);
			}
		} else if (walletInfo.importtype == vue.entities.Metadata.ImportType.PrivateType) {
			let wallet = await this.createWalletByPrivateKey(walletInfo.strval)
			if (wallet) {
				wallet.name = walletInfo.name;
				wallet.password = walletInfo.password;
				wallet.passwordtip = walletInfo.passwordtip;
				wallet.chaintype = walletInfo.chaintype;
				wallet.importtype = vue.entities.Metadata.ImportType.PrivateType;
				return vue.dal.NormalWallet.addNormalWallet(vue.entities.Metadata.ChainType.TRON, wallet);
			}
		}
		return false;
	},

	async createWalletByWords(words) {
		console.log("========TRON===创建节点请求===============")
		try {
			let seed = await bip39.mnemonicToSeed(words)
			const node = bip32.fromSeed(seed);
			const child = node.derivePath(`m/44'/195'/0'/0/0`);
			let privateKey = child.privateKey.toString('hex');
			let publicKey = child.publicKey.toString('hex');
			let address = TronWeb.address.fromPrivateKey(privateKey);

			console.log("==22=privateKey===", privateKey)
			console.log("==22=m_publicKey===", publicKey)
			console.log("==22=address===", address)

			return {
				words: words,
				privateKey: privateKey,
				publicKey: publicKey,
				address: address
			}
		} catch (e) {
			console.log("=tron==createWalletByWords=e==", e)
			return false;
		}
	},

	async createWalletByPrivateKey(privateKey) {
		try {
			console.log("==privateKey==", privateKey)
			let address = TronWeb.address.fromPrivateKey(privateKey);
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

	async initCurrChain() {
		console.log("====initCurrChain===")
		let walletInfo = vue.dal.WalletManage.getCurrWallet();
		this.m_privateKey = walletInfo.privateKey;
		this.fromAddress = walletInfo.address;
		this.m_tronWeb = new TronWeb(this.m_fullNode, this.m_solidityNode, this.m_eventServer, this.m_privateKey);
	},

	// 记录交易
	async sendTransaction(asset, to, amount, gas) {
		const tradeobj = await this.m_tronWeb.transactionBuilder.sendTrx(to, amount * Math.pow(10, 6), this.fromAddress, 1);
		const signedtxn = await this.m_tronWeb.trx.sign(tradeobj, this.m_privateKey);
		const receipt = await this.m_tronWeb.trx.sendRawTransaction(signedtxn);
		console.log("====receipt===", receipt)
		console.log("====receipt.length===", receipt.txid.length)
		if (receipt.result && receipt.txid && receipt.txid.length == 64) {
			vue.util.UiUtils.showToast("转帐已提交");
			vue.dal.Common.onTransfer(asset, this.fromAddress, to, amount, receipt.txid, "")
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtTransResult, {
				result: true
			});
		} else {
			vue.util.UiUtils.showToast("转帐失败，您的余额不变");
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtTransResult, {
				result: false
			});
		}
		vue.util.UiUtils.hideLoading();
	},

	onBalance: function() {
		console.log("==this.fromAddress=", this.fromAddress)
		this.m_tronWeb.trx.getBalance(this.fromAddress).then(function(balance) {
			console.log("====TRX==balance===", balance / Math.pow(10, 6))
			balance = balance / Math.pow(10, 6);
			vue.dal.WalletManage.setCurrWalletMoney(balance)
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtBalance);
		}.bind(this));
	},

	async sendTokenTransaction(asset, to, amount, gas, contractAddress) {
		console.log("===sendTokenTransaction=asset===", asset)
		console.log("===sendTokenTransaction=contractAddress===", contractAddress)
		let activeContract = await this.m_tronWeb.contract().at(contractAddress);
		let receipt = await activeContract.transfer(to, amount * Math.pow(10, 6)).send();
		console.log("====receipt===", receipt)
		console.log("====receipt.length===", receipt.length)
		if (receipt && receipt.length == 64) {
			vue.util.UiUtils.showToast("转帐已提交");
			vue.dal.Common.onTransfer(asset, this.fromAddress, to, amount, receipt, contractAddress)
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtTransResult, {
				result: true
			});
		} else {
			vue.util.UiUtils.showToast("转帐失败，您的余额不变");
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtTransResult, {
				result: false
			});
		}
		vue.util.UiUtils.hideLoading();
	},

	async onTokenBalance(contractAddress) {
		console.log("==onTokenBalance==contractAddress===", contractAddress)
		let activeContract = await this.m_tronWeb.contract().at(contractAddress);
		let balance = await activeContract.balanceOf(this.fromAddress).call();
		balance = balance / Math.pow(10, 6);
		console.log("==onTokenBalance==balance===", balance)
		vue.dal.ContractWallet.setContractMoney(this.fromAddress, contractAddress, balance)
		vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtToKenBalance);
	},
};

export default Tron
