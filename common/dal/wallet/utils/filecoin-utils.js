// const Tx = require('../../../../node_modules/ethereumjs-tx').Transaction;
const HttpUtils = require('./https-util.js').HttpUtils
// const {Base64} = require('../../../../node_modules/js-base64/base64.js')
import Vue from 'vue'
var vue = Vue.prototype

const FileCoinUtils = {
	m_cids : {},
	async sendTransaction(address,to,mount) {
		let pdata = {
			address:address,
			to:to,
			mount:mount
		}
		let ret = await vue.dal.Net.asyncRequest(vue.entities.RequestCode.SendTransaction, pdata);
		console.log("=sendTransaction=ret=",ret)
		return ret;
	},
	
	async getBalance(address) {
		let pdata = {
			address:address
		}		
		let ret = await vue.dal.Net.asyncRequest(vue.entities.RequestCode.GetBalance, pdata);
		console.log("=getBalance=3===ret=",ret)
		return ret.data;
	},
	
	//通过私钥导入
	async privateWallter(privatekey) {
		let pdata = {
			privatekey:privatekey
		}
		let ret = await vue.dal.Net.asyncRequest(vue.entities.RequestCode.PrivateWallter, pdata);
		console.log("=privateWallter=ret=",ret)
		return ret;
	},
	
	//通过助记词导入
	async mnemonicWallter(words) {
		let pdata = {
			words:words
		}
		let ret = await vue.dal.Net.asyncRequest(vue.entities.RequestCode.MnemonicWallter, pdata);
		console.log("=mnemonicWallter=ret=",ret)
		return ret;
	},
	
	async getGasPrice(){
		await vue.dal.Net.asyncRequest(vue.entities.RequestCode.GetFilGasPrice, pdata);
		console.log("=getGasPrice=ret=",ret)
		return ret;
	},
	
	async getWalletValidateAddress(address){
		let pdata = {
			address:address
		}
		let ret = await vue.dal.Net.asyncRequest(vue.entities.RequestCode.GetWalletValidateAddress, pdata);
		console.log("=getWalletValidateAddress=ret=",ret)
		return ret.data;
	},
}

module.exports = {
	FileCoinUtils
};
