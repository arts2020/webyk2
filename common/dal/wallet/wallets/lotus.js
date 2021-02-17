const FileCoinUtils = require('../utils/filecoin-utils.js').FileCoinUtils

import Vue from 'vue'
var vue = Vue.prototype

const Lotus = {
	init: function() {
		console.log("======== Lotus===初始化===============")
	},

	destroy: function() {

	},

	clear: function() {
		uni.cclog("======Lotus clear==========")
	},
	//创建身份钱包
	async createMain(walletInfo) {
		let wallet = vue.dal.MainWallet.getMainWalletByType(vue.entities.Metadata.ChainType.Lotus)
		if (!wallet) {
			wallet = await this.createWalletByWords(walletInfo.words)
			if (wallet) {
				wallet.password = walletInfo.password;
				wallet.passwordtip = walletInfo.tips;
				wallet.importtype = vue.entities.Metadata.ImportType.WordType;
				vue.dal.MainWallet.addMainWallet(vue.entities.Metadata.ChainType.Lotus, wallet);
				return true;
			}
			return false;
		}
		return true;
	},

	//创建普通钱包
	async createNormal(walletInfo) {
		console.log("=walletInfo.importtype=", walletInfo)
		if (walletInfo.importtype == vue.entities.Metadata.ImportType.WordType) {
			let wallet = await this.createWalletByWords(walletInfo.strval)
			if (wallet) {
				wallet.name = walletInfo.name;
				wallet.password = walletInfo.password;
				wallet.passwordtip = walletInfo.passwordtip;
				wallet.chaintype = walletInfo.chaintype;
				wallet.importtype = vue.entities.Metadata.ImportType.WordType;
				return vue.dal.NormalWallet.addNormalWallet(vue.entities.Metadata.ChainType.Lotus, wallet);

			}
		} else if (walletInfo.importtype == vue.entities.Metadata.ImportType.PrivateType) {
			let wallet = await this.createWalletByPrivateKey(walletInfo.strval)
			if (wallet) {
				wallet.name = walletInfo.name;
				wallet.password = walletInfo.password;
				wallet.passwordtip = walletInfo.passwordtip;
				wallet.chaintype = walletInfo.chaintype;
				wallet.importtype = vue.entities.Metadata.ImportType.PrivateType;
				return vue.dal.NormalWallet.addNormalWallet(vue.entities.Metadata.ChainType.Lotus, wallet);

			}
		}
		return false;
	},

	async createWalletByWords(words) {
		console.log("========LOTUS===创建节点请求===============", words)
		try {
			let ret = await FileCoinUtils.mnemonicWallter(words)
			console.log("==createWalletByWords===ret===", ret)
			if (ret.code == 200) {
				let address = "f1" + ret.data.address;
				let privateKey = ret.data.privateKey;
				let publicKey = ret.data.publicKey;

				return {
					words: words,
					privateKey: privateKey,
					publicKey: publicKey,
					address: address
				}
			}
			return false;
		} catch (e) {
			console.log("=lotus==createWalletByWords=e==", e)
			return false;
		}
	},

	async createWalletByPrivateKey(privateKey) {
		console.log("=fil=recoveryWalletManage=2=privateKey===", privateKey)
		let pkey = privateKey
		try {
			let ret = await FileCoinUtils.privateWallter(pkey)
			console.log("=fil=recoveryWalletManage=3=privateKey===", pkey)
			console.log("=fil=recoveryWalletManage==ret===", ret)
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

	async initCurrChain() {
		let walletInfo = vue.dal.WalletManage.getCurrWallet();
		this.m_privateKey = walletInfo.privateKey;
		this.fromAddress = walletInfo.address;
	},

	//GAS费
	async getGasPrice() {
		let walletInfo = vue.dal.WalletManage.getCurrWallet();
		let address = walletInfo.address;
		let to = walletInfo.address;
		let mount = 0.02;

		let res = await FileCoinUtils.getGasPrice(address, to, mount);
		console.log("===res=", res)
		return res;
	},

	// 记录交易
	async sendTransaction(to, amount, gas) {
		let isret = await this.isValidAddress(to);
		if (!isret) {
			vue.util.UiUtils.showToast("请输入正确的地址")
			return;
		}

		let ret = await FileCoinUtils.sendTransaction(this.fromAddress, to, amount);
		console.log("=====fil====sendTransaction===ret==========", ret)
		if (ret.data) {
			console.log("==tx.length==", ret.data)
			let tx = ret.data['/']
			console.log("==tx==", tx)
			console.log("==tx.length==", tx.length)
			if (tx && tx.length == 62) {
				this.onBalance();
				vue.util.UiUtils.showToast("转帐已提交");
				vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtTransResult, {
					tx: tx
				});
			} else {
				vue.util.UiUtils.showToast("转帐失败，您的余额不变");
				vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtTransResult, {
					tx: false
				});
			}
		} else {
			vue.util.UiUtils.showToast("转帐失败，您的余额不变");
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtTransResult, {
				tx: false
			});
		}
		vue.util.UiUtils.hideLoading();
	},

	onBalance: function() {
		FileCoinUtils.getBalance(this.fromAddress).then((balance) => {
			balance = balance / Math.pow(10, 18) || 0;
			console.log("=====this.FileCoinUtils===balance===", balance);
			vue.dal.WalletManage.setCurrWalletMoney(balance)
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtBalance);
		})
	},

	onTokenBalance: function() {
		FileCoinUtils.getBalance(this.fromAddress).then((balance) => {
			balance = balance / Math.pow(10, 18) || 0;
			console.log("=====this.FileCoinUtils===balance===", balance);
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtBalance, {
				balance: balance
			});
		})
	},

	async isValidAddress(address) {
		var valid = await FileCoinUtils.getWalletValidateAddress(address);
		console.log('=====valid==', valid)
		if (!valid) {
			console.log('This is a valid address');
		} else {
			console.log('Address INVALID');
		}
		return valid;
	}
};

export default Lotus
