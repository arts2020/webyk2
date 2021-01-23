const Metadata = {
	ConnectType: {
		HTTP: 1,
		WEBSOCKET: 2
	},

	PlatForm: {
		ANDROID: 1, //android
		IOS: 2, //iphone
		PC: 3,
		H5: 4,
		H5_IOS: 5,
		H5_ANDROID: 6,
	},
	
	SmsType: {
		XXBG: 63, //信息变更验证码 63 
		XGMM: 64, //修改密码验证码 64  	
		YFYZ: 65, //用户注册验证码 65  
		DLYC: 66, //登录异常验证码 66  
		DLQR: 68, //登录确认验证码 67  
		SFYZ: 68, // 身份验证验证码 68
	},

	// 游戏语言
	GameLanguage: {
		CN: 1, // 简体中文
		TW: 2, // 繁体中文
	},

	PayType: {
		BTC: 1000,
		ETH: 1001,
		FILECOIN: 1002,
		USDT: 1003,
	},

	//表情类型
	ExpressionType: {
		NORMAL: 0, //普通
		VIP: 1 //VIP
	},

	NetType: {
		NET_TYPE_NONE: 0, //网络未连接
		NET_TYPE_NORMAL: 1, //网络正常连接
	},

	//登录方式
	LoginType: {
		LOGIN_TYPE_UNVALID: "",
		LOGIN_TYPE_ACCOUNT: 0,
		LOGIN_TYPE_MOBILE: 1,
	},

	//验证方式
	CheckType: {
		CHECK_TYPE_DEFINE: 0,
		CHECK_TYPE_PHONE: 1
	},

	//交易状态
	ExchangStatusType: {
		Handling: 1, //处理中
		Lost: 2, //提现失败
		Handled: 3, //已处理
		Pay_success: 4 //支付成功
	}
}

export default Metadata
