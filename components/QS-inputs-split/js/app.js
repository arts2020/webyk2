let log = console.log;
// log = ()=>{};	//打开注释则该插件不打印信息

const requiredSign = '*'; // 必填标识

// 7.3 新增（start）
// 需自己配置（start）
function getSendData(obj) {
	const {
		// 以下参数供以判断
		value, //picker的value值
		launch, // 是否是初始化
		customId, // 自定义标识
		index, // 改变的列的下标（第几列改变）
		linkageNum, // 联动级数
		type, // picker的type
		datas, // 页面当前数据: {data_0: 第一列数据, data_1: 第二列数据, data_2: 第三列数据}
		column // 三级联动中 是第几列获取sendData
	} = obj
	const {
		data_0, // 第一列数据
		data_1 // 第二列数据
	} = datas; // 页面当前数据: {data_0: 第一列数据, data_1: 第二列数据, data_2: 第三列数据}
	let vbName_0; // 第一列数据获取value值的变量名
	let vbName_1; // 第二列数据获取value值的变量名
	switch (customId) { // 根据customId决定vbName的赋值走向
		case '自定义标识':
			vbName_0 = '';
			vbName_1 = '';
			break;
		default:
			vbName_0 = 'value';
			vbName_1 = 'value';
			break;
	}

	let sendData = {}; // 访问接口携带的数据
	switch (linkageNum) {
		case 2: // 二级联动
			sendData.id = data_0[value[0]][vbName_0];
			break;
		case 3: // 三级联动
			if (launch || index === 0) { // 首次初始化 或 第一列更改
				switch (column) {
					case 0: // 获取第一列中用以获取sendData的数据
						sendData.id = data_0[value[0]][vbName_0];
						break;
					case 1: // 获取第二列中用以获取sendData的数据
						sendData.id = data_1[0][vbName_1];
						break;
					default:
						log('column 超限');
						break;
				}
			} else { // 第二列更改
				sendData.id = data_1[value[1]][vbName_1];
			}
			break;
		default:
			log('级数不存在');
			break;
	}
	return sendData; // 最终return sendData

}

function getAsyncDataFc(obj) { // 访问接口获取picker自定义逐级数据
	return new Promise((rs, rj) => {
		uni.showLoading({ //不需要可以删除, 别忘了下面的hideLoading
			title: '获取数据中……'
		})
		setTimeout(() => { // 访问接口获取数据 (需自己修改)
			let data;
			switch (obj.id) {
				case 'a':
					data = [{
						name: 'a_a',
						value: 'a_a'
					}, {
						name: 'a_b',
						value: 'a_b'
					}];
					break;
				case 'b':
					data = [{
						name: 'b_a',
						value: 'b_a'
					}, {
						name: 'b_b',
						value: 'b_b'
					}];
					break;
				case 'c':
					data = [{
						name: 'c_a',
						value: 'c_a'
					}, {
						name: 'c_b',
						value: 'c_b'
					}];
					break;
				case 'a_a':
					data = [{
						name: 'a_a_a',
						value: 'a_a_a'
					}, {
						name: 'a_a_b',
						value: 'a_a_b'
					}]
					break;
				case 'a_b':
					data = [{
						name: 'a_b_a',
						value: 'a_b_a'
					}, {
						name: 'a_b_b',
						value: 'a_b_b'
					}]
					break;
				case 'b_a':
					data = [{
						name: 'b_a_a',
						value: 'b_a_a'
					}, {
						name: 'b_a_b',
						value: 'b_a_b'
					}]
					break;
				case 'b_b':
					data = [{
						name: 'b_b_a',
						value: 'b_b_a'
					}, {
						name: 'b_b_b',
						value: 'b_b_b'
					}]
					break;
				case 'c_a':
					data = [{
						name: 'c_a_a',
						value: 'c_a_a'
					}, {
						name: 'c_a_b',
						value: 'c_a_b'
					}]
					break;
				case 'c_b':
					data = [{
						name: 'c_b_a',
						value: 'c_b_a'
					}, {
						name: 'c_b_b',
						value: 'c_b_b'
					}]
					break;
				default:
					break;
			}
			rs(data);
			uni.hideLoading(); //不需要可以删除
		}, 1000);
	})
}
// 需自己配置（end）


