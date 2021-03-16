const ethers = require("../../../../node_modules/ethers")
const EthUtils = require('../utils/eth-utils.js').EthUtils;
const Web3 = require("../../../../node_modules/web3")
const WAValidator = require('../../../../node_modules/wallet-address-validator');
import Vue from 'vue'
var vue = Vue.prototype

const Ethers = {
	m_balance: 0,
	m_reqUrl: "",
	init: function() {
		console.log("=========Ethers===初始化===============")
		this.m_reqUrl = "https://mainnet.infura.io/v3/b732128135d54960807f9ed6d480a58a";

		this.m_web3 = new Web3(new Web3.providers.HttpProvider(this.m_reqUrl));
		// console.log("=========Ethers===初始化=======this.m_web3========", this.m_web3)
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
		let iscontract = true; //this.isContract(address);
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
		let average = {
			unitPrice: res.average / 10,
			title: vue.getLocalStr("title_str29"),
			time: res.avgWait
		};
		let fast = {
			unitPrice: res.fast / 10,
			title: vue.getLocalStr("title_str30"),
			time: res.fastWait + 1.5
		};
		let fasttest = {
			unitPrice: res.fastest / 10,
			title: vue.getLocalStr("title_str28"),
			time: res.fastestWait
		};
		let safelow = {
			unitPrice: res.safeLow / 10,
			title: vue.getLocalStr("title_str27"),
			time: res.safeLowWait + 15
		};
		let items = [];
		items.push(fasttest);
		items.push(fast);
		items.push(average);
		items.push(safelow);
		return items;
	},

	// 记录交易
	async sendTransaction(asset, to, amount, gas, remark) {
		let pedings = await EthUtils.ethTransactionCountByPending(this.fromAddress, this.m_reqUrl)
		let gcout = await EthUtils.ethTransactionCount(this.fromAddress, this.m_reqUrl)

			console.log("=====pedings=",pedings);
			console.log("=====gcout=",gcout);
			console.log("=====this.amount=",amount);
			console.log("=====this.to=",to);
			console.log("=====this.m_privateKey=",this.m_privateKey);
			console.log("=====this.fromAddress=",this.fromAddress);
			
		let txid = "";
		if(pedings && pedings >= 0){
			txid = await EthUtils.ethTransferAsync(this.m_privateKey, this.fromAddress, to, amount, pedings,
						this.m_reqUrl,
						gas);
		}
		console.log("=====Ethers===sendTransaction==0==", txid);
		if (txid && txid.length == 66) {
			this.onBalance();
			console.log("=====Ethers===sendTransaction===1=", txid);
			vue.util.UiUtils.showToast(vue.getLocalStr("title_str24"));
			vue.dal.Common.onTransfer(asset, this.fromAddress, to, amount, txid, "", remark)
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtTransResult, {
				result: true,
				txid: txid
			})
		} else {
			console.log("=====Ethers===sendTransaction==2==", txid);
			vue.util.UiUtils.showToast(vue.getLocalStr("title_str26"));
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtTransResult, {
				result: false
			});
		}
		vue.util.UiUtils.hideLoading();
		console.log("=====Ethers===sendTransaction====", txid);
	},

	async sendTokenTransaction(asset, to, amount, gas, contractAddress, remark) {
		let pedings = await EthUtils.ethTransactionCountByPending(this.fromAddress, this.m_reqUrl)
		console.log("===pedings=", pedings)
		console.log("===this.fromAddress=", this.fromAddress)
		console.log("===to=", to)
		console.log("===contractAddress=", contractAddress)
		let txid = await EthUtils.tokenTransferAsync(this.m_privateKey, contractAddress, this.fromAddress, to,
			amount, 6,
			pedings, this.m_reqUrl, gas)
		if (txid && txid.length == 66) {
			this.onTokenBalance(contractAddress);
			vue.util.UiUtils.showToast(vue.getLocalStr("title_str24"));
			vue.dal.Common.onTransfer("erc_" + asset, this.fromAddress, to, amount, txid, contractAddress,
				remark)
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtTransResult, {
				result: true
			});
		} else {
			vue.util.UiUtils.showToast(vue.getLocalStr("title_str26"));
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtTransResult, {
				result: false
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
		await EthUtils.getTokenBalanceAsync(contractAddress, this.fromAddress, this.m_reqUrl).then((
			balance) => {
			console.log("===11==contractAddress===", contractAddress);
			console.log("=====contractAddress===balance===", balance);

			vue.dal.ContractWallet.setContractMoney(this.fromAddress, contractAddress, balance)
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtToKenBalance, {
				contractAddress: contractAddress,
				balance: balance
			});
		})
	},
	async onApprove(contractAddress, fsqcontractAddress, amount) {
		let pedings = await EthUtils.ethTransactionCountByPending(this.fromAddress, this.m_reqUrl)
		let gcout = await EthUtils.ethTransactionCount(this.fromAddress, this.m_reqUrl)
		let txid = await OtcpUtils.YoukcApproveAsync(this.m_privateKey, contractAddress, fsqcontractAddress,
			amount, 8,
			gcout,
			this.m_reqUrl)
		console.log('===txid==', txid)
		if (txid && txid.length == 66) {
			let data = {
				hash: txid,
				from: this.m_fsqContractAddress,
				amount: amount,
				type: 2, //转帐
			}
			// this.addRecordList(data);
			this.onBalance();
			vue.util.EventUtils.dispatchEventCustom(vue.dal.YouKe.evtApproveResult, {
				tx: txid
			});
			return true;
		} else {
			vue.util.UiUtils.showToast("授权申请失败，您的余额不变");
			vue.util.UiUtils.hideLoading();
			return false;
		}

	},

	async YoukcisUserExists() {
		let address = vue.dal.Wallter.getAddress();

		let ret = await OtcpUtils.YoukcisUserExists(this.m_contractAddress, address, this.m_reqUrl)

		vue.util.EventUtils.dispatchEventCustom(vue.dal.ForSageForYKC.evtUserExists, {
			data: ret
		});

		vue.util.UiUtils.hideLoading();
	},

	async YoukcRegistrationExtAsync(to) {
		vue.util.UiUtils.showLoading("开启超级联盟...");
		let privateKey = vue.dal.Wallter.getPrivateKey();
		let address = vue.dal.Wallter.getAddress();
		let gcout = await OtcpUtils.ethTransactionCount(address, this.m_reqUrl);

		let txid = await OtcpUtils.YoukcRegistrationExtAsync(privateKey, this.m_contractAddress, to, 8, gcout,
			this.m_reqUrl)
		console.log('==YoukcRegistrationExtAsync=txid==', txid)
		if (txid && txid.length == 66) {
			let data = {
				tx: txid,
				matrix: 1,
				level: 1,
				amount: 100,
				nonce: gcout,
				upaddress: to
			}
			vue.dal.Order.addOrderInfo(data)
			let data2 = {
				tx: txid,
				matrix: 2,
				level: 1,
				amount: 100,
				nonce: gcout,
				upaddress: to
			}
			vue.dal.Order.addOrderInfo(data2)
			// vue.util.UiUtils.showToast("开启申请提交成功");
			vue.util.EventUtils.dispatchEventCustom(vue.dal.ForSageForYKC.evtRegistrationExt);
		} else {
			vue.util.UiUtils.showToast("开启申请提交失败，您的余额不变");
		}
		vue.util.UiUtils.hideLoading();
	},

	async YoukcBuyNewLevel(matrix, level, amount, upaddress) {
		// let isapprove = await vue.dal.YouKe.YoukcApproveAsync(amount);
		// console.log("==isapprove==", isapprove, "===amount=", amount)
		// if (!isapprove) {
		// 	vue.util.UiUtils.hideLoading();
		// 	vue.util.UiUtils.showToast("授权失败，您的余额不变");
		// 	return;
		// }

		// m_deployer/upaddress
		console.log("=====1======")
		vue.util.UiUtils.showLoading("开启请求中...");
		console.log("=====2======")
		let privateKey = vue.dal.Wallter.getPrivateKey();
		let address = vue.dal.Wallter.getAddress();
		let gcout = await OtcpUtils.ethTransactionCount(address, this.m_reqUrl)

		let txid = await OtcpUtils.YoukcBuyNewLevel(privateKey, this.m_contractAddress, matrix, level, 8, gcout,
			this.m_reqUrl)
		if (txid && txid.length == 66) {
			let data = {
				tx: txid,
				matrix: matrix,
				level: level,
				amount: amount,
				nonce: gcout,
				upaddress: upaddress
			}
			vue.dal.Order.addOrderInfo(data)
			// this.addRecordList(data, 3);
			// this.onBalance();
			vue.util.EventUtils.dispatchEventCustom(vue.dal.ForSageForYKC.evtBuyNewLevel);
		} else {
			vue.util.UiUtils.hideLoading("开启失败，您的余额不变");
		}
		vue.util.UiUtils.hideLoading();
	},

	async YoukcFsgGetBalance() {
		let address = vue.dal.Wallter.getAddress();

		let ret = await OtcpUtils.YoukcFsgGetBalance(this.m_contractAddress, address, this.m_reqUrl)
		vue.util.EventUtils.dispatchEventCustom(vue.dal.ForSageForYKC.evtFsgGetBalance, {
			data: ret
		});

		vue.util.UiUtils.hideLoading();
	},

	//获得 X3 收益
	async YoukcFsgGetX3Profit(level) {
		let address = vue.dal.Wallter.getAddress();
		let ret = await OtcpUtils.YoukcFsgGetX3Profit(this.m_contractAddress, address, level, this.m_reqUrl)
		vue.util.EventUtils.dispatchEventCustom(vue.dal.ForSageForYKC.evtFsgGetX3Profit, {
			data: ret
		});

		vue.util.UiUtils.hideLoading();
	},

	//获得 X6 收益
	async YoukcFsgGetX6Profit(level) {
		let address = vue.dal.Wallter.getAddress();
		let ret = await OtcpUtils.YoukcFsgGetX6Profit(this.m_contractAddress, address, level, this.m_reqUrl)
		vue.util.EventUtils.dispatchEventCustom(vue.dal.ForSageForYKC.evtFsgGetX6Profit, {
			data: ret
		});

		vue.util.UiUtils.hideLoading();
	},

	async isContract(address) {
		console.log("==isContract=address==", address)
		try {
			let code = await this.m_web3.eth.getCode(address.toSting())
			console.log("==isContract=code==", code)
			if (code == '0x') {
				console.log('普通账户')
				return false;
			} else {
				console.log('合约账户')
				return true;
			}
		} catch (ex) {
			console.log("===请输入有效的地址===", ex)
			// vue.util.UiUtils.showToast("请输入有效的地址");
			return false;
		}
	},

	isValidAddress: function(address) {
		console.log('=====address==', address)
		var valid = WAValidator.validate(address, 'ETH');
		if (!valid)
			console.log('This is a valid address');
		else
			console.log('Address INVALID');

		return valid;
	},
};

export default Ethers
