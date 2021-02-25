
const Tx = require('../../../../node_modules/ethereumjs-tx').Transaction;
const HttpUtils = require('./https-util.js').HttpUtils
import Vue from 'vue'
var vue = Vue.prototype

const BtcUtils = {

	async getGasPriceAsync() {
		
	},

	async getLastHeightAsync(url) {
		
	},

	async getTokenBalance(contractAddress, address, url) {
		console.log("====getTokenBalance=ret======",url)
		let ret = await HttpUtils.request(url, "GET", {});
		console.log("===3333==ret======", ret)
		if (!ret) {
			return false;
		}

		if (ret.id != '1' || ret.hasOwnProperty('error')) {
			return false;
		}

		console.log("==x3=ret==", ret.result)
		ret = parseInt(ret.result);
		ret = ret.toString(10) / Math.pow(10, 6);
		return ret;
	},

	async getBalance(address) {
		let url = "https://chain.api.btc.com/v3/address/" + address;
		let ret = await HttpUtils.request(url, "GET", {});
		console.log("=====ret======", ret)
		// let balance = ret.data.balance.toString(10) / Math.pow(10, 6);
		return ret;
	},

	async sendRawTransferAsync(rawTx, url) {
		
	}
}

module.exports = {
	BtcUtils
};