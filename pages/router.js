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
			path: 'pages/my/address/index',
			name: 'address-list'
		},{
			path: 'pages/my/address/detail',
			name: 'address-detail'
		},{
			path: 'pages/my/address/address-type',
			name: 'address-type'
		},{
			path: 'pages/my/agreement/agreement',
			name: 'user-agreement'
		},{
			path:"pages/wallet/add-coin",
			name: 'wallet-add-coin'
		},{
			path:"pages/wallet/add-wallet",
			name: 'wallet-add-wallet'
		},{
			path: 'pages/wallet/my-wallet/index',
			name: 'my-wallet-index'
		},{
			path: 'pages/wallet/my-wallet/detail',
			name: 'my-wallet-detail'
		},{
			path: 'pages/wallet/status-wallet/index',
			name: 'status-wallet-index'
		},{
			path: 'pages/wallet/status-wallet/status-info',
			name: 'status-wallet-info'
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
			path: 'pages/market/quotation/search-page',
			name: 'quotation-search'
		},{
			path: 'pages/wallet/creat-wallet/index',
			name: 'creat-wallet-index'
		},{
			path: 'pages/wallet/creat-wallet/creat-wallet',
			name: 'creat-wallet-wallet'
		},{
			path: 'pages/wallet/creat-wallet/create-status',
			name: 'creat-wallet-status'
		},{
			path: 'pages/wallet/import-wallet/import-wallet',
			name: 'import-wallet-wallet'
		},
		{
			path: 'pages/wallet/import-wallet/import-style',
			name: 'import-wallet-style'
		},{
			path: 'pages/wallet/import-wallet/index',
			name: 'import-wallet-index'
		},{
			path: 'pages/wallet/import-wallet/recover',
			name: 'import-wallet-recover'
		},{
			path: 'pages/wallet/backup/backup-info/backup-info',
			name: 'backup-info'
		},{
			path: 'pages/wallet/backup/backup-info/backup-sure',
			name: 'backup-info-sure'
		},{
			path: 'pages/wallet/backup/backup-tip',
			name: 'backup-tip'
		},{
			path:"pages/dapp/search-page",
			name: 'dapp-search'
		}
	]
})

export default router
