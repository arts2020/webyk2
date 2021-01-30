import Vue from 'vue'
var vue = Vue.prototype

const Wallter = {
	
	evtGetWalletList:"EVT_evtGetWalletList",
	evtCreateWallet:"EVT_evtCreateWallet",
	evtGetMnemonic:"EVT_evtGetMnemonic",
	evtCreateStatus:"EVT_evtCreateStatus",
	evtRecoverWallet:"EVT_RecoverWallet",
	evtRecoverStatus:"EVT_RecoverStatus",
	
	init: function() {
		this.m_WalletListInfo = {};
		this.m_MnemonicInfo={};
		this.onAddListener();
		return true;
	},
	destroy: function() {
		this.m_WalletListInfo = {};
		this.m_MnemonicInfo=[];
		this.onRemoveListener();
	},
	
	clear: function() {
		this.m_MnemonicInfo={};
		this.m_WalletListInfo = {}
	},
	
	onAddListener: function() {
		this.onRemoveListener();
		vue.shared.Event.attach(vue.entities.RequestCode.GetWalletList, this.handleGetWalletList, "dal_wallter", this);
		vue.shared.Event.attach(vue.entities.RequestCode.CreateWallet, this.handleCreateWallet, "dal_wallter", this);
		vue.shared.Event.attach(vue.entities.RequestCode.GetMnemonic, this.handleGetMnemonic, "dal_wallter", this);
	    vue.shared.Event.attach(vue.entities.RequestCode.CreateStatus, this.handleCreateStatus, "dal_wallter", this);
	    vue.shared.Event.attach(vue.entities.RequestCode.RecoverWallet, this.handleRecoverWallet, "dal_wallter", this);
		vue.shared.Event.attach(vue.entities.RequestCode.RecoverStatus, this.handleRecoverStatus, "dal_wallter", this);
	},
	
	onRemoveListener: function() {
		vue.shared.Event.removeByObserverName("dal_wallter");
	},
	//恢复身份
	onRecoverStatus(arg){
		var params = {
			
		};
		vue.dal.Net.request(vue.entities.RequestCode.RecoverStatus, params);
	},
	handleRecoverStatus(packetIn){
		if (packetIn.pktin.code == 200) {
			vue.util.EventUtils.dispatchEventCustom(this.evtRecoverStatus, {
				data: packetIn.pktin.data
			});
		}else{
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},
	//导入钱包
	onRecoverWallet(arg){
		var params = {
			
		};
		vue.dal.Net.request(vue.entities.RequestCode.RecoverWallet, params);
	},
	handleRecoverWallet(packetIn){
		if (packetIn.pktin.code == 200) {
			vue.util.EventUtils.dispatchEventCustom(this.evtRecoverWallet, {
				data: packetIn.pktin.data
			});
		}else{
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},
	//获取助记词
	onGetMnemonic(){
		vue.dal.Net.request(vue.entities.RequestCode.GetMnemonic);
	},
	handleGetMnemonic(packetIn){
		if (packetIn.pktin.code == 200) {
			this.m_MnemonicInfo = packetIn.pktin.data;
			vue.util.EventUtils.dispatchEventCustom(this.evtGetMnemonic, {
				data: packetIn.pktin.data
			});
		}else{
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},
	//创建身份
	onCreateStatus(arg){
		var params = {
			
		};
		vue.dal.Net.request(vue.entities.RequestCode.CreateStatus, params);
	},
	handleCreateStatus(packetIn){
		if (packetIn.pktin.code == 200) {
			vue.util.EventUtils.dispatchEventCustom(this.evtCreateStatus, {
				data: packetIn.pktin.data
			});
		}else{
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},
	//创建钱包
	onCreateWallet(arg){
		var params = {
			
		};
		vue.dal.Net.request(vue.entities.RequestCode.CreateWallet, params);
	},
	handleCreateWallet(packetIn){
		if (packetIn.pktin.code == 200) {
			vue.util.EventUtils.dispatchEventCustom(this.evtCreateWallet, {
				data: packetIn.pktin.data
			});
		}else{
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},
	// 获取钱包列表
	onGetWalletL(){
		var params = {
			
		};
		vue.dal.Net.request(vue.entities.RequestCode.GetWalletList, params);
	},
	handleGetWalletList(packetIn){
		if (packetIn.pktin.code == 200) {
			this.m_WalletListInfo = packetIn.pktin.data;
			vue.util.EventUtils.dispatchEventCustom(this.evtGetWalletList, {
				data: packetIn.pktin.data
			});
		}else{
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},
}
export default Wallter