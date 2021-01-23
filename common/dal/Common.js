import Vue from 'vue'
var vue = Vue.prototype

const Common = {
	evtGetNotify: "EVT_evtGetNotify",
	evtGetNotice: "EVT_evtGetNotice",
	evtGetAssetprice: "EVT_evtGetAssetprice",
	evtGetRate:"EVT_evtGetRate",
	evtGetAssetstate:"EVT_evtGetAssetstate",
	init: function() {
		uni.cclog("======Common init==========")
		this.m_AssetpriceList = {};
		this.m_PoolConfig = {};
		this.m_notices = []; 
		this.m_AssetState = [];
		this.m_AssetPriceItems = [];
		this.onAddListener();
		return true;
	},

	destroy: function() {
		this.m_AssetpriceList = {}
		// this.m_PoolConfig = {};
		this.m_AssetState = [];
		this.m_AssetPriceItems = [];
		this.onRemoveListener();
	},

	clear: function() {
		this.m_AssetpriceList = {}
		// this.m_PoolConfig = {};
		this.m_AssetState = [];
		this.m_AssetPriceItems = [];
		uni.cclog("======Common clear==========")
	},

	onAddListener: function() {
		this.onRemoveListener();
		vue.shared.Event.attach(vue.entities.RequestCode.GetAssetprice, this.handleGetAssetprice, "dal_common", this);
		vue.shared.Event.attach(vue.entities.RequestCode.GetNotice, this.handleGetNotice, "dal_common", this);
		vue.shared.Event.attach(vue.entities.RequestCode.GetNotify, this.handleGetNotify, "dal_common", this);
		vue.shared.Event.attach(vue.entities.RequestCode.GetNoticeInfo, this.handleGetNoticeInfo, "dal_common", this);
		vue.shared.Event.attach(vue.entities.RequestCode.GetRate, this.handleGetRate, "dal_common", this);
		vue.shared.Event.attach(vue.entities.RequestCode.GetAssetstate, this.handleGetAssetstate, "dal_common", this);
	},

	onRemoveListener: function() {
		vue.shared.Event.removeByObserverName("dal_common");
	},

	//通知 首页
	onGetNotify: function() {
		var params = {};
		vue.dal.Net.request(vue.entities.RequestCode.GetNotify, params);
	},

	handleGetNotify: function(packetIn) {
		uni.cclog("==========handleGetNotify==========packetIn====", packetIn)
		if (packetIn.pktin.code == 200) {
			vue.util.EventUtils.dispatchEventCustom(this.evtGetNotify, {
				data: packetIn.pktin.data
			});
		}else{
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},

	//通知/公告
	onGetNotice: function(type) {
		var params = {
			type: type + 1
		};
		vue.dal.Net.request(vue.entities.RequestCode.GetNotice, params);
	},

	handleGetNotice: function(packetIn) {
		uni.cclog("==========handleGetNotice==========packetIn====", packetIn)
		if (packetIn.pktin.code == 200) {
			this.m_notices = packetIn.pktin.data;
			vue.util.EventUtils.dispatchEventCustom(this.evtGetNotice);
		}else{
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},
	
	getNoitces:function(){
		return this.m_notices;
	},
	
	getNoitceInfo:function(id){
		console.log("====getNoitceInfo===",id)
		console.log("====this.m_notices===",this.m_notices)
		for(let i = 0; i < this.m_notices.length;i++){
			let item = this.m_notices[i];
		console.log("====getNoitceInfo=item==",item)
			if(item.id == id){
				return item;
			}
		}
		return null;
	},
	//公告详情
	onGetNoticeInfo: function(id) {
		var params = {
			notice_id: id
		};
		vue.dal.Net.request(vue.entities.RequestCode.GetNoticeInfo, params);
	},

	handleGetNoticeInfo: function(packetIn) {
		uni.cclog("==========handleGetNoticeInfo==========packetIn====", packetIn)
		if (packetIn.pktin.code == 200) {
			vue.util.EventUtils.dispatchEventCustom(this.GetNoticeInfo, {
				data: packetIn.pktin.data
			});
		}else{
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},

	//行情
	onGetAssetprice: function() {
		var params = {};
		vue.dal.Net.request(vue.entities.RequestCode.GetAssetprice, params);
	},

	handleGetAssetprice: function(packetIn) {
		uni.cclog("==========handleGetAssetprice==========packetIn====", packetIn)
		if (packetIn.pktin.code == 200) {
			this.m_AssetPriceItems = packetIn.pktin.data;
			vue.util.EventUtils.dispatchEventCustom(this.evtGetAssetprice, {
				data: packetIn.pktin.data
			});
		}else{
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},
	
	getAssetpriceInfo:function(asset){
		if(asset == "filecoin"){
			asset = "fil"
		}
		for(let i = 0; i < this.m_AssetPriceItems.length; i++){
			let item = this.m_AssetPriceItems[i];
			if(item.symbol.toLocaleLowerCase() == asset){
				return item;
			}
		}
		return null;
	},
	
	//配置表
	onGetRate: function() {
		// uni.cclog("==========onGetRate=============")
		var params = {};
		vue.dal.Net.request(vue.entities.RequestCode.GetRate, params);
	},
	
	handleGetRate: function(packetIn) {
		uni.cclog("==========handleGetRate==========packetIn====", packetIn)
		if (packetIn.pktin.code == 200) {
			for(let i = 0; i < packetIn.pktin.data.length; i++){
				let item = packetIn.pktin.data[i];
				this.m_PoolConfig[item.config_key] = item;
			}
			vue.util.EventUtils.dispatchEventCustom(this.evtGetRate);
		}else{
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},
	
	onGetRateInfo:function(key){
		let item = this.m_PoolConfig[key];
		uni.cclog("=======onGetRateInfo=======this.m_PoolConfig====", this.m_PoolConfig)
		uni.cclog("=======onGetRateInfo=======key====", key)
		uni.cclog("=======onGetRateInfo=======key====", key)
		return item;
	},
	
	//全网状态表
	onGetAssetstate: function() {
		uni.cclog("==========onGetAssetstate=============")
		var params = {};
		vue.dal.Net.request(vue.entities.RequestCode.GetAssetstate, params);
	},
	
	handleGetAssetstate: function(packetIn) {
		// uni.cclog("==========handleGetAssetstate==========packetIn====", packetIn)
		if (packetIn.pktin.code == 200) {
			this.m_AssetState = packetIn.pktin.data;
			vue.util.EventUtils.dispatchEventCustom(this.evtGetAssetstate);
		}else{
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},
	
	onGetAssetstateInfo:function(asset){
		// uni.cclog("=======onGetAssetstate=======asset====", asset)
		for(let i = 0; i < this.m_AssetState.length;i++){
			let it = this.m_AssetState[i];
			if(it.asset.toLocaleLowerCase() == asset){
				return it;
			}
		}
		return null;
	}
	//全网算力
	//挖掘盈利能力API
	//http://www.coinwarz.com/v1/api/profitability/?apikey=YOUR_API_KEY&algo=all

	//行情
	//USDT
	// http://www.tokenview.com:8088/coin/marketInfo/usdt
	// "_id": "bitcoin", // 币的全称小写字母
	// "changeUsd1h": "1.05", // 1小时涨跌幅
	// "changeUsd24h": "-11.09085", // 24小时涨跌幅
	// "changeUsd7d": "9.34", // 7天涨跌幅
	// "priceUsd": "6060.27", // 美元价格
	// "priceBtc": "6060.27", // 相对于多少个btc
	// "volumeUsd": "48385853374", // 交易额（美元）
	// "name": "Bitcoin", // 币的全称
	// "erc20Addr": "", // 如果是ETH的代币，这里会是代币地址
	// "marketCapUsd": "110781414314", // 市值（美元）
	// "symbol": "BTC",  // 币价单位符号
	// "rank": "1", // 市值排名
	// "uniqueId": "btc", // 简称小写
	// "circulatingSupply": "18279908.54", // 这个币的流通量
	// "totalUsd": "1.865007689300477E11", // 已弃用
	// "partialObject": false ,// 已弃用

	//行情=====>非小号公共API
	// https://github.com/xiaohao2019/API-docs/blob/master/PublicApi_CN.md
	// "id": "币种代码（唯一主键）",
	// "name": "币种英文名称",
	// "symbol": "币种的简称",
	// "rank": 币种的排名,
	// "logo": "币种的logo（webp格式）",
	// "logo_png": "币种的logo（非webp格式）",
	// "price_usd": 最新价格（单位：美元）,
	// "price_btc": 最新价格（单位：BTC）,
	// "volume_24h_usd": 24h的成交额（单位：美元）,
	// "market_cap_usd": 流通市值（单位：美元）,
	// "available_supply": 流通数量,
	// "total_supply": 总发行量,
	// "max_supply": 最大发行量（最大发行量可能>总发行量，譬如有些币种会主动销毁一部分数量）,
	// "percent_change_1h": 1小时涨跌幅,
	// "percent_change_24h":24小时涨跌幅,
	// "percent_change_7d":7天涨跌幅,
	// "last_updated": 行情更新时间（10位unix时间戳）


	//http://api.tianapi.com/txapi/fxrate/index?key=105988824f19c798a317ee5b60b89e7e&fromcoin=USD&tocoin=CNY&money=1
	//USDT==>RMB 汇率
	//https://market.aliyun.com/products/57000002/cmapi011221.html#sku=yuncode522100006

	//短信服务
	//https://www.aliyun.com/price/product?spm=5176.8911205.0.0.1fc61cbeeqB3oJ#/sms/detail

	//网易易盾 短信验证码 滑动图片认证
	//https://dun.163.com/product/captcha
}

export default Common
