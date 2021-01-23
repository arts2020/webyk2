import LocalDataKeys from '@/common/entities/LocalDataKeys.js'
import EventKeys from '@/common/entities/EventKeys.js'
import LocalStrMgr from '@/common/entities/LocalStrMgr.js'
import Metadata from '@/common/entities/Metadata.js'
import Common from '@/common/entities/Common.js'
import RequestCode from "@/common/entities/RequestCode.js"
import Routes from "@/common/entities/Routes.js"
import LogType from "@/common/entities/LogType.js"

export default {
	LocalDataKeys,
	EventKeys,
	LocalStrMgr,
	Metadata,
	Common,
	RequestCode,
	Routes,
	LogType,
	init: function() {
		uni.cclog("====entities init===")
		LocalStrMgr.init();
		Routes.init();
	}
}