// 尽量不要动他
// 尽量不要动他
// 尽量不要动他
const getPickerAsyncData = async function(obj) { // picker-custom与picker-custom2的逐级获取数据函数
	let _this = this;
	_this.waiting = true; // 在获取数据时不许用户点确定
	const {
		value, // picker的value值
		index, // picker改变的列的下标
		launch, // 是否是初始化
		datas, // 所有picker数据
		oldValue, // 旧的picker的value值
		customId, // 自定义标识
		linkageNum // 联动级数
	} = obj; // picker的value值， 需改变数据的变量名， 是否初始化时使用该函数，页面当前数据: {data_0: 第一列数据, data_1: 第二列数据, data_2: 第三列数据}, 旧的picker的value值, 逐级获取数据时决定携带数据的变量名
	const {
		data_0, // 第一列数据
		data_1 // 第二列数据
	} = datas; // 页面当前数据: {data_0: 第一列数据, data_1: 第二列数据, data_2: 第三列数据}

	// 使用sendData访问接口获取数据, 最终需要给async_1、async_2赋值
	let sendData = {};
	try {
		switch (linkageNum) {
			case 2: // 二级联动
				if (!!_this.memoryData_1[value[0]]) { // 查询记忆数据
					_this.async_1 = [..._this.memoryData_1[value[0]]]; // 直接赋值记忆数据
				} else {
					sendData = getSendData(obj); // 访问接口携带参数
					const newData_1 = await getAsyncDataFc(sendData); // 从接口获取第二列的数据
					_this.async_1 = [...newData_1]; // 赋值
					_this.memoryData_1[value[0]] = [...newData_1]; // 记忆数据
				}
				if (launch) { // 首次初始化 value为传进来的defaultValue
					_this.value[1] = value[1]; // 初始化可以赋值初始化的值
				} else {
					_this.value[1] = 0; // 第二列value重置为0
				}
				break;
			case 3: // 三级联动
				if (launch) { // 首次初始化 value为传进来的defaultValue
					// 获取第二列数据
					sendData = getSendData({ ...obj,
						column: 0
					}); // 访问接口携带参数
					const newData_1 = await getAsyncDataFc(sendData); // 从接口获取第二列的数据
					_this.async_1 = [...newData_1]; // 给第二列赋值
					_this.memoryData_1[value[0]] = [...newData_1]; // 记忆数据
					_this.value[1] = value[1]; // 初始化可以赋值初始化的值
					// 获取第三列数据
					sendData = getSendData({ ...obj,
						datas: { ...datas,
							data_1: [...newData_1]
						},
						column: 1
					}); // 访问接口携带参数
					const newData_2 = await getAsyncDataFc(sendData);
					_this.async_2 = [...newData_2]; // 给第三列赋值
					if (!_this.memoryData_2[value[0]])
						_this.memoryData_2[value[0]] = [];
					_this.memoryData_2[value[0]][value[1]] = [...newData_2]; // 记忆数据
					_this.value[2] = value[2]; // 初始化可以赋值初始化的值
				} else { // picker滑动
					let newData_1;
					let newData_2;
					switch (index) {
						case 0: // 第一列更改
							// 获取第二列数据
							if (!!_this.memoryData_1[value[0]]) { // 查询记忆数据
								newData_1 = [..._this.memoryData_1[value[0]]]; // 直接赋值记忆数据
							} else {
								sendData = getSendData({ ...obj,
									column: 0
								}); // 访问接口携带参数
								newData_1 = await getAsyncDataFc(sendData);
								_this.memoryData_1[value[0]] = [...newData_1]; // 记忆数据
							}
							_this.async_1 = [...newData_1]; // 给第二列赋值
							_this.value[1] = 0; // 初始化可以赋值初始化的值

							// 获取第三列数据
							if (!_this.memoryData_2[value[0]])
								_this.memoryData_2[value[0]] = [];
							if (!!_this.memoryData_2[value[0]][value[1]]) { // 查询记忆数据
								newData_2 = [..._this.memoryData_2[value[0]][value[1]]]; // 直接赋值记忆数据
							} else {
								sendData = getSendData({ ...obj,
									datas: { ...datas,
										data_1: [...newData_1]
									},
									column: 1
								}); // 访问接口携带参数
								newData_2 = await getAsyncDataFc(sendData);
								_this.memoryData_2[value[0]][value[1]] = [...newData_2]; // 记忆数据
							}
							_this.async_2 = [...newData_2] // 给第三列赋值
							_this.value[2] = 0; // 初始化可以赋值初始化的值
							break;
						case 1: // 第二列更改
							log('第二列更改')
							if (!_this.memoryData_2[value[0]])
								_this.memoryData_2[value[0]] = [];
							if (!!_this.memoryData_2[value[0]][value[1]]) { // 查询记忆数据
								log('有记忆数据');
								newData_2 = [..._this.memoryData_2[value[0]][value[1]]]; // 直接赋值记忆数据
							} else {
								log('没有记忆数据');
								sendData = getSendData(obj); // 访问接口携带参数
								newData_2 = await getAsyncDataFc(sendData);
								_this.memoryData_2[value[0]][value[1]] = [...newData_2]; // 记忆数据
							}
							_this.async_2 = [...newData_2]; // 给第三列赋值
							_this.value[2] = 0; // 初始化可以赋值初始化的值
							break;
						default:
							break;
					}
				}
				break;
		}
		_this.oldValue = [...this.value];
		_this.waiting = false;
	} catch (e) {
		//TODO handle the exception
		_this.oldValue = [...this.value];
		_this.waiting = false;

	}
}

