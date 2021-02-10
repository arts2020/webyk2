import Address from '@/common/dal/Address.js'
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
import NormalWallet from "@/common/dal/wallet/NormalWallet.js"
import ContractWallet from "@/common/dal/wallet/ContractWallet.js"
import WalletManage from "@/common/dal/wallet/WalletManage.js"
import Btc from "@/common/dal/wallet/wallets/btc.js"
import Eos from "@/common/dal/wallet/wallets/eos.js"
import Eth from "@/common/dal/wallet/wallets/ethers.js"
import Lotus from "@/common/dal/wallet/wallets/lotus.js"
import Tron from "@/common/dal/wallet/wallets/tron.js"

const Dal = {
	Address,
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
	NormalWallet,
	ContractWallet,
	WalletManage,
	Btc,
	Eos,
	Eth,
	Lotus,
	Tron,
	
	init: function() {
		Net.init()
	},
	onLoginSuccess: function() {
		Common.onGetAssetPrice();
		Common.onGetConfig();
		Common.onCommonConfig();	
	}
}
export default Dal
