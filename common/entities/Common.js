const Common = {
    getSystemTimeStruct: function () {
        var infostruct = {
            wYear: 0,
            wMonth: 0,
            wDayOfWeek: 0,
            wDay: 0,
            wHour: 0,
            wMinute: 0,
            wSecond: 0,
            wMilliseconds: 0
        };

        return infostruct;
    },

    parseSystemTime: function (packetIn) {
        var time = this.getSystemTimeStruct();
        time.wYear = packetIn.ReadUShort();
        time.wMonth = packetIn.ReadUShort();
        time.wDayOfWeek = packetIn.ReadUShort();
        time.wDay = packetIn.ReadUShort();
        time.wHour = packetIn.ReadUShort();
        time.wMinute = packetIn.ReadUShort();
        time.wSecond = packetIn.ReadUShort();
        time.wMilliseconds = packetIn.ReadUShort();
        return time;
    },

    getSystemTime: function () {
        var systime = new Date();

        var t = this.getSystemTimeStruct();
        t.wYear = systime.getFullYear();
        t.wMonth = systime.getMonth() + 1; // (0-11,0代表1月)
        t.wDayOfWeek = systime.getDay();
        t.wDay = systime.getDate();
        t.wHour = systime.getHours();
        t.wMinute = systime.getMinutes();
        t.wSecond = systime.getSeconds();
        t.wMilliseconds = systime.getMilliseconds();

        return t;
    }
}

export default Common