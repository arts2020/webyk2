var config = require('./config.js');
var base = require('./base.js');

var obj = {
	/**
	 * 验证规则
	 */
	ruleitems: {
		digits: [/^\d+$/, "请填写数字"],
		letters: [/^[a-z]+$/i, "请填写字母"],
		date: [/^\d{4}-\d{2}-\d{2}$/, "填写有效的日期，如:1996-06-03"],
		time: [/^([01]\d|2[0-3])(:[0-5]\d){1,2}$/, "请填写有效的时间，00:00到23:59之间"],
		email: [/^[\w\+\-]+(\.[\w\+\-]+)*@[a-z\d\-]+(\.[a-z\d\-]+)*\.([a-z]{2,4})$/i, "请填写有效的邮箱"],
		url: [/^(https?|s?ftp):\/\/\S+$/i, "请填写有效的网址"],
		qq: [/^[1-9]\d{4,}$/, "请填写有效的QQ号"],
		IDcard: [/^\d{6}(19|2\d)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)?$/, "请填写正确的身份证号码"],
		tel: [/^(?:(?:0\d{2,3}[\- ]?[1-9]\d{6,7})|(?:[48]00[\- ]?[1-9]\d{6}))$/, "请填写有效的电话号码"],
		mobile: [/^1[3-9]\d{9}$/, "请填写有效的手机号"],
		zipcode: [/^\d{6}$/, "请检查邮政编码格式"],
		chinese: [/^[\u0391-\uFFE5]+$/, "请填写中文字符"],
		username: [/^[\w]{3,12}$/, "请填写3-12位数字、字母、下划线"],
		password: [/^[\S]{6,16}$/, "请填写6-16位字符，不能包含空格"],
		code: [/^[\S]{6}$/, "请填写6位数验证码"],
		empty: [/^\S/, '请填入内容']
	},

	/**
	 * 验证input规则是否正确
	 */
	check: function(rule,value) {
		var This = this;
		var verify = true;
		var msg = '';
		
		base.each(rule.split('|'), function(j, m) {
			if (!This.ruleitems[m][0].test(value)) {
				verify = false;
				msg = This.ruleitems[m][1];
				return false;
			}
		});
		
		return {verify,msg};
	},
	
	/**
	 * 处理input的触发器数据
	 */
	form_item(form,json){
		var formverify = 1;
		var item = form.data[json.name];
		item.verify = json.data.verify;
		item.value = json.data.value;
		// 设置表单提交按钮状态   1:能提交,2:未达到提交条件,3:正在提交,4:禁止提交
		if(form.verify==1 || form.verify==2){
			base.each(form.data,function(i,n){
				if(n.verify==false){
					formverify = 2;
					return false;
				}
			})
			form.verify = formverify
		}
		
		switch(json.event){
			case 'input_verify':
				
				break;
			case 'radio_verify':


				break;
			case 'textarea_verify':
				
				break;
		}
	},
	
	/**
	 * 处理form触发器数据
	 */
	form_togger(form,json){
		var This = this;
		switch(json.event){
			case 'form_verify':
				form.verify = json.data.verify;
				return This.form_data(form);
				break;
		}
	},
	
	/**
	 * 组装表单所有数据
	 */
	form_data(form){
		var This = this;
		var json = {};
		base.each(form.data,function(i,n){
			json[i] = n.value;
		});
		return json;
	},
	
	/**
	 * 初始化数据
	 */
	data_init(from,data){
		var This = this;
		var form_verify = true;
		base.each(from.data,function(i,n){
			if( base.isset(data[i]) ){
				
				if(base.isset(n.rule)){
					var check = This.check(n.rule,data[i]);
					n.value = data[i];
					n.verify = check.verify;
					form_verify = n.verify;
				}else{
					n.value = data[i];
					n.verify = true;
				}
				
			}
		})
		if(from.verify==1 || from.verify==2){
			from.verify = form_verify?1:2;
		}
	}

}

module.exports = obj;
