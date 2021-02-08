// const ecc = require('eosjs-ecc')
const ECKey = require('../../../../node_modules/eckey');
const ecc = require('eosjs-ecc')

import Vue from 'vue'
var vue = Vue.prototype

const Eos = {
	m_balance: 0,
	m_reqUrl: "",
	init: function() {
		console.log("========Eos===初始化===============")
		this.m_reqUrl = "";
	},

	destroy: function() {

	},

	//创建身份钱包
	async createMain(walletInfo) {
		let wallet = vue.dal.MainWallet.getMainWalletByType(vue.entities.Metadata.ChainType.EOS)
		if (!wallet) {
			wallet = await this.createWalletByWords(walletInfo.words)
			wallet.password = walletInfo.password;
			wallet.passwordtip = walletInfo.tips;
			wallet.importtype = vue.entities.Metadata.ImportType.WordType;
			vue.dal.MainWallet.addMainWallet(vue.entities.Metadata.ChainType.EOS, wallet);
		}
		return true;
	},
	//创建普通钱包
	async createNormal(walletInfo) {
		if (walletInfo.importtype == vue.entities.Metadata.ImportType.WordType) {
			let wallet = await this.createWalletByWords(walletInfo.strval)
			if(wallet){
				wallet.name = walletInfo.name;
				wallet.password = walletInfo.password;
				wallet.passwordtip = walletInfo.passwordtip;
				wallet.chaintype = walletInfo.chaintype;
				wallet.importtype = vue.entities.Metadata.ImportType.WordType;
				vue.dal.NomalWallet.addNormalWallet(vue.entities.Metadata.ChainType.EOS, wallet);
				return true;
			}
		} else if (walletInfo.importtype == vue.entities.Metadata.ImportType.PrivateType) {
			let wallet = await this.createWalletByPrivateKey(walletInfo.strval)
			if(wallet){
				wallet.name = walletInfo.name;
				wallet.password = walletInfo.password;
				wallet.passwordtip = walletInfo.passwordtip;
				wallet.chaintype = walletInfo.chaintype;
				wallet.importtype = vue.entities.Metadata.ImportType.PrivateType;
				vue.dal.NomalWallet.addNormalWallet(vue.entities.Metadata.ChainType.EOS, wallet);
				return true;
			}
		}
		return false;
	},

	async createWalletByWords(words) {
		console.log("========EOS===创建节点请求===============")
		try {
			console.log("==words==", words)
			var privateKey = ecc.seedPrivate(words);
			console.log("EOS私钥：", privateKey)
			const publicKey = ecc.privateToPublic(privateKey);
			console.log("EOS公钥：", publicKey)

			//随机生成新的私钥公钥
			return {
				words: words,
				privateKey: privateKey,
				publicKey: publicKey,
				address: ""
			}
		} catch (e) {
			console.log("=eos==createWalletByWords=e==", e)
			return false;
		}
	},

	async createWalletByPrivateKey(privateKey) {
		try {
			console.log("==privateKey==", privateKey);
			let ecKey = ECKey.fromPrivate(privateKey);
			let publicKey = ecKey.getPublicKeyAsHex();

			const network = bitcoin.networks.bitcoin
			//设置生成测试or正式环境的钱包
			console.log("==network==", network)
			let address = bitcoin.payments.p2pkh({
				pubkey: publicKey,
				network: network
			})
			console.log("====createWalletByPrivateKey===BTC地址：", address.address)

			return {
				privateKey: privateKey,
				publicKey: publicKey,
				address: address.address
			}
		} catch (e) {
			console.log("===createWalletByPrivateKey=e==", e)
			return false;
		}
	},

	async initCurrChain() {
		let walletInfo = vue.dal.WalletMange.getCurrWallet();
		this.m_privateKey = walletInfo.privateKey;
		this.fromAddress = walletInfo.address;
	},

	// 记录交易
	async sendTransaction(to, amount, gas) {
		vue.util.UiUtils.hideLoading();
		console.log("=====Eos===sendTransaction====", txid);
	},

	getBalance: function() {
		console.log("=====Eos===this.m_balance====", this.m_balance);
		return this.m_balance;
	},

	onBalance: function() {

	},
};

export default Eos
