// import '../../shared/commands'

import Vue from 'vue'
var vue = Vue.prototype

const WindowJs = {
	init: function() {
		console.log("=========WindowJs===初始化====== =========")
		this.m_web3str = "";
		this.m_web3Url = "";
		this.m_currentWebview = null;
		this.m_loadFinish = false;
		// this.readWeb3str();
		// #ifdef APP-PLUS
		//this.loadJsFileToWebView();
		// #endif
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
	getInpageUrl: function() {
		return this.m_inpage;
	},
	readWeb3str: function() {
		// this.m_web3str = vue.util.StringUtils.getUserDefaults("eth_web3_strkey");
		this.m_web3Url = vue.util.StringUtils.getUserDefaults("eth_web3_strkey_url");
		this.m_uniUrl = vue.util.StringUtils.getUserDefaults("eth_uni_strkey_url");
		this.m_inpage = vue.util.StringUtils.getUserDefaults("eth_inpage_strkey_url");
		// #ifdef APP-PLUS
		// if (!this.m_web3Url || this.m_web3Url.length <= 0) {
		plus.io.requestFileSystem(plus.io.PRIVATE_WWW, function(fobject) {
			fobject.root.getFile('_www/static/js/uni.webview.1.5.2.js', {
				create: false
			}, function(fileEntry) {
				fileEntry.file(function(file) {
					console.log("====uni.webview=file===", file)
					vue.util.StringUtils.setUserDefaults("eth_uni_strkey_url", file.fullPath);
				});
			});
			fobject.root.getFile('_www/static/js/inpage.js', {
				create: false
			}, function(fileEntry) {
				fileEntry.file(function(file) {
					vue.util.StringUtils.setUserDefaults("eth_inpage_strkey_url", file.fullPath);
				});
			});
			// fs.root是根目录操作对象DirectoryEntry
			fobject.root.getFile('_www/static/js/web3.min.js', {
				create: false
			}, function(fileEntry) {
				fileEntry.file(function(file) {
					// var fileReader = new plus.io.FileReader();
					// let aa = JSON.stringify(file);
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
		// }
		// #endif
	},

	async getCurrentWebView() {
		var pages = getCurrentPages();
		console.log("===22=====pages:" + pages.length);

		console.log("====getCurrentWebView=====1====", this.m_currentWebview)
		if (!this.m_currentWebview) {
			this.m_currentWebview = plus.webview.create()
		}
		console.log("====getCurrentWebView=====2====" + this.m_loadFinish)
		if (!this.m_loadFinish) {
			console.log("====getCurrentWebView=====3====")
			await this.loadJsFileToWebView();
		}
		console.log("====getCurrentWebView==4=" + this.m_loadFinish)
		return this.m_currentWebview;
	},

	async loadJsFileToWebView() {
		let self = this;
		plus.io.requestFileSystem(plus.io.PRIVATE_WWW, function(fobject) {
			// fobject.root.getFile('_www/static/js/web3.min.js', {
			// 	create: false
			// }, function(fileEntry) {
			// 	fileEntry.file(function(file) {
			// 		console.log("====web3.webview=file===", file)
			// 		var fileReader = new plus.io.FileReader();
			// 		fileReader.readAsText(file, 'utf-8');
			// 		fileReader.onloadend = function(evt) {
			// 			self.m_currentWebview.evalJS(
			// 				evt.target.result
			// 			)
			// 			self.m_loadFinish = true; 
			// 			console.log("====5555555555555555===")
			// 		}
			// 	});
			// });
			fobject.root.getFile('_www/static/js/uni.webview.1.5.2.js', {
				create: false
			}, function(fileEntry) {
				fileEntry.file(function(file) {
					console.log("====uni.webview=file===", file)
					var fileReader = new plus.io.FileReader();
					fileReader.readAsText(file, 'utf-8');
					fileReader.onloadend = function(evt) {
						console.log("====evt.target.result===", evt.target.result)
						self.m_currentWebview.evalJS(
							evt.target.result
						)
						console.log("====44444444444444444444444===")
					}
					fileReader.fail = function(evt) {
						console.log("=uni===fileReader.fail===", evt)
					}
				});
			});
		})

		let strjs = this.getImTokenInjectionStr();
		this.m_currentWebview.evalJS(
			strjs
		)
	},

	//IMTOKEN注入
	getImTokenInjectionStr: function() {
		let address = vue.util.StringUtils.getUserDefaults("imtoken_account_address_key");
		if (address && address.length > 0) {
			address = "'" + address + "'"
		} else {
			address = "0x9CaCdC05cD8CE97d13d76CF1939E1c8c9e785500";
		}
		console.log("==address=", address)
		let str = "window.m_flag = false;\
			var Eth = function Eth() {\
		    var defaultAccount = null;\
		};\
		var Web3 = function Web3() {\
		    this.eth = new Eth(this);\
		};\
		function ethereum(){}\
		window.ethereum={};\
		window.ethereum.isMetaMask=true;\
		window.ethereum.isImToken=true;\
		window.ethereum.enable = function(){\
			return ['" + address + "'];\
		};\
		window.myCallbacks = {};\
		window.myFlags = {};\
		window.myParams = {};\
		window.imToken= {};\
		window.MetaMask = {};\
		window.callBack3 = function(data){ \
			console.log('====callBack3==myCallbacks====' + data.method);\
			console.log('======callbackid====' + data.callbackid);\
			console.log('======callBack3=data===' + JSON.stringify(data));\
			window.m_flag = true;\
			if(data.method == 'user.showAccountSwitch'){\
				console.log('====user.showAccountSwitch==' + data.signature);\
				window.myCallbacks[data.callbackid](data.err,data.address);\
			}else if(data.method == 'transaction.signTransaction'){\
				console.log('====transaction.signTransaction==' + data.signature);\
				window.myCallbacks[data.callbackid](data.err,data.signature);\
			}else if(data.method == 'eth_requestAccounts'){\
				console.log('====eth_requestAccounts==' + data.accounts[0]);\
				window.myFlags[data.callbackid] = true;\
				window.myParams[data.callbackid] = data;\
				if(window.myCallbacks[data.callbackid]){\
					window.myCallbacks[data.callbackid]({'id':1,'jsonrpc': '2.0','result': ['0x407d73d8a49eeb85d32cf465507dd71d507100c1']});\
				}\
			}else if(data.method == 'eth_accounts'){\
				console.log('====eth_accounts==' + data.accounts[0]);\
				window.myFlags[data.callbackid] = true;\
				window.myParams[data.callbackid] = data;\
				if(window.myCallbacks[data.callbackid]){\
					window.myCallbacks[data.callbackid]({'id':1,'jsonrpc': '2.0','result': ['0x407d73d8a49eeb85d32cf465507dd71d507100c1']});\
				}\
			}else if(data.method == 'eth_call'){\
				console.log('====eth_call==' + JSON.stringify(data));\
				window.myFlags[data.callbackid] = true;\
				window.myParams[data.callbackid] = data;\
				if(window.myCallbacks[data.callbackid]){\
					window.myCallbacks[data.callbackid](data.err,data.accounts);\
				}\
			}else if(data.method == 'eth_chainId'){\
				console.log('====eth_chainId==' + JSON.stringify(data));\
				window.myFlags[data.callbackid] = true;\
				window.myParams[data.callbackid] = data;\
				if(window.myCallbacks[data.callbackid]){\
					window.myCallbacks[data.callbackid](data.err,data.chainId);\
				}\
			}else{\
				console.log('====else==' + data);\
				window.myCallbacks[data.callbackid] = null;\
			}\
		};\
		window.onload=function(){\
		     console.log('===222222222=====onload=========');\
			document.addEventListener('UniAppJSBridgeReady', function() {\
				console.log('==UniAppJSBridgeReady==url=====');\
			  uni.webView.getEnv(function(res) {\
				console.log('当前环境：' + JSON.stringify(res));\
			  });\
			});\
		};\
		window.imToken.callAPI = function(apiName, params, callBack){\
			console.log('=callAPI==--1---');\
			let timestamp = (new Date()).valueOf();\
			window.myCallbacks[timestamp] = callBack;\
			console.log('=====0000====' + uni.webView);\
			m_flag = true;\
			params.method = apiName;\
			setTimeout(() => {\
				if(window.UniAppJSBridge){\
					uni.webView.postMessage({\
						data: {method:params.method,callbackid:timestamp,params}\
					});\
				}else{\
					document.addEventListener('UniAppJSBridgeReady', function() {\
						uni.webView.postMessage({\
							data: {method:params.method,callbackid:timestamp,params}\
						});\
					});\
				}\
			}, 100);\
		};\
		window.ethereum.request = function(params, callBack){\
			console.log('==request=--1---' + JSON.stringify(params));\
			if(params == 'eth_chainId' ){\
				return 1;\
			}else if (params.method == 'eth_chainId'){\
				return 1;\
			}else if(params == 'net_version' || params.method == 'net_version'){\
				return 'v2';\
			}else if (params == 'eth_call'){\
				return 1;\
			}else if (params.method == 'eth_call'){\
				return 1;\
			}else if (params.method == 'eth_blockNumber'){\
				return 11998674;\
			}\
			let timestamp = (new Date()).valueOf();\
			if(!callBack){\
				window.myCallbacks[timestamp] = null;\
			}else{\
				window.myCallbacks[timestamp] = callBack;\
			}\
			window.myFlags[timestamp] = false;\
			console.log('===request===params===',params);\
			console.log('===request===params==='+ JSON.stringify(params));\
			console.log('===request===typeof(params)==='+typeof(params));\
			let method = params;\
			if(typeof(params) == 'object'){\
				params.callbackid = timestamp;\
			}else{\
				params = {method:params,callbackid:timestamp,params}\
			}\
			setTimeout(() => {\
				console.log('==request=--2---',method);\
				if(window.UniAppJSBridge){\
					uni.webView.postMessage({\
						data: params\
					});\
				}else{\
					document.addEventListener('UniAppJSBridgeReady', function() {\
						console.log('==request=--3---22222');\
						uni.webView.postMessage({\
							data: params\
						});\
					});\
				}\
			}, 100);\
			console.log('===request====11111111111111111111=====');\
			return new Promise((resolve, reject)=>{\
				let setInterValFunc = setInterval(function(){\
					console.log('====request===2222222222222222==2===' + window.myFlags[timestamp]);\
					if(window.myFlags[timestamp] == true){\
						window.myFlags[timestamp] = false;\
						let params = window.myParams[timestamp];\
						console.log('====request===2222222222222222===3=='+ JSON.stringify(params));\
						clearInterval(setInterValFunc);\
						let data = '';\
						if(params.method == 'eth_requestAccounts'){\
							data = params.accounts;\
						}else if(params.method == 'eth_chainId'){\
							data = params.chainId;\
						}else if(params.method == 'eth_call'){\
							data = params.chainId;\
						}\
						resolve(data);\
					}\
				},1000)\
			})\
		};\
		window.ethereum.send = function(params, callBack){\
			console.log('==send=--2-0--' + JSON.stringify(params));\
			console.log('=send==--1---');\
			if(params == 'eth_chainId' ){\
				return 1;\
			}else if (params.method == 'eth_chainId'){\
				return {chainId:1,listUrl:''};\
			}else if(params == 'net_version' || params.method == 'net_version'){\
				return '1';\
			}else if (params == 'eth_call'){\
				return 1;\
			}\
			let timestamp = (new Date()).valueOf();\
			if(!callBack){\
				window.myCallbacks[timestamp] = null;\
			}else{\
				window.myCallbacks[timestamp] = callBack;\
			}\
			window.myFlags[timestamp] = false;\
			console.log('===send===params==='+params);\
			setTimeout(() => {\
				console.log('==send=--2---');\
				if(window.UniAppJSBridge){\
					uni.webView.postMessage({\
						data: {method:params,callbackid:timestamp,params}\
					});\
				}else{\
					document.addEventListener('UniAppJSBridgeReady', function() {\
						console.log('===send--3---22222');\
						uni.webView.postMessage({\
							data: {method:params,callbackid:timestamp,params}\
						});\
					});\
				}\
			}, 100);\
			console.log('====send===11111111111111111111=====');\
			return new Promise((resolve, reject)=>{\
				let setInterValFunc = setInterval(function(){\
					console.log('===send====2222222222222222==2===' + window.myFlags[timestamp]);\
					if(window.myFlags[timestamp] == true){\
						window.myFlags[timestamp] = false;\
						let params = window.myParams[timestamp];\
						console.log('===send====2222222222222222===3=='+ JSON.stringify(params));\
						clearInterval(setInterValFunc);\
						let data = '';\
						if(params.method == 'eth_requestAccounts'){\
							data = params.accounts;\
						}else if(params.method == 'eth_chainId'){\
							data = params.chainId;\
						}\
						resolve(data);\
					}\
				},1000)\
			})\
		};\
		window.ethereum.sendAsync = function(params, callBack){\
			console.log('==sendAsync=--3--5555-' + JSON.stringify(params));\
			if(params == 'eth_chainId' ){\
				return 1;\
			}else if (params.method == 'eth_chainId'){\
				return 1;\
			}\
		};\
		let count = 0;\
		let runcount = 0;\
		function loadScript(url, callback) {\
			var script = document.createElement('script');\
		    script.type = 'text/javascript';\
			script.async = true;\
		    if (script.readyState) {\
		        script.onreadystatechange = function () {\
		            if (script.readyState == 'loaded' || script.readyState == 'complete') {\
		                script.onreadystatechange = null;\
		                callback();\
		            }\
		        };\
		    } else {\
		        script.onload = function () {\
					count +=1;\
					console.log('==UniAppJSBridgeReady==count=='+ url);\
					setTimeout(() => {\
						console.log('===--2---' + window.UniAppJSBridge);\
						if(window.UniAppJSBridge){\
							uni.webView.postMessage({\
								data: {count:count}\
							});\
						}else{\
							document.addEventListener('UniAppJSBridgeReady', function() {\
								uni.postMessage({\
									data: {count:count}\
								});\
							});\
						}\
					}, 100);\
		        };\
		    }\
		    script.src = url;\
			if(runcount == 0){\
				var s = document.getElementsByTagName('script')[0];\
				s.parentNode.insertBefore(script, s);\
			}else{\
				 document.body.appendChild(script);\
			}\
			runcount += 1;\
		};\
		window.addEventListener('load', async () => {\
			console.log('===addEventListener==onloaded=');\
		});"
		// document.body.appendChild(script);\
		// window.addEventListener('load', async () => {\
		// console.log('===addEventListener==2=');\
		//  if (window.ethereum) {\
		//    window.web3 = new Web3(ethereum);\
		//    try {\
		//   await window.ethereum.request({ method: 'eth_requestAccounts' },function(accounts){\
		// 	  console.log('===accounts='+ accounts);\
		//   });\
		//    } catch (error) {\
		// 	console.log('===err===',error);\
		//    }\
		//  }else if (window.web3) {\
		//    window.web3 = new Web3(web3.currentProvider);\
		//  }\
		// })
		return str;
	}
};

export default WindowJs
