import Vue from 'vue'
var vue = Vue.prototype

var PlatformConfig = {
	host: null,
	
	getChannelInfo: function() {
		uni.cclog("=======开始初始化====getChannelInfo=====app&h5==")
		var platform = "";
		var devtype = "";
	
		switch (uni.getSystemInfoSync().platform) {
			case 'android':
				uni.cclog('运行Android上')
				platform = vue.entities.Metadata.PlatForm.H5_ANDROID;
				devtype = vue.entities.Metadata.PlatForm.H5_ANDROID;
				// #ifdef APP-PLUS
				platform = vue.entities.Metadata.PlatForm.ANDROID;
				devtype = vue.entities.Metadata.PlatForm.ANDROID;
				// #endif
				break;
			case 'ios':
				uni.cclog('运行iOS上')
				platform = vue.entities.Metadata.PlatForm.H5_IOS
				devtype = vue.entities.Metadata.PlatForm.H5_IOS;
				// #ifdef APP-PLUS
				platform = vue.entities.Metadata.PlatForm.IOS;
				devtype = vue.entities.Metadata.PlatForm.IOS;
				// #endif
				break;
			default:
				uni.cclog('运行在H5上')
				platform = vue.entities.Metadata.PlatForm.H5
				devtype = vue.entities.Metadata.PlatForm.H5;
				break;
		}
	
		this.channelInfo = { //基础渠道配置模板
			language: vue.entities.Metadata.GameLanguage.CN,
			vsn: "1.0.0",
			platform: platform,
			devtype: devtype,
			urlParams: {from: 0},
			host: "http://119.8.55.19", //当前正在用的域名 http://8.210.62.53
			testhost: "http://127.0.0.1:7300", //开发环境使用的域名
		}
		// #ifdef APP-PLUS
			this.channelInfo.vsn = plus.runtime.version;
		// #endif
		console.log('=this.channelInfo.vsn=',this.channelInfo.vsn)
		return this.channelInfo
	},
}

export default PlatformConfig;
