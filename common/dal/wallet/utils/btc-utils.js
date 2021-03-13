const Tx = require('../../../../node_modules/ethereumjs-tx').Transaction;
const HttpUtils = require('./https-util.js').HttpUtils
const bitcoin = require('bitcoinjs-lib')
import Vue from 'vue'
var vue = Vue.prototype

const BtcUtils = {
	// btcUrl : "https://chain.api.btc.com/v3/address/",
	m_btcUrl: "https://api.blockcypher.com/v1/btc/test3",
	// btcUrl: "https://api.blockcypher.com/v1/btc/main",
	async getGasPriceAsync() {

	},

	async getLastHeightAsync(url) {

	},

	async getTokenBalance(contractAddress, address, url) {
		console.log("====getTokenBalance=ret======", url)
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
		var url = this.m_btcUrl + "/addrs/" + address + "/balance";
		console.log("===getBalance==url======", url)
		let ret = await HttpUtils.request(url, "GET", {});
		console.log("=====ret======", ret)
		return ret;
	},
	//keypair, fromAddress, toAddress, value
	//this.m_privateKey, this.fromAddress, to, amount
	async sendRawTransferAsync(keys, fromAddress, toAddress, amount) {
		console.log("===========fromAddress=" + fromAddress);
		console.log("===========toAddress=" + toAddress);
		console.log("===========amount=" + amount);
		amount = amount * Math.pow(10, 8);
		console.log("=====2======amount=" + amount);
		// var keys = bitcoin.ECPair.fromPrivateKey(privateKey);

		console.log("=====2======newTx=");
		var newTx = {
			inputs: [{
				addresses: [fromAddress]
			}],
			outputs: [{
				addresses: [toAddress],
				value: amount
			}]
		}
		console.log("====3=======newTx=");
		let tmptx = await HttpUtils.request(this.m_btcUrl + '/txs/new', "POST", JSON.stringify(newTx));
		console.log("===========tmptx=", tmptx);
		if(tmptx.errors){
			return false;
		}
		tmptx.data = tmptx.data || {};
		tmptx.data.pubkeys = [];
		tmptx.data.signatures = tmptx.data.tosign.map(function(tosign, n) {
			tmptx.data.pubkeys.push(keys.publicKey.toString('hex'));
			return bitcoin.script.signature.encode(
				keys.sign(Buffer.from(tosign, "hex")),
				0x01,
			).toString("hex").slice(0, -2);
		});

		// 解开JSON序列化过程中对象的循环引用
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
		const getCircularReplacer = () => {
			const seen = new WeakSet();
			return (key, value) => {
				if (typeof value === "object" && value !== null) {
					if (seen.has(value)) {
						return;
					}
					seen.add(value);
				}
				return value;
			};
		};
		let finaltx = await HttpUtils.request(this.m_btcUrl + '/txs/send', "POST", JSON.stringify(tmptx.data,
			getCircularReplacer()));
		console.log(finaltx);
		return finaltx;
	},

	async getRecords(address) {
		let url = this.m_btcUrl + '/addrs/' + address;
		console.log("TxRecordsUrl", url);
		let ret = await HttpUtils.request(url, "GET", {});
		return ret;
	},
	
	async gettransferHash(tx){
		let url = this.m_btcUrl + '/txs/' + tx;
		console.log("gettransferHash", url);
		let ret = await HttpUtils.request(url, "GET", {});
		return ret;
	}
}

module.exports = {
	BtcUtils
};
