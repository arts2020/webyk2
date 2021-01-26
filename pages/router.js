import MinRouter from './MinRouter'

// 配置路由
const router = new MinRouter({
	// uni.navigateTo	保留当前页面，跳转到应用内的某个页面，使用uni.navigateBack可以返回到原页面
	// uni.redirectTo	关闭当前页面，跳转到应用内的某个页面
	// uni.reLaunch	关闭所有页面，打开到应用内的某个页面
	// uni.switchTab	跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
	// uni.navigateBack	关闭当前页面，返回上一页面或多级页面


	// type必须是以下的值['navigateTo', 'switchTab', 'reLaunch', 'redirectTo','navigateBack']
	// name: 'back' 当 type 为 'navigateBack' 时有效，表示回退的层数。。。。
	
	routes: [{
			path: 'pages/wallet/index',
			type: 'navigateBack', //特定跳转
			name: 'back'
		},{
			path: 'pages/wallet/index',
			type: 'switchTab', //特定跳转
			name: 'wallet-index'
		}, {
			path: 'pages/market/index',
			type: 'switchTab', //特定跳转
			name: 'market-index'
		}, {
			path: 'pages/dapp/index',
			type: 'switchTab', //特定跳转
			name: 'dapp-index'
		},{
			path: 'pages/my/index',
			type: 'switchTab', //特定跳转
			name: 'mine-mine'
		},{
			path: 'pages/account/register/register',
			name: 'register-register'
		}, {
			path: 'pages/account/login/login',
			name: 'login-login'
		},{
			path: 'pages/account/register/agreement/agreement',
			name: 'agreement-page'
		},{
			path: 'pages/account/register/agreement/hide',
			name: 'hide-page'
		},{
			path: 'pages/my/visit/visit',
			name: 'my-visit'
		},{
			path: 'pages/my/about-us/about-us',
			name: 'about-us'
		},{
			path: 'pages/my/help/help',
			name: 'help-help'
		},{
			path: 'pages/my/safe/pwd-back',
			name: 'safe-pwd-back'
		},{
			path: 'pages/my/safe/safe-center',
			name: 'safe-safe-center'
		},{
			path: 'pages/my/safe/money-pwd/sure-pwd',
			name: 'safe-money-pwd-sure-pwd'
		},{
			path: 'pages/my/safe/money-pwd/money-pwd',
			name: 'safe-money-pwd'
		},{
			path: 'pages/my/safe/money-pwd/money-changepwd',
			name: 'safe-money-changepwd'
		},{
			path: 'pages/my/safe/authentication/authentication',
			name: 'safe-authentication-authentication'
		},{
			path: 'pages/market/quotation/quotation',
			name: 'quotation-quotation'
		},{
			path: 'pages/notice/notice',
			name: 'notice-notice'
		},{
			path: 'pages/computing-power/power',
			name: 'computing-power-power'
		},{
			path: 'pages/mine/my-wallet/my-wallet',
			name: 'mine-my-wallet-my-wallet'
		},{
			path: 'pages/order-list/order-list',
			name: 'order-list-order-list'
		},{
			path: 'pages/income/my-income/my-income',
			name: 'income-my-income'
		},{
			path: 'pages/income/income-eth',
			name: 'income-income-eth'
		},{
			path: 'pages/mine/creat-wallet/creat-wallet',
			name: 'mine-creat-wallet'
		},{
			path: 'pages/pay/pay-power/pay-power',
			name: 'pay-pay-power'
		},{
			path: 'pages/pay/pay',
			name: 'pages-pay'
		},{
			path: 'pages/order-list/order-list',
			name: 'order-list'
		},{
			path: 'pages/tip-page/pay-tip',
			name: 'tip-page-pay-tip'
		},{
			path: 'pages/tip-page/recover-tip',
			name: 'tip-page-recover-tip'
		},{
			path: 'pages/recover-identify/recover',
			name: 'recover-identify-recover'
		},{
			path: 'pages/backup-tip/backup-info/backup-sure',
			name: 'backup-info-backup-sure'
		},{
			path: 'pages/backup-tip/backup-info/backup-info',
			name: 'backup-info-backup-info'
		},{
			path: 'pages/backup-tip/backup-tip',
			name: 'backup-tip-backup-tip'
		},{
			path: 'pages/deal-record/deal-record',
			name: 'deal-record-deal-record'
		},{
			path: 'pages/recharge-currency/carry-over/carry-over',
			name: 'carry-over'
		},{
			path: 'pages/recharge-currency/filecoin-over/carry-over',
			name: 'filecoin-carry-over'
		},{
			path: 'pages/recharge-currency/recharge-currency',
			name: 'recharge-currency'
		},
		
		{
			path: 'pages/notice/notice-detail/notice-detail',
			name: 'notice-detail'
		},
		{
			path: 'pages/pay/pay-power/xieyi',
			name: 'xieyi-xieyi'
		}
	]
})

export default router
