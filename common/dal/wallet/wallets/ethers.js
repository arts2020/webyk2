const ethers = require("../../../../node_modules/ethers")
const OtcpUtils = require('../utils/otcp-utils.js').OtcpUtils;

import Vue from 'vue'
var vue = Vue.prototype

const Ethers = {
	m_balance: 0,
	m_reqUrl: "",
	init: function() {
		vue.cclog("=========Ethers===初始化===============")
		this.m_reqUrl = "";
	},

	destroy: function() {

	},
	
	//创建身份钱包
	async createMain(words){
		let ethwallet = vue.dal.MainWallet.getMainWallet(vue.entities.Metadata.ChainType.ETH)
		if (!ethwallet) {
			ethWallet = await this.createWalletByWords(words)
			vue.dal.MainWallet.addMainWallet(vue.entities.Metadata.ChainType.ETH, ethWallet);
		}
	},
	//创建普通钱包
	async createNormal(importtype,strval){
		if (importtype == vue.Metadata.ImportType.WordType) {
			let ethWallet = await this.createWalletByWords(strval)
			ethWallet.importtype = vue.Metadata.ImportType.WordType;
			vue.dal.NomalWallet.addNormalWallet(vue.entities.Metadata.ChainType.ETH, ethWallet);
		}else if(importtype == vue.Metadata.ImportType.PrivateType){
			let ethWallet = await this.createWalletByPrivateKey(strval)
			ethWallet.importtype = vue.Metadata.ImportType.PrivateType;
			vue.dal.NomalWallet.addNormalWallet(vue.entities.Metadata.ChainType.ETH, ethWallet);
		}
	},
	
	async createWalletByWords(words) {
		vue.cclog("========LOTUS===创建节点请求===============")
		try {
			return null;
		} catch (e) {
			console.log("===createWalletByWords=e==", e)
			return false;
		}
	},
	
	async createWalletByPrivateKey(privateKey) {
		try {
			console.log("==privateKey==", privateKey)
			return null;
		} catch (e) {
			console.log("===createWalletByPrivateKey=e==", e)
			return false;
		}
	},
	
	// 记录交易
	async sendTransaction(to, amount,gas) {
		let privateKey = vue.dal.Wallter.getPrivateKey();
		let address = vue.dal.Wallter.getAddress();
		let pedings = await OtcpUtils.ethTransactionCountByPending(address, this.m_reqUrl)
		
		let gcout = await OtcpUtils.ethTransactionCount(address, this.m_reqUrl)
		let txid = await OtcpUtils.ethTransferAsync(privateKey, address, to, amount, pedings, this.m_reqUrl,gas);
		if (txid && txid.length == 66) {
			let data = {
				hash: txid,
				from: address,
				to: to,
				amount: amount,
				type: 2, //转帐
			}
			this.addRecordList(data);
			this.onBalance();
			vue.cclog("=====Ethers===sendTransaction===1=", txid);
			vue.util.UiUtils.showToast("转帐已提交");
			
			vue.util.EventUtils.dispatchEventCustom(vue.dal.Wallter.evtTransResult,{tx:txid});
		} else {
			vue.cclog("=====Ethers===sendTransaction==2==", txid);
			vue.util.UiUtils.showToast("转帐失败，您的余额不变");
		}
		vue.util.UiUtils.hideLoading();
		vue.cclog("=====Ethers===sendTransaction====", txid);
	},

	getBalance: function() {
		vue.cclog("=====Ethers===m_balance====", this.m_balance);
		return this.m_balance;
	},

	onBalance: function() {
		let address = vue.dal.Wallter.getAddress()
		OtcpUtils.getETHBalanceAsync(address, this.m_reqUrl).then((balance) => {
			vue.cclog("=====this.Ethers===balance====", balance);
			this.m_balance = balance;
			vue.util.EventUtils.dispatchEventCustom(vue.dal.Wallter.evtBalance);
		})
	},
};

export default Ethers
