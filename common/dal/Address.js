import Vue from 'vue'
var vue = Vue.prototype

//地址本
const Address = {
	m_address: [], //地址本存储库
	current_address:{},  //当前正再处理的地址
	
	init: function() {
		uni.cclog("======Address init==========")
		this.onAddListener();
		return true;
	},

	destroy: function() {
		this.onRemoveListener();
		this.clear();
	},

	clear: function() {
		uni.cclog("======Address clear==========")
		this.m_address = [];
	},

	onAddListener: function() {
		this.onRemoveListener();
	},

	onRemoveListener: function() {
		vue.shared.Event.removeByObserverName("dal_address");
	},

	//保存地址，若是传递过来的参数有地址id为修改地址       若是没有则为新增地址
	saveAddress: function(addrInfo) {
		// 判断有没有idx分情况处理
		if(addrInfo.idx){
			//修改   找到并替换该地址对象
		   let index = this.m_address.findIndex(el=>el.idx==addrInfo.idx);
		   this.m_address.splice(index,1,addrInfo);
		}else{
			//新增
			let len = this.m_address.length + 1;
			let item = {
				idx: len,
				chaintype:addrInfo.chaintype,
				name:addrInfo.name,
				username:addrInfo.username,
				address:addrInfo.address,
				bak:addrInfo.bak,
				img:addrInfo.img
			}
			this.m_address.push(item)
		}
	},

	//删除地址
	deleteAddress: function(idx) {
		let index = this.m_address.findIndex(el=>el.idx==idx);
		this.m_address.splice(index,1);
	},

	//获得所有地址
	getAddressList: function() {
		return this.m_address;
	},
    
	//保存临时地址
	saveTempAddress:function(address){
		this.current_address = address;
	},
	//保存临时地址
	getTempAddress:function(){
		return this.current_address;
	}
}

export default Address