// 7.3 新增（end）



const interfaces = {
	baseUrl: '',
	upLoadImg: '', // 服务器地址(上传图片)
};

const inputCustomTapFc = function(customId) { //inputTap custom类型触发的函数, 必须return一个Promise对象, 可以resolve数据给相应的input赋值
	return new Promise((resolve, reject) => {
		switch (customId) {
			default:
				console.log("==========扫码后赋值===22====")
				uni.scanCode({ //示例, 扫码后赋值
					success: function(res) {
						let val = res.result;
						if(val && val.length > 0){
							val = val.substring(val.indexOf("0x"),val.length);
						}
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						console.log('条码内容：' + val);
						resolve(val);
					},
					fail(res) {
						console.log('条码失败：');			
					}
				});
				break;
		}
	})
}

const inputCustomTapCatchFc = function(customId, e) { // inputTap custom类型触发的函数异常时触发的函数, 必须return一个Promise对象, 可以resolve数据给相应的input赋值
	return new Promise((resolve, reject) => {
		switch (customId) {
			case '自定义id':
				break;
			default:

				break;
		}
	})
}

const UpLoadFile = function(customId, filePath) { // 上传文件方法: (自定义上传标识, 文件路径)
	if (filePath.substring(0, 4) === 'http') { //域名替换机制: 判断是否是从后端获取的图片路径, 若是 替换域名字符串为空后resolve. 也可以根据customId动态控制, 不需要则删除此代码
		const replacePath = filePath.replace(interfaces.baseUrl, '');
		return Promise.resolve({
			data: replacePath
		});
	}
	let _this = this;
	let url = '';
	let formData = {};
	let name = '';
	switch (customId) { //判断该项pics类型自带的UpLoadFileType, 根据此值来确定不同的url、formData、name
		case 'UpLoadImage_1': //自定义的标识
			url = '';
			formData = {};
			name = '';
			break;
		default: //若无判断需求可直接写在这里
			url = interfaces.upLoadImg;
			formData = {};
			name = '';
			break;
	}
	if (!url) {
		_this.showToast('上传文件的url不能为空');
		return new Promise((rs, rj) => {
			rj('上传文件的url不能为空');
		});
	}
	if (!filePath) {
		_this.showToast('上传文件的filePath不能为空');
		return new Promise((rs, rj) => {
			rj('上传文件的filePath不能为空');
		});
	}
	return new Promise((reslove, reject) => {
		_this.showLoading('上传文件中');
		const obj = {
			url,
			name,
			filePath,
			success(res) {
				appJS.log('进入UpLoadFile方法的success回调: ' + JSON.stringify(res));
				_this.hideLoading();
				reslove(res)
			},
			fail(err) {
				appJS.log('进入UpLoadFile方法的fail回调')
				appJS.log(JSON.stringify(err))
				_this.hideLoading();
				reject();
			}
		}

		// #ifdef APP-PLUS
		if (plus.os.name.toLowerCase() === 'ios') {
			if (Object.keys(formData).length > 0) obj.url = renderUrlData(obj.url, formData);
		} else {
			obj.formData = formData;
		}
		// #endif
		// #ifndef APP-PLUS
		obj.formData = formData;
		// #endif
		uni.uploadFile(obj);
	})
}

