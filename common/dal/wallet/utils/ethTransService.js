//根据区块检查是否有入金
const OtcpUtils = require('./otcp-utils.js').OtcpUtils;

import Vue from 'vue'
var vue = Vue.prototype

const ethTransService = {
	m_blockHeight: 0,
	m_url: "",
	m_hashs: {},
	//保存交易 //tx.from, tokenTo, timestamp, value, tx.hash

	saveBlockHeight(blockHeight) {
		// console.log("===saveBlockHeight==blockHeight==", blockHeight)
		vue.util.StringUtils.setUserDefaults("ETHERS_WALLET_BLOCK_HEIGHT", blockHeight);
	},

	// tx: 交易信息
	async trySaveTx(addressTable, tx) {
		// 如果不是token转账
		// if (!tx.hasOwnProperty('tokenTransfer')) {
		// 	return;
		// }
		if (!tx.hasOwnProperty('to')) {
			return;
		}

		if (tx.to == null) {
			return;
		}

		if (tx.input == null || tx.input.length != 138) {
			// return;
		}
		// console.log("=2======trySaveTx=tx.input==", tx)
		let txTo = tx.to.toLowerCase();
		let txHash = tx.hash.toLowerCase();

		let fromAddress = tx.from.toLowerCase();
		
		if (!addressTable.hasOwnProperty(txTo) && !addressTable.hasOwnProperty(fromAddress)) {
			return;
		}
		console.log("=3333=fromAddress==", fromAddress)
		console.log("=3333=txTo==", tx.value)
		//余额decimal
		let value = parseInt(tx.value.toString(10)) / Math.pow(10, 18);
		
		console.log("=3333=value==", value)
		//1充值 2转帐
		let type = 1;
		if (addressTable.hasOwnProperty(fromAddress)) {
			type = 2
		}

		console.log("=3333=txTo==", txTo)
		console.log("=3333=type==", type)
		
		let ret = await OtcpUtils.getTransactionReceiptAsync(tx.hash, this.m_url);
		var tinfo = {
			from: tx.from,
			to: txTo,
			amount: value,
			hash: tx.hash,
			type: type,
			state: ret.status,
		}
		console.log("=666=txTo==", txTo)
		vue.dal.Ethers.addRecordList(tinfo, 1,ret.timestamp);
	}
}


module.exports = {
	ethTransService
};
