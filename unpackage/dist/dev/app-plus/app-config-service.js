
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/wallet/index","pages/account/login/login","pages/account/register/agreement/hide","pages/account/register/agreement/agreement","pages/account/register/register","pages/dapp/index","pages/market/index","pages/my/index","pages/my/visit/visit","pages/my/safe/pwd-back","pages/my/safe/authentication/authentication","pages/my/safe/money-pwd/sure-pwd","pages/my/safe/money-pwd/money-pwd","pages/my/safe/money-pwd/money-changepwd","pages/my/safe/safe-center","pages/my/about-us/about-us","pages/my/help/help","pages/market/quotation/quotation","pages/market/quotation/search-page","pages/wallet/creat-wallet/index","pages/wallet/creat-wallet/creat-wallet","pages/wallet/creat-wallet/create-status","pages/wallet/import-wallet/import-wallet","pages/wallet/import-wallet/index","pages/wallet/import-wallet/import-style","pages/wallet/import-wallet/recover","pages/wallet/my-wallet/index","pages/wallet/my-wallet/detail","pages/wallet/status-wallet/index","pages/wallet/status-wallet/status-info","pages/wallet/backup/backup-tip","pages/wallet/backup/backup-info/backup-keystore","pages/wallet/backup/backup-info/backup-private","pages/wallet/backup/backup-info/backup-info","pages/wallet/backup/backup-info/backup-sure","pages/wallet/add-coin","pages/wallet/add-wallet","pages/my/address/index","pages/my/address/address-type","pages/my/address/detail","pages/my/agreement/agreement","pages/dapp/search-page","pages/wallet/record/index","pages/wallet/record/detail","pages/wallet/recharge/carry-over/carry-over","pages/wallet/recharge/recharge-currency","pages/wallet/index"],"window":{"navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","titleNView":false},"tabBar":{"color":"#A9B7C4","selectedColor":"#232323","borderStyle":"black","backgroundColor":"#ffffff","list":[{"pagePath":"pages/wallet/index","text":"钱包","iconPath":"static/image/index/index.png","selectedIconPath":"static/image/index/index-select.png"},{"pagePath":"pages/market/index","text":"市场","iconPath":"static/image/index/chanpin.png","selectedIconPath":"static/image/index/chanpin-select.png"},{"pagePath":"pages/dapp/index","text":"浏览","iconPath":"static/image/index/hangqing.png","selectedIconPath":"static/image/index/hangqing-select.png"},{"pagePath":"pages/my/index","text":"我的","iconPath":"static/image/index/mine.png","selectedIconPath":"static/image/index/mine-select.png"}]},"nvueCompiler":"uni-app","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":false,"autoclose":false},"appname":"琥珀Pool","compilerVersion":"3.0.7","entryPagePath":"pages/wallet/index","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/wallet/index","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"钱包","navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","titleNView":true}},{"path":"/pages/account/login/login","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#efefef","backgroundColor":"#efefef","titleNView":true}},{"path":"/pages/account/register/agreement/hide","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#efefef","backgroundColor":"#efefef","titleNView":true}},{"path":"/pages/account/register/agreement/agreement","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#efefef","backgroundColor":"#efefef","titleNView":true}},{"path":"/pages/account/register/register","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#efefef","backgroundColor":"#efefef","titleNView":true}},{"path":"/pages/dapp/index","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/market/index","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/my/index","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationStyle":"custom","navigationBarTitleText":"我的","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","titleNView":true}},{"path":"/pages/my/visit/visit","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#efefef","backgroundColor":"#efefef","titleNView":true}},{"path":"/pages/my/safe/pwd-back","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#efefef","backgroundColor":"#efefef","titleNView":true}},{"path":"/pages/my/safe/authentication/authentication","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#efefef","backgroundColor":"#efefef","titleNView":true}},{"path":"/pages/my/safe/money-pwd/sure-pwd","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#efefef","backgroundColor":"#efefef","titleNView":true}},{"path":"/pages/my/safe/money-pwd/money-pwd","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#efefef","backgroundColor":"#efefef","titleNView":true}},{"path":"/pages/my/safe/money-pwd/money-changepwd","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#efefef","backgroundColor":"#efefef","titleNView":true}},{"path":"/pages/my/safe/safe-center","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#efefef","backgroundColor":"#efefef","titleNView":true}},{"path":"/pages/my/about-us/about-us","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#efefef","backgroundColor":"#efefef","titleNView":true}},{"path":"/pages/my/help/help","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#efefef","backgroundColor":"#efefef","titleNView":true}},{"path":"/pages/market/quotation/quotation","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/market/quotation/search-page","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/wallet/creat-wallet/index","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/wallet/creat-wallet/creat-wallet","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/wallet/creat-wallet/create-status","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/wallet/import-wallet/import-wallet","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/wallet/import-wallet/index","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/wallet/import-wallet/import-style","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/wallet/import-wallet/recover","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/wallet/my-wallet/index","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/wallet/my-wallet/detail","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/wallet/status-wallet/index","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/wallet/status-wallet/status-info","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/wallet/backup/backup-tip","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/wallet/backup/backup-info/backup-keystore","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/wallet/backup/backup-info/backup-private","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/wallet/backup/backup-info/backup-info","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/wallet/backup/backup-info/backup-sure","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/wallet/add-coin","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/wallet/add-wallet","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/my/address/index","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/my/address/address-type","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/my/address/detail","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/my/agreement/agreement","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/dapp/search-page","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/wallet/record/index","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/wallet/record/detail","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/wallet/recharge/carry-over/carry-over","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}},{"path":"/pages/wallet/recharge/recharge-currency","meta":{},"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","enablePullDownRefresh":true,"titleNView":true}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
