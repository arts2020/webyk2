import Vue from 'vue'
var vue = Vue.prototype

//身份钱包
const MainWallet = {
	m_mainWallet: {}, //主钱包
	m_mainInfo: {}, //身份信息

	init: function() {
		uni.cclog("======MainWallet init==========")
		let maininfo = vue.util.StringUtils.getUserDefaults("main_info_key");
		if (maininfo && maininfo.length > 0) {
			this.m_mainInfo = JSON.parse(maininfo)
		}
		let wallets = vue.util.StringUtils.getUserDefaults("main_wallets_key");
		if (wallets && wallets.length > 0) {
			this.m_mainWallet = JSON.parse(wallets)
		}
		this.onAddListener();
		return true;
	},

	destroy: function() {
		this.onRemoveListener();
	},

	clear: function() {
		uni.cclog("======MainWallet clear==========")
		this.m_mainWallet = {};
		vue.util.StringUtils.removeUserDefaults("main_info_key");
		vue.util.StringUtils.removeUserDefaults("main_wallets_key");
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
			idx: 0,
			chaintype: chaintype,
			address: wallet.address,
			privateKey: wallet.privateKey,
			importtype: vue.entities.Metadata.ImportType.WordType,
			password: wallet.password,
			passwordtip: wallet.passwordtip, //密码提示
			name: wallet.name, //钱包名称
			money: 0,
		}
		this.m_mainWallet[chaintype] = item;

		vue.util.StringUtils.setUserDefaults("main_wallets_key", JSON.stringify(this.m_mainWallet));
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
	getMainWalletByType: function(chaintype) {
		console.log('=getMainWallet=chaintype==', chaintype)
		let wallet = this.m_mainWallet[chaintype];
		if (wallet) {
			return wallet;
		}
		return null;
	},
	// name: "identity_name",
	// password: this.password,
	// tips: this.pasdTip,
	// words:this.words,
	// importtype:this.Metadata.ImportType.WordType
	setMainInfo: function(mainInfo) {
		let info = {
			name: mainInfo.name,
			password: mainInfo.password,
		}
		this.m_mainInfo = info;
		vue.util.StringUtils.setUserDefaults("main_info_key", JSON.stringify(this.m_mainInfo));
	},

	getMainInfo: function() {
		return this.m_mainInfo;
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
		let walletInfo = this.getMainWalletByType(chaintype)
		if (walletInfo) {
			return walletInfo.privateKey;
		}
		return null;
	},

	//私钥是否被身份钱包使用过
	isExistWallet: function(chaintype, privateKey) {
		let isexist = false;
		let items = this.getMainWalletByType(chaintype);
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			if (item.privateKey == privateKey) {
				isexist = true;
				break;
			}
		}
		return isexist;
	},
}
export default MainWallet
