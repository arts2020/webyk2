// const Tx = require('../../../../node_modules/ethereumjs-tx').Transaction;
const HttpUtils = require('./https-util.js').HttpUtils
// const {Base64} = require('../../../../node_modules/js-base64/base64.js')
import Vue from 'vue'
var vue = Vue.prototype

const FileCoinUtils = {
	m_cids: {},
	async sendTransaction(address, to, mount) {
		let url = vue.dal.FileCoinWallter.m_reqUrl + '/sendTransaction';
		let pdata = {
			address: address,
			to: to,
			mount: mount
		}
		let ret = await HttpUtils.request(url, "POST", pdata);
		console.log("=sendTransaction=ret=", ret)
		return ret;
	},

	async getBalance(address) {
		let url = vue.dal.FileCoinWallter.m_reqUrl + '/getBalance';
		let pdata = {
			address: address
		}
		console.log("XXXXXXXXXXXXX=getBalance=url=", url)
		let ret = await HttpUtils.request(url, "POST", pdata);
		console.log("=getBalance=3===ret=", ret)
		return ret.data;
	},

	//通过私钥导入
	async privateWallter(privatekey) {
		let url = vue.dal.FileCoinWallter.m_reqUrl + '/privateWallter';
		let pdata = {
			privatekey: privatekey
		}
		let ret = await HttpUtils.request(url, "POST", pdata);
		console.log("=privateWallter=ret=", ret)
		return ret;
	},

	//通过助记词导入
	async mnemonicWallter(words) {
		let url = vue.dal.FileCoinWallter.m_reqUrl + '/mnemonicWallter';
		let pdata = {
			words: words
		}
		let ret = await HttpUtils.request(url, "POST", pdata);
		console.log("=mnemonicWallter=ret=", ret)
		return ret;
	},

	async getWalletValidateAddress(address) {
		let url = vue.dal.FileCoinWallter.m_reqUrl + '/getWalletValidateAddress';
		let pdata = {
			address: address
		}
		let ret = await HttpUtils.request(url, "POST", pdata);
		console.log("=getWalletValidateAddress=ret=", ret)
		return ret.data;
	},

	async InitData() {
		// this.tokenTransferAsync("f1oqzfuf7ce57irm4br7kdh4hqsdjzilwl3aqcvnq","f1bj7k5e35r3iupcl2d26jncbj7t27nqnpy3glsoy",0.001);
	},


	//归集转账
	async sendHash() {
		let addressList = await this.getAddressList();
		for (let i = 0; i < addressList.size(); i++) {
			let address = addressList.getString(i);
			if (address.equals(COLDADDRESS)) {
				continue;
			}
			let to = ""
			let getbalance = await this.getBalance(address);
			if (getbalance.compareTo(BigInt.ZERO) == 1) {
				let nonce = await this.getNonce(address);
				let gasLimit = await this.getGasLimit(address, to, nonce, getbalance);
				let gasFeeCap = await this.getGasFeeCap(address, to, nonce, getbalance, gasLimit);
				//gasPremium 必须小于 gasFeeCap 这里直接用的limit获取的 没做限制
				let gasPremium = await this.getGasPremium(address, gasLimit);
				console.log(nonce);
				console.log(gasLimit);
				console.log(gasFeeCap);
				console.log(gasPremium);
				let walletSignMessage = await this.getWalletSignMessage(address, to, nonce, getbalance, gasLimit, gasFeeCap,
					gasPremium);
				let mpoolPush = await this.getMpoolPush(walletSignMessage);
			}
		}
	},

	async tokenTransferAsync(address, to, mount) {
		let getbalance = mount; //await getBalance(address);
		let head = await this.getChainHead()
		if (head.result.Cids && head.result.Cids.length > 0) {
			this.m_cids = head.result.Cids;
		}

		let nonce = await this.getNonce(address);
		console.log(nonce);
		let gasLimit = await this.getGasLimit(address, to, nonce, getbalance);
		console.log(gasLimit);
		let gasFeeCap = await this.getGasFeeCap(address, to, nonce, getbalance, gasLimit);
		console.log(gasFeeCap);
		//gasPremium 必须小于 gasFeeCap 这里直接用的limit获取的 没做限制
		let gasPremium = await this.getGasPremium(address, gasLimit);
		console.log(gasPremium);

		let walletSignMessage = this.getParamsJsonObject(address, to, nonce, getbalance, gasLimit, gasFeeCap, gasPremium)

		// let walletSignMessage = await this.getWalletSignMessage(address, to,nonce, getbalance, gasLimit, gasFeeCap, gasPremium);
		let mpoolPush = await this.getMpoolPush(walletSignMessage);
		return mpoolPush;
	},
	//发送交易
	async getMpoolPush(walletSignMessage) {
		console.log("==sss=", JSON.stringify(walletSignMessage))
		// var baseStr = Base64.encode(Buffer(JSON.stringify(walletSignMessage),'hex'));


		var b = new Buffer(JSON.stringify(walletSignMessage));
		var baseStr = b.toString('base64');

		console.log("==baseStr=", baseStr)
		try {
			let pdata = {
				id: 1,
				jsonrpc: "2.0",
				method: "Filecoin.MpoolPush",
				params: [{
					"Message": walletSignMessage,
					Signature: {
						"Type": 1,
						"Data": baseStr
					}
				}]
			}
			console.log("=getMpoolPush=pdata==", pdata)
			let ret = await HttpUtils.request(vue.dal.FileCoinWallter.m_reqUrl2, "POST", pdata);
			console.log("=getMpoolPush=ret==", ret)
			return ret;
		} catch (error) {
			console.log(error)
			return console.log(error.code, error)
		}
	},

	//签名交易
	async getWalletSignMessage(address, to, nonce, getbalance, gasLimit, gasFeeCap, gasPremium) {
		try {
			let params = this.getParamsJsonObject(address, to, nonce, getbalance, gasLimit, gasFeeCap, gasPremium)
			let pdata = {
				id: 1,
				jsonrpc: "2.0",
				method: "Filecoin.WalletSignMessage",
				params: [address, params]
			}
			let ret = await HttpUtils.request(vue.dal.FileCoinWallter.m_reqUrl2, "POST", pdata);
			console.log("==ret==", ret.result)
			return ret;
		} catch (error) {
			console.log(error)
			return console.log(error.code, error)
		}
	},

	//查询GasPremium
	async getGasPremium(address, gasLimit) {
		try {
			let pdata = {
				id: 1,
				jsonrpc: "2.0",
				method: "Filecoin.GasEstimateGasPremium",
				params: [2, address, gasLimit, null]
			}
			let ret = await HttpUtils.request(vue.dal.FileCoinWallter.m_reqUrl2, "POST", pdata);
			console.log("=getGasPremium=ret==", ret)
			return ret.result;
		} catch (error) {
			console.log(error)
			return console.log(error.code, error)
		}
	},

	//查询GasFeeCap
	async getGasFeeCap(address, to, nonce, getbalance, gasLimit) {
		try {
			let params = this.getParamsJsonObject(address, to, nonce, getbalance, gasLimit, "0", "0");
			let pdata = {
				id: 1,
				jsonrpc: "2.0",
				method: "Filecoin.GasEstimateFeeCap",
				params: [params, 100, null]
			}
			let ret = await HttpUtils.request(vue.dal.FileCoinWallter.m_reqUrl2, "POST", pdata);
			console.log("=getGasFeeCap=ret==", ret)
			return ret.result;
		} catch (error) {
			console.log(error)
			return console.log(error.code, error)
		}
	},

	//查询GasLimit
	async getGasLimit(address, to, nonce, getbalance) {
		try {
			let params = this.getParamsJsonObject(address, to, nonce, getbalance, 0, "0", "0", this.m_cids);
			let pdata = {
				id: 1,
				jsonrpc: "2.0",
				method: "Filecoin.GasEstimateGasLimit",
				params: [params, this.m_cids]
			}
			let ret = await HttpUtils.request(vue.dal.FileCoinWallter.m_reqUrl2, "POST", pdata);
			console.log("=getGasLimit=ret==", ret)
			return ret.result;
		} catch (error) {
			console.log(error)
			return console.log(error.code, error)
		}
	},

	//获取当前nonce
	async getNonce(address) {
		try {
			let pdata = {
				id: 1,
				jsonrpc: "2.0",
				method: "Filecoin.MpoolGetNonce",
				params: [address]
			}
			let ret = await HttpUtils.request(vue.dal.FileCoinWallter.m_reqUrl2, "POST", pdata);
			console.log("=getNonce=ret==", ret)
			return ret.result;
		} catch (error) {
			console.log(error)
			return console.log(error.code, error)
		}
	},
	//查询余额
	async getBalance(address) {
		try {
			let pdata = {
				id: 1,
				jsonrpc: "2.0",
				method: "Filecoin.WalletBalance",
				params: [address]
			}
			let ret = await HttpUtils.request(vue.dal.FileCoinWallter.m_reqUrl2, "POST", pdata);
			console.log("=getBalance=ret==", ret)
			if (ret.result == null) {
				return 0;
			}
			return ret.result;
		} catch (error) {
			console.log(error)
			return console.log(error.code, error)
		}
	},

	//查询钱包地址
	async getAddressList() {
		try {
			let pdata = {
				id: 1,
				jsonrpc: "2.0",
				method: "Filecoin.WalletList",
				params: []
			}
			let ret = await HttpUtils.request(vue.dal.FileCoinWallter.m_reqUrl2, "POST", pdata);
			console.log("=getAddressList=ret==", ret.result)
			return ret;
		} catch (error) {
			console.log(error)
			return console.log(error.code, error)
		}
	},
	//生成地址
	async getWalletNew() {
		try {
			let pdata = {
				id: 1,
				jsonrpc: "2.0",
				method: "Filecoin.WalletNew",
				params: [1]
			}
			let ret = await HttpUtils.request(vue.dal.FileCoinWallter.m_reqUrl2, "POST", pdata);
			console.log("=getWalletNew=ret==", ret.result)
			return ret;
		} catch (error) {
			console.log(error)
			return console.log(error.code, error)
		}
	},

	//获取充币记录
	// async  geChainGetMessage(){
	//     try {
	//         let blockHash = this.getChainGetTipSetByHeight()
	//         let jsonArray = this.getChainGetBlockMessages(blockHash)

	//         for(let i = 0 ; i < jsonArray.length;i++){
	//             let txHash = jsonArray[i];
	//              let pdata={
	//                 id: 1 ,
	//                 jsonrpc:"2.0",
	//                 method:"Filecoin.ChainGetMessage",
	//                 params:[txHash]
	//             }
	//             let ret = await HttpUtils.request(vue.dal.FileCoinWallter.m_reqUrl2, "POST", pdata);
	//             console.log("==ret==",ret.result.Method)
	//             if(ret.result.Method == 0){
	//                 let flag = getStateGetReceipt(txHash);
	//                 if(flag){
	//                    let address = ret.result.To;
	//                    let value = ret.result.Value;
	//                     console.log('===address===',address)
	//                     console.log('===value===',value)
	//                 }
	//             }
	//         }
	//     } catch (error) {
	//         console.log(error)
	//         return console.log(error.code, error)
	//     }
	// },
	// async  geChainGetMessage(){
	//     try {
	//        let pdata={
	//            id: 1 ,
	//            jsonrpc:"2.0",
	//            method:"Filecoin.ChainGetMessage",
	//            params:[txHash]
	//        }
	//        let ret = await HttpUtils.request(vue.dal.FileCoinWallter.m_reqUrl2, "POST", pdata);

	//     } catch (error) {
	//         console.log(error)
	//         return console.log(error.code, error)
	//     }
	// },
	// //获取最新区块
	// async  getChainHead(){
	//     try {
	//         let pdata={
	//             id: 1 ,
	//             jsonrpc:"2.0",
	//             method:"Filecoin.ChainHead",
	//             params:[]
	//         }
	//         let ret = await HttpUtils.request(vue.dal.FileCoinWallter.m_reqUrl2, "POST", pdata);
	//         console.log("=getChainHead=ret==", ret)
	// 		return ret;
	//     } catch (error) {
	//         console.log(error)
	//         return console.log(error.code, error)
	//     }
	// } ,

	// //扫描区块
	// async  getChainGetTipSetByHeight(){
	//     try {
	//         let pdata={
	//             id: 1 ,
	//             jsonrpc:"2.0",
	//             method:"Filecoin.ChainGetTipSetByHeight",
	//             params:[0,null]
	//         }
	//         let ret = await HttpUtils.request(vue.dal.FileCoinWallter.m_reqUrl2, "POST", pdata);
	//         console.log("=getChainGetTipSetByHeight=ret==",ret.result)
	//         return ret.result.Cids;
	//     } catch (error) {
	//         console.log(error)
	//         return console.log(error.code, error)
	//     }
	// },

	// //获取区块交易hash
	// async  getChainGetBlockMessages(blockHash){
	//     try {
	//         let hashSet = [];
	//         for(let i = 0; i < blockHash.length;i++){
	//             let hash = blockHash[i];
	//             console.log("===hash==",hash)
	//             let pdata={
	//                 id: 1 ,
	//                 jsonrpc:"2.0",
	//                 method:"Filecoin.ChainGetBlockMessages",
	//                 params:[hash]
	//             }
	//             let ret = await HttpUtils.request(vue.dal.FileCoinWallter.m_reqUrl2, "POST", pdata);
	//             console.log("=getChainGetBlockMessages=ret==",ret.result.Cids)
	//             hashSet.push(ret.result.Cids)
	//         }
	//         return hashSet;
	//     } catch (error) {
	//         console.log(error)
	//         return console.log(error.code, error)
	//     }
	// },

	// //校验交易
	// async  getStateGetReceipt(txHash){
	//     try {
	//         let flag = false;
	//         let pdata={
	//             id: 1 ,
	//             jsonrpc:"2.0",
	//             method:"Filecoin.StateGetReceipt",
	//             params:[txHash]
	//         }
	//         let ret = await HttpUtils.request(vue.dal.FileCoinWallter.m_reqUrl2, "POST", pdata);
	// 		console.log("==getStateGetReceipt==ret=",ret)
	//         if(ret.result.Return == 0){
	//             flag = true;
	//         }
	//         return flag;
	//     } catch (error) {
	//         console.log(error)
	//         return console.log(error.code, error)
	//     }
	// },

	// // async  getWalletValidateAddress(address){
	// //     try {
	// //         let flag = false;
	// //         let pdata={
	// //             id: 1 ,
	// //             jsonrpc:"2.0",
	// //             method:"Filecoin.WalletValidateAddress",
	// //             params:[address]
	// //         }
	// //         let ret = await HttpUtils.request(vue.dal.FileCoinWallter.m_reqUrl2, "POST", pdata);
	// // 		console.log("==getWalletValidateAddress==ret=",ret)
	// //         if(ret.result == address){
	// //             flag = true;
	// //         }
	// //         return flag;
	// //     } catch (error) {
	// //         console.log(error)
	// //         return console.log(error.code, error)
	// //     }
	// // },
	// async  getChainNotify(){
	//     try {
	//         let flag = false;
	//         let pdata={
	//             id: 1 ,
	//             jsonrpc:"2.0",
	//             method:"Filecoin.ChainNotify",
	//             params:[]
	//         }
	//         let ret = await HttpUtils.request(vue.dal.FileCoinWallter.m_reqUrl2, "POST", pdata);
	// 		console.log("==getChainNotify==ret=",ret)
	//         if(ret.result.Return == 0){
	//             flag = true;
	//         }
	//         return flag;
	//     } catch (error) {
	//         console.log(error)
	//         return console.log(error.code, error)
	//     }
	// },
	// async getVersion(){
	//     try {
	//         let flag = false;
	//         let pdata={
	//             id: 1 ,
	//             jsonrpc:"2.0",
	//             method:"Filecoin.Version",
	//             params:[]
	//         }
	//         let ret = await HttpUtils.request(vue.dal.FileCoinWallter.m_reqUrl2, "POST", pdata);
	// 		console.log("==getVersion==ret=",ret)
	//         return ret.result;
	//     } catch (error) {
	//         console.log(error)
	//         return console.log(error.code, error)
	//     }
	// },
	// getParamsJsonObject(address,to, nonce, getbalance, gasLimit, gasFeeCap, gasPremium,cids) {
	//     let paramsObject =  {};
	//     paramsObject.Version = 0;
	//     paramsObject.To = to;
	//     paramsObject.From = address;
	//     paramsObject.Nonce = nonce;
	//     paramsObject.Value = getbalance * Math.pow(10,18) + '';
	//     paramsObject.GasLimit = gasLimit;
	//     paramsObject.GasFeeCap = gasFeeCap;
	//     paramsObject.GasPremium = gasPremium;
	//     paramsObject.Method = 0;
	//     paramsObject.Params = null;
	//     paramsObject.CID = this.m_cids;
	// 	console.log("===paramsObject==",paramsObject)
	//     return paramsObject;
	// }
}

module.exports = {
	FileCoinUtils
};
