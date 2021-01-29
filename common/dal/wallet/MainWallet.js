import Vue from 'vue'
var vue = Vue.prototype

//身份钱包
const MainWallet = {
	m_mainWallet: {}, //主钱包
	m_privateKeys: {}, //主链私钥列表
	m_mnemonic: "", //助记词
	
	m_currChainType: vue.entities.ChainType.ETH,//当前钱包
	
	m_chains:[],//主链信息
	
	init: function() {
		uni.cclog("======MainWallet init==========",this.getAssets(vue.entities.Metadata.ChainType.ETH))
		this.onAddListener();
		return true;
	},

	destroy: function() {
		this.onRemoveListener();
		this.clear();
	},

	clear: function() {
		uni.cclog("======MainWallet clear==========")
		this.m_mainWallet = {};
		this.m_mnemonic = "";
	},

	onAddListener: function() {
		this.onRemoveListener();
	},

	onRemoveListener: function() {
		vue.shared.Event.removeByObserverName("dal_mainwallet");
	},

	//===========================身份钱包=================================
	//增加身份钱包
	addMainWallet: function(chaintype, address, privateKey) {
		let item = {
			chain: chaintype,
			address: address,
			privateKey: privateKey
		}
		this.m_mainWallet[chaintype] = item;
	},
	
	//删除身份钱包
	deleteMainWallet:function(chaintype){
		this.m_mainWallet[chaintype] = null;
	},
	
	//获得所有身份钱包
	getMainWallets:function(){
		let items = [];
		for(let key in this.m_mainWallet){
			let item = this.m_mainWallet[key];
			items.push(item);
		}
		return items;
	},
	
	//获得单个身份钱包信息 
	getMainWallet:function(chaintype){
		return this.m_mainWallet[chaintype];
	},
	
	//===========================身份钱包=助记词=私钥=======================
	
	//设置主链助记词
	setMnemonic: function(mne) {
		this.m_mnemonic = mne;
	},

	//设置主链私钥
	setMainPrivate: function(chaintype, privatekey) {
		this.m_privateKeys[chaintype] = privatekey;
	},

	//获取主链助记词
	getMnemonic: function() {
		return this.m_mnemonic;
	},

	//获取主链私钥
	getMainPrivate: function(chaintype) {
		return this.m_privateKeys[chaintype];
	},
	
	//======================切换链钱包=============================
	//设置当前钱包
	setCurrWallet: function(chaintype) {
		let cinfo = this.getChainInfo(chaintype)
		if(cinfo){
			this.m_currChainType = chaintype;
		}else{
			return false;
		}
		return true;
	},
	
}
export default MainWallet
