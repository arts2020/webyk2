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
	
	createWallet: function() {
		vue.cclog("========Eos===创建节点请求===============")
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
