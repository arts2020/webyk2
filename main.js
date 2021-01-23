import Vue from 'vue'
import App from './App'

var cclog = {}
uni.cclog = function() {
	// if (process.env.NODE_ENV === 'development') {
	console.log(...arguments)
	// }
}

Vue.config.productionTip = false

uni.getLocalStr = function(key) {
	return entities.LocalStrMgr.getLocalStr(key);
}

Vue.prototype.getLocalStr = function(key) {
	return entities.LocalStrMgr.getLocalStr(key);
}
App.mpType = 'app'
// 引入MinRouter文件
import MinRouter from './pages/MinRouter'
// 注册插件
Vue.use(MinRouter)
// 引入router文件
import minRouter from './pages/router'
import PlatformConfig from './common/platform/PlatformConfig.js'
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import clipboard from './components/js_sdk/ican-clipBoard/ican-clipBoard.js'
import QSInput from './components/QS-inputs-split/elements/QS-input/index.vue'
import HsIcon from "./pages/uielement/hsicon.vue"
import HsRate from "./pages/uielement/hsrate.vue"
import entities from './common/entities/Entities.js'
import language from './common/language/Language.js'
import shared from './common/shared/shared.js'
import util from './common/util/Util.js'
import dal from './common/dal/Dal.js'

import "./common/shared/unorm.js";
//import "./static/image/common/iconfontIcon.js";
	
Vue.component('clipboard', clipboard);
Vue.component('QSInput', QSInput);
Vue.component('HsIcon', HsIcon);
Vue.component('HsRate', HsRate);
Vue.component('uniNavBar', uniNavBar);

Vue.prototype.cclog = uni.cclog;
Vue.prototype.entities = entities
Vue.prototype.language = language
Vue.prototype.shared = shared
Vue.prototype.util = util
Vue.prototype.dal = dal

Vue.prototype.PlatformInfo = PlatformConfig.getChannelInfo()

const app = new Vue({
	...App,
	minRouter
})
app.$mount()
