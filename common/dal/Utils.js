import Vue from 'vue'
var vue = Vue.prototype

//数据层工具类
const Utils = {
	init: function() {
		return true;
	},

	setTimer: function(func, delay, repeat) {
		var delay = delay * 1000;
		if (repeat) {
			return setInterval(func, delay);
		} else {
			return setTimeout(func, delay);
		}
	},

	killTimer: function(timerId, repeat) {
		if (repeat) {
			clearInterval(timerId);
		} else {
			clearTimeout(timerId);
		}
	},

	getSysErrorType: function(code) {
		if (code !== 0) {
			var lbl = vue.getLocalStr('SYS_ERR_' + code);
			return lbl
		}
		return "";
	},

	//json转url参数
	parseParams: function(data) {
		try {
			var tempArr = [];
			for (var i in data) {
				var key = encodeURIComponent(i);
				var value = encodeURIComponent(data[i]);
				tempArr.push(key + '=' + value);
			}
			var urlParamsStr = tempArr.join('&');
			return urlParamsStr;
		} catch (err) {
			return '';
		}
	},

	formatDate: function(day) {
		var date = new Date();
		var time = date.getTime() - (day * 24 * 3600 * 1000); // 开始时间倒退7天
		var beginDate = new Date(time);
		var Year = beginDate.getFullYear();
		var Month = beginDate.getMonth() + 1;
		var Day = beginDate.getDate();
		var Hour = beginDate.getHours();
		var Minute = beginDate.getMinutes();
		var Seconds = beginDate.getSeconds();

		var nyr = Year + "-" + Month + "-" + Day;
		var nyrsf = Year + "-" + Month + "-" + Day + " " + Hour + ":" + Minute;
		var nyrsfm = Year + "-" + Month + "-" + Day + " " + Hour + ":" + Minute + ":" + Seconds;
		return {
			nyr: nyr,
			nyrsf: nyrsf,
			nyrsfm: nyrsfm
		};
	},

	getSysTimestamp: function(date) {
		// console.log("===date==",typeof(date))
		if(typeof(date) == "number"){
			date = date.toString();
		}
		// console.log("==date==",date)
		date = date.substring(0, 19);
		date = date.replace(/-/g, '/');
		var timestamp = new Date(date).getTime();

		// 根据毫秒数构建 Date 对象
		var date2 = new Date(timestamp);
		// 格式化日期
		var dateTime = date2.toLocaleString();
		return {
			timestamp: timestamp,
			dt: dateTime
		}
	},

	// 获取服务器要的起始时间和结束时间
	// dateType: entities.Metadata.DateType
	getBeginEndTime: function(dateType) {
		var days = 0;
		if (dateType === vue.entities.Metadata.DateType.Today) {
			days = 0;
		} else if (dateType === vue.entities.Metadata.DateType.Yesterday) {
			days = 1;
		} else if (dateType === vue.entities.Metadata.DateType.SevenDay) {
			days = 7;
		}
		var result = {};
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var dateStr = year + "/" + month + "/" + day + " " + "00:00:00";
		var time = new Date(dateStr).getTime();
		if (days === 0) {
			// 今天
			var beginTime = time;
			var beginDate = new Date(beginTime);
			var beginStr = vue.util.StringUtils.formatDate(beginDate, "yyyy-MM-dd hh:mm:ss")
			result.begin = beginStr;
			var endTime = time + 24 * 3600 * 1000;
			var endDate = new Date(endTime);
			var endStr = vue.util.StringUtils.formatDate(endDate, "yyyy-MM-dd hh:mm:ss")
			result.end = endStr;
		} else if (days === 1) {
			// 昨天
			var beginTime = time - 1 * 24 * 3600 * 1000;
			var beginDate = new Date(beginTime);
			var beginStr = vue.util.StringUtils.formatDate(beginDate, "yyyy-MM-dd hh:mm:ss")
			result.begin = beginStr;
			var endTime = time;
			var endDate = new Date(endTime);
			var endStr = vue.util.StringUtils.formatDate(endDate, "yyyy-MM-dd hh:mm:ss")
			result.begin = beginStr;
			result.end = endStr;
		} else {
			// 7天或者其它天数
			var beginTime = time - (days - 1) * 24 * 3600 * 1000;
			var beginDate = new Date(beginTime);
			var beginStr = vue.util.StringUtils.formatDate(beginDate, "yyyy-MM-dd hh:mm:ss")
			result.begin = beginStr;
			var endTime = time + 24 * 3600 * 1000;
			var endDate = new Date(endTime);
			var endStr = vue.util.StringUtils.formatDate(endDate, "yyyy-MM-dd hh:mm:ss")
			result.end = endStr;
		}

		uni.cclog("getBeginEndTime", days, result);
		return result;
	},

	// 设置富文本页面信息
	setRichTextInfo: function(info) {
		this.mRichTextInfo = {};
		this.mRichTextInfo.title = info.title;
		this.mRichTextInfo.content = info.content;
		this.mRichTextInfo.desc = info.desc;
	},

	// 返回富文本页面信息
	getRichTextInfo: function() {
		return this.mRichTextInfo;
	},

	AesEncrypt: function(password) {
		var ps = CryptoJS.enc.Utf8.parse(password);
		var key = CryptoJS.enc.Utf8.parse("2GCgt0goNWeVkRcX");
		var ivs = CryptoJS.enc.Utf8.parse("2GCgt0goNWeVkRcX");
		var encrypted = CryptoJS.AES.encrypt(ps, key, {
			iv: ivs,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		var encrypted = CryptoJS.AES.encrypt(ps, key, {
			iv: ivs,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});

		encrypted = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);

		return encrypted;
	},
}
export default Utils
