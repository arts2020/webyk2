import Vue from 'vue'
var vue = Vue.prototype

var PacketOut = function(params) {
	this._buffer = new ArrayBuffer(1024 * 5);
	this._session = 0;
	this._code = params.code;
	this._dataView = new DataView(this._buffer, 0);
	this._length = 0;

	this.HEAD_SIZE = 58;

	this._pos = this.HEAD_SIZE;

	this.setHeadData(params);
};

PacketOut.prototype.setHeadData = function(data) {
	this.m_byteProVer = 1;
	this.m_nPlatformId = data.m_nPlatformId || 0; //系统标识
	this.m_nDevType = data.m_nDevType || 1; //设备信息
	this.m_nDevId = data.m_nDevId || 1; //设备信息
	this.m_byteGroup = data.m_byteGroup || 1; //组标识
	this.m_nSeq = 0; //流水号
	this.m_nSrc = 0; //源
	this.m_nDest = 0; //目标
	this.m_nFlags = 0; //标志
	this.m_nCompanyID = data.m_nCompanyID || 0; //公司ID
	this.m_nUserID = data.m_nUserID || 0; //玩家ID

};

PacketOut.prototype._ensureLength = function() {
	if (this._length < this._pos) {
		this._length = this._pos;
		// cc.log("==this._length=",this._length);
	}
};

PacketOut.prototype.getBuffer = function() {
	return this._buffer.slice(0, this._length);
};

PacketOut.prototype.setSession = function(session) {
	this._session = session;
};

PacketOut.prototype.WriteHead = function(rewrite) {
	if (!this.head_writed_ || rewrite) {
		this._pos = 0;
		this.m_nLen = this._length;
		this.m_nHdrLen = this.HEAD_SIZE;
		this.m_nSubID = this._code;

		if (rewrite) {
			this.setCheck();
		}

		this.WriteByte(this.m_byteProVer); //协议版本
		this.WriteInt(this.m_nLen);
		this.WriteShort(this.m_nHdrLen);

		this.WriteInt(this.m_nPlatformId);
		this.WriteInt(this.m_nDevType);
		this.WriteInt(this.m_nDevId);
		this.WriteByte(this.m_byteGroup);

		this.WriteShort(this.m_nSubID);

		this.WriteInt(this.m_nSeq);

		this.WriteInt(this.m_nSrc);
		this.WriteInt(this.m_nDest);
		this.WriteInt(this.m_nFlags);

		this.WriteInt(this.m_nCheckCode);
		this.WriteInt(this.m_nAllCheckCode);
		this.WriteInt(this.m_nCompanyID);
		this.WriteInt(this.m_nUserID);

		this.head_writed_ = true;
	}
};

PacketOut.prototype.setCheck = function() {
	this.m_nAllCheckCode = 0;
	var ints = new Uint8Array(this._length);
	for (var i = 0; i < ints.length; i++) {
		var v = this._dataView.getInt8(i); // 每次提取一个int8
		this.m_nAllCheckCode += v;
	}

	var nTmpCode = this.m_nLen + this.m_nHdrLen + this.m_nDevType + this.m_byteGroup + this.m_nSubID +
		this.m_nSeq + this.m_nSrc + this.m_nDest + this.m_nFlags + this.m_byteProVer + this.m_nAllCheckCode;
	this.m_nCheckCode = nTmpCode;
};

PacketOut.prototype.WriteByte = function(v) {
	this._dataView.setInt8(this._pos, v);
	this._pos += 1;
	this._ensureLength();
};

PacketOut.prototype.WriteSByte = function(v) {
	this._dataView.setInt8(this._pos, v);
	this._pos += 1;
	this._ensureLength();
};

PacketOut.prototype.WriteShort = function(v) {
	// var tmp = v;
	// tmp = tmp & 0x00FF;
	//
	// var tmp2 = tmp << 8;
	//
	// var tmp3 = v;
	// tmp3 = tmp3 >> 8;
	//
	// var t = tmp3 | tmp2;
	//
	// this._dataView.setInt16(this._pos, t);


	this._dataView.setInt16(this._pos, v, true);
	this._pos += 2;
	this._ensureLength();
};

