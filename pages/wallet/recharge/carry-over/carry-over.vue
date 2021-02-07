<template>
	<view class="carry-over">
		<uni-nav-bar background-color="#F6F7F9" left-icon="back" :statusBar="true" :fixed="true" :title="m_asset.name+'转账'" @clickLeft="btnBack"></uni-nav-bar>
		<view class="carry-addr">
			<view class="carry-title">收款地址</view>
		    <view class="addr">
				<input type="text" :placeholder="m_asset.name+'地址'" v-model="address" placeholder-class="tipClass"/>
			    <image src="../../../../static/image/index/address.png" mode="" @tap="goAddressList"></image>
			</view>
		</view>
		<view class="carry-count">
			<view class="carry-title">
				<text>金额</text><text>{{m_balane || 0}} {{m_asset.name}}</text>
			</view>
			<view class="count">
				<view class="input-count">
					<input type="text" placeholder="0" placeholder-class="tipClass-2" v-model="count"/>
				</view>
				<view class="bak">
					<text>备注</text>
					<input type="text"  v-model="bak"/>
				</view>
			</view>
		</view>		
		<view class="fee" @tap="goSetting">
			<text>矿工费</text>
			<view class="fee-info">
				<view class="coin">{{count}}{{m_asset.name}}</view>
				<view class="rmb">￥{{rmb}}</view>
			</view>
			<image src="../../../../static/image/mine/arrow-left.svg" mode=""></image>
		</view>
		<view class="confirm-ok" @click="btnConfirm">转账</view>
	    <uni-popup type="bottom" ref="tipPop">
			<view class="tip-content">
				<uni-icons @click="cancell(1)" type="closeempty" color="#444444" size="30" class="close-icon"></uni-icons>
				<view class="tip-title">风险提示</view>
				<view class="ok_btn" @tap="confirmKnow">我知晓了</view>
			</view>
		</uni-popup>
		<uni-popup type="center" ref="pasdPop" class="pasdTip">
			<view class="main-content">
				<view class="title">请输入密码</view>
				<view class="input-box">
					<input type="text" password placeholder="密码" v-model="password" />
				</view>
				<view class="btns">
					<view class="cancell" @click="cancell(2)">取消</view>
					<view class="ok" @click="confirmOk">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		created() {
			// this.onRefresh();
			// this.getGas();
			// this.util.EventUtils.addEventListenerCustom(this.dal.Wallter.evtTransResult, this.onTransResult);
			// this.util.EventUtils.addEventListenerCustom(this.dal.Wallter.evtBalance, this.onRefresh);
			// this.util.EventUtils.addEventListenerCustom(this.dal.Setting.evtCheckCapitalPassword, this.onCheckCapitalPassword);
		},
		destroyed() {
			// this.util.EventUtils.removeEventCustom(this.dal.Wallter.evtTransResult, this.onTransResult);
			// this.util.EventUtils.removeEventCustom(this.dal.Wallter.evtBalance, this.onRefresh);
			// this.util.EventUtils.removeEventCustom(this.dal.Setting.evtCheckCapitalPassword, this.onCheckCapitalPassword);
		},
		onLoad(option) {
			if (option.query) {
				var data = JSON.parse(option.query);
				console.log(data)
				this.m_asset = data;
				if (this.m_asset.name == "filecoin") {
					this.m_asset.name = "FIL";
				}
			}
		},
		data() {
			return {
				count: "",
				rmb:"0.124",
				address: "",
				password: "",
				bak:"",
				//当前资产信息
				m_asset: {},
				m_balane: "",
				//默认矿工费
				feeInfo:{
					coin:"0.004500",
					rmb:"39.28",
					value:'89.00GWEI',
					name: "快速",
					time:'5分钟'
				}
			}
		},
		methods: {
			goAddressList(){
				this.$openPage({name:"address-list",query:{type:1}})
			},
			goSetting(){
				let params = {
					  coinType:this.m_asset.name,
					  ...this.feeInfo
					}
				this.$openPage({name:"setting-fee",query:params})
			},
			btnBack: function() {
				this.util.UiUtils.switchBackPage();
			},
			btnScan: function() {
				//#APP-PLUS
				// #ifndef APP-PLUS
				this.util.UiUtils.showToast("请使用手机操作")
				return;
				// #endif

				// console.log("==this.PlatformInfo==",this.PlatformInfo)
				uni.scanCode({ //示例, 扫码后赋值
					success: function(res) {
						let val = res.result;
						if (val && val.length > 0) {
							val = val.substring(val.indexOf("0x"), val.length);
						}
						this.address = val;
					}.bind(this),
					fail(res) {
						console.log('条码失败：');
					}
				});
			},

			onRefresh: function() {
				if (this.m_asset == "eth") {
					// this.m_balane = this.dal.Ethers.getBalance().toFixed(6);
				} else if (this.m_asset == "usdt") {
					// this.m_balane = this.dal.UsdtErc20.getBalance().toFixed(6);
				} else if (this.m_asset == "btc") {
					// this.m_balane = this.dal.BtcWallter.getBalance().toFixed(6);
				} else if (this.m_asset == "filecoin") {
					// this.m_balane = this.dal.FileCoinWallter.getBalance().toFixed(6);
				}
			},

			onTransResult(data) {
				// this.dal.WallterTranser.onTransfer(this.m_asset, this.count, this.address, data.tx);
				// this.dal.Common.
				setTimeout(function() {
					uni.navigateBack();
				}, 500)
			},
			//点击转账
			btnConfirm() {
             // 对地址数量和矿工费进行校验并打开风险提示框
			 
			// 	if (!this.util.UiUtils.getIsCanTrans()) {
			// 		return;
			// 	}

				let address = this.address.replace(new RegExp(/( )/g), "");
				let count = this.count.replace(new RegExp(/( )/g), "");
				// let password = this.password.replace(new RegExp(/( )/g), "");

				if (address.length <= 0) {
					this.util.UiUtils.showToast("请输入转出的地址")
					return;
				}
				if (!this.dal.Wallter.isValidAddress(address)) {
					this.util.UiUtils.showToast("请输入正确的地址")
					return;
				}
				if (this.m_balane <= 0) {
					this.util.UiUtils.showToast(this.m_asset + "可用余额不足")
					return;
				}
				if (count.length <= 0) {
					this.util.UiUtils.showToast("请输入转出的数额")
					return;
				}
				// if (this.gas.length <= 0) {
				// 	this.util.UiUtils.showToast("请输入矿工费")
				// 	return;
				// }
			// 	let sum = count * 1 + this.gas / 100000 * 1;
			// 	if (this.m_balane < sum) {
			// 		this.util.UiUtils.showToast(this.m_asset + "可用余额不足")
			// 		return;
			// 	}

			// 	let selfAddress = this.dal.Wallter.getAddress().toLowerCase();
			// 	if (address.toLowerCase() == selfAddress) {
			// 		this.util.UiUtils.showToast("不允许对自己进行转帐")
			// 		return;
			// 	}
			// 	uni.showModal({
			// 		title: this.getLocalStr("tip_title"),
			// 		content: "您确定要转帐吗？",
			// 		confirmText: this.getLocalStr("btnstring_confirm"),
			// 		showCancel: true,
			// 		success: function(res) {
			// 			if (res.confirm) {
			// 				this.util.UiUtils.showLoading("");
			// 				this.dal.Setting.onCheckCapitalPassword(password);
			// 			}
			// 		}.bind(this)
			// 	});
			// },
			// onCheckCapitalPassword: function(data) {
			// 	this.util.UiUtils.showLoading("");
			// 	let val = this.gas;
			// 	let gas = parseInt(val) * Math.pow(10, 8);
			// 	gas = '0x' + parseInt(gas).toString(16);

			// 	if (this.m_asset == "eth") {
			// 		this.dal.Ethers.sendTransaction(this.address, this.count, gas)
			// 	} else if (this.m_asset == "usdt") {
			// 		this.dal.UsdtErc20.sendTransaction(this.address, this.count, gas)
			// 	} else if (this.m_asset == "btc") {
			// 		this.dal.BtcWallter.sendTransaction(this.address, this.count, gas)
			// 	} else if (this.m_asset == "filecoin") {
			// 		this.dal.FileCoinWallter.sendTransaction(this.address, this.count, gas)
			// 	}
			this.$refs.tipPop.open();
			},
			//点击我知晓了
			confirmKnow(){
				this.$refs.pasdPop.open();
			},
			cancell(e){
				if(e==2){
					this.password = "";
					this.$refs.pasdPop.close();
					this.$refs.tipPop.close();
				}else if(e==1){
					this.$refs.tipPop.close();
				}
			},
			//点击密码提示框的确定
            confirmOk(){
				//检查密码
				if(!this.password){
					this.util.UiUtils.showToast("请输入密码");
					return;
				}
				// 转账操作
				
			},
			isETHValidAddress: function(input) {
				if (StrUtil.isEmpty(input) || !input.startsWith("0x"))
					return false;
				return isValidAddress(input);
			},
		}
	}
</script>

<style lang="scss">
	@import 'carry-over.scss';
	
</style>
