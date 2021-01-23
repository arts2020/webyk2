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

	}
}

export default Http
