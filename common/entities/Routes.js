import Vue from 'vue'
var vue = Vue.prototype

const Routes = {
	items : [],
	
	init:function(){
		this.items = [
			{code:vue.entities.RequestCode.Register , path:"/api/v1/register",method:"POST", islogin:false},// 1, //会员注册接口
			{code:vue.entities.RequestCode.Login , path:"/api/v1/login",method:"POST", islogin:false},// 2, //会员登录
			{code:vue.entities.RequestCode.LogOut , path:"/api/v1/logout",method:"POST", islogin:false},// 2, //会员登录
			{code:vue.entities.RequestCode.Forget , path:"/api/v1/forget",method:"POST", islogin:false},// 3, //找回密码接口
			{code:vue.entities.RequestCode.GetCaptcha , path:"/api/v1/getCaptcha",method:"POST", islogin:false},// 4, //获取短信验证码接口
			{code:vue.entities.RequestCode.GetUserInfo , path:"/api/v1/getUserInfo",method:"POST", islogin:true},// 5, //查询个人信息接口
			{code:vue.entities.RequestCode.ChangePassword , path:"/api/v1/changePassword",method:"POST", islogin:true},//6,// 修改用户密码接口
			{code:vue.entities.RequestCode.Authentication , path:"/api/v1/authentication",method:"POST", islogin:true},//7,// 身份认证接口
			{code:vue.entities.RequestCode.CapitalPassword , path:"/api/v1/capitalPassword",method:"POST", islogin:true},//10,// 设置资金密码接口
			{code:vue.entities.RequestCode.ChangeCapitalPassword , path:"/api/v1/changeCapitalPassword",method:"POST", islogin:true},//11,// 修改资金密码接口
			{code:vue.entities.RequestCode.CheckCapitalPassword , path:"/api/v1/checkCapitalPassword",method:"POST", islogin:true},//11,// 修改资金密码接口
				
			{code:vue.entities.RequestCode.GetNotify , path:"/api/v1/getNotify",method:"POST", islogin:true},//80,// 公告查询接口	
			{code:vue.entities.RequestCode.GetNotice , path:"/api/v1/getNotice",method:"POST", islogin:true},//80,// 公告查询接口	
			{code:vue.entities.RequestCode.GetNoticeInfo , path:"/api/v1/getNoticeInfo",method:"POST", islogin:true},//80,// 公告查询接口	
			
			{code:vue.entities.RequestCode.GetSwiperList , path:"/api/v1/getSwiperList",method:"POST", islogin:true},//81,//轮播图列表
			{code:vue.entities.RequestCode.GetAssetprice , path:"/api/v1/getAssetprice",method:"POST", islogin:true},//82,//获得币价
			{code:vue.entities.RequestCode.GetRate , path:"/api/v1/getRate",method:"POST", islogin:false},
			{code:vue.entities.RequestCode.GetAssetstate , path:"/api/v1/getAssetstate",method:"POST", islogin:true},
			// 这里以下的path路径未改
		]
	},
	getRoute:function(code){
		for(var i = 0;i < this.items.length;i++){
			var item = this.items[i];
			if(item.code == code){
				return item;
			}
		}
		uni.cclog("=没定义===code===",code)
		return null;
	}
}

export default Routes