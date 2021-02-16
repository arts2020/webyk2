import Vue from 'vue'
var vue = Vue.prototype

const Wallets = {
	chains : [],
	assets : [],
	
	init:function(){
		this.chains = [
			{chaintype:vue.entities.Metadata.ChainType.ETH , img:"eth.png", name:'ETH', alias:'Ethereum' ,isaddassets:true},
			{chaintype:vue.entities.Metadata.ChainType.BTC , img:"btc.png", name:'BTC',alias:'Bitcoin' ,isaddassets:false},
			{chaintype:vue.entities.Metadata.ChainType.TRON , img:"tron.png", name:'TRON',alias:'TRON',isaddassets:true},
			{chaintype:vue.entities.Metadata.ChainType.Lotus , img:"fil.png",name:'FIL', alias:'Filecoin',isaddassets:false},
			{chaintype:vue.entities.Metadata.ChainType.EOS , img:"eos.png",name:'EOS', alias:'Enterprise Operation System',isaddassets:false},
		]
		
		this.assets = [{
				chaintype:vue.entities.Metadata.ChainType.ETH,
				isgas:true,
				assets:[
					{idx:0 , img:"eth.png", name:'ETH', contract:"",isshow:true},
					{idx:1 , img:"lon.png", name:'LON', contract:"0x0000000000095413afC295d19EDeb1Ad7B71c952",isshow:false},
				 	{idx:2 , img:"tft.png", name:'TFT', contract:"0xe534619defdbf0caf673b8abf7158714f5bd4bd9",isshow:false},
					{idx:3 , img:"wbtc.png", name:'WBTC', contract:"0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",isshow:false},
					{idx:4 , img:"dai.png", name:'DAI', contract:"0x6b175474e89094c44da98b954eedeac495271d0f",isshow:false},
					{idx:5 , img:"usdc.png", name:'USDC', contract:"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",isshow:false},
					{idx:6 , img:"usdt.png", name:'USDT', contract:"0xdac17f958d2ee523a2206206994597c13d831ec7",isshow:false},
					{idx:7 , img:"link.png", name:'LINK', contract:"0x514910771af9ca656af840dff83e8264ecf986ca",isshow:false},
					{idx:8 , img:"yfi.png", name:'YFI', contract:"0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e",isshow:false},
					{idx:9 , img:"uni.png", name:'UNI', contract:"0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",isshow:false}
				]
			},{
				chaintype:vue.entities.Metadata.ChainType.BTC,
				isgas:true,
				assets:[
					{idx:0 , img:"btc.png", name:'BTC', contract:"",isshow:true},
					{idx:1 , img:"usdt.png", name:'USDT', contract:"",isshow:false}
				]
			},{
				chaintype:vue.entities.Metadata.ChainType.TRON,
				isgas:false,
				assets:[
					{idx:0 , img:"trx.png", name:'TRX', contract:"",isshow:true},
					{idx:1 , img:"usdt.png", name:'USDT', contract:"TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",isshow:false},
					{idx:2 , img:"btt.png", name:'BTT', contract:"TKfjV9RNKJJCqPvBtK8L7Knykh7DNWvnYt",isshow:false},
					{idx:3 , img:"win.png", name:'WIN', contract:"TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7",isshow:false},
					{idx:4 , img:"jst.png", name:'JST', contract:"TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9",isshow:false},
					{idx:5 , img:"ht.png", name:'HT', contract:"TDyvndWuvX5xTBwHPYJi7J3Yq8pq8yh62h",isshow:false},
					{idx:5 , img:"wbtt.png", name:'WBTT', contract:"TKfjV9RNKJJCqPvBtK8L7Knykh7DNWvnYt",isshow:false},
					{idx:6 , img:"sun.png", name:'SUN', contract:"TKkeiboTkxXKJpbmVFbv4a8ov5rAfRDMf9",isshow:false},
					{idx:7 , img:"dice.png", name:'DICE', contract:"TKttnV3FSY1iEoAwB4N52WK2DxdV94KpSd",isshow:false},
					{idx:8 , img:"usdj.png", name:'SDJ', contract:"TMwFHYXLJaRUPeW6421aqXL4ZEzPRFGkGT",isshow:false},
					{idx:9 , img:"btc.png", name:'BTC', contract:"TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9",isshow:false},
					{idx:10 , img:"wtrx.png", name:'WTRX', contract:"TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR",isshow:false},
					{idx:11 , img:"live.png", name:'LIVE', contract:"TVgAYofpQku5G4zenXnvxhbZxpzzrk8WVK",isshow:false},
				]
			},{
				chaintype:vue.entities.Metadata.ChainType.Lotus,
				isgas:true,
				assets:[
					{idx:0 , img:"fil.png", name:'FIL', contract:"",isshow:true},
				]
			},{
				chaintype:vue.entities.Metadata.ChainType.EOS,
				isgas:false,
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