import Vue from 'vue'
var vue = Vue.prototype

const SocketServert = {
	socket_index: Math.round(new Date()), ////精确到毫秒级

	init: function() {
		uni.cclog("-==========SocketServert====init========")
		this._connected = false;
		this._connecting = false;
		this._websocket = undefined;
		this._components = [];
		this._components.push(vue.dal.GroupChat); //群聊天
		this._components.push(vue.dal.Chat); //群聊天
		this.initComps();
		return true;
	},

	initComps: function() {
		// uni.cclog("==initComps==this._components.length=", this._components.length);
		for (var i = 0; i < this._components.length; ++i) {
			var c = this._components[i];
			c.init();
		}
	},

	destroy: function() {
		// uni.cclog("=destroy=this._components.length=", this._components.length);
		for (var i = 0; i < this._components.length; ++i) {
			var c = this._components[i];
			if (c.destroy) {
				c.destroy();
			}
		}
	},

	clear: function() {
		for (var i = 0; i < this._components.length; ++i) {
			var c = this._components[i];
			if (c.clear) {
				c.clear();
			}
		}
	},

	onGetGameInitData: function() {
		// uni.cclog("=========getGameInitData=========");
		//dal.Finance:onReqMoneyCenterUserInfo();
		//dal.Finance:onGetBankCard();
		// dal.Activity.requestActivity();
		// dal.Character.requestselfRewardData();
	},

	_onConnect: function() {
		// uni.cclog("=====_onConnect==========true===");
		for (var i = 0; i < this._components.length; ++i) {
			var c = this._components[i];
			if (c.hasOwnProperty("onConnect")) {
				c.onConnect();
			}
		}
		this._connected = true;
		this._connecting = false;
		vue.shared.Event.trigger(vue.entities.EventKeys.SOCKECT_LC_CONNECTTOSERVICE);
	},

	_onClose: function(reason) {
		// uni.cclog("=====socket===_onClose======", reason);
		this._connected = false;
		this._connecting = false;
		// this._websocket = null;
		for (var i = this._components.length - 1; i >= 0; --i) {
			var c = this._components[i];
			if (c.onClose !== undefined) {
				c.onClose();
			}
		}
		// uni.cclog("===socket==_onClose====", vue.entities.EventKeys.SOCKECT_LC_CLOSECNNECT);
		vue.shared.Event.trigger(vue.entities.EventKeys.SOCKECT_LC_CLOSECNNECT);
	},

	_onError: function(reason) {
		// uni.cclog("======socket====_onError========" + reason);
		this._connecting = false;
		vue.shared.Event.trigger(vue.entities.EventKeys.SOCKECT_CL_CONNECTERROR, reason);
	},

	isConnected: function() {
		// uni.cclog("=====socket===close===isConnected======");
		return this._connected;
	},

	close: function(from, cb) {
		uni.cclog("=====socket===close====" + from + "===this._connected=====" + this._connected);
		if (this._websocket && (this._connected === true || this._connecting === true)) {
			this._connecting = false;
			this._websocket.close(from);
		} else {
			this._connecting = false;
		}
		cb();
	},

	ensureConnect: function(wsurl) {
		this._connecting = true;
		this.socket_index = this.socket_index + 1;
		// if(!this._websocket){
		this._websocket = new vue.shared.WebSocket(this, this.socket_index);
		this._websocket.setEvtHandler({
			obj: this,
			onReceive: this._onReceive,
			onClose: this._onClose,
			onConnect: this._onConnect,
			onError: this._onError
		});
		// }else{
		// this._websocket.close("ensureConnect===index=" + this.socket_index);
		// }
		// uni.cclog("====socket====ensureConnect========wsurl=", wsurl);
		this._websocket.setSocketIndex(this.socket_index);
		this._websocket.connect(wsurl);
	},

	send: function(code, params) {
		if (this._connected) {
			if (!params) {
				params = {};
			}
			var logininfo = vue.dal.Account.getLoginInfo();
			if (!logininfo) {
				uni.cclog("=====登录信息不存在，请重新登录==", code)
				return;
			}
			if (code !== vue.entities.RequestCode.CS_KeepAliveTestReq) {
				params.platform = logininfo.m_nPlatformId;
				params.company = logininfo.m_nCompanyId;
				params.userid = logininfo.m_nUserId.toString();
			}
			var pstr = JSON.stringify(params);

			var head = {}
			head.code = code;
			head.m_nPlatformId = logininfo.m_nPlatformId;
			head.m_nCompanyID = logininfo.m_nCompanyId;
			head.m_nUserID = logininfo.m_nUserId;

			if (code !== vue.entities.RequestCode.CS_KeepAliveTestReq) {
				// uni.cclog("====socket=send====code=", code, "=====pstr==", pstr)
			}

			var pktout = new vue.shared.PacketOut(head);
			pktout.WriteString(pstr);
			this._websocket.send(pktout);

			vue.dal.Net.SocketConnectMgr.setSendDataTime()
		}
	},

	_onReceive: function(pktin) {
		 var tmpindex = pktin.index;
		this._connecting = false;
		pktin = new vue.shared.PacketIn(pktin.data);
		var data = "";
		try {
			if (tmpindex != this.socket_index) {
				uni.cclog('=抛弃数据=old=index===', tmpindex, '==curr.index===', this.socket_index, "===code=", pktin.code)
				return;
			}
			data = pktin.ReadFixedLenString(pktin.m_nLen - pktin.m_nHdrLen);
		} catch (e) {
			uni.cclog('===_onReceive===err===', e)
		}
		var jdata = {};
		if (data.length > 0) {
			try {
				jdata = JSON.parse(data.toString());
			} catch (e) {
				console.warn(e);
				uni.cclog("==异常=pktin.code==", pktin.code)
				return;
			}
		}
		if (pktin.code !== vue.entities.RequestCode.SC_KeepAliveCnf &&
			pktin.code !== vue.entities.RequestCode.SC_KeepAliveTestCnf) {
			if (jdata.result.m_nResult === 10) { //"TOKEN失效",
				vue.util.UiUtils.hideLoading();
				uni.showModal({
					title: vue.getLocalStr("tip_title"),
					content: vue.getLocalStr("login_err"),
					confirmText: vue.getLocalStr("btnstring_confirm"),
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							vue.dal.Net.clear();
							vue.util.UiUtils.switchToPage("login", "_onReceive_socket", {}, "reLaunch");
						}
					}.bind(vue)
				});
				return;
			} else if (jdata.result.m_nResult === 9) { //SYS_ERR_9: "TOKEN不对，请重新登陆",
				vue.dal.Net.clear();
				return;
			}
			// uni.cclog("====socket=onReceive====code=", pktin.code, "=====data=", data);
		}

		vue.dal.Net.SocketConnectMgr.setReceiveTime();
		if (this._websocket) {
			vue.shared.Event.trigger(pktin.code, {
				pktin: jdata
			});
		}
	}
};
export default SocketServert
