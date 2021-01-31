// const ecc = require('eosjs-ecc')
const ECKey = require('../../../../node_modules/eckey');

import Vue from 'vue'
var vue = Vue.prototype

const Eos = {
	m_balance: 0,
	m_reqUrl: "",
	init: function() {
		vue.cclog("========Eos===初始化===============")
		this.m_reqUrl = "";
	},

	destroy: function() {

	},
	
	//创建身份钱包
	async createMain(words){
		let btcwallet = vue.dal.MainWallet.getMainWallet(vue.entities.Metadata.ChainType.EOS)
		if (!btcwallet) {
			btcWallet = await this.createWalletByWords(words)
			vue.dal.MainWallet.addMainWallet(vue.entities.Metadata.ChainType.EOS, btcWallet);
		}
	},
	//创建普通钱包
	async createNormal(importtype,strval){
		if (importtype == vue.Metadata.ImportType.WordType) {
			let btcWallet = await this.createWalletByWords(strval)
			btcWallet.importtype = vue.Metadata.ImportType.WordType;
			vue.dal.NomalWallet.addNormalWallet(vue.entities.Metadata.ChainType.EOS, btcWallet);
		}else if(importtype == vue.Metadata.ImportType.PrivateType){
			let btcWallet = await this.createWalletByPrivateKey(strval)
			btcWallet.importtype = vue.Metadata.ImportType.PrivateType;
			vue.dal.NomalWallet.addNormalWallet(vue.entities.Metadata.ChainType.EOS, btcWallet);
		}
	},
	
	async createWalletByWords(words) {
		vue.cclog("========EOS===创建节点请求===============")
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
			console.log("===createWalletByWords=e==", e)
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
	
	// 记录交易
	async sendTransaction(to, amount,gas) {
		let privateKey = vue.dal.Wallter.getPrivateKey();
		let address = vue.dal.Wallter.getAddress();
		
		//TODO....
		
		vue.util.UiUtils.hideLoading();
		vue.cclog("=====Eos===sendTransaction====", txid);
	},

	getBalance: function() {
		vue.cclog("=====Eos===this.m_balance====", this.m_balance);
		return this.m_balance;
	},

	onBalance: function() {
		let address = vue.dal.Wallter.getAddress()
	},
};

export default Eos
