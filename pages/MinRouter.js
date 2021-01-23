import Vue from 'vue'
var vue = Vue.prototype

const toString = Object.prototype.toString

const noNeedLoginUrl = [
	'register-register',
	'login-login',
	'safe-pwd-back',
	'agreement-page',
	'hide-page',
];

const refreshToHome = [
	"HistoryOpen",
	"LongTrend",
	"RichTextPage",
	"PrivateChat",
];

function isObject(value) {
	return toString.call(value) === '[object Object]'
}

function isString(value) {
	return toString.call(value) === '[object String]'
}

function isDefault(value) {
	return value === void 0
}

function isSwitchToHome(path) {
	var iscan = false;
	this.$minRouter.forEach(item => {
		if (item.path === path) {
			for (var i = 0; i < refreshToHome.length; i++) {
				var val = refreshToHome[i];
				if (val.toLocaleLowerCase() === item.name.toLocaleLowerCase()) {
					iscan = true;
					break;
				}
			}
		}
	})
	return iscan;
}

function isNeedLogin(path) {
	this.cclog("===path=", path)
	var iscan = true;
	this.$minRouter.forEach(item => {
		if (item.path === path) {
			for (var i = 0; i < noNeedLoginUrl.length; i++) {
				var val = noNeedLoginUrl[i];
				if (val.toLocaleLowerCase() === item.name.toLocaleLowerCase()) {
					iscan = false;
					break;
				}
			}
		}
	})
	return iscan;
}

var preReqUrlName = "";

function openPage(args) {
	let name, query = {},
		gotype,
		queryStr = null,
		path, type, delta, isName = false

	switch (true) {
		case isObject(args):
			({
				name,
				query = {},
				delta, //当 type 为 'navigateBack' 时有效，表示回退的层数
				gotype //'navigateTo', 'switchTab', 'reLaunch', 'redirectTo','navigateBack'
			} = args)
			break
		case isString(args):
			name = args
			break
		default:
			throw new Error('参数必须是对象或者字符串')
	}
	var reqname = name;

	var ishave = false;
	
	if (this.dal.Character.isValidLogin() === false) {
		for (var i = 0; i < noNeedLoginUrl.length; i++) {
			var val = noNeedLoginUrl[i];
			if (val.toLocaleLowerCase() === name.toLocaleLowerCase()) {
				ishave = true;
				break;
			}
		}
		if (ishave === false) {
			uni.cclog("======重复请求===ishave==")
			name = "login-login";
		}
	}

	if (isObject(query)) {
		queryStr = encodeURIComponent(JSON.stringify(query))
	} else {
		throw new Error('query数据必须是Object')
	}

	this.$minRouter.forEach(item => {
		if (item.name === name) {
			path = item.path
			type = item.type || 'navigateTo'
			isName = true
		}
	})

	if (gotype) {
		type = gotype;
	}

	if (!isName) {
		throw new Error(`没有${name}页面`)
	}

	if (!['navigateTo', 'switchTab', 'reLaunch', 'redirectTo', 'navigateBack'].includes(type)) {
		throw new Error(`name:${name}里面的type必须是以下的值['navigateTo', 'switchTab', 'reLaunch', 'redirectTo','navigateBack']`)
	}
	// uni.cclog("===path==", path)
	// uni.cclog("===type==", type)
	// uni.cclog("===queryStr.length==", queryStr.length)
	try {
		if (!queryStr || queryStr.length <= 0) {
			return new Promise((resolve, reject) => {
				uni[type]({
					url: `/${path}`,
					success: resolve,
					fail: reject,
					delta: delta, //返回的页面数，如果 delta 大于现有页面数，则返回到首页
				})
			})
		} else {
			return new Promise((resolve, reject) => {
				uni[type]({
					url: type != "switchTab" ? `/${path}?query=${queryStr}` : `/${path}`,
					success: resolve,
					fail: reject,
					delta: delta, //返回的页面数，如果 delta 大于现有页面数，则返回到首页
				})
			})
		}
	} catch (e) {
		uni.cclog("========跳转报错了======")
		console.warn(e);
	}

}

function parseURL() {
	const query = this.$root.$mp.query.query
	uni.cclog("========this.$root.$mp.query======", query)
	if (query) {
		return JSON.parse(decodeURIComponent(query))
	} else {
		return {}
	}
}

function install(Vue) {
	// uni.cclog("========function install=========")
	Vue.mixin({
		beforeCreate: function() {
			if (!isDefault(this.$options.minRouter)) {
				Vue._minRouter = this.$options.minRouter
			}
		}
	})

	Object.defineProperty(Vue.prototype, '$minRouter', {
		get: function() {
			return Vue._minRouter._router
		}
	})
	Object.defineProperty(Vue.prototype, '$parseURL', {
		get: function() {
			return Vue._minRouter.parseURL
		}
	})
	Object.defineProperty(Vue.prototype, '$openPage', {
		get: function() {
			return Vue._minRouter.openPage
		}
	})

	Object.defineProperty(Vue.prototype, '$isNeedLogin', {
		get: function() {
			return Vue._minRouter.isNeedLogin
		}
	})
	Object.defineProperty(Vue.prototype, '$isSwitchToHome', {
		get: function() {
			return Vue._minRouter.isSwitchToHome
		}
	})

}

function MinRouter(options) {
	if (!(this instanceof MinRouter)) {
		throw Error("MinRouter是一个构造函数，应该用`new`关键字调用")
	}
	isDefault(options) && (options = {})
	this.options = options
	this._router = options.routes || []
}

MinRouter.install = install
MinRouter.prototype.openPage = openPage
MinRouter.prototype.parseURL = parseURL
MinRouter.prototype.isNeedLogin = isNeedLogin
MinRouter.prototype.isSwitchToHome = isSwitchToHome

export default MinRouter