const pics_splice = function(vals, val) { // 拼接图片上传返回后的数据, vals是拼接后的数据， val是新添项
	if (typeof(vals) !== 'string') { // 第一次传进来是一个数组
		vals = val || '|'; // 可更改分隔符
		return vals;
	}
	vals += val ? '|' + val : '|';
	return vals; // 必须return vals
}


const filterTypeObj = { // 内置过滤函数，可根据需求自行添加拓展
	twoDecimalPlaces(value) { // 必须接受一个参数
		value = value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
		value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
		value = value.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3'); //只能输入1个小数 
		return value; // 必须return value
	}
};

const sendSMS = function(customId, phone) { // 发送验证码方法, 需返回生成的验证码
	let code = ''; // 生成验证码
	switch (customId) { // 判断自定义标识
		case '1':
			code = '';
			break;
		default: //若无判断需求可直接写在这里
			code = '123456';
			break;
	}
	//发送验证码
	this.showToast(`发送验证码给${phone}成功,请注意查收`);
	return code; // 必须return生成的验证码
}






/*
 *	一下代码尽量不要动他
 */
/*
 *	一下代码尽量不要动他
 */
/*
 *	一下代码尽量不要动他
 */

const verifyTypeObj = {
	Tel: {
		reg: /^[1][0-9]{10}$/,
		name: '手机号'
	},
	Email: {
		reg: /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/,
		name: '电子邮箱'
	},
	idCart: {
		reg: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
		name: '身份证号'
	},
	NationalNumber: {
		reg: /\d{3}-\d{8}|\d{4}-\d{7}/,
		name: '国内号码'
	},
	QQ: {
		reg: /[1-9][0-9]{4,}/,
		name: 'QQ号'
	},
	PostalCode: {
		reg: /[1-9]\d{5}(?!\d)/,
		name: '邮政编码'
	},
	IpAddress: {
		reg: /\d+\.\d+\.\d+\.\d+/,
		name: 'IP地址'
	},
	Chinese: {
		reg: /[\u4e00-\u9fa5]/,
		name: '中文字符'
	},
	Char: {
		reg: /^[A-Za-z]+$/,
		name: '英文字母'
	},
	Int: {
		reg: /^\d+$/,
		name: '整数'
	},
	Number: {
		reg: /^([1-9]\d*(\.\d+)?)|(\d+(\.\d+))$/,
		name: '数字'
	}
};
const typeObj = {
	input: 'input'
}
const publicProps = {
	name: {
		type: String,
		default: ''
	},
	variableName: {
		type: String,
		default: ''
	},
	required: {
		type: Boolean,
		default: false
	},
	value: {
		type: String,
		deault: ''
	},
	titleFlex: {
		type: [Number, String],
		default: 1
	},
	contentFlex: {
		type: [Number, String],
		default: 4
	},
	titleStyle: {
		type: String,
		default: ''
	},
	contentStyle: {
		type: String,
		default: ''
	},
	boxStyle: {
		type: String,
		default: ''
	},
	title: {
		type: String,
		default: ''
	},
	titleHide: {
		type: Boolean,
		default: false
	},
	fontSize: {
		type: String,
		default: "16px"
	},
	width: {
		type: String,
		default: '100%'
	}
}
import QSFormObj from './QSForm.js'; // 勿动
const _app = {
	log, // 打印管理
	verifyTypeObj, // 内置正则验证
	filterTypeObj, // 内置过滤函数
	typeObj,
	inputCustomTapFc,
	inputCustomTapCatchFc,
	getPickerAsyncData, // picker-custom与picker-custom2的逐级获取数据函数
	requiredSign, // 必填标识
	publicProps, // 公共属性
	showToast(msg) {
		uni.showToast({
			title: msg,
			icon: 'none'
		})
	},
	showLoading(msg, ifmask) {
		uni.showLoading({
			title: msg,
			mask: ifmask || false
		})
	},
	hideLoading() {
		uni.hideLoading();
	},
	UpLoadFile,
	pics_splice,
	sendSMS,
	previewImage(imgPath, currentIndex) {
		if (!(imgPath instanceof Array))
			imgPath = [imgPath];
		uni.previewImage({
			urls: imgPath,
			current: currentIndex || 0
		})
	},
	countDays(Y, M, val, mode) {
		let days = [];
		if (mode !== time) {
			days = new Date(Y, M + 1, 0).getDate();
			if (val) {
				val[2] = val[2] < days - 1 ? val[2] : days - 1;
			}
		}
		return {
			days,
			val
		};
	},
	countYears(sy, ey) {
		let _this = this;
		let y = [];
		let c = ey - sy;
		for (let i = 0; i <= c; i++) {
			y.push(sy + i);
		}
		return y;
	},
	checkbox_status(data) {
		for (let i = 0; i < data.length; i++) {
			if (data[i] || data[i] === 0) data[i] = true;
			else data[i] = false;
		}
		return data;
	},
	regTest(name, val) {
		return verifyTypeObj[name].reg.test(val);
	},
	isNumber(param) {
		return typeof(param) === 'number';
	},
	formatNum(num) {
		return num < 10 ? ('0' + num) : num;
	},
	delForm(obj) {
		QSFormObj.del(obj);
	},
	setForm(obj) {
		QSFormObj.set(obj);
	},
	getForm(name) {
		const {
			status,
			result
		} = QSFormObj.get({
			name
		});
		if (status === 'success') {
			// log('getForm数据成功:' + JSON.stringify(res));
			return new Promise(async (resolve, reject) => {
				const {
					data
				} = result;
				const returnObj ={ 
					name,
					...(await getValue(data))
				};
				resolve(returnObj);
			});
		} else {
			// log('getForm数据失败:' + JSON.stringify(res));
			return Promise.reject(result);
		}
	}
}
export default _app;

