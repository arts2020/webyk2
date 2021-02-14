const ethers = require("../../../../node_modules/ethers")
const EthUtils = require('../utils/eth-utils.js').EthUtils;
const Web3 = require("../../../../node_modules/web3")

import Vue from 'vue'
var vue = Vue.prototype

const Ethers = {
	m_balance: 0,
	m_reqUrl: "",
	init: function() {
		console.log("=========Ethers===初始化===============", ethers)
		this.m_reqUrl = "https://mainnet.infura.io/v3/b732128135d54960807f9ed6d480a58a";

		this.m_web3 = new Web3(new Web3.providers.HttpProvider(this.m_reqUrl));
	},

	destroy: function() {

	},
	
	clear: function() {
		uni.cclog("======Ethers clear==========")
	},
	//创建身份钱包
	async createMain(walletInfo) {
		let wallet = vue.dal.MainWallet.getMainWalletByType(vue.entities.Metadata.ChainType.ETH)
		if (!wallet) {
			wallet = await this.createWalletByWords(walletInfo.words)
			wallet.password = walletInfo.password;
			wallet.passwordtip = walletInfo.tips;
			wallet.importtype = vue.entities.Metadata.ImportType.WordType;
			vue.dal.MainWallet.addMainWallet(vue.entities.Metadata.ChainType.ETH, wallet);
		}
		return true;
	},

	//创建合约钱包
	async createContract(address) {
		let iscontract = this.isContract(address);
		if (iscontract) {
			return await vue.dal.ContractWallet.addContractWallet(vue.entities.Metadata.ChainType.ETH, address)
		}
		return false;
	},

	//创建普通钱包
	async createNormal(walletInfo) {
		if (walletInfo.importtype == vue.entities.Metadata.ImportType.WordType) {
			let wallet = await this.createWalletByWords(walletInfo.strval)
			if (wallet) {
				wallet.name = walletInfo.name;
				wallet.password = walletInfo.password;
				wallet.passwordtip = walletInfo.passwordtip;
				wallet.chaintype = walletInfo.chaintype;
				wallet.importtype = vue.entities.Metadata.ImportType.WordType;
				return vue.dal.NormalWallet.addNormalWallet(vue.entities.Metadata.ChainType.ETH, wallet);
			}
		} else if (walletInfo.importtype == vue.entities.Metadata.ImportType.PrivateType) {
			let wallet = await this.createWalletByPrivateKey(walletInfo.strval)
			if (wallet) {
				wallet.name = walletInfo.name;
				wallet.password = walletInfo.password;
				wallet.passwordtip = walletInfo.passwordtip;
				wallet.chaintype = walletInfo.chaintype;
				wallet.importtype = vue.entities.Metadata.ImportType.PrivateType;
				return vue.dal.NormalWallet.addNormalWallet(vue.entities.Metadata.ChainType.ETH, wallet);
			}
		}
		return false;
	},

	async createWalletByWords(words) {
		console.log("========ETH===创建节点请求===============", words)
		try {
			//根据助记词找回钱包信息
			// var monic = "peace mouse scrap chase order guess volume unit riot save reopen nation"
			var mnemonic = ethers.Wallet.fromMnemonic(words);
			let privateKey = mnemonic.privateKey;
			console.log("找回-钱包私钥：", privateKey)
			//获取path
			var path = mnemonic.path;
			let publicKey = mnemonic.publicKey;
			//根据私钥找回钱包地址
			var wallet = new ethers.Wallet(privateKey);
			//钱包地址
			let address = wallet.address;

			return {
				words: words,
				privateKey: privateKey,
				publicKey: publicKey,
				address: address
			}
		} catch (e) {
			console.log("=eth==createWalletByWords=e==", e)
			return false;
		}
	},

	async createWalletByPrivateKey(privateKey) {
		try {
			//根据私钥找回钱包地址
			var wallet = new ethers.Wallet(privateKey);
			//钱包地址
			let address = wallet.address;
			return {
				privateKey: privateKey,
				publicKey: null,
				address: address
			}
		} catch (e) {
			console.log("==eth=createWalletByPrivateKey=e==", e)
			return false;
		}
	},

	async initCurrChain() {
		let walletInfo = vue.dal.WalletManage.getCurrWallet();
		this.m_privateKey = walletInfo.privateKey;
		this.fromAddress = walletInfo.address;
	},

	//GAS费
	async getGasPrice() {
		let res = await EthUtils.getGasPriceAsync2();
		console.log("===res=", res)
		let average = {unitPrice: res.average/10,title: "正常",time: res.avgWait};
		let fast = {unitPrice: res.fast/10,title: "快速",time: res.fastWait + 1.5};
		let fasttest = {unitPrice: res.fastest/10,title: "最快",time: res.fastestWait};
		let safelow = {unitPrice: res.safeLow/10,title: "缓慢",time: res.safeLowWait + 15};
		let items = [];
		items.push(fasttest);
		items.push(fast);
		items.push(average);
		items.push(safelow);
		return items;
	},

	// 记录交易
	async sendTransaction(to, amount, gas) {
		let pedings = await EthUtils.ethTransactionCountByPending(this.fromAddress, this.m_reqUrl)

		let gcout = await EthUtils.ethTransactionCount(this.fromAddress, this.m_reqUrl)
		let txid = await EthUtils.ethTransferAsync(privateKey, this.fromAddress, to, amount, pedings, this.m_reqUrl, gas);
		if (txid && txid.length == 66) {
			this.onBalance();
			console.log("=====Ethers===sendTransaction===1=", txid);
			vue.util.UiUtils.showToast("转帐已提交");

			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtTransResult, {
				tx: txid
			});
		} else {
			console.log("=====Ethers===sendTransaction==2==", txid);
			vue.util.UiUtils.showToast("转帐失败，您的余额不变");
		}
		vue.util.UiUtils.hideLoading();
		console.log("=====Ethers===sendTransaction====", txid);
	},

	async sendTokenTransaction(to, amount, gas, contractAddress) {
		let pedings = await EthUtils.ethTransactionCountByPending(this.fromAddress, this.m_reqUrl)
		console.log("===pedings=", pedings)
		console.log("===this.fromAddress=", this.fromAddress)
		console.log("===to=", to)
		let txid = await EthUtils.tokenTransferAsync(privateKey, contractAddress, this.fromAddress, to, amount, 6, pedings,
			this.m_reqUrl, gas)
		console.log("====txid=====", txid)
		if (txid && txid.length == 66) {
			this.onTokenBalance(contractAddress);
			vue.util.UiUtils.showToast("转帐已提交");
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtTransResult, {
				tx: txid
			});
		} else {
			vue.util.UiUtils.showToast("转帐失败，您的余额不变");
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtTransResult, {
				tx: false
			});
		}
		vue.util.UiUtils.hideLoading();
		console.log("=========usdterc20===sendTransaction=====2==========", txid)
	},

	getBalance: function() {
		console.log("=====Ethers===m_balance====", this.m_balance);
		return this.m_balance;
	},

	async onBalance() {
		console.log("==3333===this.m_reqUrl====", this.m_reqUrl);
		await EthUtils.getETHBalanceAsync(this.fromAddress, this.m_reqUrl).then((balance) => {
			console.log("=====this.fromAddress====", this.fromAddress);
			console.log("=====this.Ethers===balance====", balance);

			vue.dal.WalletManage.setCurrWalletMoney(balance)
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtBalance);
		})
	},

	async onTokenBalance(contractAddress) {
		await EthUtils.getTokenBalanceAsync(contractAddress, this.fromAddress, this.m_reqUrl).then((balance) => {
			console.log("===11==contractAddress===", contractAddress);
			console.log("=====contractAddress===balance===", balance);

			vue.dal.ContractWallet.setContractMoney(this.fromAddress, contractAddress, balance)
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtToKenBalance, {
				contractAddress: contractAddress,
				balance: balance
			});
		})
	},

	async isContract(address) {
		console.log("==isContract=address==", address)
		try {
			let code = await this.m_web3.eth.getCode(address)
			if (code == '0x') {
				console.log('普通账户')
				return false;
			} else {
				console.log('合约账户')
				return true;
			}
		} catch (ex) {
			console.log("===请输入有效的地址===")
			// vue.util.UiUtils.showToast("请输入有效的地址");
			return false;
		}

	}
};

export default Ethers
