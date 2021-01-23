import CryptoJS from '../../node_modules/crypto-js/crypto-js.js'

import Vue from 'vue'
var vue = Vue.prototype

//#ifdef H5
//#endif

//全局的、与业务无关的，可以独立出来，可供其他项目使用
const Utils = {
	//文件上传
	upLoadFile: function(path) {
		var host = path;
		//TODO
		uni.uploadFile({
			url: host,
			complete: () => {}
		});
	},

	//下载文件
	downLoadFile: function(path) {
		var host = path;
		uni.downloadFile({
			url: host,
			success: (res) => {
				if (res.statusCode === 200) {
					uni.cclog('下载成功');
				}
			}
		})
	},

	downloadImg: function(loadUrl, relativePath, localKey) {
		uni.cclog('=======loadUrl=', loadUrl)
		uni.cclog('=======relativePath=', relativePath)
		var dtask = plus.downloader.createDownload(loadUrl, {
			filename: "_doc/uploads/"
		}, function(d, status) {
			if (status == 200) {
				uni.cclog("下载wgt成功：" + d.filename);
				vue.util.StringUtils.setUserDefaults(localKey, d.filename);
			} else {
				uni.cclog("下载wgt失败！");
				// plus.nativeUI.alert("下载wgt失败！");
				if (relativePath != null) {
					this.delFile(relativePath);
				}
			}
			plus.nativeUI.closeWaiting();
		})
		dtask.start();
	},
	/*删除指定文件*/
	delFile: function(relativePath) {
		uni.cclog("文件删除==" + relativePath);
		plus.io.resolveLocalFileSystemURL(relativePath, function(entry) {
			entry.remove(function(entry) {
				uni.cclog("文件删除成功==" + relativePath);
			}, function(e) {
				uni.cclog("文件删除失败=" + relativePath);
			});
		});
	},
	
	getNetState: function() {
		var state = true;
		uni.onNetworkStatusChange(function(res) {
			state = res.isConnected;
		});
		// uni.cclog("==getNetState=state=====", state)
		return state;
	},

	// string转对象
	getTableFromString: function(str, from) {
		try {
			return JSON.parse(str);
		} catch (e) {
			vue.dal.Logger.write(str, vue.entities.LogType.JSONERROR);
		}
	},

	// 对象转string
	getJsonFromTable: function(tb) {
		return JSON.stringify(tb);
	},

	//加密
	encryption: function() {
		//TODO
	},

	//解密
	decrypt: function(cbcontent) {
		var intevalpos = Math.floor((cbcontent.length + 1) / 2);
		var sstr = cbcontent.substr(intevalpos, cbcontent.length);
		var dstr = cbcontent.substr(0, intevalpos);

		var contentstr = "";
		for (var i = 0; i < sstr.length; i++) {
			if (i < sstr.length) {
				contentstr = contentstr + sstr[i];
			}
			if (i < dstr.length) {
				contentstr = contentstr + dstr[i];
			}
		}
		uni.cclog('==contentstr====', contentstr)
		var resultstr = vue.shared.Base64.decode(contentstr);
		return resultstr;
	},

	// 复制到粘贴板，需要做兼容测试
	setClipboardData: function(data) {
		//#ifndef H5
		uni.setClipboardData({
			data: data,
			success() {

			},
			fail() {

			}
		});
		//#endif
		//#ifdef H5
		if (ClipboardJS.isSupported()) {
			// 浏览器支持复制
			var clipboard = new ClipboardJS(".btn");
			clipboard.on("success", function(e) {
				e.clearSelection();
			});
			clipboard.on("error", function(e) {

			});
			var btn = document.getElementById("copybtn");
			if (!btn) {
				btn = document.createElement('input');
				document.body.appendChild(btn);
				btn.type = 'button';
				btn.id = 'copybtn';
				btn.style.display = 'none';
			}
			btn.setAttribute("class", "btn");
			btn.setAttribute("data-clipboard-text", data);
			btn.click();
			clipboard.destroy();
		} else {
			uni.cclog("浏览器不支持复制");
		}
		//#endif
	},

	// 参考cc.clone，深度复制对象
	ccClone: function(obj) {
		var newObj = (obj.constructor) ? new obj.constructor : {};
		for (var key in obj) {
			var copy = obj[key];
			if (((typeof copy) === "object") && copy) {
				newObj[key] = this.ccClone(copy);
			} else {
				newObj[key] = copy;
			}
		}
		return newObj;
	},

	random: function(min, max) {
		var range = max - min;
		var rand = Math.random();
		return (min + Math.round(rand * range));
	},

	AesEncrypt: function(password) {
		return password;
		var ps = CryptoJS.enc.Utf8.parse(password);
		var key = CryptoJS.enc.Utf8.parse("2GCgt0gsssoNWeVkRcX");
		var ivs = CryptoJS.enc.Utf8.parse("2GCgt0gsssoNWeVkRcX");
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
