import Vue from 'vue'
var vue = Vue.prototype

var WebSocket = function(target, index) {
	this._connected = false;
	this._connecting = false;
	this._sock = null;
	this._pos = 0;
	this._buffer = null;
	this._socket_index = index;
	this._target = target;
	this._evtHandler = {
		obj: undefined,
		onReceive: undefined,
		onClose: undefined,
		onConnect: undefined,
		onError: undefined
	}
};

WebSocket.prototype.setSocketIndex = function(index) {
	this._socket_index = index;
};

WebSocket.prototype.setEvtHandler = function(param) {
	this._evtHandler.obj = param.obj || null;
	this._evtHandler.onReceive = param.onReceive || function() {};
	this._evtHandler.onConnect = param.onConnect || function() {};
	this._evtHandler.onClose = param.onClose || function() {};
	this._evtHandler.onError = param.onError || function() {};
};

WebSocket.prototype.close = function(from) {
	uni.cclog("========close=======2122222=========", from);
	// if (this._connected) {
	// vue.dal.Logger.write("===socket===主动请求连接断开==from=" + from, vue.entities.LogType.SOCKETCONNETREQCLOSE);
	var self = this;
	// uni.closeSocket({
	// 	success: (res) => {
	// 		// self._connected = false;
	// 		uni.cclog("========close=======success=========", res);
	// 	},
	// 	fail: (res) => {
	// 		uni.cclog("========close=======fail=========", res);
	// 	},
	// 	complete: (res) => {
	// 		uni.cclog("==33==this._sock=", this._sock);
	// 		uni.cclog("========close=======complete=========", res);
	// 	}
	// })
	uni.cclog("==========this._sock================", this._sock);
	if (this._sock) {
		this._sock.close({
			success(res) {
				self._connected = false;
				uni.cclog("关闭成功", res);
			},
			fail(err) {
				uni.cclog("关闭失败", err)
			}
		})
	}
	// }
};

WebSocket.prototype.connect = function(wss) {
	uni.cclog("==========connect===t11111================", this._connected);
	if (this._connected === true) {
		return;
	}
	this._connecting = true;
	uni.cclog("====wss=", wss);

	this._sock = uni.connectSocket({
		url: wss,
		success(data) {
			uni.cclog("websocket连接成功");
		},
		complete: (res) => {
			uni.cclog("====连接完成==等待连接打开=====")
		}
	});

	//WebSocket连接已打开
	this._sock.onOpen(function(res) { //连接成功
		this._connected = true;
		this._connecting = false;
		uni.cclog("WebSocket连接已打开！");
		if (this._evtHandler && this._evtHandler.onConnect) {
			this._evtHandler.onConnect.call(this._evtHandler.obj);
		}
	}.bind(this));

	this._sock.onError(function(res) { //连接失败
		// uni.cclog("WebSocket 连接打开失败！==index=", this._target.socket_index);
		vue.dal.Logger.write("=WebSocket 连接打开失败！===" + res, vue.entities.LogType
			.SOCKETCONNETFAIL);
		if (this._connecting === false) {
			if (this._evtHandler && this._evtHandler.onError) {
				this._evtHandler.onError.call(this._evtHandler.obj, "connect fail");
			}
		} else {
			uni.cclog("WebSocket 连接打开失败！==连接中抛掉此次事件=", this._target.socket_index);
		}
		this._connected = false;
		this._connecting = false;

	}.bind(this));

	this._sock.onClose(function(res, data) { //连接断开
		// uni.cclog("WebSocket 已关闭！==index=", this._target.socket_index);
		vue.dal.Logger.write("=WebSocket 连接断开！====" + wss, vue.entities.LogType.SOCKETCONNETCLOSE);

		uni.cclog("=====this._target.socket_index==", this._target.socket_index, "==index=", this._socket_index)
		if (this._target.socket_index === this._socket_index) {
			this._connecting = false;
			// this._sock = null;
			if (this._evtHandler && this._evtHandler.onClose && this._connected === true) {
				this._connected = false;
				uni.cclog("=====onSocketClose====11111==")
				this._evtHandler.onClose.call(this._evtHandler.obj, "==连接断开==");
			} else {
				this._connected = false;
				vue.dal.Logger.write("WebSocket 连接断开！=未成功连接=抛掉此次事件=", vue.entities.LogType.SOCKETCONNETCLOSE);
			}
		}

	}.bind(this));

	this.isok = false;
	this._sock.onMessage(function(res) { //接收到消息
		var slen = res.data.byteLength;
		if (!this._buffer && this.isok === false) {
			this.isok = true;
			var dw = new DataView(res.data);
			this._nlen = dw.getInt32(1, true); //整包长
			this._buffer = new Int8Array(this._nlen);
		}
		var arry = new Int8Array(res.data);
		for (var i = 0; i < slen; i++) {
			this._buffer[this._pos + i] = arry[i];
		}

		this._pos = this._pos + slen;
		if (this._pos === this._nlen) {
			if (this._evtHandler && this._evtHandler.onReceive) {
				var buf = new ArrayBuffer(this._nlen);
				var tmp = new Int8Array(buf);
				for (var i = 0; i < this._buffer.length; i++) {
					tmp[i] = this._buffer[i];
				}
				this._pos = 0;
				this._nlen = 0;
				this._buffer = null;
				this.isok = false;
				this._evtHandler.onReceive.call(this._evtHandler.obj, {
					data: buf,
					index: this._socket_index
				});
			}
		}
	}.bind(this))
};

WebSocket.prototype.send = function(pktout) {
	if (!this._connected) {
		return;
	}
	try {
		if (pktout) {
			pktout.WriteHead(true);
			this._sock.send({
				data: pktout.getBuffer(),
				index: this._socket_index
			});
		} else {
			uni.cclog("======发送包异常====pktout=", pktout);
		}
	} catch (e) {
		uni.cclog("======网络断开，发送异常====e=", e);
	}
};
export default WebSocket
