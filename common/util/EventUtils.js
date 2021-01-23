// Event相关的全局方法
const EventUtils = {
	addEventListenerCustom: function(eventname, hd) {
		uni.$on(eventname, hd);
	},

	dispatchEventCustom: function(eventname, obj) {
		uni.$emit(eventname, obj);
	},

	removeEventCustom: function(eventname, hd) {
		uni.$off(eventname, hd);
	}
}

export default EventUtils
