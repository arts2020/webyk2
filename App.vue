<script>
	const unorm = require('./unorm.js')
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef APP-PLUS
				plus.screen.lockOrientation("portrait-primary");
			// #endif
			
			//实体层层数据模型初始化
			this.entities.init();

			//第三方工具类初始化
			this.shared.init();

			//数据层数据模型初始化 
			this.dal.init();
			
			// this.dal.Account.onAutoLogin();
			this.dal.onLoginSuccess();
			// this.dal.Net.clear();
			// this.util.EventUtils.addEventListenerCustom(this.dal.Common.evtGetRate, this.onGetRate);
		},
	
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		
		// methods:{
		// 	onGetRate:function(){
		// 		console.log("====22===onGetRate=========",this.PlatformInfo.vsn)
		// 		setTimeout(function(){
		// 			this.util.UiUtils.checkUpdate(this.PlatformInfo.vsn,true)
		// 		}.bind(this),2000)
		// 	}
		// }
	}
</script>

<style lang="scss">
	uni-tabbar .uni-tabbar__icon img{
		width: 18px !important;
		height: 18px !important;
	}
	// @import "./static/image/common/iconfont.css";
	/* #ifndef APP-PLUS-NVUE */
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './static/uni.css';
	
	/* 以下样式用于 hello uni-app 演示所需 */
	page {
		// background-color: #F4F5F6;
		height: 100%;
		font-size: 28rpx;
		line-height: 1.8;
	}

	.uni-header-logo {
		padding: 30rpx;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 10rpx;
	}

	.uni-header-image {
		width: 100px;
		height: 100px;
	}

	.uni-hello-text {
		color: #7A7E83;
	}

	.uni-hello-addfile {
		text-align: center;
		line-height: 300rpx;
		background: #FFF;
		padding: 50rpx;
		margin-top: 10px;
		font-size: 38rpx;
		color: #808080;
	}

	/* #endif*/

	/* #ifdef MP-360 */
	::-webkit-scrollbar {
		width: 4px;
		height: 4px;
		background-color: transparent;
	}

	::-webkit-scrollbar-track {
		background-color: transparent;
	}

	::-webkit-scrollbar-thumb {
		background-color: #ddd;
	}

	::-webkit-scrollbar-thumb:hover {
		background-color: #ccc;
	}

	::-webkit-scrollbar-thumb:active {
		background-color: #bbb;
	}

	::-webkit-scrollbar-corner {
		background: #ffffff;
	}
	
	/* #endif*/
</style>
