
const LogType = {
	Error: 1, // 通用错误
	Common: 2, // 通用日志

	ServerError: 4, // 服务器异常提示
	ProErroeCode:5,//协议号提示
	
	HTTPREQUESTFAIL:10,//http请求失败
	HttpDataError: 11, // http返回数据异常
	HTTPCLOSEREQUEST:12,//请求http断开
	HTMLERROR: 13,//index.html被拦截
	SOCKETOVERTIME: 14,//socket超时
	SOCKETCONNETFAIL : 15, //socket连接失败
	SOCKETCONNETCLOSE : 16, //socket连接断开
	SOCKETCONNETREQCLOSE : 17, //请求socket连接断开
	SWITCH_FOREGROUND:18,//从后台切回到游戏
	CONNECTTIMEOUT:19,//连接超时提示

	HorseTooMany: 30, //跑马灯积压
	JSONERROR:40,//json解析异常
}
export default LogType
