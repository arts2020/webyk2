const RequestCode = {
	Register: 1, //会员注册接口
	Login: 2, //会员登录
	LogOut: 3, //会员登录
	Forget: 4, //找回密码接口
	GetCaptcha: 5, //获取短信验证码接口

	GetUserInfo: 24, //查询个人信息接口
	ChangePassword: 25, // 修改用户密码接口
	Authentication: 26, // 身份认证接口
	GetAuthentication: 27, //获取身份认证接口
	CapitalPassword: 28, // 设置资金密码接口
	ChangeCapitalPassword: 29, // 修改资金密码接口
	CheckCapitalPassword: 30, //资金密码检测接口

	GetNotice: 80, // 公告 查询接口	
	GetNoticeInfo: 81, //公告详情
	GetNotify: 82, // 通知 查询接口	
	GetSwiperList: 83, //轮播图列表
	
	GetRate: 85, //配置文件
	GetAssetstate: 86, //全网算力
	
	GetAssetprice: 84, //获得币价
	GetSearchcoin:84,//通过关键词搜索币
	AddCollect:84,//添加为自选
}

export default RequestCode
