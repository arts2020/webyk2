import Vue from 'vue'
var vue = Vue.prototype

// String相关的全局方法
const StringUtils = {

	m_userDefaults: {}, // 当浏览器关闭了cookie，使用内存保存键值对

	removeUserDefaults: function(key, isvsn) {
		if (isvsn) {
			key = key + "_" + vue.PlatformInfo.configinfo.cache_vsn
		}
		key = "APP_" + key;
		// uni.cclog("===removeUserDefaults===key=", key)
		try {
			uni.removeStorageSync(key);
		} catch (e) {
			console.warn(e);
		}
	},

	setUserDefaults: function(key, value, isvsn) {
		if (isvsn) {
			key = key + "_" + vue.PlatformInfo.configinfo.cache_vsn
		}
		key = "APP_" + key;
		// uni.cclog("===setUserDefaults===key=", key)
		var v = value;
		if (v === null || v === undefined) {
			v = "";
		}
		v = v.toString();
		try {
			uni.setStorageSync(key, v);
		} catch (e) {
			console.warn(e);
		}
	},

	getUserDefaults: function(key, isvsn) {
		if (isvsn) {
			key = key + "_" + vue.PlatformInfo.configinfo.cache_vsn
		}
		key = "APP_" + key;
		// uni.cclog("===getUserDefaults===key=", key)
		// if (vue.PlatformInfo.platform === vue.entities.Metadata.PlatForm.H5) {
		// 	try {
		// 		var localStorage = window.localStorage;
		// 		localStorage.setItem("storage", "");
		// 		localStorage.removeItem("storage");
		// 	} catch (e) {
		// 		console.warn(e)
		// 		uni.cclog("无法读local storage");
		// 		var v = this.m_userDefaults[key];
		// 		if (v === null || v === undefined) {
		// 			v = "";
		// 		}
		// 		uni.cclog("getUserDefaults by memory", key, v);
		// 		return v;
		// 	}
		// }
		var v = "";
		try {
			v = uni.getStorageSync(key);
		} catch (e) {
			console.warn(e);
		}

		if (v === null || v === undefined) {
			v = "";
		}
		if (v === null || v === undefined) {
			v = "";
		}
		return v;
		// return "";
	},

	getStandardTypeForServiceSysTimeData: function(timedata) {
		var resultstr = "";
		resultstr = resultstr + timedata.wYear + "-";

		if (timedata.wMonth < 10) {
			resultstr = resultstr + "0";
		}
		resultstr = resultstr + timedata.wMonth + "-";

		if (timedata.wDay < 10) {
			resultstr = resultstr + "0";
		}
		resultstr = resultstr + timedata.wDay + "  ";

		if (timedata.wHour < 10) {
			resultstr = resultstr + "0";
		}
		resultstr = resultstr + timedata.wHour + ":";

		if (timedata.wMinute < 10) {
			resultstr = resultstr + "0";
		}
		resultstr = resultstr + timedata.wMinute + ":";

		if (timedata.wSecond < 10) {
			resultstr = resultstr + "0";
		}
		resultstr = resultstr + timedata.wSecond;

		return resultstr;
	},

	isChinese: function(str) {
		if (/^[\u3220-\uFA29]+$/.test(str)) {
			return true;
		} else {
			return false;
		}
	},

	// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
	// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
	// 例子：
	// formatDate(new Date(), "yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
	// formatDate(new Date(), "yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
	formatDate: function(date, fmt) {
		var date = date || new Date();
		var fmt = fmt || "yyyy-MM-dd hh:mm:ss.S";
		var o = {
			"M+": date.getMonth() + 1, //月
			"d+": date.getDate(), //日
			"h+": date.getHours(), //时
			"m+": date.getMinutes(), //分
			"s+": date.getSeconds(), //秒
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度
			"S": date.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	},

	// 字符串截取制定长度，isOmit为true返回+省略号
	subString: function(value, showCount, isOmit) {
		value = value || 0;
		var str = value || "";
		var str = str.substr(0, Math.min(showCount, str.length));
		if (isOmit && value.length > showCount) {
			str = str + "...";
		}
		return str;
	},
	formatBankNumber: function(bankNumber) {
		// return bankNumber.substr(0, 4) + "********" + bankNumber.substr(-4);
		return "**** **** **** " + bankNumber.substr(-4);
	},
	stringTb: function(str, number) {
		str = str.replace(/ /g, "");
		var start = 0;
		var nSplitIndex = 0;
		var nSplitArray = [];
		while (true) {
			var val = str.substr(start, number);
			var len = val.length;
			if (len < number) {
				if (len > 0) {
					nSplitArray[nSplitIndex] = val;
				}
				break;
			}
			nSplitArray[nSplitIndex] = val;
			start = start + number;
			nSplitIndex = nSplitIndex + 1;
		}
		var s = "";
		for (var i = 0; i < nSplitArray.length; i++) {
			if (i === (nSplitArray.length - 1)) {
				s = s + nSplitArray[i];
			} else {
				s = s + nSplitArray[i] + " ";
			}
		}
		return s;
	},

	//只获取数字
	getNumber: function(value) {
		var str = value.replace(/[^0-9]/ig, "");
		return str;
	},

	//
	getString: function(value) {
		var specialStr = ""
		// var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]");
		var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]");
		for (var i = 0; i < value.length; i++) {
			specialStr += value.substr(i, 1).replace(pattern, '');
		}
		return specialStr;
	},

	//判断是否是数字
	IsNum: function(num) {
		var re = /^\d+(?=\.{0,1}\d+$|$)/
		return (re.test(num));
	},

	isNumOrLetter: function(value) {
		var Regx = /^[A-Za-z0-9]*$/;
		if (Regx.test(value)) {
			return true;
		} else {
			return false;
		}
	},

	//判断是否字母和数字
	isCharAndNumber: function(value) {
		var reg = /^[0-9a-zA-Z]+$/
		if (!reg.test(value)) {
			return false;
		}
		return true;
	},

	//判断是否是汉字
	isHaz: function(value) {
		var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
		if (reg.test(value)) {
			return true;
		}
		return false;
	},

	HzFilter: function(str) {
		str = str.replace(/ /g, "");
		var s = "";
		for (var i = 0; i < str.length; i++) {
			var c = str[i];
			if (this.isHaz(c) === false) {
				s = s.toString() + c.toString();
			}
		}
		return s;
	},

	//过滤自符串 带小数点
	CharFilter2: function(str, isfilter) {
		if (isfilter === null || isfilter === undefined) {
			isfilter = true;
		}
		var count = 1;
		var isflag = false;
		str = str.replace(/ /g, "");
		var s = "";
		for (var i = 0; i < str.length; i++) {
			var c = str[i];
			if (c === ".") {
				if (isflag === false) {
					isflag = true;
					s = s.toString() + c.toString();
				}
			} else if (this.IsNum(c) === true && count <= 2) {
				s = s.toString() + c.toString();
				if (isflag === true) {
					count = count + 1;
				}
			}
		}
		if (s.length > 0 && isfilter) {
			// s = parseInt(s).toString();
		}
		if (s === ".") {
			s = "";
		}
		return s;
	},

	//过滤自符串
	CharFilter: function(str, isfilter) {
		if (isfilter === null || isfilter === undefined) {
			isfilter = true;
		}
		str = str.replace(/ /g, "");
		var s = "";
		for (var i = 0; i < str.length; i++) {
			var c = str[i];
			if (this.IsNum(c) === true) {
				s = s.toString() + c.toString();
			}
		}
		if (s.length > 0 && isfilter) {
			s = parseInt(s).toString();
		}
		return s;
	},

	htmlIsValid: function() {
		uni.cclog("===========htmlIsValid=========1")
		if (this.PlatformInfo.platform === vue.entities.Metadata.PlatForm.H5) {
			uni.cclog("===========htmlIsValid=========2")
			var reg = /\n(\n)*( )*(\n)*\n/g;
			var html = document.documentElement.innerHTML.replace(/ /g, "").replace(reg, "").replace(/[\r\n]/g, "");
			html = html.replace("https://www.googletagmanager.com/gtag", "");
			html = html.replace("https://www.google-analytics.com", "");
			if (html.indexOf("window.open") >= 0 ||
				html.indexOf("document") >= 0 ||
				html.indexOf("http://") >= 0 ||
				html.indexOf(".com") >= 0 ||
				html.indexOf("eval") >= 0) {
				return true;
			}
			return false;
		}
		uni.cclog("===========htmlIsValid=========3")
		return false;
	},

	/**
	 * A string tool to construct a string with format string.
	 * for example:
	 *      this.util.StringUtils.formatStr("a: %d, b: %b", a, b);
	 *      this.util.StringUtils.formatStr(a, b, c);
	 * @returns {String}
	 */
	formatStr: function() {
		var args = arguments;
		var l = args.length;
		if (l < 1)
			return "";

		var str = args[0];
		var needToFormat = true;
		if (typeof str === "object") {
			needToFormat = false;
		}
		for (var i = 1; i < l; ++i) {
			var arg = args[i];
			if (needToFormat) {
				while (true) {
					var result = null;
					if (typeof arg === "number") {
						result = str.match(/(%d)|(%s)/);
						if (result) {
							str = str.replace(/(%d)|(%s)/, arg);
							break;
						}
					}
					result = str.match(/%s/);
					if (result)
						str = str.replace(/%s/, arg);
					else
						str += "    " + arg;
					break;
				}
			} else
				str += "    " + arg;
		}
		return str;
	},
	
	isMobile:function(phoneNum){
		if(!(/^1[3578][0-9]{9}$/.test(phoneNum))){ 
		   return false; 
		} 
		return true;
	}
}

export default StringUtils
