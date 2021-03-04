// import '../../shared/commands'

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
					console.log("====uni.webview=file===",file)
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

	//IMTOKEN注入
	getImTokenInjectionStr: function() {
		let address = vue.util.StringUtils.getUserDefaults("imtoken_account_address_key");
		if (address && address.length > 0) {
			address = "'" + address + "'"
		} else {
			address = "0x9CaCdC05cD8CE97d13d76CF1939E1c8c9e785508";
		}
		console.log("==address=",address)
		let str =
			"window.ethereum={};\
		window.ethereum.isMetaMask=true;\
		window.ethereum.isImToken=true;\
		window.ethereum.enable = function(){\
			return '" + address +"';\
		};\
		window.myCallbacks = {};\
		window.imToken= {};\
		window.MetaMask = {};\
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
		window.onload=function(){\
		    console.log('===222222222=====onload=========');\
			document.addEventListener('UniAppJSBridgeReady', function() {\
				console.log('==UniAppJSBridgeReady==url=====',url);\
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
			params.method = apiName;\
			setTimeout(() => {\
				if(window.UniAppJSBridge){\
					uni.webView.postMessage({\
						data: {callbackid:timestamp,params}\
					});\
				}else{\
					document.addEventListener('UniAppJSBridgeReady', function() {\
						uni.webView.postMessage({\
							data: {callbackid:timestamp,params}\
						});\
					});\
				}\
			}, 100);\
		};\
		window.ethereum.request = function(params, callBack){\
			console.log('===--1---');\
			let timestamp = (new Date()).valueOf();\
			window.myCallbacks[timestamp] = callBack;\
			console.log('params'+params.method);\
			setTimeout(() => {\
				console.log('===--2---' + window.UniAppJSBridge);\
				if(window.UniAppJSBridge){\
					uni.webView.postMessage({\
						data: {callbackid:timestamp,params}\
					});\
				}else{\
					document.addEventListener('UniAppJSBridgeReady', function() {\
						console.log('===--3---22222');\
						uni.postMessage({\
							data: {callbackid:timestamp,params}\
						});\
					});\
				}\
			}, 100);\
		};\
		window.ethereum.send = function(params, callBack){\
			console.log('===--2-0--' + params);\
			let timestamp = (new Date()).valueOf();\
			window.myCallbacks[timestamp] = callBack;\
			console.log('params'+params.method);\
			setTimeout(() => {\
				console.log('===--3---' , window.UniAppJSBridge);\
				if(window.UniAppJSBridge){\
				console.log('===--5---');\
					uni.webView.postMessage({\
						data: {callbackid:timestamp,params}\
					});\
				}else{\
					document.addEventListener('UniAppJSBridgeReady', function() {\
						console.log('===--4---22222');\
						uni.postMessage({\
							data: {callbackid:timestamp,params}\
						});\
					});\
				}\
			}, 100);\
		};\
		window.ethereum.sendAsync = function(params, callBack){\
			console.log('===--3--5555-');\
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
		};"
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
