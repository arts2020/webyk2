import Vue from 'vue'
var vue = Vue.prototype

const Wallets = {
	chains : [],
	assets : [],
	
	init:function(){
		this.chains = [
			{chaintype:vue.entities.Metadata.ChainType.ETH ,isgas:true, img:"eth.png", name:'ETH', alias:'Ethereum' ,isaddassets:true},
			{chaintype:vue.entities.Metadata.ChainType.BTC ,isgas:true, img:"btc.png", name:'BTC',alias:'Bitcoin' ,isaddassets:false},
			{chaintype:vue.entities.Metadata.ChainType.TRON ,isgas:false, img:"tron.png", name:'TRON',alias:'TRON',isaddassets:true},
			{chaintype:vue.entities.Metadata.ChainType.Lotus ,isgas:true, img:"fil.png",name:'FIL', alias:'Filecoin',isaddassets:false},
			{chaintype:vue.entities.Metadata.ChainType.EOS ,isgas:false, img:"eos.png",name:'EOS', alias:'Enterprise Operation System',isaddassets:false},
		]
	},
	
	//获得主链基础信息
	getChains:function(){
		return this.chains;
	},
	
	//获得资产基础信息
	getAssets:function(){
		return this.assets;
	}
}
export default Wallets