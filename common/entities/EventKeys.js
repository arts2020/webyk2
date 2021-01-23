const EventKeys = {
	APP_HOME_BACK: "APP_HOME_BACK", //从后台返回
	APP_HOME_FORE: "APP_HOME_FORE", //从前台进入后台

	NET_CONNECT_STATE: "NETWORK_CONNECT_STATE", //网络连接状态

	APP_REQUEST_CONFIGINFO: "APP_REQUEST_CONFIGINFO", //请求CONFIG配置文件
	APP_REQUEST_HOSTSINFO: "APP_REQUEST_HOSTSINFO", //请求HOSTS数据
	APP_WINDOW_RESIZE_KEY: "APP_WINDOW_RESIZE_KEY",
	APP_WINDOW_SCROLL_KEY: "APP_WINDOW_SCROLL_KEY", //滑动事件
	APP_KEYBOARD_KEY:"APP_KEYBOARD_KEY",//键盘事件
	APP_PARAMS_KEY: "APP_PARAMS_KEY", //url参数
	APP_REGISTER_KEY: "APP_REGISTER_KEY", //REGISTER
			
	//socket
	SOCKECT_LC_CONNECTTOSERVICE: "SOCKECT_LC_CONNECTTOSERVICE",
	SOCKECT_LC_CLOSECNNECT: 'SOCKECT_LC_CLOSECNNECT',
	SOCKECT_CL_CONNECTERROR: "SOCKECT_CL_CONNECTERROR", //连接服务器状态更新返回

	SOCKECT_CONNECT_SUCCESS: 'SOCKECT_CONNECT_SUCCESS', //连接服务器成功 抛给业务用
	SOCKECT_CONNECT_CLOSE: 'SOCKECT_CONNECT_CLOSE', //连接关闭 抛给业务用

	//Sockectconnectmgr
	SOCKETCONNETMGR_HANDLEVENT_CONNECT: "SOCKETCONNET_HANDLEVENT_CONNECT",
	SOCKETCONNETMGR_HANDLEVENT_CLOSECNNECT: "SOCKETCONNET_HANDLEVENT_CLOSECNNECT",
	SOCKETCONNETMGR_HANDLEVENT_ERROR: "SOCKETCONNET_HANDLEVENT_ERROR",

	//http
	HTTPSERVER_HANDLEVENT_CONNECT: "HTTPSERVER_HANDLEVENT_CONNECT",
	HTTPSERVER_HANDLEVENT_CLOSECNNECT: "HTTPSERVER_HANDLEVENT_CLOSECNNECT",
	HTTP_REQUEST_ERROR: "HTTP_REQUEST_ERROR", //请求返回数据异常
	HTTP_REQUEST_FAILED: "HTTP_REQUEST_FAILED", //请求失败

	UI: {
		Cp_Click_Clear: "Cp_Click_Clear", // 投注界面点击清空
		Cp_Select_Bet_Cell: "Cp_Select_Bet_Cell", // 勾选或者取消勾选某个投注单元
		Cp_Select_Bet_Left_Nav: "Cp_Select_Bet_Left_Nav", // 选中投注界面左边导航栏

		TabBar_Update: "TabBar_Update", // 自定义tabBar刷新（新增或者删除项）
		TabBar_Badge_Update: "TabBar_Badge_Update", // 自定义tabBar更新右上角文本
		TabBar_RedDot_Update: "TabBar_RedDot_Update", // 自定义tabBar更新右上角红点

		DragBall_Show: "DragBall_Show", // 悬浮球显示
		DragBall_Hide: "DragBall_Hide", // 悬浮球隐藏
		DragBall_Click: "DragBall_Click", // 点击悬浮球
		DragBall_Move: "DragBall_Move", // 悬浮球移动

		DragBall_NewMsg: "DragBall_NewMsg", //新信息
	},

	UIELEMENT: {
		BTNEXTENTD_ONCLICK: 'BTNEXTENTD_ONCLICK',
	}

}

export default EventKeys
