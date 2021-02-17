import Vue from 'vue'
var vue = Vue.prototype

const Common = {
	evtGetTransferList: "EVT_evtGetTransferList",

	evtGetAssetPrice: "EVT_evtGetAssetPrice",
	evtGetDefi: "EVT_evtGetDefi",

	evtGetConfig: "EVT_evtGetConfig",
	evtGetCommonConfig: "EVT_evtGetCommonConfig",

	evtGetAssetstate: "EVT_evtGetAssetstate",
	evtGetTokenList: "EVT_evtGetTokenList",
	evtGetTokenDetail: "EVT_evtGetTokenDetail",

	init: function() {
		uni.cclog("======Common init==========")
		this.m_AssetpriceList = {};
		this.m_DefiPriceItems = {};
		this.m_PoolConfig = {};
		this.m_commonConfig = {};
		this.m_notices = [];
		this.m_AssetState = [];
		this.m_AssetPriceItems = [];
		this.onAddListener();
		this.m_tokenList = [];
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
		vue.shared.Event.attach(vue.entities.RequestCode.GetAssetPrice, this.handleGetAssetprice, "dal_common", this);
		vue.shared.Event.attach(vue.entities.RequestCode.GetConfig, this.handleGetConfig, "dal_common", this);

		vue.shared.Event.attach(vue.entities.RequestCode.GetDefi, this.handleGetDefi, "dal_common", this);
		vue.shared.Event.attach(vue.entities.RequestCode.GetCommonConfig, this.handleGetCommonConfig, "dal_common", this);

		vue.shared.Event.attach(vue.entities.RequestCode.Transfer, this.handleTransfer, "dal_common", this);
		vue.shared.Event.attach(vue.entities.RequestCode.GetTransferList, this.handleGetTransferList, "dal_common", this);
		vue.shared.Event.attach(vue.entities.RequestCode.GetTokenList, this.handleGetTokenList, "dal_common", this);
	},

	onRemoveListener: function() {
		vue.shared.Event.removeByObserverName("dal_common");
	},

	//获取市币
	onGetAssetPrice: function() {
		uni.cclog("==========onGetAssetPrice=============")
		var params = {};
		vue.dal.Net.request(vue.entities.RequestCode.GetAssetPrice, params);
	},

	handleGetAssetprice: function(packetIn) {
		uni.cclog("==========handleGetAssetprice==========packetIn====", packetIn)
		if (packetIn.pktin.code == 200) {
			this.m_AssetPriceItems = packetIn.pktin.data;
			vue.util.EventUtils.dispatchEventCustom(this.evtGetAssetPrice, {
				data: packetIn.pktin.data
			});
		} else {
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},

	getAssetPriceInfo: function(asset) {
		for (let i = 0; i < this.m_AssetPriceItems.length; i++) {
			let item = this.m_AssetPriceItems[i];
			if (item.symbol.toLowerCase() == asset.toLowerCase()) {
				return item;
			}
		}
		return null;
	},

	// GetDefi
	onGetDefi: function() {
		uni.cclog("==========onGetAssetPrice=============")
		var params = {};
		vue.dal.Net.request(vue.entities.RequestCode.GetDefi, params);
	},

	handleGetDefi(packetIn) {
		uni.cclog("==========handleGetDefi==========packetIn====", packetIn)
		if (packetIn.pktin.code == 200) {
			this.m_DefiPriceItems = packetIn.pktin.data;
			vue.util.EventUtils.dispatchEventCustom(this.evtGetDefi, {
				data: packetIn.pktin.data
			});
		} else {
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},

	//配置表
	onGetConfig: function() {
		// uni.cclog("==========onGetRate=============")
		var params = {};
		vue.dal.Net.request(vue.entities.RequestCode.GetConfig, params);
	},

	handleGetConfig: function(packetIn) {
		uni.cclog("==========handleGetConfig==========packetIn====", packetIn)
		if (packetIn.pktin.code == 200) {
			for (let i = 0; i < packetIn.pktin.data.length; i++) {
				let item = packetIn.pktin.data[i];
				this.m_PoolConfig[item.config_key] = item;
			}
			vue.util.EventUtils.dispatchEventCustom(this.evtGetConfig);
		} else {
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},

	onGetConfigInfo: function(key) {
		let item = this.m_PoolConfig[key];
		uni.cclog("=======onGetConfigInfo====", item)
		return item;
	},

	onCommonConfig: function() {
		// uni.cclog("==========onGetRate=============")
		var params = {};
		vue.dal.Net.request(vue.entities.RequestCode.GetCommonConfig, params);
	},

	handleGetCommonConfig: function(packetIn) {
		uni.cclog("==========handleCommonConfig==========packetIn====", packetIn)
		if (packetIn.pktin.code == 200) {
			for (let i = 0; i < packetIn.pktin.data.length; i++) {
				let item = packetIn.pktin.data[i];
				this.m_commonConfig[item.config_key] = item;
			}
			vue.util.EventUtils.dispatchEventCustom(this.evtGetCommonConfig);
		} else {
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},

	onGetCommonConfigInfo: function(key) {
		let item = this.m_commonConfig[key];
		uni.cclog("=======this.m_commonConfig=======", this.m_commonConfig)
		uni.cclog("=======onGetCommonConfigInfo=======", item)
		return item;
	},

	handleGetConfig: function(packetIn) {
		uni.cclog("==========handleGetConfig==========packetIn====", packetIn)
		if (packetIn.pktin.code == 200) {
			for (let i = 0; i < packetIn.pktin.data.length; i++) {
				let item = packetIn.pktin.data[i];
				this.m_PoolConfig[item.config_key] = item;
			}
			vue.util.EventUtils.dispatchEventCustom(this.evtGetConfig);
		} else {
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},

	onGetConfigInfo: function(key) {
		let item = this.m_PoolConfig[key];
		uni.cclog("=======onGetConfigInfo=======this.m_PoolConfig====", this.m_PoolConfig)
		uni.cclog("=======onGetConfigInfo=======key====", key)
		uni.cclog("=======onGetConfigInfo=======key====", key)
		return item;
	},

	//转账
	onTransfer: function(contractasset, fromaddress, to, amount, tx, contractaddress) {
		let currWallet = vue.dal.WalletManage.getCurrWallet()
		var params = {
			walletidx: currWallet.idx, //钱包ID
			asset: currWallet.asset, //币种 eth/lotus/btc/eos/tron
			contractaddress: contractaddress, //代币地址
			contractasset: contractasset, //代币 USDT
			fromaddress: fromaddress,
			to: to,
			amount: amount, //金额
			tx: tx, //交易HASH
		};
		vue.dal.Net.request(vue.entities.RequestCode.Transfer, params);
	},

	handleTransfer: function(packetIn) {
		uni.cclog("==========handleTransfer==========packetIn====", packetIn)
		if (packetIn.pktin.code == 200) {
			vue.util.EventUtils.dispatchEventCustom(this.evtGetTransferList);
		} else {
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},

	//交易记录（转账记录）
	onGetTransferList: function(contractaddress) {
		let currWallet = vue.dal.WalletManage.getCurrWallet()
		var params = {
			walletidx: currWallet.idx,
			contractaddress: contractaddress
		};
		vue.dal.Net.request(vue.entities.RequestCode.GetTransferList, params);
	},

	handleGetTransferList: function(packetIn) {
		uni.cclog("==========handleGetTransferList==========packetIn====", packetIn)
		if (packetIn.pktin.code == 200) {
			this.m_userRecords = packetIn.pktin.data.list;
			vue.util.EventUtils.dispatchEventCustom(this.evtGetTransferList);
		} else {
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},

	GetTransferList: function(asset) {
		console.log("==asset=", asset)
		let items = []
		for (let i = 0; i < this.m_userRecords.length; i++) {
			let item = this.m_userRecords[i];
			console.log("==item.asset=", item.asset)
			if (item.asset.toLocaleLowerCase() == asset) {
				if (item.type == 1) {
					item.remark = vue.getLocalStr("title_award") //"挖矿奖励"
				} else if (item.type == 2) {
					item.remark = vue.getLocalStr("btnstring_rechage_coin") //"充币"
				} else if (item.type == 3) {
					item.remark = vue.getLocalStr("btnstring_carry") //"转账"
				} else if (item.type == 4) {
					item.remark = vue.getLocalStr("btnstring_get_coin") //"提币"
				}
				item.unit = item.asset;
				items.push(item);
			}
		}

		function sortFun(a, b) {
			return b.id - a.id;
		}
		return items.sort(sortFun);
	},

	//代币列表接口
	onGetTokenList: function() {
		var params = {};
		vue.dal.Net.request(vue.entities.RequestCode.GetTokenList, params);
	},

	handleGetTokenList: function(packetIn) {
		uni.cclog("==========handleGetTokenList==========packetIn====", packetIn)
		if (packetIn.pktin.code == 200) {
			this.m_tokenList = packetIn.pktin.data;
			console.log('==============================', this.m_userRecords)
			vue.util.EventUtils.dispatchEventCustom(this.evtGetTokenList);
		} else {
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},
	onGetTokenListData: function() {
		console.log(this.m_tokenList)
		return this.m_tokenList;
	},
	//代币明细接口
	onGetTokenDetail: function() {
		var params = {};
		vue.dal.Net.request(vue.entities.RequestCode.GetTokenDetail, params);
	},

	handleGetTokenDetail: function(packetIn) {
		uni.cclog("==========handleGetTokenDetail==========packetIn====", packetIn)
		if (packetIn.pktin.code == 200) {
			vue.util.EventUtils.dispatchEventCustom(this.evtGetTokenDetail, {
				data: packetIn.pktin.data
			});
		} else {
			vue.util.UiUtils.showToast(packetIn.pktin.msg);
		}
		vue.util.UiUtils.hideLoading();
	},

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
