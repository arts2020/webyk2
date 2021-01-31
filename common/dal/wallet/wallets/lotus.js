import Vue from 'vue'
var vue = Vue.prototype

const Lotus = {
	m_balance: 0,
	m_reqUrl: "",
	init: function() {
		vue.cclog("======== Lotus===初始化===============")
		this.m_reqUrl = "";
	},

	destroy: function() {

	},
	
	//创建身份钱包
	async createMain(words){
		let ethwallet = vue.dal.MainWallet.getMainWallet(vue.entities.Metadata.ChainType.Lotus)
		if (!ethwallet) {
			ethWallet = await this.createWalletByWords(words)
			vue.dal.MainWallet.addMainWallet(vue.entities.Metadata.ChainType.Lotus, ethWallet);
		}
	},
	
	//创建普通钱包
	async createNormal(importtype,strval){
		if (importtype == vue.Metadata.ImportType.WordType) {
			let ethWallet = await this.createWalletByWords(strval)
			ethWallet.importtype = vue.Metadata.ImportType.WordType;
			vue.dal.NomalWallet.addNormalWallet(vue.entities.Metadata.ChainType.Lotus, ethWallet);
		}else if(importtype == vue.Metadata.ImportType.PrivateType){
			let ethWallet = await this.createWalletByPrivateKey(strval)
			ethWallet.importtype = vue.Metadata.ImportType.PrivateType;
			vue.dal.NomalWallet.addNormalWallet(vue.entities.Metadata.ChainType.Lotus, ethWallet);
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
		
		//TODO....
		
		vue.util.UiUtils.hideLoading();
		vue.cclog("=====Lotus===sendTransaction====", txid);
	},

	getBalance: function() {
		vue.cclog("=====Lotus===this.m_balance====", this.m_balance);
		return this.m_balance;
	},

	onBalance: function() {
		let address = vue.dal.Wallter.getAddress()
	},
};

export default Lotus