PacketOut.prototype.WriteUShort = function(v) {
	// var tmp = v;
	// tmp = tmp & 0x00FF;
	//
	// var tmp2 = tmp << 8;
	//
	// var tmp3 = v;
	// tmp3 = tmp3 >> 8;
	//
	// var t = tmp3 | tmp2;
	//
	// this._dataView.setUint16(this._pos, t);
	this._dataView.setUint16(this._pos, v, true);
	this._pos += 2;
	this._ensureLength();
};

PacketOut.prototype.WriteSysytime = function(v) {
	this.WriteUShort(v.wYear);
	this.WriteUShort(v.wMonth);
	this.WriteUShort(v.wDayOfWeek);
	this.WriteUShort(v.wDay);
	this.WriteUShort(v.wHour);
	this.WriteUShort(v.wMinute);
	this.WriteUShort(v.wSecond);
	this.WriteUShort(v.wMilliseconds);
};

PacketOut.prototype.WriteInt = function(v) {

	// var tmp2 = v;
	// tmp2 = tmp2 & 0x0000FFFF;
	// this.WriteShort(tmp2);
	//
	//
	// var tmp = v;
	//
	// var t2 = tmp >> 16;
	// this.WriteShort(t2);

	this._dataView.setInt32(this._pos, v, true);
	this._pos += 4;
	this._ensureLength();
};

PacketOut.prototype.WriteUInt = function(v) {
	// var tmp2 = v;
	// tmp2 = tmp2 & 0x0000FFFF;
	// this.WriteUShort(tmp2);
	//
	//
	// var tmp = v;
	//
	// var t2 = tmp >> 16;
	// this.WriteUShort(t2);

	this._dataView.setUint32(this._pos, v, true);
	this._pos += 4;
	this._ensureLength();
};


PacketOut.prototype.numberToInt64BE = function(v) {
	var result = [];
	var sign = v < 0;
	if (sign) v = -1 - v;
	for (var i = 0; i < 8; i++) {
		var mod = v % 0x100;
		v = (v - mod) / 0x100;
		result[7 - i] = sign ? mod ^ 0xFF : mod;
	}
	return result;
}

PacketOut.prototype.int64BEtoNumber = function(bytes) {
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

PacketOut.prototype.WriteInt64 = function(v) {
	// var tmp2 = v;
	// tmp2 = tmp2 & 0x00000000FFFFFFFF;
	// this.WriteInt(tmp2);
	//
	// var tmp = v;
	//
	// var t2 = tmp >> 32;
	// this.WriteInt(t2);

	var buff = this.numberToInt64BE(v);
	for (var i = buff.length; i > 0; i--) {
		var t = buff[i - 1];
		this.WriteByte(t);
	}
	// var buff2 = this.int64BEtoNumber(buff);

	this._ensureLength();
};


PacketOut.prototype.WriteString = function(str) {
	str = str || "";
	var byteArray = vue.shared.UTF8.stringToByteArray(str);
	//this.WriteInt(byteArray.length);
	for (var i = 0; i < byteArray.length; ++i) {
		this._dataView.setUint8(this._pos, byteArray[i]);
		this._pos += 1;
	}
	this._ensureLength();
};

PacketOut.prototype.WriteFixedLenString = function(str, len) {
	str = str || "";
	var pos = this._pos;
	var byteArray = vue.shared.UTF8.stringToByteArray(str);
	var l = byteArray.length;
	if (l > len) {
		l = len;
	}
	for (var i = 0; i < l; ++i) {
		this._dataView.setUint8(pos, byteArray[i]);
		pos += 1;
	}
	if (l < len) {
		this._dataView.setUint8(pos, 0);
	}
	this._pos += len;
	this._ensureLength();
};

PacketOut.prototype.WriteBoolean = function(b) {
	this._dataView.setInt8(this._pos, b ? 1 : 0);
	this._pos += 1;
	this._ensureLength();
};

PacketOut.prototype.WriteFloat = function(v) {
	this._dataView.setFloat32(this._pos, v, true);
	this._pos += 4;
	this._ensureLength();
};

PacketOut.prototype.WriteList = function(list, itemWriter) {
	this.WriteInt(list.length);
	list.forEach(itemWriter, this);
};

PacketOut.prototype.dumpInfo = function() {
	cc.log(this._code);
	var buffer = this.getBuffer();
	var str = "";
	for (var i = 0; i < buffer.length; ++i) {
		str += (buffer[i] + ",");
	}
	cc.log(str);
};

export default PacketOut
