const Tx = require('../../../../node_modules/ethereumjs-tx').Transaction;
const HttpUtils = require('./https-util.js').HttpUtils
import Vue from 'vue'
var vue = Vue.prototype

const OtcpUtils = {

	async getGasPriceAsync() {
		console.log("====getGasPriceAsync=data=======")
		let url = 'https://ethgasstation.info/json/ethgasAPI.json';

		let ret = await HttpUtils.request(url, "GET", "");

		console.log("====getGasPriceAsync=data===1==ret==", ret)
		ret = parseInt(ret.average) * Math.pow(10, 8);

		console.log("====getGasPriceAsync=data====2=ret==", ret)
		return '0x' + parseInt(ret).toString(16);
	},

	async getGasPriceAsync2() {
		let url = 'https://ethgasstation.info/json/ethgasAPI.json';
		let ret = await HttpUtils.request(url, "GET", "");
		console.log("====getGasPriceAsync=ret=======", ret)
		return ret;
	},

	async getLastHeightAsync(url) {
		let pdata = [{
			id: "1",
			jsonrpc: "2.0",
			method: "eth_blockNumber",
			params: []
		}]
		let ret = await HttpUtils.request(url, "POST", pdata);
		if (!ret) {
			return false;
		}
		if (ret[0].id != '1' || ret[0].hasOwnProperty("error")) {
			return false;
		}
		ret = parseInt(ret[0].result);
		// console.log('===getLastHeightAsync==ret==',ret.toString(10))
		return ret.toString(10);
	},

	async getPendingTransactionsAsync(url) {
		// console.log('===getPendingTransactionsAsync==ret==',url)
		let pdata = {
			jsonrpc: "2.0",
			method: "eth_pendingTransactions",
			params: [],
			id: "1"
		}
		let ret = await HttpUtils.request(url, "POST", pdata);
		console.log('===getPendingTransactionsAsync==ret==', ret)
		if (ret.id != '1' || ret.hasOwnProperty('error')) {
			throw new Error(JSON.stringify(ret));
			return false;
		}
		return ret.result.length;
	},

	async getBlockAllTxAsync(blockNumber, url) {
		blockNumber = blockNumber.toString(16);
		let pdata = [{
			id: "1",
			jsonrpc: "2.0",
			method: "eth_getBlockByNumber",
			params: [`0x${blockNumber}`, true]
		}]
		let ret = await HttpUtils.request(url, "POST", pdata);

		// console.log('===pdata==',pdata)
		// console.log('===ret==',ret)
		if (!ret) {
			return false;
		}

		if (ret[0].id != '1' || ret[0].hasOwnProperty('error')) {
			return false;
		}

		return ret[0].result;
	},

	async getTokenBalanceAsync(contractAddress, address, url) {
		console.log("====getTokenBalanceAsync=data=======")
		if (address.indexOf('0x') == 0) {
			address = address.substring(2);
		}
		let data = `0x70a08231000000000000000000000000${address}`;
		let ret = await this.getTokenBalance(`0x${address}`, `${contractAddress}`, data, url);
		console.log("====getTokenBalanceAsync=ret======", ret)
		return ret;
	},

	async getTokenBalance(from, to, data, url) {
		console.log("====getTokenBalance=ret======",url)
		data = data.toLowerCase();
		let pdata = {
			jsonrpc: "2.0",
			method: "eth_call",
			params: [{
				from: `${from}`,
				to: `${to}`,
				data: `${data}`
			}, "latest"],
			id: "1"
		}
		console.log("====333=ret======",pdata)
		let ret = await HttpUtils.request(url, "POST", pdata);
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

	async getTokenCallFun(from, to, data, url) {
		// console.log("====getTokenBalance=ret======")
		data = data.toLowerCase();
		let pdata = {
			jsonrpc: "2.0",
			method: "eth_call",
			params: [{
				from: `${from}`,
				to: `${to}`,
				data: `${data}`
			}, "latest"],
			id: "1"
		}
		// console.log("=====ret======",pdata)
		let ret = await HttpUtils.request(url, "POST", pdata);
		console.log("=====ret======", ret)
		if (!ret) {
			return false;
		}

		if (ret.id != '1' || ret.hasOwnProperty('error')) {
			return false;
		}
		return ret.result;
	},

	async getETHBalanceAsync(address, url) {
		address = address.toLowerCase();
		let pdata = {
			jsonrpc: "2.0",
			method: "eth_getBalance",
			params: [`${address}`, "latest"],
			id: "1"
		}
		let ret = await HttpUtils.request(url, "POST", pdata);

		if (ret.id != '1' || ret.hasOwnProperty('error')) {
			return false;
		}

		ret = parseInt(ret.result);
		ret = ret.toString(10) / Math.pow(10, 18);

		return ret;
	},

	async ethTransactionCount(address, url, ) {
		address = address.toLowerCase();
		let pdata = {
			jsonrpc: "2.0",
			method: "eth_getTransactionCount",
			params: [`${address}`, "latest"],
			id: "1"
		}
		let ret = await HttpUtils.request(url, "POST", pdata);
		if (ret.id != '1' || ret.hasOwnProperty('error')) {
			return false;
		}

		ret = parseInt(ret.result);
		console.log("====ethTransactionCount==url=", url)
		console.log("====ethTransactionCount==res=", ret)
		return ret;
	},

	async ethTransactionCountByPending(address, url, ) {
		address = address.toLowerCase();
		let pdata = {
			jsonrpc: "2.0",
			method: "eth_getTransactionCount",
			params: [`${address}`, "pending"],
			id: "1"
		}
		let ret = await HttpUtils.request(url, "POST", pdata);

		if (ret.id != '1' || ret.hasOwnProperty('error')) {
			return false;
		}
		console.log("===pedings=ethTransactionCount==ret.result=", ret.result)
		ret = parseInt(ret.result);
		console.log("===pedings=ethTransactionCount==url=", url)
		console.log("==pedings==ethTransactionCount==res=", ret)
		return ret;
	},
	async getTxConfirmsAsync(txid, url) {
		let pdata = [{
			id: "1",
			jsonrpc: "2.0",
			method: "eth_getTransactionByHash",
			params: [`${txid}`]
		}]
		let ret = await HttpUtils.request(url, "POST", pdata);


		if (ret[0].id != '1' || ret[0].hasOwnProperty('error')) {
			return 0;
		}
		let lastHeight = await this.getLastHeightAsync();

		if (ret[0].result.blockNumber == null) {
			return 0;
		}

		let blockNum = parseInt(ret[0].result.blockNumber)

		blockNum = parseInt(blockNum.toString(10));

		return lastHeight - blockNum;
	},


	async getTransactionFee(txid, url) {
		let pdata = [{
			id: "1",
			jsonrpc: "2.0",
			method: "eth_getTransactionByHash",
			params: [`${txid}`]
		}]
		let ret = await HttpUtils.request(url, "POST", pdata);

		if (ret[0].id != '1' || ret[0].hasOwnProperty('error')) {
			return 0;
		}

		if (ret[0].result.gasPrice == null) {
			return 0;
		}
		let gasPrice = parseInt(ret[0].result.gasPrice);
		gasPrice = parseInt(gasPrice.toString(10)) / Math.pow(10, 18);


		pdata = [{
			id: "1",
			jsonrpc: "2.0",
			method: "eth_getTransactionReceipt",
			params: [`${txid}`]
		}]
		ret = await HttpUtils.request(url, "POST", pdata);

		if (ret[0].id != '1' || ret[0].hasOwnProperty('error')) {
			return 0;
		}

		if (ret[0].result.gasUsed == '') {
			return 0;
		}
		//gasPrice*gasUsed=手续费
		let gasUsed = parseInt(ret[0].result.gasUsed);

		return gasPrice * gasUsed;
	},

	async getTransactionReceiptAsync(txid, url) {
		let pdata = [{
			id: "1",
			jsonrpc: "2.0",
			method: "eth_getTransactionReceipt",
			params: [`${txid}`]
		}]

		let ret = await HttpUtils.request(url, "POST", pdata);

		if (ret[0].id != '1' || ret[0].hasOwnProperty('error')) {
			return 0;
		}
		console.log('===result==', ret)
		if (ret && ret[0].result && ret[0].result.status == "0x1") {
			return {
				status: 1,
				data: ret[0].result
			};
		} else {
			return {
				status: 0,
				data: ret[0].result
			};
		}
	},

	//getTxConfirmsAsync("0x9d0d28b2d8e60e73dcd5d832f370815d218761be5cbb31f5b006f6ea246a023c")

	async sendRawTransferAsync(rawTx, url) {
		console.log("=sendRawTransferAsync=url==", url)
		let pdata = {
			jsonrpc: "2.0",
			id: "1",
			method: "eth_sendRawTransaction",
			params: [
				rawTx
			]
		};
		console.log("=2=url==", url)
		let ret = await HttpUtils.request(url, "POST", pdata);
		console.log("==3==ret===", ret)
		if (ret.id !== '1' || ret.hasOwnProperty('error')) {
			return false;
		}
		return ret.result;
	},

	async ethTransferAsync(privateKey, from, to, value, nonce, url, gas) {

		if (privateKey.indexOf('0x') == 0) {
			privateKey = privateKey.substring(2, privateKey.length);
		}
		let weiValue = value * 1000000000000000000;
		weiValue = '0x' + weiValue.toString(16);
		let bestGasPrice = await this.getGasPriceAsync();
		if (!gas || gas <= 0) {
			gas = bestGasPrice;
		}
		if (typeof(nonce) != Number) {
			nonce = parseInt(nonce);
		}
		console.log("======ethTransferAsync==nonce=", nonce)

		nonce = nonce.toString(16);

		let rawTx = {
			nonce: `0x${nonce}`, //随机数 //不能丢
			gasPrice: gas, //bestGasPrice,
			gasLimit: '0x5208',
			to: to, //接受方地址或者合约地址
			value: weiValue, //发送的金额，这里是16进制，实际表示发送=wei
			data: '0x'
		};

		//使用私钥对原始的交易信息进行签名，得到签名后的交易数据
		let necessary = {
			chain: 'mainnet'
		}
		if (url.indexOf("ropsten") >= 0) {
			necessary = {
				chain: 'ropsten'
			}
		}
		console.log("===rawTx===necessary:", necessary)
		console.log("===rawTx===privateKey:", privateKey)
		console.log("===rawTx===rawTx:", rawTx)
		let pKey = Buffer.from(privateKey, 'hex');
		let tx = new Tx(rawTx, necessary);
		
		console.log("===rawTx===tx:", tx)
		console.log("===rawTx===pKey:", pKey)
		
		tx.sign(pKey);
		let serializedTx = tx.serialize().toString('hex');
		let txid = await this.sendRawTransferAsync('0x' + serializedTx, url);

		return txid;
	},

	/* 质朴长存法 by lifesinger */
	padZero(source, n) {
		let len = source.length;
		while (len < n) {
			source = "0" + source;
			len++;
		}
		return source;
	},

	async ethGetBlockChair(address) {
		var url = "https://api.blockchair.com/ethereum/calls?q=recipient(" + address + ")";
		return await HttpUtils.request(url, "GET", {});
	},
	// function getaddress() public view returns(bytes4){
	//           return bytes4(keccak256("getaddress(string,string)"));
	//    }
	//ERC20Token交易privateKey, 
	async tokenTransferAsync(privateKey, contractAddress, from, to, value, decimal, nonce, url, gas) {
		if (privateKey.indexOf('0x') == 0) {
			privateKey = privateKey.substring(2, privateKey.length);
		}
		if (to.indexOf('0x') == 0) {
			to = to.substring(2, to.length);
		}

		let realValue = value * Math.pow(10, decimal);
		realValue = parseInt(realValue).toString(16);
		let data = "0xa9059cbb" + this.padZero(to, 64) +
			this.padZero(realValue.toString('hex'), 64);

		if (typeof(nonce) != Number) {
			nonce = parseInt(nonce);
		}

		nonce = nonce.toString(16);
		let bestGasPrice = await this.getGasPriceAsync();
		if (!gas || gas <= 0) {
			gas = bestGasPrice;
		}
		let rawTx = {
			nonce: `0x${nonce}`, //随机数
			gasPrice: gas, //bestGasPrice,
			gasLimit: '0x124c0',
			to: contractAddress, //接受方地址或者合约地址
			value: '0x0', //发送的金额，这里是16进制，实际表示发送256个wei
			data: data,
		};
		//使用私钥对原始的交易信息进行签名，得到签名后的交易数据
		let pKey = Buffer.from(privateKey, 'hex');

		let necessary = {
			chain: 'mainnet'
		}
		if (url.indexOf("ropsten") >= 0) {
			necessary = {
				chain: 'ropsten'
			}
		}

		let tx = new Tx(rawTx, necessary);

		console.log("===rawTx===pKey:", pKey)
		console.log("===rawTx===tx:", tx)
		tx.sign(pKey);
		let serializedTx = tx.serialize().toString('hex');

		let txid = await this.sendRawTransferAsync('0x' + serializedTx, url);

		return txid;
	},

	//YOUKEY查询受权数 
	async YoukcApproveAllowanceAsync(contractAddress, tokenOwner, address, decimal, nonce, url) {
		console.log("==1==YoukcApproveAllowanceAsync=ret======")
		if (tokenOwner.indexOf('0x') == 0) {
			tokenOwner = tokenOwner.substring(2, tokenOwner.length);
		}

		if (address.indexOf('0x') == 0) {
			address = address.substring(2, address.length);
		}

		let data = "0xdd62ed3e" + this.padZero(tokenOwner, 64) +
			this.padZero(address, 64);
		let ret = await this.getTokenBalance(`0x${tokenOwner}`, `${contractAddress}`, data, url);
		console.log("====YoukcApproveAllowanceAsync=ret======", ret)
		return ret;
	},

	async YoukcisUserExists(contractAddress, address, url) {
		console.log("====YoukcisUserExists=ret======", contractAddress)
		console.log("====YoukcisUserExists=address======", address)
		if (address.indexOf('0x') == 0) {
			address = address.substring(2, address.length);
		}
		let data = "0x509222cd" + this.padZero(address, 64);
		let ret = await this.getTokenBalance(`0x${address}`, `${contractAddress}`, data, url);
		return ret;

	},

	//YOUKEY授权
	async YoukcApproveAsync(privateKey, contractAddress, address, amount, decimal, nonce, url) {
		if (privateKey.indexOf('0x') == 0) {
			privateKey = privateKey.substring(2, privateKey.length);
		}

		if (address.indexOf('0x') == 0) {
			address = address.substring(2, address.length);
		}

		let realValue = amount * Math.pow(10, decimal);
		console.log("=1==realValue=", realValue)
		realValue = parseInt(realValue).toString(16);
		console.log("=2==realValue=", realValue)
		let data = "0x095ea7b3" + this.padZero(address, 64) +
			this.padZero(realValue.toString('hex'), 64);

		console.log("=32=data=", data)
		if (typeof(nonce) != Number) {
			nonce = parseInt(nonce);
		}

		// console.log("=1==nonce=", nonce)
		nonce = nonce.toString(16);
		console.log("YoukcApproveAsync=2==nonce=", nonce)

		let bestGasPrice = await this.getGasPriceAsync();
		let rawTx = {
			nonce: `0x${nonce}`, //随机数
			gasPrice: bestGasPrice,
			gasLimit: '0x124c0',
			to: contractAddress, //接受方地址或者合约地址
			value: '0x0', //发送的金额，这里是16进制，实际表示发送256个wei
			data: data,
		};
		//使用私钥对原始的交易信息进行签名，得到签名后的交易数据
		let pKey = Buffer.from(privateKey, 'hex');

		let necessary = {
			chain: 'mainnet'
		}
		if (url.indexOf("ropsten") >= 0) {
			necessary = {
				chain: 'ropsten'
			}
		}

		let tx = new Tx(rawTx, necessary);
		tx.sign(pKey);
		let serializedTx = tx.serialize().toString('hex');

		let txid = await this.sendRawTransferAsync('0x' + serializedTx, url);
		console.log('==txid==', txid)
		return txid;
	},

	//ERC20Token交易privateKey
	async YoukcRegistrationExtAsync(privateKey, contractAddress, to, decimal, nonce, url) {
		console.log("YoukcRegistrationExtAsync=2==privateKey=", privateKey)
		console.log("YoukcRegistrationExtAsync=2==contractAddress=", contractAddress)
		console.log("YoukcRegistrationExtAsync=2==to=", to)
		console.log("YoukcRegistrationExtAsync=2==url=", url)
		if (privateKey.indexOf('0x') == 0) {
			privateKey = privateKey.substring(2, privateKey.length);
		}

		if (to.indexOf('0x') == 0) {
			to = to.substring(2, to.length);
		}

		let data = "0xf02e597e" + this.padZero(to, 64);
		console.log("=YoukcRegistrationExtAsync=data=", data)
		if (typeof(nonce) != Number) {
			nonce = parseInt(nonce);
		}
		console.log("=1==nonce=", nonce)

		nonce = nonce.toString(16);
		console.log("YoukcRegistrationExtAsync=2==nonce=", nonce)
		let bestGasPrice = await this.getGasPriceAsync();
		console.log("YoukcRegistrationExtAsync=3==nonce=")
		let rawTx = {
			nonce: `0x${nonce}`, //随机数
			gasPrice: bestGasPrice,
			gasLimit: 21000 * 40,
			to: contractAddress, //接受方地址或者合约地址
			value: '0x0', //发送的金额，这里是16进制，实际表示发送256个wei
			data: data,
		};

		console.log("YoukcRegistrationExtAsync=2==3=")
		//使用私钥对原始的交易信息进行签名，得到签名后的交易数据
		let pKey = Buffer.from(privateKey, 'hex');

		console.log("YoukcRegistrationExtAsync=2==4=")
		let necessary = {
			chain: 'mainnet'
		}
		if (url.indexOf("ropsten") >= 0) {
			necessary = {
				chain: 'ropsten'
			}
		}

		console.log("YoukcRegistrationExtAsync=2==5=")
		let tx = new Tx(rawTx, necessary);
		tx.sign(pKey);
		let serializedTx = tx.serialize().toString('hex');

		console.log("YoukcRegistrationExtAsync=2==serializedTx=", serializedTx)
		let txid = await this.sendRawTransferAsync('0x' + serializedTx, url);

		return txid;
	},

	//ERC20Token交易privateKey,
	async YoukcBuyNewLevel(privateKey, contractAddress, matrix, level, decimal, nonce, url, network) {
		if (privateKey.indexOf('0x') == 0) {
			privateKey = privateKey.substring(2, privateKey.length);
		}
		console.log("===matrix=", matrix)
		console.log("===level=", level)
		let data = "0xbe389d57" + this.padZero(matrix.toString(16), 64) +
			this.padZero(level.toString(16), 64);

		console.log("======bestGasPrice==data=", data)
		if (typeof(nonce) != Number) {
			nonce = parseInt(nonce);
		}

		nonce = nonce.toString(16);
		let bestGasPrice = await this.getGasPriceAsync();


		console.log("===2===bestGasPrice=", bestGasPrice * 3)

		let rawTx = {
			nonce: `0x${nonce}`, //随机数
			gasPrice: bestGasPrice,
			gasLimit: 21000 * 40,
			to: contractAddress, //接受方地址或者合约地址
			value: '0x0', //发送的金额，这里是16进制，实际表示发送256个wei
			data: data,
		};
		//使用私钥对原始的交易信息进行签名，得到签名后的交易数据
		let pKey = Buffer.from(privateKey, 'hex');

		let necessary = {
			chain: 'mainnet'
		}
		if (url.indexOf("ropsten") >= 0) {
			necessary = {
				chain: 'ropsten'
			}
		}

		let tx = new Tx(rawTx, necessary);
		tx.sign(pKey);
		let serializedTx = tx.serialize().toString('hex');

		let txid = await this.sendRawTransferAsync('0x' + serializedTx, url);

		return txid;
	},
	//收益
	async YoukcFsgGetBalance(contractAddress, address, url) {
		console.log("====YoukcFsgGetBalance=contractAddress======", contractAddress)
		console.log("====YoukcFsgGetBalance=address======", address)
		if (address.indexOf('0x') == 0) {
			address = address.substring(2, address.length);
		}
		let data = "0xf8b2cb4f" + this.padZero(address, 64);
		let ret = await this.getTokenBalance(`0x${address}`, `${contractAddress}`, data, url);
		return ret;
	},

	//获得 X3 收益
	async YoukcFsgGetX3Profit(contractAddress, address, level, url) {
		console.log("====YoukcFsgGetBalance=ret======", contractAddress)
		console.log("====YoukcFsgGetBalance=address======", address)
		if (address.indexOf('0x') == 0) {
			address = address.substring(2, address.length);
		}
		let data = "0x83ba31b2" + this.padZero(address, 64) + this.padZero(level.toString(16), 64);
		let ret = await this.getTokenCallFun(`0x${address}`, `${contractAddress}`, data, url);
		return ret;
	},

	//获得 X6 收益
	async YoukcFsgGetX6Profit(contractAddress, address, level, url) {
		console.log("====YoukcFsgGetBalance=ret======", contractAddress)
		console.log("====YoukcFsgGetBalance=address======", address)
		if (address.indexOf('0x') == 0) {
			address = address.substring(2, address.length);
		}
		let data = "0x9cc102fc" + this.padZero(address, 64) + this.padZero(level.toString(16), 64);
		let ret = await this.getTokenCallFun(`0x${address}`, `${contractAddress}`, data, url);
		return ret;
	}
}

module.exports = {
	OtcpUtils
};
