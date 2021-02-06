const FileCoinUtils = require('../utils/filecoin-utils.js').FileCoinUtils

import Vue from 'vue'
var vue = Vue.prototype

const Lotus = {
	init: function() {
		vue.cclog("======== Lotus===初始化===============")
	},

	destroy: function() {

	},

	//创建身份钱包
	async createMain(walletInfo) {
		let wallet = vue.dal.MainWallet.getMainWallet(vue.entities.Metadata.ChainType.Lotus)
		if (!wallet) {
			wallet = await this.createWalletByWords(walletInfo.words)
			wallet.password = walletInfo.password;
			wallet.passwordtip = walletInfo.tips;
			wallet.importtype = vue.entities.Metadata.ImportType.WordType;
			vue.dal.MainWallet.addMainWallet(vue.entities.Metadata.ChainType.Lotus, wallet);
		}
	},

	//创建普通钱包
	async createNormal(importtype, strval) {
		if (importtype == vue.entities.Metadata.ImportType.WordType) {
			let wallet = await this.createWalletByWords(strval)
			wallet.importtype = vue.entities.Metadata.ImportType.WordType;
			vue.dal.NomalWallet.addNormalWallet(vue.entities.Metadata.ChainType.Lotus, wallet);
		} else if (importtype == vue.entities.Metadata.ImportType.PrivateType) {
			let wallet = await this.createWalletByPrivateKey(strval)
			wallet.importtype = vue.entities.Metadata.ImportType.PrivateType;
			vue.dal.NomalWallet.addNormalWallet(vue.entities.Metadata.ChainType.Lotus, wallet);
		}
	},

	async createWalletByWords(words) {
		vue.cclog("========LOTUS===创建节点请求===============")
		try {
			let ret = await FileCoinUtils.mnemonicWallter(words)
			console.log("==createWalletByWords===ret===", ret)
			let address = "f1" + ret.data.address;
			let privateKey = ret.data.privateKey;
			let publicKey = ret.data.publicKey;

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
			let ret = await FileCoinUtils.privateWallter(privateKey)
			console.log("=fil=recoveryWalletMange==ret===", ret)
			let address = "f1" + ret.data.address;
			let privateKey = ret.data.privateKey;
			let publicKey = ret.data.publicKey;
			return {
				privateKey: privateKey,
				publicKey: publicKey,
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
		let isret = await this.isValidAddress(to);
		if (!isret) {
			vue.util.UiUtils.showToast("请输入正确的地址")
			return;
		}

		let ret = await FileCoinUtils.sendTransaction(this.fromAddress, to, amount);
		vue.cclog("=====fil====sendTransaction===ret==========", ret)
		if (ret.data) {
			console.log("==tx.length==", ret.data)
			let tx = ret.data['/']
			console.log("==tx==", tx)
			console.log("==tx.length==", tx.length)
			if (tx && tx.length == 62) {
				this.onBalance();
				vue.util.UiUtils.showToast("转帐已提交");
				vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletMange.evtTransResult, {
					tx: tx
				});
			} else {
				vue.util.UiUtils.showToast("转帐失败，您的余额不变");
				vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletMange.evtTransResult, {
					tx: false
				});
			}
		} else {
			vue.util.UiUtils.showToast("转帐失败，您的余额不变");
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletMange.evtTransResult, {
				tx: false
			});
		}
		vue.util.UiUtils.hideLoading();
	},
	
	onBalance: function() {
		FileCoinUtils.getBalance(this.fromAddress).then((balance) => {
			balance = balance / Math.pow(10, 18) || 0;
			vue.cclog("=====this.FileCoinUtils===balance===", balance);
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletMange.evtBalance, {
				balance: balance
			});
		})
	},
	
	async isValidAddress(address) {
		var valid = await FileCoinUtils.getWalletValidateAddress(address);
		console.log('=====valid==', valid)
		if (!valid){
			console.log('This is a valid address');
		}else{
			console.log('Address INVALID');
		}
		return valid;
	}
};

export default Lotus
