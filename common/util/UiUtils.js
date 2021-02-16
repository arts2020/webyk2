import Vue from 'vue'
var vue = Vue.prototype

// UI相关的全局方法
const UiUtils = {
	mTimerId: null, // 控制菊花的计时器
	mLoadingShowTime: 15000, // 菊花默认显示时间10s

	// 悬浮球相关
	mDragBallVisible: false,
	mDragBallDotVisible: false,
	mDragBallType: 1, // 1:私聊 2:群聊
	mDragBallChatInfo: null,
	mDragBallPos: {
		x: uni.getSystemInfoSync().windowWidth - 60 - 10,
		y: uni.getSystemInfoSync().windowHeight / 2 - 25,
	},

	// 显示提示框
	showToast: function(str = "") {
		if (str.length < 1) {
			return;
		}

		uni.showToast({
			icon: "none",
			duration: 2000,
			title: str,
		});
	},

	// 隐藏提示框
	hideToast: function() {
		uni.hideToast();
	},

	// 显示加载框
	showLoading: function(str = "", time = this.mLoadingShowTime, isMask = true) {
		this.clearLoadingTimer();
		uni.showLoading({
			title: str,
			mask: isMask
		});
		this.mTimerId = setTimeout(function() {
			uni.cclog("==str==", str)
			uni.cclog("loading time out");
			this.hideLoading();
		}.bind(this), time)
	},

	// 隐藏加载框
	hideLoading: function() {
		if (this.mTimerId) {
			uni.hideLoading();
		}
		this.clearLoadingTimer();
	},

	// 清除菊花计时器
	clearLoadingTimer: function() {
		if (this.mTimerId) {
			clearTimeout(this.mTimerId);
			this.mTimerId = null;
		}
	},

	setTitle: function() {
		if (vue.PlatformInfo.platform == vue.entities.Metadata.PlatForm.H5) {
			if (vue.PlatformInfo.configinfo) {
				if (vue.PlatformInfo.configinfo.title) {
					window.document.title = vue.PlatformInfo.configinfo.title;
				}
				if (vue.PlatformInfo.configinfo.favicon) {
					var favicon = document.getElementById("faviconid");
					favicon.href = vue.util.GameUtils.netFullPath(vue.PlatformInfo.configinfo.favicon);
				}
			}
		}
	},

	switchToPage: function(name, from, param, gotype, delta) {
		if (name == "login-login") {
			uni.redirectTo({
				url: '/pages/wallet/index.vue'
			});
			return;
		}
		vue.$openPage({
			name: name,
			gotype: gotype,
			delta: delta,
			query: {
				from: from,
				param: param,
			}
		})
	},

	switchBackPage2: function() {
		let pages = getCurrentPages();
		if (pages.length < 1) {
			this.$openPage({
				name: "wallet-index",
				query: {},
				gotype: "switchTab"
			})
		} else {
			uni.navigateBack({
				delta: 1
			});
		}
	},

	switchBackPage: function() {
		let pages = getCurrentPages();

		if (pages.length <= 1) {
			vue.util.UiUtils.switchToPage("wallet-index", "switchBackPage")
		} else {
			uni.navigateBack({
				delta: 1
			});
		}
	},

	openDownLoadApp: function(url) {
		if (vue.PlatformInfo.platform == vue.entities.Metadata.PlatForm.H5) {
			vue.util.GameUtils.openUrlFun(url)
		} else {
			plus.runtime.openURL(url, function(res) {
				vue.cclog("===openDownLoadApp=", res);
			});
		}
	},


	switchToKeFu: function() {
		// vue.$openPage({
		// 	name: "webui-webview",
		// 	query: {
		// 		title:vue.getLocalStr('kefu_title_center'),
		// 		url: vue.PlatformInfo.configinfo.kefu
		// 	}
		// })
		var ismain = vue.util.GameUtils.getIsMainPack();
		if (!ismain) {
			this.util.UiUtils.switchToPage("game", "kefu");
			return;
		}
		var url = vue.PlatformInfo.configinfo.kefu;
		if (url && url.length > 0) {
			if (vue.PlatformInfo.platform == vue.entities.Metadata.PlatForm.H5) {
				// vue.util.GameUtils.openUrlFun(url)
				vue.$openPage({
					name: "webui-webview",
					query: {
						title: vue.getLocalStr('kefu_title_center'),
						url: vue.PlatformInfo.configinfo.kefu
					}
				})
			} else {
				plus.runtime.openURL(url, function(res) {
					vue.cclog("===switchToKeFu=", res);
				});
			}
		}
	},

	switchToUrl: function(url) {
		if (vue.PlatformInfo.platform == vue.entities.Metadata.PlatForm.H5) {
			vue.util.GameUtils.openUrlFun(url);
		} else {
			plus.runtime.openURL(url, function(res) {

			});
		}
	},

	/* 根据交易类型取名字 */
	geTradeNameType: function(type) {
		var str = vue.getLocalStr('finance_recordtype_' + type); //提款失败
		return str;
	},

	/* 提现状态描述 */
	getTiXianStatusDesc: function(state) {
		var str = vue.getLocalStr('mycenter_reocord_state_pass')
		if (state === vue.entities.Metadata.ExchangStatusType.Handling) { //处理中
			str = vue.getLocalStr('mycenter_reocord_state_processing')
		} else if (state === vue.entities.Metadata.ExchangStatusType.Lost) { //提现失败
			str = vue.getLocalStr('mycenter_reocord_state_failed')
		} else if (state === vue.entities.Metadata.ExchangStatusType.Handled) { //已处理
			str = vue.getLocalStr('mycenter_reocord_state_pass')
		} else if (state === vue.entities.Metadata.ExchangStatusType.Pay_success) {
			str = vue.getLocalStr('mycenter_reocord_state_success')
		}
		return str;
	},

	//是否可以转帐，购买
	getIsCanTrans: function() {
		try {
			console.log("==vue.dal.Character.m_playerInfo.isset_capital_pwd=", vue.dal.Character.m_playerInfo.isset_capital_pwd)
			if (vue.dal.Character.m_playerInfo.isset_capital_pwd == 2) { //否
				uni.showModal({
					title: uni.getLocalStr("tip_title"),
					content: uni.getLocalStr("err_tip_safepasd"),
					confirmText: uni.getLocalStr("btnstring_confirm"),
					showCancel: true,
					success: function(res) {
						if (res.confirm) {
							vue.util.UiUtils.switchToPage("safe-money-pwd", "getIsCanTrans", {});
						}
					}
				});
				return false;
			}
			return true;
		} catch (e) {
			console.warn(e)
			return false;
		}
	},

	checkUpdate: function(vsn_curr, ishome = false) {
		let apploadurl = "";
		let v = ""
		if (vue.PlatformInfo.platform === vue.entities.Metadata.PlatForm.ANDROID) {
			v = vue.dal.Common.onGetConfigInfo("appload_android_url").ext1;
			apploadurl = vue.dal.Common.onGetConfigInfo("appload_android_url").value;
		} else if (vue.PlatformInfo.platform === vue.entities.Metadata.PlatForm.IOS) {
			v = vue.dal.Common.onGetConfigInfo("appload_ios_url").ext1;
			apploadurl = vue.dal.Common.onGetConfigInfo("appload_ios_url").value;
		} else if (vue.PlatformInfo.platform === vue.entities.Metadata.PlatForm.H5_IOS) {
			v = vue.dal.Common.onGetConfigInfo("appload_ios_url").ext1;
			apploadurl = vue.dal.Common.onGetConfigInfo("appload_ios_url").value;
		} else if (vue.PlatformInfo.platform === vue.entities.Metadata.PlatForm.H5_ANDROID) {
			v = vue.dal.Common.onGetConfigInfo("appload_android_url").ext1;
			apploadurl = vue.dal.Common.onGetConfigInfo("appload_android_url").value;
		}

		let vsn = vsn_curr.split('.')
		let v1 = parseInt(vsn[0])
		let v2 = parseInt(vsn[1])
		let v3 = parseInt(vsn[2])
		// 	console.log("======v1=", v1);
		// 	console.log("======v2=", v2);
		// 	console.log("======v3=", v3);

		// 	console.log("==vue.PlatformInfo.platform=", vue.PlatformInfo.platform);
		// 	console.log("==new====v=", v);
		let vsn_n = v.split('.')
		let v1_n = parseInt(vsn_n[0])
		let v2_n = parseInt(vsn_n[1])
		let v3_n = parseInt(vsn_n[2])

		if (v1_n <= v1 && v2_n <= v2 && v3_n <= v3 && ishome == false) {
			vue.util.UiUtils.showToast(uni.getLocalStr("tip_version"));
			return;
		}
		// console.log("======v1_n=", v1_n);
		// console.log("======v2_n=", v2_n);
		// console.log("======v3_n=", v3_n);
		if (v1_n > v1) {
			console.log("强制更新");
			this.downLoadTip(apploadurl, false, uni.getLocalStr("tip_version_update")); //检测到有新版本，请更新版本
			return;
		}
		if (v2_n > v2) {
			console.log("提示更新1");
			this.downLoadTip(apploadurl, true, uni.getLocalStr("tip_version_update_ask")); //"检测到有新版本，需要更新吗？"
			return;
		}
		if (v3_n > v3) {
			console.log("提示更新3");
			this.downLoadTip(apploadurl, true, uni.getLocalStr("tip_version_update_ask")); //"检测到有新版本，需要更新吗？"
			return;
		}

	},
	downLoadTip: function(url, flag, tip) {
		if (vue.PlatformInfo.platform === vue.entities.Metadata.PlatForm.ANDROID ||
			vue.PlatformInfo.platform === vue.entities.Metadata.PlatForm.IOS) {
			uni.showModal({
				title: uni.getLocalStr("tip_title"),
				content: tip,
				confirmText: uni.getLocalStr("btnstring_confirm"),
				showCancel: flag,
				success: function(res) {
					if (res.confirm) {
						this.downLoadApp(url);
					}
				}.bind(this)
			});
		} else {
			vue.util.UiUtils.showToast(uni.getLocalStr("tip_update_no")); //"不支持更新"
		}
	},
	downLoadApp: function(url) {
		vue.util.UiUtils.showLoading(uni.getLocalStr('tip_load_going'), 300000000);
		var dtask = plus.downloader.createDownload(url, {}, function(d, status) {
			vue.util.UiUtils.hideLoading();
			// 下载完成  
			if (status == 200) {
				plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename), {}, {}, function(error) {
					uni.showToast({
						title: uni.getLocalStr("tip_install_success"), //'安装失败'
						duration: 1500
					});
				})
			} else {
				uni.showToast({
					title: uni.getLocalStr("tip_update_fail"), //'更新失败'
					duration: 1500
				});
			}
		});
		dtask.start();
	},
	//是否可以充值
	getIsCanRecharge: function() {
		return true;
	},

	// 设置悬浮球位置 
	setDragBallPos: function(pos) {
		this.mDragBallPos = pos;
	},

	// 获取悬浮球位置
	getDragBallPos: function() {
		return this.mDragBallPos;
	},

	// 设置悬浮球是否可见
	setDragBallVisible: function(visible) {
		this.mDragBallVisible = visible;
	},

	// 获取悬浮球是否可见
	getDragBallVisible: function() {
		return this.mDragBallVisible;
	},

	// 设置悬浮球红点是否可见
	setDragBallDotVisible: function(visible) {
		this.mDragBallDotVisible = visible;
	},

	// 获取悬浮球红点是否可见
	getDragBallDotVisible: function() {
		return this.mDragBallDotVisible;
	},

	// 设置悬浮球类型
	setDragBallType: function(type) {
		this.mDragBallType = type;
	},

	// 获取悬浮球类型
	getDragBallType: function() {
		return this.mDragBallType;
	},

	// 设置悬浮球的聊天信息
	setDragBallChatInfo: function(info) {
		this.mDragBallChatInfo = info;
	},

	// 获取悬浮球的聊天信息
	getDragBallChatInfo: function() {
		return this.mDragBallChatInfo;
	}
}
export default UiUtils