function getValue(obj) {
	const returnObj = {
		data: {},
		verifyErr: []
	};
	return new Promise(async (resolve, reject) => {
		for (const o in obj) {
			const {
				title,
				name,
				variableName,
				value,
				type,
				required,
				verifyFc,
				verifyType
			} = obj[o];
			let verifyItem = {result: true, checkErrType: [], title, name, variableName, type };
			switch (type){
				case typeObj.input:
					returnObj.data[o] = value;
					
					if(value==='' && required) {
						verifyItem.result = false;
						verifyItem.checkErrType.push('required');
					}
					
					if(verifyFc&&!verifyFc(value)) {
						if(verifyItem.result)
							verifyItem.result = false;
						verifyItem.checkErrType.push('verifyFc');
					}
					
					if(verifyType&&verifyTypeObj[verifyType]!==undefined&&verifyTypeObj[verifyType].reg&&!verifyTypeObj[verifyType].reg.test(value)) {
						if(verifyItem.result)
							verifyItem.result = false;
						verifyItem.checkErrType.push('verifyType');
					}
					
					if(!verifyItem.result) returnObj.verifyErr.push(verifyItem);
					
					break;
				default:
					break;
			}
		}
		resolve(returnObj);
	})
}


function renderUrlData(u, d) {
	let c = '';
	let n = 0;
	if (d)
		for (let i in d) {
			if (n > 0)
				c += '&' + i + '=' + d[i];
			else
				c += '?' + i + '=' + d[i];
			++n;
		}
	return u + c;
}
