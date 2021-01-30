//根据区块检查是否有入金
const OtcpUtils = require('./otcp-utils.js').OtcpUtils;

import Vue from 'vue'
var vue = Vue.prototype

const tokenTransService = {
	m_blockHeight: 0,
	m_url: "",
	m_hashs: {},
	//保存交易 //tx.from, tokenTo, timestamp, value, tx.hash

	saveBlockHeight(blockHeight) {
		// console.log("===saveBlockHeight==blockHeight==", blockHeight)
		vue.util.StringUtils.setUserDefaults("ETHERS_WALLET_BLOCK_HEIGHT", blockHeight);
	},

	// tx: 交易信息
	async trySaveTx(addressTable, contractTable, tx) {
		// 如果不是token转账
		if (tx.hasOwnProperty('tokenTransfer')) {
			return;
		}
		if (!tx.hasOwnProperty('to')) {
			return;
		}

		if (tx.to == null) {
			return;
		}

		if (tx.input == null || tx.input.length != 138) {
			return;
		}

		// 如果交易的入地址不是配置支持的合约地址
		let txTo = tx.to.toLowerCase();
		let txHash = tx.hash.toLowerCase();

		// if (this.m_hashs.hasOwnProperty(txHash)) {
		// 	return;
		// }

		if (!contractTable.hasOwnProperty(txTo)) {
			return;
		}
		//let toTable = {};
		let tokenTo = tx.input.substring(34, 74);
		tokenTo = "0x" + tokenTo.toLowerCase();

		let fromAddress = tx.from.toLowerCase();
		// console.log("=3333====xx====tx.from==", tx.from)
		// console.log("=3333====xx====tokenTo==", tokenTo)
		// console.log("=3333====xx====txTo==", txTo)
		if (!addressTable.hasOwnProperty(tokenTo) && !addressTable.hasOwnProperty(fromAddress)) {
			return;
		}
		console.log("=3333=w==xxx===tokenTo==", tokenTo)

		let tokenValue = tx.input.substring(75);
		let value = parseInt("0x" + tokenValue)
		//余额decimal
		if (txTo == vue.dal.UsdtErc20.m_contractAddress.toLowerCase()) {
			value = parseInt(value.toString(10)) / Math.pow(10, 6);
		} else if (txTo == vue.dal.YouKe.m_contractAddress.toLowerCase()) {
			value = parseInt(value.toString(10)) / Math.pow(10, 8);
		}
		//1充值 2转帐
		let type = 1;
		if (addressTable.hasOwnProperty(fromAddress)) {
			type = 2
		}

		console.log("=3333=tokenTo==", tokenTo)
		console.log("=3333=type==", type)

		let ret = await OtcpUtils.getTransactionReceiptAsync(tx.hash, this.m_url);
		console.log("=======3333========ret==", ret)
		var tinfo = {
			from: tx.from,
			to: tokenTo,
			amount: value,
			hash: tx.hash,
			type: type,
			state: ret.status,
		}
		// this.m_hashs[txHash] = tinfo;
		if (contractTable.hasOwnProperty(txTo)) {
			console.log("=5555=txTo==", txTo)
			if (txTo == vue.dal.UsdtErc20.m_contractAddress.toLowerCase()) {
				vue.dal.UsdtErc20.addRecordList(tinfo, 1,ret.timestamp);
			} else if (txTo == vue.dal.YouKe.m_contractAddress.toLowerCase()) {
				vue.dal.YouKe.addRecordList(tinfo, 1,ret.timestamp);
			}
		} else {
			console.log("=666=txTo==", txTo)
			vue.dal.Ethers.addRecordList(tinfo, 1,ret.timestamp);
		}
		// await this.safeSaveTx(tx.from, tokenTo, timestamp, value, tx.hash);
	},

	async startService() {
		// ------------- 初始化载入地址 ------------------------
		this.m_url = vue.dal.YouKe.m_reqUrl;

		console.log('==this.m_url==', this.m_url)

		let usdtErc20 = vue.dal.UsdtErc20.m_contractAddress.toLowerCase()
		let youKe = vue.dal.YouKe.m_contractAddress.toLowerCase()
		var contractTable = {}
		contractTable[usdtErc20] = usdtErc20
		contractTable[youKe] = youKe

		let address = vue.dal.Wallter.getAddress().toLowerCase()
		let addressTable = {};
		addressTable[address] = address;

		console.log('==addressTable==', addressTable)
		console.log('==contractTable==', contractTable)

		// let blockHeight = vue.util.StringUtils.getUserDefaults("ETHERS_WALLET_BLOCK_HEIGHT");
		// if (!blockHeight) {
		let blockHeight = await OtcpUtils.getLastHeightAsync(this.m_url);
		// }
		blockHeight = blockHeight - 2000
		console.log('==1=blockHeight==', blockHeight)
		let waitCount = 0;
		let sleepTime = 10000;

		while (true) {
			// 更新用户地址
			try {
				let lastBlock = await OtcpUtils.getLastHeightAsync(this.m_url);
				if ((lastBlock - blockHeight) >= 20) {
					sleepTime = 10;
				} else {
					sleepTime = 10000;
				}

				let requests = [];

				// 如果没有新区块 暂停一秒钟
				if (blockHeight >= lastBlock - 4) {
					waitCount += 1;
					if (waitCount >= 10) {
						waitCount = 0;
						console.log('waiting new block...');
					}
					await new Promise((resolve, reject) => {
						setTimeout(resolve, 1000);
					});
					continue;
				}
				waitCount = 0;

				// 新区块到了
				console.log('lastBlock=' + lastBlock + ' , start get block trans: ' + (parseInt(blockHeight) + 1));
				let newBlocks = 0;
				for (let i = 1; i <= 5; i++) {
					if ((parseInt(blockHeight) + i) > lastBlock) {
						break;
					}
					// console.log('==2=blockHeight==', blockHeight)
					let request = await OtcpUtils.getBlockAllTxAsync(parseInt(blockHeight) + i, this.m_url);
					requests.push(request);
					newBlocks++;
				}
				// 执行请求
				let results = await Promise.all(requests);
				let failed = false;
				for (let txs of results) {
					if (txs == null) {
						failed = true;
						break;
					}
				}
				// 如果有请求失败了 继续重试
				if (failed) {
					console.log(`[${blockHeight + 1}, ${blockHeight + newBlocks}] synced failed, retry.`);
					await new Promise((resolve, reject) => {
						setTimeout(resolve, 1000);
					});
					continue;
				}
				// 如果请求都成功了
				let txCount = 0;

				for (let txs of results) {
					txCount += txs.transactions.length;
					for (let tx of txs.transactions) {
						await this.trySaveTx(addressTable, contractTable, tx);
					}
				}

				console.log(`[${blockHeight + 1}, ${blockHeight + newBlocks}] synced, txs: ${txCount}.`);
				blockHeight += newBlocks;
				// console.log("===========ddd=====blockHeight==", blockHeight)
				await this.saveBlockHeight(blockHeight);

				//需要睡眠
				await new Promise((resolve, reject) => {
					setTimeout(resolve, sleepTime);
				});
			} catch (e) {
				console.log('ethTransService : ' , e);
				console.warn('tokenTransService : ' + e);
			}
		}
	}

	// 遍历交易列表
	// for(let tokenTx of tx.tokenTransfer) {
	// 	let tokenTo = tokenTx.to.toLowerCase();
	// 	// 如果转账的目标用户不是我们的用户
	// 	if(!addressTable.hasOwnProperty(tokenTo)) {
	// 		continue;
	// 	}
	// 	// 找到了一个属于我们的交易
	// 	let decimal = parseInt(tokenTx.tokenInfo.d);
	// 	let amount =  parseInt(tokenTx.value) / Math.pow(10, decimal);
	// 	if(toTable.hasOwnProperty(tokenTo)) {
	// 		toTable[tokenTo] = toTable[tokenTo] + amount;
	// 	} else {
	// 		toTable[tokenTo] = amount;
	// 	}
	// }
	// // 根据合约类型获取资产类型
	// let asset = contractTable[txTo].asset;
	// for(let to in toTable) {
	// 	let userId = addressTable[to].user_id;
	// 	let amount = toTable[to];
	// 	await safeSaveTx(userId, tx.from, to, asset, amount, tx.txid);
	// }
}


module.exports = {
	tokenTransService
};
