//http://wenjixu.com/blog/117.html

const bip39 = require('../../../../node_modules/bip39')
const bip32 = require('../../../../node_modules/bip32')
const BtcUtils = require('../utils/btc-utils.js').BtcUtils;
const bitcoin = require('bitcoinjs-lib')

import Vue from 'vue'
var vue = Vue.prototype

const Btc = {
	m_balance: 0,
	m_reqUrl: "",

	init: function() {
		console.log("========Btc===初始化===============")
		this.m_reqUrl = "http://119.8.55.19:8332";
	},

	destroy: function() {

	},

	clear: function() {
		uni.cclog("======Btc clear==========")
	},
	//创建身份钱包
	async createMain(walletInfo) {
		let wallet = vue.dal.MainWallet.getMainWalletByType(vue.entities.Metadata.ChainType.BTC)
		if (!wallet) {
			wallet = await this.createWalletByWords(walletInfo.words)
			wallet.password = walletInfo.password;
			wallet.passwordtip = walletInfo.tips;
			wallet.importtype = vue.entities.Metadata.ImportType.WordType;
			vue.dal.MainWallet.addMainWallet(vue.entities.Metadata.ChainType.BTC, wallet);
		}
		return wallet;
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
				return vue.dal.NormalWallet.addNormalWallet(vue.entities.Metadata.ChainType.BTC, wallet);

			}
		} else if (walletInfo.importtype == vue.entities.Metadata.ImportType.PrivateType) {
			let wallet = await this.createWalletByPrivateKey(walletInfo.strval)
			if (wallet) {
				wallet.name = walletInfo.name;
				wallet.password = walletInfo.password;
				wallet.passwordtip = walletInfo.passwordtip;
				wallet.chaintype = walletInfo.chaintype;
				wallet.importtype = vue.entities.Metadata.ImportType.PrivateType;
				return vue.dal.NormalWallet.addNormalWallet(vue.entities.Metadata.ChainType.BTC, wallet);
			}
		}
		return true;
	},

	async createWalletByWords(words) {
		console.log("========Btc===创建节点请求===============")
		try {
			console.log("==words==", words)
			//设置生成测试or正式环境的钱包
			const network = bitcoin.networks.bitcoin
			// console.log("==network==", network)
			// 计算seed:
			const seed = await bip39.mnemonicToSeed(words)
			// console.log("==seed==", seed)
			const root = bip32.fromSeed(seed, network)
			const path = "m/44'/0'/0'/0/0";
			const keyPair = root.derivePath(path)
			const privateKey = keyPair.toWIF()
			console.log("BTC私钥：", privateKey)
			const publicKey = keyPair.publicKey.toString("hex")
			console.log("BTC公钥：", publicKey)
			let address = bitcoin.payments.p2pkh({
				pubkey: keyPair.publicKey,
				network: network
			})
			console.log("===createWalletByWords====BTC地址：", address.address)
			return {
				words: words,
				privateKey: privateKey,
				publicKey: publicKey,
				address: address.address
			}
		} catch (e) {
			console.log("=btc==createWalletByWords=e==", e)
			return false;
		}
	},

	async createWalletByPrivateKey(privateKey) {
		console.log("==privateKey==", privateKey);
		try {
			const network = bitcoin.networks.bitcoin
			let keyPair = bitcoin.ECPair.fromWIF(privateKey, bitcoin.networks[network]);
			let publicKey = keyPair.publicKey;
			let address = bitcoin.payments.p2pkh({
				pubkey: publicKey
			});
			console.log("==address==", address);
			console.log("==publicKey==", publicKey.toString("hex"));
			console.log("==privateKey==", privateKey);
			return {
				privateKey: privateKey,
				publicKey: publicKey,
				address: address.address
			}
		} catch (e) {
			console.log("===createWalletByPrivateKey=e==", e)
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
		return false;
	},

	// 记录交易
	async sendTransaction(asset, to, amount, gas, remark) {
		let privateKey = vue.dal.WalletManage.getPrivateKey();
		let address = vue.dal.WalletManage.getAddress();

		//TODO....
		const network = bitcoin.networks.bitcoin
		const keyPair = bitcoin.ECPair.fromWIF(privateKey, network);
		const pubKey = keyPair.getPublicKeyBuffer();
		const pubKeyHash = bitcoin.crypto.hash160(pubKey);
		// 得到隔离见证地址的回执脚本
		const redeemScript = bitcoin.script.witnessPubKeyHash.output.encode(pubKeyHash);

		// 构建交易 builder
		const txb = new bitcoin.TransactionBuilder();

		// 添加交易中的 Inputs，假设这个 UTXO 有 15000 satoshi
		txb.addInput(address, 0);
		// 添加交易中的 Outputs，矿工费用 = 15000 - 12000 = 3000 satoshi
		// addOutput 方法的参数分别为收款地址和转账金额
		txb.addOutput(to, amount);

		// 交易签名
		txb.sign(0, keyPair, redeemScript, null, 15000);

		let txid = txb.build().toHex()
		// 打印签名后的交易 hash
		console.log("=====Btc===sendTransaction====", txid);
		
		if(txid && txid.length > 0){
			this.onBalance();
			console.log("=====Ethers===sendTransaction===1=", txid);
			vue.util.UiUtils.showToast(vue.getLocalStr("title_str24"));
			vue.dal.Common.onTransfer(asset, this.fromAddress, to, amount, txid, "",remark)
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtTransResult, {
				result: true
			})
		}else{
			vue.util.UiUtils.showToast(vue.getLocalStr("title_str25"));
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtTransResult, {
				result: false
			});
		}

		vue.util.UiUtils.hideLoading();
	},

	// TOKEN交易记录
	async sendTokenTransaction(asset, to, amount, gas, remark) {
		let privateKey = vue.dal.WalletManage.getPrivateKey();
		let address = vue.dal.WalletManage.getAddress();

		//TODO....
		vue.util.UiUtils.hideLoading();
		console.log("=====Btc===sendTransaction====", txid);
	},

	async getBalance() {
		console.log("=====Btc===this.m_balance====", this.m_balance);
		return this.m_balance; //let address = vue.dal.WalletManage.getAddress()
	},

	async onTokenBalance(contractAddress) {

	},

	async onBalance() {
		let address = "15urYnyeJe3gwbGJ74wcX89Tz7ZtsFDVew"; //vue.dal.WalletManage.getAddress();
		let ret = await BtcUtils.getBalance(address);
		console.log("====onBalance=ret==", ret)
		if (ret.status == "success") {
			let balance = ret.data.balance / Math.pow(10, 8);;
			vue.dal.WalletManage.setCurrWalletMoney(balance)
			vue.util.EventUtils.dispatchEventCustom(vue.dal.WalletManage.evtBalance);
		}
	},

	async isAddress(address) {
		try {
			const crypto = require(`crypto`);
			const ecdh = crypto.createECDH('secp256k1');
			const bs58 = require(`bs58`);

			// 1.把地址base58解码成字节数组
			const arr = bs58.decode(address);
			const buf = new Buffer(arr);

			// 2.把数组分成两个字节数组，字节数组（一）是后4字节数组，字节数组（二）是减去后4字节的数组
			const checksum = buf.slice(-4);
			const bytes = buf.slice(0, buf.length - 4);

			// 3.把字节数组（二）两次Sha256 Hash
			const shax1 = createHash('sha256').update(bytes).digest();
			const shax2 = createHash('sha256').update(shax1).digest();
			// 4.取字节数组（二）hash后的前4位，跟字节数组（一）比较。如果相同校验通过。
			const newChecksum = shax2.slice(0, 4);
			if (checksum.toString('hex') !== newChecksum.toString('hex')) {
				throw new Error('Invalid checksum');
			}
			// 5.校验通过的解码字节数组取第一个字节（0xff），得到版本号
			const version = buf.toString('hex').slice(0, 2);
			// 6.检验版本号的合法性（根据主网参数校验）00 为普通地址，05为脚本地址，注意大小写。
			if (version !== '00' && version !== '05') {
				throw new Error('Invalid version');
			}

		} catch (e) {
			return false;
		}
		return true;
	}
};

export default Btc
