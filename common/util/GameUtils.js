import Vue from 'vue'
var vue = Vue.prototype

//系统中和模块业务相关
const GameUtils = {
	m_sps: [],
	// 本地图片走CDN访问
	fullPath: function(file, isLanguage, needGetResPath) {
		if (process.env.NODE_ENV === 'development') {
			if (vue.PlatformInfo.platform === vue.entities.Metadata.PlatForm.H5) {
				var url = window.location.origin
				if (!url) {
					url = window.location.protocol + "//" + window.location.hostname + (window.location.port ?
						':' + window.location.port : '');
				}
				file = url + file
			}
		} else {
			var cdnurl = vue.PlatformConfig.getCdnUrl();
			if (cdnurl && cdnurl.length > 10) {
				file = cdnurl + "/m" + file;
			}else{
				file = vue.PlatformConfig.getCurrUrl() + "/m/" + file;
			}
		}
		// vue.cclog("==fullPath==", file)
		return file; //+ "?vsn=" + vue.PlatformInfo.vsn;
	},

	//后台上传,走CDN访问
	netFullPath: function(file) {
		if (process.env.NODE_ENV == 'development') {
			file = vue.PlatformConfig.getCurrUrl() + file;
		} else {
			var cdnurl = vue.PlatformConfig.getCdnUrl();	
			if (cdnurl && cdnurl.length > 10) {
				file = cdnurl + file;
			} else {
				file = vue.PlatformConfig.getCurrUrl() + file;
			}
		}
		return file;
	},

	// 返回带version的文件路径
	fullPathVersion: function(file, isLanguage) {
		return this.fullPath(file, isLanguage, true);
	},

	// 本地模板全路径
	tplPath: function(file, isLanguage) {
		if (file === null || file.length() < 1) {
			return file;
		}
		var pre = "tpl/cn/";
		if (isLanguage) {
			var gameLanguage = dal.Setting.getSysLanguage();
			if (gameLanguage === entities.Metadata.GameLanguage.TW) {
				pre = "tpl/tw/";
			}
		}

		return pre + file;
	},

	// 获取本地化字符
	LocalizedString: function(key, gameId, tag) {
		gameId = gameId || 0;
		tag = tag || 0;
		var str = LocalStrMgr.instance().getLocalStr(key, gameId, tag);
		return str;
	},

	//APP浏览器URL新窗口跳转
	openUrlFun: function(str) {
		var url = str;
		if (str.indexOf("http") < 0) {
			this.inputLogFun("=1=openurl==url=" + url);
			var href = window.location.href;
			if (href.indexOf("https") >= 0) {
				url = "https://" + window.location.host + "/" + url;
			} else {
				url = "http://" + window.location.host + "/" + url;
			}
		}
		this.inputLogFun("=2=openurl==url=" + url);

		if (window.webkit && window.webkit.messageHandlers.openUrl) {
			window.webkit.messageHandlers.openUrl.postMessage(url);
		} else if (window.jsToAndroid) {
			window.jsToAndroid.openUrl(url);
		} else {
			var a = document.createElement("a"); //创建a对象
			a.setAttribute("href", str);
			a.setAttribute("target", "_blank");
			a.setAttribute("id", "camnpr");
			document.body.appendChild(a);
			a.click(); //执行当前对象
		}
	},

	//判断是否是主包
	getIsMainPack() {
		var isflag = false;
		if (vue.PlatformInfo.configinfo) {
			if (vue.PlatformInfo.configinfo.companyid === 0) {
				isflag = true;
			}
		}
		return isflag;
	},

	//日志输出
	inputLogFun: function(str) {
		if (window.webkit && window.webkit.messageHandlers.inputLog) {
			window.webkit.messageHandlers.inputLog.postMessage(str);
		} else {
			vue.cclog("==inputLogFun=====str=", str);
		}
	},
	
	//首页调用完成
	homePageFun: function() {
		if (window.webkit && window.webkit.messageHandlers.homePage) {
			window.webkit.messageHandlers.homePage.postMessage("homePage");
		}
	},

	// omit：默认不传，true表示省略
	getIpArea: function(m_strGPSAddress, omit) {
		var address = "";
		if (m_strGPSAddress === "0" || m_strGPSAddress === "") {
			address = entry.UiUtils.LocalizedString("playerinfo_notknow_area");
		} else {
			address = entry.GFunc.addressChange(m_strGPSAddress);
		}

		var language = dal.Setting.getSysLanguage();
		if (language === entities.Metadata.GameLanguage.TW) {
			address = IpList[address] || address;
		}

		if (omit) {
			address = entry.StringUtils.subString(address, 4, true);
		}
		return address;
	},

	getIpAbbr: function(ip) {
		var sip = ip;
		var ips = ip.split(".");
		if (ips.length === 4) {
			sip = ips[0] + "." + ips[1] + "***";
		}

		if (sip.length <= 3) {
			sip = entry.UiUtils.LocalizedString("playerinfo_notknow_ip");
		}

		return sip;
	},
	getAddressAbbr: function(addressstr, showlenth) { //截取地址显示。showlenth-显示多少个字符，多余的用"..."代表
		var len = showlenth || 4;
		if (addressstr.length > len) {
			return addressstr.substring(0, len) + "...";
		}
		return addressstr;
	},

	getVersion: function(cb) {
		var path = scene.loader.AssetCache.getResUsePath("res/version/version.json");
		cc.loader.loadTxt(path, function(err, txt) {
			var v = "1.0.0";
			if (!err) {
				var jv = JSON.parse(txt);
				v = jv.v1 + "." + jv.v2 + "." + jv.v3;
			}

			var from = entry.GFunc.urlGetValue("from");
			if (from && (from === "1" || from === "2")) {
				var version = entry.GFunc.urlGetValue("version");
				if (version && version.length > 0) {
					var v = version.split(".");
					entry.GameUtils.inputLogFun("=== v[0]=" + v[0]);
					entry.GameUtils.inputLogFun("=== v[1]=" + v[1]);
					entry.GameUtils.inputLogFun("===  jv.v3=" + jv.v3);
					var v1 = v[0] || 1;
					var v2 = v[1] || 0;

					if (v1 <= 0) {
						v1 = 1;
					}

					var vn = v1 + "." + v2 + "." + jv.v3;
					entry.GameUtils.inputLogFun("====version=" + vn);
					cb({
						v: vn
					});
					return;
				}
			}

			cb({
				v: v
			});
		});

	},

	getHangByCardNumber: function(cardnumber) {
		var ext = cardnumber.substr(0, 6);
		var str = entry.UiUtils.LocalizedString("LocalStr.bank_" + ext);
		return str;
	},

	// 服务Http的
	getLanguageFlag: function() {
		var flag = "zh-tw";
		var language = dal.Setting.getSysLanguage();
		if (language === entities.Metadata.GameLanguage.CN) {
			flag = "zh-cn";
		}
		return flag;
	},

	getChipsRound: function(value, isneedrate) {
		var rate = 1;
		var tmp = value;
		if (value > 1000000000 || value < -1000000000) {
			rate = 100000000;
			tmp = Math.floor(value / 1000000000) + entry.UiUtils.LocalizedString("char_yi");
		} else if (value >= 100000 || value <= -100000) {
			rate = 10000;
			tmp = Math.floor(value / 10000) + entry.UiUtils.LocalizedString("char_wan");
		}
		if (isneedrate) {
			return [tmp, rate];
		} else {
			return tmp;
		}
	},

	getGoldAddStep: function(value) {
		var tmp = 1;
		if (value > 10000000000) {
			tmp = 10000000000;
		} else if (value > 1000000000) {
			tmp = 1000000000;
		} else if (value > 100000000) {
			tmp = 100000000;
		} else if (value > 10000000) {
			tmp = 10000000;
		} else if (value > 1000000) {
			tmp = 1000000;
		} else if (value > 100000) {
			tmp = 100000;
		} else if (value > 10000) {
			tmp = 10000;
		} else if (value > 100) {
			tmp = 100;
		} else if (value > 10) {
			tmp = 10;
		}
		return tmp;
	},

	// 大于10显示10.00万
	// 例如：114532 显示为 11.45万
	// 大于1亿显示 1.00亿
	// 例如：131223345 显示为 1.31亿
	// 小数点后第三位省略
	// 11.40显示11.4  11.0显示11
	getGoldText: function(value) {
		var gold = value;
		var text = gold;
		if (gold < 100000) {
			text = gold;
		} else if (gold >= 100000 && gold < 100000000) {
			var temp1 = Math.floor(gold / 10000);
			var temp2 = Math.floor((gold - temp1 * 10000) / 1000);
			var temp3 = Math.floor((gold - temp1 * 10000 - temp2 * 1000) / 100);
			if (temp3 === 0) {
				if (temp2 === 0) {
					text = temp1 + entry.UiUtils.LocalizedString("char_wan");
				} else {
					text = temp1 + "." + temp2 + entry.UiUtils.LocalizedString("char_wan");
				}
			} else {
				text = temp1 + "." + temp2 + temp3 + entry.UiUtils.LocalizedString("char_wan");
			}
		} else {
			var temp1 = Math.floor(gold / 100000000);
			var temp2 = Math.floor((gold - temp1 * 100000000) / 10000000);
			var temp3 = Math.floor((gold - temp1 * 100000000 - temp2 * 10000000) / 1000000);
			if (temp3 === 0) {
				if (temp2 === 0) {
					text = temp1 + entry.UiUtils.LocalizedString("char_yi");
				} else {
					text = temp1 + "." + temp2 + entry.UiUtils.LocalizedString("char_yi");
				}
			} else {
				text = temp1 + "." + temp2 + temp3 + entry.UiUtils.LocalizedString("char_yi");
			}
		}
		return text;
	},

	getTimeByServiceTypeDate: function(date) {
		// return Date.UTC(date.wYear, date.wMonth - 1, date.wDay, date.wHour, date.wMinute, date.wSecond, 0); // 2018.8.31和2018.9.1返回值有问题，前者反而大，原因未知
		var number = (((date.wYear * 365 + date.wMonth * 31 + date.wDay) * 24 + date.wHour) * 60 + date.wMinute) * 60 +
			date.wSecond;
		return number;
	},

	getDayServiceTypeData: function(date) {
		var str = date.wYear + "" + date.wMonth + "" + date.wDay;
		return str;
	},

	// 解析域名?后的参数,返回一个json键值表
	// 格式：index.html?a=123&b=456 返回{a: "123", b: "456"}
	urlSearch: function() {
		var jsonList = {};
		var name;
		var value;
		var str = "";
		if (cc.sys.isNative) {
			//TODO
		} else {
			str = location.href;
		}

		var num = str.indexOf("?");
		str = str.substr(num + 1);
		var arr = str.split("&");
		for (var i = 0; i < arr.length; i++) {
			num = arr[i].indexOf("=");
			if (num > 0) {
				name = arr[i].substring(0, num);
				value = arr[i].substr(num + 1);
				jsonList[name] = value;
			}
		}
		return jsonList;
	},

	// 获取url的键值
	// 返回undefined表示无此键
	urlGetValue: function(key) {
		var list = entry.GFunc.urlSearch();
		var value = list[key];
		return value;
	},

	filterUserName(showname) {
		if (showname.length > 3) {
			var starcount = showname.length - 3;
			var starstr = "";
			//	for (var i = 0; i < starcount; i++) {
			starstr += "***";
			//	}
			showname = showname.substr(0, 2) + starstr + showname.substr(showname.length - 1);
		}
		return showname;
	},

}

export default GameUtils
