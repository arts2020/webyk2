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
			{code:vue.entities.RequestCode.GetUserInfo , path:"/api/v1/getUserInfo",method:"POST", islogin:false},// 5, //查询个人信息接口
			{code:vue.entities.RequestCode.ChangePassword , path:"/api/v1/changePassword",method:"POST", islogin:false},//6,// 修改用户密码接口
			{code:vue.entities.RequestCode.Authentication , path:"/api/v1/authentication",method:"POST", islogin:false},//7,// 身份认证接口
			{code:vue.entities.RequestCode.CapitalPassword , path:"/api/v1/capitalPassword",method:"POST", islogin:false},//10,// 设置资金密码接口
			{code:vue.entities.RequestCode.ChangeCapitalPassword , path:"/api/v1/changeCapitalPassword",method:"POST", islogin:false},//11,// 修改资金密码接口
			{code:vue.entities.RequestCode.CheckCapitalPassword , path:"/api/v1/checkCapitalPassword",method:"POST", islogin:false},//11,// 修改资金密码接口
				
			{code:vue.entities.RequestCode.GetNotify , path:"/api/v1/getNotify",method:"POST", islogin:false},//80,// 公告查询接口	
			{code:vue.entities.RequestCode.GetNotice , path:"/api/v1/getNotice",method:"POST", islogin:false},//80,// 公告查询接口	
			{code:vue.entities.RequestCode.GetNoticeInfo , path:"/api/v1/getNoticeInfo",method:"POST", islogin:false},//80,// 公告查询接口	
			
			{code:vue.entities.RequestCode.GetSwiperList , path:"/api/v1/getSwiperList",method:"POST", islogin:false},//81,//轮播图列表
			{code:vue.entities.RequestCode.GetAssetprice , path:"/api/v1/getAssetprice",method:"POST", islogin:false},//82,//获得币价
			{code:vue.entities.RequestCode.GetRate , path:"/api/v1/getRate",method:"POST", islogin:false},
			{code:vue.entities.RequestCode.GetAssetstate , path:"/api/v1/getAssetstate",method:"POST", islogin:false},
			
			{code:vue.entities.RequestCode.SendTransaction , path:"/api/v1/link/sendTransaction",method:"POST", islogin:false},
			{code:vue.entities.RequestCode.GetBalance , path:"/api/v1/link/getBalance",method:"POST", islogin:false},
			{code:vue.entities.RequestCode.PrivateWallter , path:"/api/v1/link/privateWallter",method:"POST", islogin:false},
			{code:vue.entities.RequestCode.MnemonicWallter , path:"/api/v1/link/mnemonicWallter",method:"POST", islogin:false},
			{code:vue.entities.RequestCode.GetWalletValidateAddress , path:"/api/v1/link/getWalletValidateAddress",method:"POST", islogin:false},
		    {code:vue.entities.RequestCode.GetDappList , path:"/api/v1/getDappList",method:"POST", islogin:false,host:"http://119.8.55.19"},
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