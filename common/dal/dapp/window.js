import Vue from 'vue'
var vue = Vue.prototype

var window = {
	ethereum: {
		isMetaMask: true,
		on: function(...args) {
			console.log("=====on===00000=")
		},
		removeListener: function(...args) {
			console.log("=====removeListener==0000==")
		}
	},
	web3: {}
};
