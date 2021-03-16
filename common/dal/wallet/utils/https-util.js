const http = require('http');
// const querystring = require('../../../../node_modules/querystring');
const URL = require('url');

import Vue from 'vue'
var vue = Vue.prototype

const HttpUtils = {
	//method GET POST
	async request(url, method, hdata) {
		// console.log("====const===HttpUtils==request======", method)
		// console.log("====const===HttpUtils==url======", url)
		return new Promise(function(resolve, reject) {
			console.log("====const===HttpUtils==request====1==")
			var headers = {
				'Authorization':"Basic MW0wN1BhUkhnYWdONE5yWGdvTkFRcHdia0g5OmEzYjFkMWY0NGFkYmM3ZGFmNzMzY2FhZWVkODRjZDU5",
				'Content-Type': 'application/json;',
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
				// 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:70.0) Gecko/20100101 Firefox/70.0'
			}
			if (method == "GET") {
				headers = {
					'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:70.0) Gecko/20100101 Firefox/70.0'
				}
			}
			if(url.indexOf("9092") < 0){
				headers = null
			}
			// console.log("====const===HttpUtils==request====headers==",headers)
			uni.request({
				url: url,
				method: method,		
				dataType: 'json',
				data: hdata,
				header: headers,
				success: (res) => {
					console.log("====1===HttpUtils==complete======", res)
					resolve(res.data)
				},
				fail: (err) => {
					console.log("====2===HttpUtils==err======", err)
					reject(err)
				},
				complete: (res) => {
					console.log("====3===HttpUtils==complete======", res)
				}
			});
		})
		// console.log("====const===HttpUtils==request==333====", url)
	}
}
module.exports = {
	HttpUtils
};
