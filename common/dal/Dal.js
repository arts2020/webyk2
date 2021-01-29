import Account from "@/common/dal/Account.js"
import Character from "@/common/dal/Character.js"
import UserInfo from "@/common/dal/UserInfo.js"
import Setting from "@/common/dal/Setting.js"
import Net from "@/common/dal/Net.js"
import Logger from "@/common/dal/Logger.js"
import Utils from "@/common/dal/Utils.js"
import Common from "@/common/dal/Common.js"
import Chain from "@/common/dal/wallet/Chain.js"
import MainWallet from "@/common/dal/wallet/MainWallet.js"
import NomalWallet from "@/common/dal/wallet/NomalWallet.js"

const Dal = {
	Net,
	Logger,
	Utils,
	Setting,
	Account,
	Character,
	UserInfo,
	Common,
	Chain,
	MainWallet,
	NomalWallet,

	init: function() {
		Net.init()
	},

	onLoginSuccess: function() {
		Common.onGetAssetstate();
		Common.onGetAssetprice();
	}
}
export default Dal
