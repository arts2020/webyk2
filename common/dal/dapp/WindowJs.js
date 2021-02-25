import Vue from 'vue'
var vue = Vue.prototype

const WindowJs = {
	init: function() {
		console.log("=========WindowJs===初始化===============")
		this.m_web3str = "";
		this.m_web3Url = "";
		this.readWeb3str();
	},

	destroy: function() {

	},

	clear: function() {
		uni.cclog("======WindowJs clear==========")
	},

	getWeb3Url: function() {
		return this.m_web3Url;
	},
	getUniUrl: function() {
		return this.m_uniUrl;
	},

	readWeb3str: function() {
		// this.m_web3str = vue.util.StringUtils.getUserDefaults("eth_web3_strkey");
		this.m_web3Url = vue.util.StringUtils.getUserDefaults("eth_web3_strkey_url");
		this.m_uniUrl = vue.util.StringUtils.getUserDefaults("eth_uni_strkey_url");
		uni.cclog("======getInjectionStr====11111111======", this.m_web3Url)
		// #ifdef APP-PLUS
		if (!this.m_web3Url || this.m_web3Url.length <= 0) {
			plus.io.requestFileSystem(plus.io.PRIVATE_WWW, function(fobject) {
				fobject.root.getFile('_www/static/js/uni.webview.1.5.2.js', {
					create: false
				}, function(fileEntry) {
					uni.cclog("======getInjectionStr====3======")
					fileEntry.file(function(file) {
						console.log("==222=aa==", file.fullPath)
						vue.util.StringUtils.setUserDefaults("eth_uni_strkey_url", file.fullPath);
					});
				});
				// fs.root是根目录操作对象DirectoryEntry
				fobject.root.getFile('_www/static/js/web3.min.js', {
					create: false
				}, function(fileEntry) {
					uni.cclog("======getInjectionStr====3======")
					fileEntry.file(function(file) {
						// var fileReader = new plus.io.FileReader();
						// let aa = JSON.stringify(file);
						console.log("===aa==", file)
						vue.util.StringUtils.setUserDefaults("eth_web3_strkey_url", file.fullPath);

						// fileReader.readAsText(file, 'utf-8');
						// fileReader.onloadend = function(evt) {
						// 	console.log("=v=evt.target.filename=", evt.target.fileName)
						// 	// uni.cclog("======getInjectionStr====aa======" + this.m_web3str + '=sssss')
						// 	// vue.util.StringUtils.setUserDefaults("eth_web3_strkey", evt.target.result);
						// 	vue.util.StringUtils.setUserDefaults("eth_web3_strkey_url", evt.target.filename);
						// }
					});
				});
			});
		}
		// #endif
	},

	//IMTOKEN注入
	getImTokenInjectionStr: function() {
		let address = vue.util.StringUtils.getUserDefaults("imtoken_account_address_key");
		if(address && address.length > 0){
			address = "'" + address + "'"
		}else{
			address = "";
		}
		console.log("==address=",address)
		let str =
			"window.ethereum={};\
		window.ethereum.isMetaMask=true;\
		window.ethereum.isImToken=true;\
		window.ethereum.enable = function(){\
			return "+address+";\
		};\
		window.myCallbacks = {};\
		window.imToken= {};\
		window.callBack3 = function(data){ \
			alert('======myCallbacks====');\
			if(data.apiName == 'user.showAccountSwitch'){\
				window.myCallbacks[data.callbackid](data.err,data.address);\
			}else if(data.apiName == 'transaction.signTransaction'){\
				window.myCallbacks[data.callbackid](data.err,data.signature);\
			}else if(data.apiName == 'eth_requestAccounts'){\
				window.myCallbacks[data.callbackid](data.err,data.signature);\
			}\
			window.myCallbacks[data.callbackid] = null;\
		};\
		window.imToken.callAPI = function(apiName, params, callBack){\
			var timestamp = (new Date()).valueOf();\
			window.myCallbacks[timestamp] = callBack;\
			document.addEventListener('UniAppJSBridgeReady', function() {\
				uni.postMessage({\
					data: {callbackid:timestamp,apiName:apiName,params:params}\
				});\
				uni.getEnv(function(res) {\
					console.log('当前环境：' + JSON.stringify(res));\
				});\
			});\
		};"
		

		return str;
	},

};

export default WindowJs
