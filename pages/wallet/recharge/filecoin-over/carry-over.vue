<template>
	<view class="carry-over">
		<bar ref="bar"></bar>
		<view @tap="btnBack()" class="safe-header">
			<image src="../../../static/image/login/left.svg" />
			<text>{{m_asset.toLocaleUpperCase()}}转账</text>
		</view>
		<view class="carry-content">
			<view class="carry-title">转账地址</view>
			<QSInput :maxlength="70" style="background-color: #FFFFFF;" inputwidth="94%" name="address" placeholder="输入或长按粘贴地址"
			 :filterFc="userNameFilterInput" variableName="address" title="" customTapIcon="scanning" customId="1000" v-model="address"
			 focusBorderColor="#FFFFFF;" blurBorderColor="#e5e5e5"></QSInput>
		</view>
		<view class="carry-count">
			<view class="carry-title">转账数量</view>
			<QSInput :maxlength="16" inputwidth="94%" name="count" style="border-bottom: 1px solid rgba(0,0,0,0.06);height: 40px;"
			 placeholder="请输入转出数额" :filterFc="countFilterInput" variableName="count" title="" v-model="count" focusBorderColor="#FFFFFF"
			 blurBorderColor="#FFFFFF"></QSInput>
			<view class="count">可用数量：{{m_balane || 0}} {{m_title.toLocaleUpperCase()}}</view>
		</view>
		<view class="carry-count">
			<view class="label-font">
				<text class="carry-title">资金密码</text>
				<!-- <image @input="InputEye" @tap="btnEye" class="eye" :src="eyeImg" /> -->
			</view>
			<QSInput :maxlength="16" inputwidth="94%" name="password" style="border-bottom: 1px solid rgba(0,0,0,0.06);"
			 placeholder="请输入资金密码" :filterFc="passWordFilterInput" variableName="password" password title="" v-model="password"
			 focusBorderColor="#FFFFFF" blurBorderColor="#FFFFFF"></QSInput>
		</view>
		<view @tap="btnConfirm()" class="container-login">确认转账</view>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	export default {
		components: {
			Bar
		},
		created() {
			this.onRefresh();
			this.getGas();
			this.util.EventUtils.addEventListenerCustom(this.dal.LotusWallter.evtTransResult, this.onTransResult);
			this.util.EventUtils.addEventListenerCustom(this.dal.Wallter.evtBalance, this.onRefresh);
			this.util.EventUtils.addEventListenerCustom(this.dal.Setting.evtCheckCapitalPassword, this.onCheckCapitalPassword);
		},
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.LotusWallter.evtTransResult, this.onTransResult);
			this.util.EventUtils.removeEventCustom(this.dal.Wallter.evtBalance, this.onRefresh);
			this.util.EventUtils.removeEventCustom(this.dal.Setting.evtCheckCapitalPassword, this.onCheckCapitalPassword);
		},
		onLoad(option) {
			if (option) {
				var data = JSON.parse(option.query);
				this.m_asset = data.param.asset;
				this.m_title = this.m_asset;
				console.log('==this.m_title.toLocaleLowerCase()=', this.m_title.toLocaleLowerCase())
				if (this.m_title.toLocaleLowerCase() == "filecoin") {
					this.m_title = "FIL";
				}
			}
		},
		data() {
			return {
				m_gitems: [],
				current: 1,
				eyeImg: '../../../static/image/login/closeEye.png',
				count: "",
				address: "",
				password: "",
				m_asset: "btc",
				m_title: "btc",
				m_balane: "",
				isShowPassword: false,
				showAddressClearIcon: false,
				showAmountClearIcon: false,
				showPwdClearIcon: false,
				showClearIcon: false, //清除按钮
				userNameFilterInput(value) {
					var specialStr = value.replace(/[^\w\.\/]/ig, '')
					return specialStr;
				},
				countFilterInput(value) {
					return value;
				},
				passWordFilterInput(value) {
					// uni.cclog("=====passWordFilterInput=======", value)	
					return value;
				},
				inputCustomTapFc(value) {
					uni.cclog("=====inputCustomTapFc=======", value)
				}
			}
		},
		methods: {
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
					this.m_balane = this.dal.Ethers.getBalance().toFixed(6);
				} else if (this.m_asset == "usdt") {
					this.m_balane = this.dal.UsdtErc20.getBalance().toFixed(6);
				} else if (this.m_asset == "btc") {
					this.m_balane = this.dal.BtcWallter.getBalance().toFixed(6);
				} else if (this.m_asset == "filecoin") {
					this.m_balane = this.dal.FileCoinWallter.getBalance().toFixed(6);
				}
				console.log("==3===this.m_balane=", this.m_balane)
				console.log("==3===this.m_asset=", this.m_asset)
			},

			onTransResult(data) {
				console.log("==3===onTransResult=", data)
				if(data){
					this.dal.WallterTranser.onTransfer(this.m_asset, this.count, this.address, data.tx);
					// this.dal.Common.
					setTimeout(function() {
						uni.navigateBack();
					}, 500)
				}
			},

			radioChange: function(evt) {
				for (let i = 0; i < this.m_gitems.length; i++) {
					if (this.m_gitems[i].value === evt.target.value) {
						this.current = i;
						this.gas = this.m_gitems[i].value;
						break;
					}
				}
				console.log('==this.gas==', this.gas)
			},
			getGas: async function() {
				this.m_gitems = [];
				let price = await this.dal.Wallter.getGasPriceAsync()
				console.log('==this.price==', price)
				let v0 = {
					value: price.safeLow + "",
					name: "较慢"
				}
				let v1 = {
					value: price.average + "",
					name: "普通"
				}
				let v2 = {
					value: price.fast + "",
					name: "较快"
				}
				this.gas = price.average;
				this.m_gitems.push(v0)
				this.m_gitems.push(v1)
				this.m_gitems.push(v2)
			},

			btnConfirm() {
				console.log("==this.address==", this.address)

				if (!this.util.UiUtils.getIsCanTrans()) {
					return;
				}

				let address = this.address.replace(new RegExp(/( )/g), "");
				let count = this.count.replace(new RegExp(/( )/g), "");
				let password = this.password.replace(new RegExp(/( )/g), "");

				if (address.length <= 0) {
					this.util.UiUtils.showToast("请输入转出的地址")
					return;
				}
				
				if (this.m_balane <= 0) {
					this.util.UiUtils.showToast(this.m_asset + "可用余额不足")
					// return;
				}
				if (count.length <= 0) {
					this.util.UiUtils.showToast("请输入转出的数额")
					return;
				}
				// if (this.gas.length <= 0) {
				// 	this.util.UiUtils.showToast("请输入矿工费")
				// 	return;
				// }
				if (password.length <= 0) {
					this.util.UiUtils.showToast("密码不能为空")
					return;
				}

				let sum = count * 1 + this.gas / 100000 * 1;
				if (this.m_balane < sum) {
					console.log("====getGasPriceAsync=data==1==sum==", sum)
					this.util.UiUtils.showToast(this.m_asset + "可用余额不足")
					return;
				}

				let selfAddress = this.dal.LotusWallter.getAddress().toLowerCase();
				if (address.toLowerCase() == selfAddress) {
					this.util.UiUtils.showToast("不允许对自己进行转帐")
					return;
				}
				uni.showModal({
					title: this.getLocalStr("tip_title"),
					content: "您确定要转帐吗？",
					confirmText: this.getLocalStr("btnstring_confirm"),
					showCancel: true,
					success: function(res) {
						if (res.confirm) {
							this.util.UiUtils.showLoading("");
							this.dal.Setting.onCheckCapitalPassword(password);
						}
					}.bind(this)
				});
			},
			onCheckCapitalPassword: function(data) {
				this.util.UiUtils.showLoading("");
				let val = this.gas;
				console.log("====getGasPriceAsync=data==1==gas==", val)
				let gas = parseInt(val) * Math.pow(10, 8);
				gas = '0x' + parseInt(gas).toString(16);

				console.log("====getGasPriceAsync=data====gas==", gas)
				this.dal.FileCoinWallter.sendTransaction(this.address, this.count)
			},

			isETHValidAddress: function(input) {
				if (StrUtil.isEmpty(input) || !input.startsWith("0x"))
					return false;
				return isValidAddress(input);
			},

			btnEye: function() {
				console.log("========")
				this.isShowPassword = !this.isShowPassword;
				if (this.isShowPassword) {
					this.eyeImg = "../../../static/image/login/eye.png"
				} else {
					this.eyeImg = "../../../static/image/login/closeEye.png"
				}
			},
		}
	}
</script>

<style lang="scss">
	@import 'carry-over.scss';
	
</style>
