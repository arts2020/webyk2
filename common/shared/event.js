export default {
    handlers_: [],

    attach: function (name, listener, autoObserver,obj) {
        if (!name || name === 0) {
            uni.cclog("==事件名为空，无法注册事件===" + autoObserver);
            return;
        }
        var rval = this.judgeRegisted(name, autoObserver , listener);
        if (rval === 0) {
            var hds = {
                handler: listener,
                name: name,
                autoObserver: autoObserver,
                obj: obj
            };
            this.handlers_.push(hds);
        } else if(rval === 1){
            for (var i = 0; i < this.handlers_.length; i++) {
                var hds = this.handlers_[i];
                if (hds.name === name && hds.autoObserver && autoObserver && hds.autoObserver === autoObserver) {
                    hds.handler = listener;
                    uni.cclog("==事件名===" + name + "=＝＝＝=侦听者=＝＝＝＝=" + autoObserver + "已经被代替了，请确定是否要注册");
                    break;
                }
            }
        }else if(rval === 2){
            uni.cclog("==事件名=＝＝＝不存在＝＝＝autoObserver＝=" + autoObserver + "===name=" + name);
        }
    },

    judgeRegisted: function (name, autoObserver , listener) {
        if (!name || !autoObserver) {
            uni.cclog("把异常抛出来=" + name);
            uni.cclog("======空的事件名字  空的侦听者名字============");
            return 2; //异常
        }
        for (var i = 0; i < this.handlers_.length; i++) {
            var hds = this.handlers_[i];
            if (hds.name === name && hds.autoObserver && (hds.autoObserver === autoObserver) && (hds.handler === listener) ) {
                return 1;//已存在
            }
        }
        return 0; //可以加入
    },


    printAllEvent: function () {
        for (var i = 0; i < this.handlers_.length; i++) {
            {
                var hds = this.handlers_[i];
                uni.cclog("===hds.name===" + hds.name + "===hds.autoObserver===" + hds.autoObserver);
            }
        }
    },

    trigger: function (name, obj) {
        if (!name) {
            uni.cclog("======空的事件名字 无法抛出事件=0===========");
            return;
        }

        var funs = [];
        if (this.handlers_.length > 0) {
            for (var i = 0; i < this.handlers_.length; i++) {
                var hdcell = this.handlers_[i];
                if (hdcell.name === name && hdcell.handler) {

                    if (hdcell.obj && hdcell.obj != undefined && hdcell.handler.call && hdcell.handler.call !== undefined) {
                        funs.push({ funname : hdcell.handler , obj : hdcell.obj , data : obj });
                    }else{
                        cc.warn("===无人处理的事件====name=",name);
                    }
                }
            }
        }

        if (funs.length > 0){
            for (var i = 0; i < funs.length; i++) {
                var datacell = funs[i];
                datacell.funname.call(datacell.obj , datacell.data);
            }
        }
    },

    removeByHandler: function (handle) {
        if (!handle) {
            uni.cclog("======空的回调方法 无法移除事件============");
            return;
        }
        for (var i = (this.handlers_.length - 1); i >= 0; i--) {
            var hds = this.handlers_[i];
            if (!hds.handler === handle) {
                this.handlers_.splice(i, 1);
            }
        }
    },

    //删除这事件的所有监听者
    removeByName: function (name) {
        if (!name) {
            uni.cclog("======空的事件名  无法移除事件============");
            return;
        }
        for (var i = (this.handlers_.length - 1); i >= 0; i--) {
            var hds = this.handlers_[i];
            if (hds.name === name) {
                this.handlers_.splice(i, 1);
            }
        }
    },

    //删除某个监听者
    removeByObserverName: function (name) {
        if (!name) {
            uni.cclog("======  空的侦听者名字， 无法移除事件============");
            return;
        }
        for (var i = (this.handlers_.length - 1); i >= 0; i--) {
            var hds = this.handlers_[i];
            if (hds.autoObserver && hds.autoObserver === name) {
                this.handlers_.splice(i, 1);
            }
        }
    },

    //删除某个事件某个监听者
    removeByEventNameAndObserverName: function (ename, oname) {
        if (!ename || !oname) {
            uni.cclog("======空的事件名 或空的侦听者名字， 无法移除事件=====ename=======" + ename + "===oname===" + oname);
            return;
        }

        for (var i = (this.handlers_.length - 1); i >= 0; i--) {
            var hds = this.handlers_[i];
            if (hds.name === ename && hds.autoObserver && oname && hds.autoObserver === oname) {
                this.handlers_.splice(i, 1);
            }
        }
    },

    clearAllListener: function () {
        this.handlers_ = [];
    }
};