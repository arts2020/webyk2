import Vue from 'vue'
var vue = Vue.prototype

const SocketConnectMgr = {
	evtAuthToken: "EVT_AUTH_TOKEN",

	ConnectState: {
		INVALID: -1, //连接未初始化
		COLOSE: 0, //(断开)
		CONNECTION: 1, //正在连接
		CONNECTED: 2, //连接成功
		INSTABLE: 3, //不稳定(弱网络)
	},

	m_roundTime: 2, //轮询时间
	m_connectFailedTime: 6, //建立连接长时间没成功，超时时间
	m_InstableTimeOut: 9, //连接中收不到网络包时，触发网弱网络提示
	m_keepAliveTime: 6, //几秒发一次心跳包:客户端=>服务端 间隔时间		
	m_connectTimeOut: 6 + 10, //长时间收不到数据包=》连接失败时间

	m_isAutoReconnect: false, //断线后，是否重连

	m_closeTime: 0, //未连接计时器
	m_connectionTime: 0, //正在连接计时器
	m_connectedTime: 0, //连接成功计时器
	m_instableTime: 0, //不稳定计时器

	m_isReqClose: false, //人为请求关闭
	m_wss: "", //当前正用的wss
	m_lastReceiveTime: 0, //最后一次收包收时间
	m_sendDataTime: 0, //最后一次发送数据时间
	init: function(connect) {
		uni.cclog("=====SocketConnectMgr=====init====")
		this.m_connectStatus = this.ConnectState.INVALID;
		this.m_connectHandle = connect;
		this.m_wss = ""; //当前正用的wss
		this.m_lastReceiveTime = 0;
		this.addListener();
	},

	destroy: function() {
		this.onRemoveListener();
	},

	clear: function() {
		uni.cclog("=====SocketConnectMgr=====clear====")
		this.closeConnect(null, false, "clear");
		this.deleteTimer();
		this.m_lastReceiveTime = 0;
		this.m_wss = ""; //当前正用的wss
	},

	addListener: function() {
		this.onRemoveListener();
		vue.shared.Event.attach(vue.entities.EventKeys.SOCKECT_LC_CONNECTTOSERVICE, this.handleConnectToService,
			"dal_socketconnectmgr", this);
		vue.shared.Event.attach(vue.entities.EventKeys.SOCKECT_LC_CLOSECNNECT, this.handleConnectClose,
			"dal_socketconnectmgr", this);
		vue.shared.Event.attach(vue.entities.EventKeys.SOCKECT_CL_CONNECTERROR, this.handleConnectError,
			"dal_socketconnectmgr", this);
		vue.shared.Event.attach(vue.entities.RequestCode.SC_KeepAliveCnf, this.handleKeepAlive, "dal_socketconnectmgr",
			this);
		vue.shared.Event.attach(vue.entities.RequestCode.SC_KeepAliveTestCnf, this.handleKeepAliveTest,
			"dal_socketconnectmgr", this);
		vue.shared.Event.attach(vue.entities.EventKeys.APP_HOME_BACK, this.onAppHomeBack, "dal_socketconnectmgr", this);
		vue.shared.Event.attach(vue.entities.EventKeys.APP_HOME_FORE, this.onAppHomeFore, "dal_socketconnectmgr", this);
		vue.shared.Event.attach(vue.entities.RequestCode.AuthTokenCnf, this.handleAuthToken, "dal_socketconnectmgr", this);
		vue.shared.Event.attach(vue.entities.EventKeys.NET_CONNECT_STATE, this.netConnectState, "dal_socketconnectmgr",
			this);
	},

	onRemoveListener: function() {
		vue.shared.Event.removeByObserverName("dal_socketconnectmgr");
	},

	onAppHomeBack: function() {
		uni.cclog("=====onAppHomeBack=====")
	},

	onAppHomeFore: function() {
		uni.cclog("=====onAppHomeFore=====")
	},

	netConnectState: function(state) {
		if (state === vue.entities.Metadata.NetType.NET_TYPE_NORMAL) {
			//风络连接上了
			if (!this.m_isReqClose) { //不是请求关闭 && 自动重连
				uni.cclog("=====netConnectState==3===", this.m_connectStatus)
				this.m_connectStatus = this.ConnectState.COLOSE
				this.m_isAutoReconnect = true;
			}
			vue.shared.Event.trigger(vue.entities.EventKeys.SOCKECT_CONNECT_CLOSE);
		} else {
			//网络断开 触发=》不稳定(弱网络)
			if (this.isConnectState()) {
				this.closeConnect(null, false, "netConnectState-触发网络断开");
			}
		}
	},

	deleteTimer: function() {
		if (this.m_timeTimer) {
			vue.dal.Utils.killTimer(this.m_timeTimer, false);
		}
		this.m_timeTimer = null;
	},

	createTimer: function() {
		uni.cclog("=====createTimer=====")
		if (this.m_timeTimer) {
			vue.dal.Utils.killTimer(this.m_timeTimer, false);
		}
		this.m_timeTimer = vue.dal.Utils.setTimer(this.roundFunc.bind(this), this.m_roundTime, true);
	},

	//最后一次收包时间
	setReceiveTime: function() {
		// uni.cclog("=====setReceiveTime=====")
		this.m_lastReceiveTime = Date.parse(new Date());
	},
	//最后一次发包时间
	setSendDataTime: function() {
		// uni.cclog("=====setSendDataTime=====")
		this.m_sendDataTime = Date.parse(new Date());
	},

	//轮询状态机
	roundFunc: function() {
		// uni.cclog("=====roundFunc===m_closeTime==", this.m_closeTime)
		// uni.cclog("=====roundFunc===m_connectionTime==", this.m_connectionTime)
		// uni.cclog("=====roundFunc===m_connectedTime==", this.m_connectedTime)
		// uni.cclog("=====roundFunc===m_instableTime==", this.m_instableTime)	
		if (vue.dal.Character.isValidLogin() === false) {
			if (this.m_connectStatus !== this.ConnectState.COLOSE) {
				this.closeConnect(null, false, "roundFunc-无效登录");
			}
			return;
		}
		if (this.m_isReqClose) {
			return;
		}
		// uni.cclog("==============this.m_connectStatus===", this.m_connectStatus)
		var currtime = Date.parse(new Date());
		if (this.m_connectStatus === this.ConnectState.COLOSE) { //未连接(断开)		
			this.m_closeTime = this.m_closeTime + 1;
			this.m_connectionTime = this.m_connectFailedTime;
			this.m_connectedTime = 0;
			this.m_instableTime = 0;
			if (this.m_isAutoReconnect) {
				this.m_isAutoReconnect = false;
				this.connectToServer("COLOSE");
			} else {
				uni.cclog("======ConnectState.COLOSE============")
			}
		} else if (this.m_connectStatus === this.ConnectState.CONNECTION) { //正在连接		
			this.m_closeTime = 0;
			this.m_connectedTime = 0;
			this.m_instableTime = 0;
			if (this.m_connectionTime >= this.m_connectFailedTime || this.m_wss.length <= 0) {
				this.m_connectionTime = this.m_connectFailedTime;
				this.connectToServer("CONNECTION");
			}
			this.m_connectionTime = this.m_connectionTime - 1;
			if (this.m_connectionTime <= 0) {
				this.m_connectionTime = this.m_connectFailedTime
			}
		} else if (this.m_connectStatus === this.ConnectState.CONNECTED) { //连接成功		
			this.m_closeTime = 0;
			this.m_connectionTime = this.m_connectFailedTime;
			this.m_connectedTime = this.m_connectedTime + 1;
			this.m_instableTime = 0;

			var rlast = currtime / 1000 - this.m_lastReceiveTime / 1000;
			var slast = currtime / 1000 - this.m_sendDataTime / 1000;
			// uni.cclog("=====rlast===",rlast)
			// uni.cclog("=====slast===", slast)
			if (slast >= this.m_keepAliveTime) { //发保活包
				this.onKeepAliveTest();
			}
			if (rlast >= this.m_InstableTimeOut) { //触发弱网络中
				this.m_connectStatus = this.ConnectState.INSTABLE;
			}
		} else if (this.m_connectStatus === this.ConnectState.INSTABLE) { //不稳定(弱网络中)
			this.m_closeTime = 0;
			this.m_connectionTime = this.m_connectFailedTime;
			this.m_connectedTime = 0;
			this.m_instableTime = this.m_instableTime + 1;

			var rlast = currtime / 1000 - this.m_lastReceiveTime / 1000;
			var slast = currtime / 1000 - this.m_sendDataTime / 1000;
			if (slast >= this.m_keepAliveTime) { //发保活包
				this.onKeepAliveTest();
			}
			if (rlast >= this.m_connectTimeOut) { //连接异常，主动断开,触发自动重连
				this.closeConnect(null, true, "roundFunc-INSTABLE");
			}
		}
	},

	//接到服务端保活包
	handleKeepAlive: function(packetIn) {
		// uni.cclog("=========handleKeepAlive====packetIn====", packetIn)
		// this.onKeepAliveTest();
		if (this.m_connectStatus === this.ConnectState.INSTABLE) {
			this.closeConnect(null, true, "handleKeepAlive-INSTABLE");
			return;
		}
		this.m_connectStatus = this.ConnectState.CONNECTED;
	},

	//客户端发送保活包
	onKeepAliveTest: function() {
		var param = {
			m_nTime: new Date().getTime().toString(),
		}
		// uni.cclog("=========onKeepAliveTest===param=====", param)
		vue.dal.Net.send(vue.entities.RequestCode.CS_KeepAliveTestReq, param);
	},

	//客户端发送保活包响应
	handleKeepAliveTest: function(packetIn) {
		// uni.cclog("=========handleKeepAliveTest===packetIn=====", packetIn)
		//丢弃
		this.m_connectStatus = this.ConnectState.CONNECTED;
	},

	//连接成功
	handleConnectToService: function() {
		uni.cclog("=========onConnectToService========")
		this.m_connectStatus = this.ConnectState.CONNECTED;
		this.setReceiveTime();
		this.setSendDataTime();

		vue.shared.Event.trigger(vue.entities.EventKeys.SOCKECT_CONNECT_SUCCESS);
		//登录认证
		this.AuthToken();
	},

	//关闭连接
	handleConnectClose: function() {
		this.m_connectStatus = this.ConnectState.COLOSE;
		// this.closeConnect(null, true, "handleConnectClose");
		if (!this.m_isReqClose) {
			uni.cclog("=======onConnectClose=====其它关闭==========")
			this.m_isAutoReconnect = true;
			if (this.m_connectStatus === this.ConnectState.COLOSE) {
				this.m_connectionTime = this.m_connectFailedTime;
			}
		} else {
			uni.cclog("=======onConnectClose=====客户端自己请求关闭==========")
			this.m_isAutoReconnect = false;
		}
		vue.shared.Event.trigger(vue.entities.EventKeys.SOCKECT_CONNECT_CLOSE);
	},

	//关闭异常
	handleConnectError: function(reason) {
		uni.cclog("=======onConnectError=====reason=", reason)
		this.m_wss = "";
		this.m_connectStatus = this.ConnectState.COLOSE;
		this.m_isAutoReconnect = true; //异常关闭触发重连
	},

	//连接
	connectToServer: function(from) {
		uni.cclog("=======connetToService======", from)
		this.m_isReqClose = false;
		var self = this;

		function startConnect() {
			// self.m_wss = "ws://192.168.1.101:10003";
			uni.cclog("===this.wss==", self.m_wss)
			self.m_connectStatus = self.ConnectState.CONNECTION;
			if (!self.m_wss || self.m_wss.length <= 0) {
				self.m_wss = vue.PlatformConfig.getWssUrl();
			}
			self.m_connectHandle.ensureConnect(self.m_wss);

			if (!self.m_timeTimer) {
				self.createTimer();
			}
		}

		if (this.m_connectStatus == this.ConnectState.CONNECTED) {
			this.closeConnect(function() {
				startConnect();
			}.bind(this), false, "connectToServer")
		} else {
			startConnect();
		}
	},

	//0.登陆
	AuthToken: function() {
		uni.cclog("=========AuthToken========")
		var logininfo = vue.dal.Account.getLoginInfo();
		var param = {
			token: logininfo.m_sUserToken
		}
		vue.dal.Net.send(vue.entities.RequestCode.AuthTokenReq, param);
	},

	handleAuthToken: function(packetIn) {
		uni.cclog("========handleAuthToken=============", packetIn)
		if (packetIn.pktin.result.m_nResult === 0) {
			vue.shared.Event.trigger(this.evtAuthToken, packetIn.pktin.result);
		} else {
			//登录失败，会重得登录
			this.AuthToken();
		}
	},
	//客户端请求关闭
	reqCloseConnect: function(cb, isautoconnect, from) {
		uni.cclog("====客户端请求关闭==reqCloseConnect==========from=", from)
		this.closeConnect(function() {
			if (cb) {
				cb();
			}
		}, isautoconnect, from, true);
	},

	//关闭
	closeConnect: function(cb, isautoconnect, from, isreqclose) {
		this.m_isReqClose = isreqclose || false;
		uni.cclog("=========closeConnect=======from=", from)
		this.m_connectHandle.close(from, function() {
			this.m_connectStatus = this.ConnectState.COLOSE;
			this.m_isAutoReconnect = isautoconnect;
			if (cb) {
				cb();
			}
			return;
		}.bind(this));
	},

	//当前连接是否连接成功
	isConnectState: function() {
		return this.m_connectStatus === this.ConnectState.CONNECTED;
	}
}

export default SocketConnectMgr
