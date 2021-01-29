import Vue from 'vue'
var vue = Vue.prototype

const Wallets = {
	chains : [],
	assets : [],
	
	init:function(){
		this.chains = [
			{chaintype:vue.entities.Metadata.ChainType.ETH , img:"eth.png", name:'ETH', alias:'Ethereum' , isaddassets:true},
			{chaintype:vue.entities.Metadata.ChainType.BTC , img:"btc.png", name:'BTC',alias:'Bitcoin' , isaddassets:false},
			{chaintype:vue.entities.Metadata.ChainType.TRON , img:"tron.png", name:'TRON',alias:'TRON', isaddassets:false},
			{chaintype:vue.entities.Metadata.ChainType.FIL , img:"fil.png",name:'FIL', alias:'Filecoin', isaddassets:false},
			{chaintype:vue.entities.Metadata.ChainType.EOS , img:"eos.png",name:'EOS', alias:'Enterprise Operation System', isaddassets:false},
		]
		
		this.assets = [{
				chaintype:vue.entities.Metadata.ChainType.ETH,
				assets:[
					{idx:0 , img:"eth.png", name:'ETH', contract:"",isshow:true},
					{idx:1 , img:"lon.png", name:'LON', contract:"",isshow:false},
					{idx:2 , img:"tft.png", name:'TFT', contract:"",isshow:false},
					{idx:3 , img:"wbtc.png", name:'WBTC', contract:"",isshow:false},
					{idx:4 , img:"dai.png", name:'DAI', contract:"",isshow:false},
					{idx:5 , img:"usdc.png", name:'USDC', contract:"",isshow:false},
					{idx:6 , img:"usdt.png", name:'USDT', contract:"",isshow:false},
					{idx:7 , img:"link.png", name:'LINK', contract:"",isshow:false},
					{idx:8 , img:"yfi.png", name:'YFI', contract:"",isshow:false},
					{idx:9 , img:"uni.png", name:'UNI', contract:"",isshow:false}
				]
			},{
				chaintype:vue.entities.Metadata.ChainType.BTC,
				assets:[
					{idx:0 , img:"btc.png", name:'BTC', contract:"",isshow:true},
					{idx:1 , img:"usdt.png", name:'USDT', contract:"",isshow:false}
				]
			},{
				chaintype:vue.entities.Metadata.ChainType.TRON,
				assets:[
					{idx:0 , img:"trx.png", name:'TRX', contract:"",isshow:true},
					{idx:1 , img:"btt.png", name:'BTT', contract:"",isshow:false},
					{idx:2 , img:"win.png", name:'WIN', contract:"",isshow:false},
					{idx:3 , img:"jst.png", name:'HT', contract:"",isshow:false},
					{idx:4 , img:"wbtt.png", name:'WBTT', contract:"",isshow:false},
					{idx:5 , img:"sun.png", name:'SUN', contract:"",isshow:false},
					{idx:6 , img:"dice.png", name:'DICE', contract:"",isshow:false},
					{idx:7 , img:"usdj.png", name:'SDJ', contract:"",isshow:false},
					{idx:8 , img:"btc.png", name:'BTC', contract:"",isshow:false},
					{idx:9 , img:"wtrx.png", name:'WTRX', contract:"",isshow:false},
					{idx:10 , img:"live.png", name:'LIVE', contract:"",isshow:false},
					{idx:11 , img:"peer.png", name:'TOFU10', contract:"",isshow:false},
					{idx:12 , img:"mbox.png", name:'MBOX', contract:"",isshow:false},
					{idx:13 , img:"aave.png", name:'Aave', contract:"",isshow:false},
					{idx:14 , img:"bal.png", name:'BAL', contract:"",isshow:false},
					{idx:15 , img:"wip.png", name:'WIP', contract:"",isshow:false},
					{idx:16 , img:"sdc.png", name:'SDC', contract:"",isshow:false},
					{idx:17 , img:"hdlr.png", name:'HDLR', contract:"",isshow:false},
					{idx:18 , img:"avo.png", name:'AVO', contract:"",isshow:false},
					{idx:19 , img:"inst.png", name:'INST', contract:"",isshow:false},
					{idx:20 , img:"unc.png", name:'UNC', contract:"",isshow:false},
				]
			},{
				chaintype:vue.entities.Metadata.ChainType.FIL,
				assets:[
					{idx:0 , img:"fil.png", name:'FIL', contract:"",isshow:true},
				]
			},{
				chaintype:vue.entities.Metadata.ChainType.EOS,
				assets:[
					{idx:0 , img:"eos.png", name:'EOS', contract:"",isshow:true},
				]
			}
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