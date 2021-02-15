//http://wenjixu.com/blog/117.html

const bip39 = require('../../../../node_modules/bip39')
const bip32 = require('../../../../node_modules/bip32')
// const bitcoin = require('../../../../node_modules/bitcoinjs-lib')
const bitcoin = require('bitcoinjs-lib')

import Vue from 'vue'
var vue = Vue.prototype

const Btc = {
	m_balance: 0,
	m_reqUrl: "",

	init: function() {
		console.log("========Btc===初始化===============")
		this.m_reqUrl = "";
	},

	destroy: function() {

	},

	clear: function() {
		uni.cclog("======Btc clear==========")
	},
	//创建身份钱包
	async createMain(walletInfo) {
		let wallet = vue.dal.MainWallet.getMainWalletByType(vue.entities.Metadata.ChainType.BTC)
		if (!wallet) {
			wallet = await this.createWalletByWords(walletInfo.words)
			wallet.password = walletInfo.password;
			wallet.passwordtip = walletInfo.tips;
			wallet.importtype = vue.entities.Metadata.ImportType.WordType;
			vue.dal.MainWallet.addMainWallet(vue.entities.Metadata.ChainType.BTC, wallet);
		}
		return wallet;
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
				return vue.dal.NormalWallet.addNormalWallet(vue.entities.Metadata.ChainType.BTC, wallet);

			}
		} else if (walletInfo.importtype == vue.entities.Metadata.ImportType.PrivateType) {
			let wallet = await this.createWalletByPrivateKey(walletInfo.strval)
			if (wallet) {
				wallet.name = walletInfo.name;
				wallet.password = walletInfo.password;
				wallet.passwordtip = walletInfo.passwordtip;
				wallet.chaintype = walletInfo.chaintype;
				wallet.importtype = vue.entities.Metadata.ImportType.PrivateType;
				return vue.dal.NormalWallet.addNormalWallet(vue.entities.Metadata.ChainType.BTC, wallet);
			}
		}
		return true;
	},

	async createWalletByWords(words) {
		console.log("========Btc===创建节点请求===============")
		try {
			console.log("==words==", words)
			//设置生成测试or正式环境的钱包
			const network = bitcoin.networks.bitcoin
			// console.log("==network==", network)
			// 计算seed:
			const seed = await bip39.mnemonicToSeed(words)
			// console.log("==seed==", seed)
			const root = bip32.fromSeed(seed, network)
			const path = "m/44'/0'/0'/0/0";
			const keyPair = root.derivePath(path)
			const privateKey = keyPair.toWIF()
			console.log("BTC私钥：", privateKey)
			const publicKey = keyPair.publicKey.toString("hex")
			console.log("BTC公钥：", publicKey)
			let address = bitcoin.payments.p2pkh({
				pubkey: keyPair.publicKey,
				network: network
			})
			console.log("===createWalletByWords====BTC地址：", address.address)
			return {
				words: words,
				privateKey: privateKey,
				publicKey: publicKey,
				address: address.address
			}
		} catch (e) {
			console.log("=btc==createWalletByWords=e==", e)
			return false;
		}
	},

	async createWalletByPrivateKey(privateKey) {
		console.log("==privateKey==", privateKey);
		try {
			const network = bitcoin.networks.bitcoin
			let keyPair = bitcoin.ECPair.fromWIF(privateKey, bitcoin.networks[network]);
			let publicKey = keyPair.publicKey;
			let address = bitcoin.payments.p2pkh({
				pubkey: publicKey
			});
			console.log("==address==", address);
			console.log("==publicKey==", publicKey.toString("hex"));
			console.log("==privateKey==", privateKey);
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
		let walletInfo = vue.dal.WalletManage.getCurrWallet();
		this.m_privateKey = walletInfo.privateKey;
		this.fromAddress = walletInfo.address;
	},

	//GAS费
	async getGasPrice() {
		return false;
	},

	// 记录交易
	async sendTransaction(to, amount, gas) {
		let privateKey = vue.dal.WalletManage.getPrivateKey();
		let address = vue.dal.WalletManage.getAddress();

		//TODO....

/*
		let alice = bitcoin.ECPair.fromWIF('L1uyy5qTuGrVXrmrsvHWHgVzW9kKdrp27wBC7Vs6nZDTF2BRUVwy');
		// L1uyy5qTuGrVXrmrsvHWHgVzW9kKdrp27wBC7Vs6nZDTF2BRUVwy为Alice的私钥
		//  let lbtcVersion = 65282;
		let txb = new bitcoin.TransactionBuilder(bitcoin.networks[network]),
			//  txb.setVersion(Number(setVersion));

		txb.addInput('61d520ccb74288c96bc1a2b20ea1c0d5a704776dd0164a396efec3ea7040349d', 0);
		// Alice's previous transaction output, has 15000 satoshis
		txb.addOutput('1cMh228HTCiwS8ZsaakH8A8wze1JR5ZsP', 12000); // (in)15000 - (out)12000 = (fee)3000, this is the miner fee

		txb.sign(0, alice); // 签名
		txb.build().toHex(); // 最后将交易十六进制编码广播到BTC网络

*/


		vue.util.UiUtils.hideLoading();
		console.log("=====Btc===sendTransaction====", txid);
	},

	// TOKEN交易记录
	async sendTokenTransaction(to, amount, gas) {
		let privateKey = vue.dal.WalletManage.getPrivateKey();
		let address = vue.dal.WalletManage.getAddress();

		//TODO....
		vue.util.UiUtils.hideLoading();
		console.log("=====Btc===sendTransaction====", txid);
	},

	getBalance: function() {
		console.log("=====Btc===this.m_balance====", this.m_balance);
		return this.m_balance;
	},

	async onTokenBalance(contractAddress) {

	},

	async onBalance() {
		return 0; //let address = vue.dal.WalletManage.getAddress()
	},
};

export default Btc
