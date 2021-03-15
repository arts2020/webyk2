import Vue from 'vue'
var vue = Vue.prototype

const Http = {
	init: function() {
		this._connected = false;
		this._request = null;
		this._pos = 0;
		this._buffer = null;

		this._evtHandler = {
			obj: undefined,
			onReceive: undefined,
			onClose: undefined,
			onError: undefined,
			onFailed: undefined,
		};
	},

	setEvtHandler: function(param) {
		this.init();

		this._evtHandler.obj = param.obj || null;
		this._evtHandler.onReceive = param.onReceive || function() {};
		this._evtHandler.onClose = param.onClose || function() {};
		this._evtHandler.onError = param.onError || function() {};
		this._evtHandler.onFailed = param.onFailed || function() {};

	},

	close: function(code) {
		uni.cclog("=====http===close========code=", code);
		vue.dal.Logger.write("===http==请求连接断开==from=" + code, vue.entities.LogType.HTTPCLOSEREQUEST);
		if (this._request) {
			this._request.abort(); //中断请求任务
		}
	},

	//method GET POST
	request: function(url, method, hdata, code) {
		// uni.cclog("===http======url=========", url);
		// uni.cclog("===http======hdata=========", hdata);
		this._request = uni.request({
			url: url,
			method,
			dataType: 'json',
			data: hdata,
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.statusCode === 200) {
					// console.log("==res.data=",res)
					res.data.act = code;
					this._evtHandler.onReceive(res.data)
				} else {
					//失败
					if (code !== vue.entities.RequestCode.Logger) {
						uni.cclog("======_evtHandler.onError====res=", res)
						this._evtHandler.onError("error")
						vue.dal.Logger.write("=2=http请求数据包失败==statusCode=" + res.statusCode + "===url=" + url + "==hdata=" + hdata,
							vue.entities.LogType
							.HttpDataError);
					}
				}
			},
			fail: (res) => {
				if (code !== vue.entities.RequestCode.Logger) {
					this._evtHandler.onFailed(res.errMsg)
					console.log('==res.errMsg==',res.errMsg)
				}
			},
			complete: (res) => {
				// uni.cclog("==request=complete====",res)
			}
		});
	},
	
	async asyncRequest(url, method, hdata, code) {
		// console.log("====const===HttpUtils==request======", method)
		// console.log("====const===HttpUtils==url======", url)
		return new Promise(function(resolve, reject) {
			// console.log("====const===HttpUtils==request====1==")
			var headers = {
				'Authorization':"Basic MW0wN1BhUkhnYWdONE5yWGdvTkFRcHdia0g5OmEzYjFkMWY0NGFkYmM3ZGFmNzMzY2FhZWVkODRjZDU5",
				'Content-Type': 'application/json;',
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
				// 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:70.0) Gecko/20100101 Firefox/70.0'
			}
			if (method == "GET") {
				headers = {
					'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:70.0) Gecko/20100101 Firefox/70.0'
				}
			}
			if(url.indexOf("9092") < 0){
				headers = null
			}
			// console.log("====const===HttpUtils==request====headers==",headers)
			uni.request({
				url: url,
				method: method,		
				dataType: 'json',
				data: hdata,
				header: headers,
				success: (res) => {
					console.log("====1===HttpUtils==complete======", res)
					resolve(res.data)
				},
				fail: (err) => {
					console.log("====2===HttpUtils==err======", err)
					reject(err)
				},
				complete: (res) => {
					console.log("====3===HttpUtils==complete======", res)
				}
			});
		})
		// console.log("====const===HttpUtils==request==333====", url)
	}
}

export default Http
