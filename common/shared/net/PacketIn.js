import Vue from 'vue'
var vue = Vue.prototype

var PacketIn = function(ab) {
	this._dataView = undefined;
	this._pos = 0;
	this.length = 0;

	this.code = 0;

	this.m_byteProVer = 0; //协议版本          1
	this.m_nLen = 0; //包长度            4
	this.m_nHdrLen = 0; //包头长度          2
	this.m_nPlatformId = 0; //系统标识
	this.m_nDevType = 0; //设备信息          1
	this.m_nDevId = 0; //设备信息          1
	this.m_byteGroup = 0; //组标识            1
	this.m_nSubID = 0; //子标识          就是协议号  2
	this.m_nSeq = 0; //流水号            4
	this.m_nSrc = 0; //源                4
	this.m_nDest = 0; //目标              4
	this.m_nFlags = 0; //标志（第1位表示压缩,第2位加密,,32位保活）      4
	this.m_nCheckCode = 0; //验证码               4
	this.m_nAllCheckCode = 0; //验证码               4

	this.m_nCompanyID = 0; //公司ID
	this.m_nUserID = 0; //玩家ID

	this._dataView = new DataView(ab);

	this.readHead();
};

// read head
PacketIn.prototype.readHead = function() {
	this.m_byteProVer = this.ReadByte();
	this.m_nLen = this.ReadInt();
	this.size_ = this.m_nLen;
	this.m_nHdrLen = this.ReadUShort();

	this.m_nPlatformId = this.ReadInt();
	this.m_nDevType = this.ReadInt();
	this.m_nDevId = this.ReadInt();
	this.m_byteGroup = this.ReadByte();

	this.m_nSubID = this.ReadUShort();
	this.code = this.m_nSubID;
	this.m_nSeq = this.ReadInt();
	this.m_nSrc = this.ReadInt();
	this.m_nDest = this.ReadInt();
	this.m_nFlags = this.ReadInt();
	this.m_nCheckCode = this.ReadInt();
	this.m_nAllCheckCode = this.ReadInt();
	this.m_nCompanyID = this.ReadInt();
	this.m_nUserID = this.ReadLong();
};

PacketIn.prototype.ReadBool = function() {
	var b = this._dataView.getInt8(this._pos);
	this._pos += 1;
	return b === 1;
};

PacketIn.prototype.ReadByte = function() {
	var r = this._dataView.getUint8(this._pos);
	this._pos += 1;
	return r;
};

PacketIn.prototype.ReadUInt8 = function() {
	var r = this._dataView.getUint8(this._pos);
	this._pos += 1;
	return r;
};

PacketIn.prototype.ReadInt8 = function() {
	var r = this._dataView.getInt8(this._pos);
	this._pos += 1;
	return r;
};

PacketIn.prototype.ReadUShort = function() {
	var r = this._dataView.getUint16(this._pos, true);
	this._pos += 2;

	// var t1 = r ;
	// var tmax = (t1 & 0xFF00) >> 8;
	// var t2 = r;
	// var tmin = (t2 & 0x00FF) << 8;
	//
	// var val =  tmax | tmin;
	// return val;

	return r;

};

PacketIn.prototype.ReadShort = function() {
	var r = this._dataView.getInt16(this._pos, true);
	this._pos += 2;

	// var t1 = r ;
	// var tmax = (t1 & 0xFF00) >> 8;
	// var t2 = r;
	// var tmin = (t2 & 0x00FF) << 8;
	//
	// var val =  tmax | tmin;
	// return val;
	return r;
};

PacketIn.prototype.ReadUInt = function() {
	var r = this._dataView.getUint32(this._pos, true);
	this._pos += 4;
	// var tmax = this.ReadUShort();
	// var tmin = this.ReadUShort();
	//
	// var val = (tmin & 0x0000FFFF) << 16 | tmax;

	// return val;
	return r;
};

PacketIn.prototype.ReadInt = function() {
	var r = this._dataView.getInt32(this._pos, true);
	this._pos += 4;
	// var tmax = this.ReadShort();
	// var tmin = this.ReadShort();
	//
	// var val = (tmin & 0x0000FFFF) << 16 | tmax;
	//
	// return val;
	return r;
};

PacketIn.prototype.ReadFloat = function() {
	var r = this._dataView.getFloat32(this._pos, true);
	this._pos += 4;
	return r;
};


PacketIn.prototype.int64BEtoNumber = function(bytes) {
	var sign = bytes[0] >> 7;
	var sum = 0;
	var digits = 1;
	for (var i = 0; i < 8; i++) {
		var value = bytes[7 - i];
		sum += (sign ? value ^ 0xFF : value) * digits;
		digits *= 0x100;
	}
	return sign ? -1 - sum : sum;
}
PacketIn.prototype.getBit = function(val, bit) {
	var t = ((val & (0x1 << bit)) >> bit);
};

PacketIn.prototype.ReadLong = function() {
	var tmin = this.ReadUInt();
	var tmax = this.ReadInt();
	// var val = tmin | tmax;
	//
	var val = tmax * Math.pow(2, 32) + tmin;
	//cc.log("===val=",val,"==tmin",tmin,"==tmax=",tmax);
	return val;
};

PacketIn.prototype.ReadULong = function() {
	var arr = new Array(8);
	var bytes = [];
	for (var i = 7; i >= 0; i--) {
		var v = this.ReadInt8();
		bytes[i] = v;
	}
	var bint = new BigInteger(bytes)
	return bint;
	// var value = this.int64BEtoNumber(bytes);
	// cc.log("===value=",value);
	// return value;
};

PacketIn.prototype.ReadString = function() {
	var len = this._dataView.getUint8(this._pos);
	this._pos += 1;

	var bytes = this.ReadByteArray(len);
	this._pos += len;
	return vue.shared.UTF8.byteArrayToString(bytes);
};

PacketIn.prototype.ReadFixedLenString = function(len) {
	var bytes = this.ReadByteArray(len);
	this._pos += len;
	return vue.shared.UTF8.byteArrayToString(bytes);
};

PacketIn.prototype.ReadSystime = function() {
	var st = {};
	st.wYear = this.ReadUShort();
	st.wMonth = this.ReadUShort();
	st.wDayOfWeek = this.ReadUShort();
	st.wDay = this.ReadUShort();
	st.wHour = this.ReadUShort();
	st.wMinute = this.ReadUShort();
	st.wSecond = this.ReadUShort();
	st.wMilliseconds = this.ReadUShort();
	return st;
};

PacketIn.prototype.ReadByteArray = function(len) {
	var arr = new Uint8Array(len);
	var pos = this._pos;
	var pcount = 0;
	for (var i = 0; i < arr.length; ++i) {
		var v = this._dataView.getInt8(pos);
		if (v != 0) {
			pcount += 1;
			arr[i] = v;
			pos = pos + 1;
		} else {
			break;
		}
	}
	var arr1 = new Uint8Array(pcount);
	for (var i = 0; i < pcount; i++) {
		arr1[i] = arr[i];
	}
	return arr1;
};
export default PacketIn
