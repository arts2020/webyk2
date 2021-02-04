import Account from "@/common/dal/Account.js"
import Character from "@/common/dal/Character.js"
import UserInfo from "@/common/dal/UserInfo.js"
import Setting from "@/common/dal/Setting.js"
import Net from "@/common/dal/Net.js"
import Logger from "@/common/dal/Logger.js"
import Dapp from "@/common/dal/dapp/Dapp.js"

import Utils from "@/common/dal/Utils.js"
import Common from "@/common/dal/Common.js"
import Chain from "@/common/dal/wallet/Chain.js"
import MainWallet from "@/common/dal/wallet/MainWallet.js"
import NomalWallet from "@/common/dal/wallet/NomalWallet.js"
import BTC from "@/common/dal/wallet/wallets/btc.js"
import EOS from "@/common/dal/wallet/wallets/eos.js"
import ETH from "@/common/dal/wallet/wallets/ethers.js"
import Lotus from "@/common/dal/wallet/wallets/lotus.js"
import TRON from "@/common/dal/wallet/wallets/tron.js"

const Dal = {
	Net,
	Logger,
	Dapp,
	Utils,
	Setting,
	Account,
	Character,
	UserInfo,
	Common,
	Chain,
	MainWallet,
	NomalWallet,
	BTC,
	EOS,
	ETH,
	Lotus,
	TRON,
	
	init: function() {
		Net.init()
	},
	onLoginSuccess: function() {
		Common.onGetAssetstate();
		Common.onGetAssetprice();
	}
}
export default Dal
