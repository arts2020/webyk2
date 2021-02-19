import HttpServer from "@/common/dal/net/HttpServer.js"
// import SocketServer from "@/common/dal/net/SocketServer.js"
// import SocketConnectMgr from "@/common/dal/net/SocketConnectMgr.js"

import Vue from 'vue'
var vue = Vue.prototype

import App from 'App'

const Net = {
	host: "",
	count: 0,
	// SocketConnectMgr,
	init: function() {
		this.onAddListener();

		HttpServer.init();
		// SocketServer.init();
		// SocketConnectMgr.init(SocketServer);

		this.host = vue.PlatformInfo.host;
		console.log('vue.PlatformInfo.host',this.host)
		this.count = 0;
		return true;
	},

	destroy: function() {
		this.onRemoveListener();
	},

	onAddListener: function() {
		this.onRemoveListener();
		vue.shared.Event.attach(vue.entities.EventKeys.HTTP_REQUEST_FAILED, this.onRequstFiled, "dal_net", this);
		vue.shared.Event.attach(vue.entities.EventKeys.NET_CONNECT_STATE, this.netConnectState, "dal_net",
			this);
	},

	onRemoveListener: function() {
		vue.shared.Event.removeByObserverName('dal_net');
	},

	clear: function() {
		uni.cclog("======Net clear==========")
		HttpServer.clear();
		// SocketServer.clear();
		// SocketConnectMgr.clear();
	},
	
	clearReqHost:function(){
		this.host = ""; 
	},

	netConnectState: function(state) {
		// uni.cclog("===Net==netConnectState=====", state)
		if (state === vue.entities.Metadata.NetType.NET_TYPE_NONE) {
			vue.util.UiUtils.showToast(vue.getLocalStr('net_err'));
		} else if (state === vue.entities.Metadata.NetType.NET_TYPE_NORMAL) {
			//连接正常
		}
	},

	onRequstFiled: function() {
		
	},

	request: function(code, params,url) {
		// var netstate = vue.util.Utils.getNetState();
		let host = this.host;
		// uni.cclog("===request=====host=======", host)
		if(url){
			host = url;
		}
		if(host || host.length <= 0){
			host = vue.PlatformInfo.host;
		}
		// uni.cclog("===request=====this.host=======", this.host)
		HttpServer.request(code, params, host)
	},
	
	async asyncRequest(code, params,url) {
		// var netstate = vue.util.Utils.getNetState();
		let host = this.host;
		uni.cclog("===request====2=host=======", host)
		if(url){
			host = url;
		}
		if(host || host.length <= 0){
			host = vue.PlatformInfo.host;
		}
		// uni.cclog("===request=====this.host=======", this.host)
		return await HttpServer.asyncRequest(code, params, host)
	},

	connectSocket() {
		uni.cclog("==net=connectSocket=======")
		if (!vue.dal.Character.isValidLogin()) {
			return;
		}
		SocketConnectMgr.connectToServer("connectSocket");
	},

	closeSocket() {
		uni.cclog("==net=closeSocket=======")
		SocketConnectMgr.reqCloseConnect(null, false, "Net-closeSocket");
	},

	send: function(code, data) {
		var netstate = vue.util.Utils.getNetState();
		if (!netstate) {
			uni.cclog("==send===code=======", code)
			if (code !== vue.entities.RequestCode.CS_KeepAliveTestReq) {
				vue.util.UiUtils.showToast(vue.getLocalStr('net_req_err'));
			}
			return;
		}
		if (!vue.dal.Character.isValidLogin()) {
			uni.cclog("==send=需要登录后才能连接==tcpip=======")
			return;
		}
		var isconnect = SocketConnectMgr.isConnectState()
		if (!isconnect) {
			if (code !== vue.entities.RequestCode.CS_KeepAliveTestReq) {
				vue.util.UiUtils.showToast(vue.getLocalStr('net_connecting'));
			}
			return;
		}
		SocketServer.send(code, data)
	}
}

export default Net
