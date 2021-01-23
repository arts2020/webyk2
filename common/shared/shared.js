import UTF8 from "@/common/shared/UTF8.js"
import MD5 from "@/common/shared/MD5.js"
import Event from "@/common/shared/event.js"
import Http from "@/common/shared/net/Http.js"
import PacketIn from "@/common/shared/net/PacketIn.js"
import PacketOut from "@/common/shared/net/PacketOut.js"
import WebSocket from "@/common/shared/net/WebSocket.js"
import Base64 from "./Base64.js"

export default{
	UTF8,
	MD5,
	Event,
	Http,
	PacketIn,
	PacketOut,
	WebSocket,
	Base64,
	init:function(){
		// bit.init()
		Http.init()
	}
}