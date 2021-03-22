import Vue from 'vue'
var vue = Vue.prototype

const Routes = {
	items : [],
	
	init:function(){
		this.items = [
			
			{code:vue.entities.RequestCode.GetDappList , path:"/api/v1/getDappList",method:"POST", islogin:false},
			{code:vue.entities.RequestCode.GetDappDetail , path:"/api/v1/getDappDetail",method:"POST", islogin:false},
			{code:vue.entities.RequestCode.GetConfig , path:"/api/v1/getConfig",method:"POST", islogin:false},
			{code:vue.entities.RequestCode.GetTokenList, path:"/api/v1/getTokenList",method:"POST", islogin:false},
			{code:vue.entities.RequestCode.GetTokenDetail, path:"/api/v1/getTokenDetail",method:"POST", islogin:false},
			
			{code:vue.entities.RequestCode.Transfer , path:"/api/v1/transfer",method:"POST", islogin:false},
			{code:vue.entities.RequestCode.GetTransferList , path:"/api/v1/getTransferList",method:"POST", islogin:false},
			
			{code:vue.entities.RequestCode.GetAssetPrice , path:"/api/v1/web/getAssetPrive",method:"POST", islogin:false},
			{code:vue.entities.RequestCode.GetDefi , path:"/api/v1/web/getDefi",method:"POST", islogin:false},
			{code:vue.entities.RequestCode.GetCommonConfig , path:"/api/v1/web/getConfig",method:"POST", islogin:false},
			
			{code:vue.entities.RequestCode.GetContract , path:"/api/v1/getContract",method:"POST", islogin:false},
			{code:vue.entities.RequestCode.SendTransaction , path:"/api/v1/link/sendTransaction",method:"POST", islogin:false},
			{code:vue.entities.RequestCode.GetBalance , path:"/api/v1/link/getBalance",method:"POST", islogin:false},
			{code:vue.entities.RequestCode.PrivateWallter , path:"/api/v1/link/privateWallter",method:"POST", islogin:false},
			{code:vue.entities.RequestCode.MnemonicWallter , path:"/api/v1/link/mnemonicWallter",method:"POST", islogin:false},
			{code:vue.entities.RequestCode.GetWalletValidateAddress , path:"/api/v1/link/getWalletValidateAddress",method:"POST", islogin:false},
			{code:vue.entities.RequestCode.GetFilGasPrice , path:"/api/v1/link/getGasPrice",method:"POST", islogin:false},
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