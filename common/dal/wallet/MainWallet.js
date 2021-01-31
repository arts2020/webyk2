import Vue from 'vue'
var vue = Vue.prototype

//身份钱包
const MainWallet = {
	m_mainWallet: {}, //主钱包
	m_currChainType: 1, //当前钱包
	m_chains: [], //主链信息

	init: function() {
		uni.cclog("======MainWallet init==========")
		this.m_currChainType = vue.entities.Metadata.ChainType.ETH, //当前钱包
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
	},

	onAddListener: function() {
		this.onRemoveListener();
	},

	onRemoveListener: function() {
		vue.shared.Event.removeByObserverName("dal_mainwallet");
	},

	//===========================身份钱包=================================
	//增加身份钱包
	addMainWallet: function(chaintype, wallet) {
		let item = {
			chain: chaintype,
			address: wallet.address,
			privateKey: wallet.privateKey,
			importtype: vue.Metadata.ImportType.WordType,
			password: wallet.password,
			passwordtip: wallet.passwordtip, //密码提示
			name: wallet.name,//钱包名称
		}
		this.m_mainWallet[chaintype] = item;
	},

	//删除身份钱包
	deleteMainWallet: function(chaintype) {
		this.m_mainWallet[chaintype] = null;
	},

	//获得所有身份钱包
	getMainWallets: function() {
		let items = [];
		for (let key in this.m_mainWallet) {
			let item = this.m_mainWallet[key];
			items.push(item);
		}
		return items;
	},

	//获得单个身份钱包信息 
	getMainWallet: function(chaintype) {
		return this.m_mainWallet[chaintype];
	},

	//===========================身份钱包=助记词=私钥=======================

	//设置主链助记词
	setMnemonic: function(mne) {
		this.m_mnemonic = mne;
	},

	//获取主链助记词
	getMnemonic: function() {
		return this.m_mnemonic;
	},

	//获取主链私钥
	getMainPrivate: function(chaintype) {
		let walletInfo = this.getMainWallet(chaintype)
		if (walletInfo) {
			return walletInfo.privateKey;
		}
		return null;
	},

	//私钥是否被身份钱包使用过
	isExistWallet: function(chaintype, privateKey) {
		let isexist = false;
		let items = this.getMainWallet(chaintype);
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			if (item.privateKey == privateKey) {
				isexist = true;
				break;
			}
		}
		return isexist;
	},

	//======================切换链钱包=============================
	//设置当前钱包
	setCurrWallet: function(chaintype) {
		let cinfo = this.getMainWallet(chaintype)
		if (cinfo) {
			this.m_currChainType = chaintype;
		} else {
			return false;
		}
		return true;
	}
}
export default MainWallet
