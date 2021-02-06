const TronWeb = require("../../../../node_modules/tronweb")
const bip39 = require('../../../../node_modules/bip39')
const bip32 = require('../../../../node_modules/bip32')

import Vue from 'vue'
var vue = Vue.prototype

const Tron = {
	init: function() {
		vue.cclog("========Tron===初始化===============")
		let HttpProvider = TronWeb.providers.HttpProvider;
		this.m_fullNode = new HttpProvider("https://api.shasta.trongrid.io");
		this.m_solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
		this.m_eventServer = new HttpProvider("https://api.shasta.trongrid.io");
	},

	destroy: function() {

	},

	//创建身份钱包
	async createMain(walletInfo) {
		let wallet = vue.dal.MainWallet.getMainWallet(vue.entities.Metadata.ChainType.TRON)
		if (!wallet) {
			wallet = await this.createWalletByWords(walletInfo.words)
			wallet.password = walletInfo.password;
			wallet.passwordtip = walletInfo.tips;
			wallet.importtype = vue.entities.Metadata.ImportType.WordType;
			vue.dal.MainWallet.addMainWallet(vue.entities.Metadata.ChainType.TRON, wallet);
		}
	},
	//创建普通钱包
	async createNormal(importtype, strval) {
		if (importtype == vue.entities.Metadata.ImportType.WordType) {
			let wallet = await this.createWalletByWords(strval)
			wallet.importtype = vue.entities.Metadata.ImportType.WordType;
			vue.dal.NomalWallet.addNormalWallet(vue.entities.Metadata.ChainType.TRON, wallet);
		} else if (importtype == vue.entities.Metadata.ImportType.PrivateType) {
			let wallet = await this.createWalletByPrivateKey(strval)
			wallet.importtype = vue.entities.Metadata.ImportType.PrivateType;
			vue.dal.NomalWallet.addNormalWallet(vue.entities.Metadata.ChainType.TRON, wallet);
		}
	},

	async createWalletByWords(words) {
		vue.cclog("========TRON===创建节点请求===============")
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
			console.log("==privateKey==", privateKey)
			let address = TronWeb.address.fromPrivateKey(privateKey);
			return {
				privateKey: privateKey,
				publicKey: null,
				address: address.address
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
		
		this.m_tronWeb = new TronWeb(this.m_fullNode, this.m_solidityNode, this.m_eventServer, this.m_privateKey);
	},

	// 记录交易
	async sendTransaction(to, amount, gas) {
		const tradeobj = await this.m_tronWeb.transactionBuilder.sendTrx(to, amount, this.fromAddress, 1);
		const signedtxn = await this.m_tronWeb.trx.sign(tradeobj, this.m_privateKey);
		const receipt = await this.m_tronWeb.trx.sendRawTransaction(signedtxn);
		console.log("====receipt===", receipt)
		if (receipt.result && receipt.txid.length == 66) {
			// this.addRecordList(data);
			// this.onBalance();
			vue.util.UiUtils.showToast("转帐已提交");
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletMange.evtTransResult);
		} else {
			vue.util.UiUtils.showToast("转帐失败，您的余额不变");
		}
		vue.util.UiUtils.hideLoading();
	},

	onBalance: function() {
		this.m_tronWeb.trx.getBalance(this.fromAddress).then(function(balance) {
			console.log("====TRX==balance===", balance / Math.pow(10, 6))
			balance = balance / Math.pow(10, 6);
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletMange.evtBalance, {
				balance: balance
			});
		}.bind(this));
	},

	async sendTokenTransaction(to, amount, contractAddress) {
		let activeContract = await this.m_tronWeb.contract().at(contractAddress);
		let receipt = await activeContract.transfer(to, amount * Math.pow(10, 6)).send();
		// console.log("====receipt===", receipt)
		if (receipt && receipt.length == 66) {
			vue.util.UiUtils.showToast("转帐已提交");
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletMange.evtTransResult, {
				tx: receipt
			});
		} else {
			vue.util.UiUtils.showToast("转帐失败，您的余额不变");
		}
		vue.util.UiUtils.hideLoading();
	},

	async onTokenBalance(to,contractAddress) {
		let activeContract = await this.m_tronWeb.contract().at(contractAddress);
		let balance = await activeContract.balanceOf(to).call();
		return balance;
	},
};

export default Tron
