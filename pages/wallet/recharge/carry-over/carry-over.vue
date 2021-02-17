<template>
	<view class="carry-over">
		<uni-nav-bar background-color="#F6F7F9" left-icon="back" :statusBar="true" :fixed="true" right-icon="scan" :title="m_asset.name+'  '+btnstring_carry"
		 @clickLeft="btnBack" @clickRight="btnScan"></uni-nav-bar>
		<view class="carry-addr">
			<view class="carry-title">{{title_str6}}</view>
			<view class="addr">
				<textarea type="text" :placeholder="title_str9" v-model="address" placeholder-class="tipClass" />
				<image src="../../../../static/image/index/address.png" mode="" @tap="goAddressList"></image>
			</view>
		</view>
		<view class="carry-count">
			<view class="carry-title">
				<text>{{title_str7}}</text><text>{{m_balane || 0}} {{m_asset.name}}</text>
			</view>
			<view class="count">
				<view class="input-count">
					<input type="text" placeholder="0" placeholder-class="tipClass-2" v-model="count" />
				</view>
				<view class="bak">
					<text>{{title_str8}}</text>
					<input type="text" v-model="bak" />
				</view>
			</view>
		</view>
		<view class="fee" @tap="goSetting" v-if="m_chain.isgas">
			<text>{{seeting_fee_str1}}</text>
			<view class="fee-info">
				<view class="coin">{{m_feeInfo.money}}</view>
				<view class="rmb">￥{{m_feeInfo.rmb}}</view>
			</view>
			<image src="../../../../static/image/mine/arrow-left.svg" mode=""></image>
		</view>
		<view class="confirm-ok" @click="btnConfirm">{{btnstring_carry}}</view>
		<uni-popup type="center" ref="pasdPop" class="pasdTip">
			<view class="main-content">
				<view class="title">{{pasd_title}}</view>
				<view class="input-box">
					<input type="text" password :placeholder="pasd_title" v-model="password" />
				</view>
				<view class="btns">
					<view class="cancell" @click="cancell">{{btnstring_cancle}}</view>
					<view class="ok" @click="confirmOk">{{btnstring_confirm}}</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				count: "",
				rmb: "0.124",
				address: "",
				password: "",
				bak: "",
				//当前资产信息
				m_asset: {
					name: "ETH"
				},
				//当前链
				m_chain:{},
				m_balane: 0,
				//默认矿工费
				m_feeInfo: {
					money: 0,
					rmb: 0,
					index:0
				}
			}
		},
		onLoad(option) {
			let params = JSON.parse(option.query);
			if(Object.keys(params).length!=0){
				console.log("=====当前代币信息========",params)
				this.m_asset = params;
				// if(params.money){
				// 	this.m_feeInfo ={
				// 		money:params.money,
				// 		rmb:params.rmb
				// 	}
				// }
			}
		    this.initword();
		},
		onShow() {
			//获取临时地址
			let item = this.dal.Address.getTempParamsByCarry()
			if (Object.keys(item).length != 0) {
				this.address = item.address;
				this.count=item.count;
				this.bak = item.bak;
				this.m_asset = item.m_asset;
				this.m_feeInfo = item.m_feeInfo;
			}
			this.m_chain = this.dal.Chain.getAssets(this.m_asset.chaintype)||{isgas:false};
			console.log('==========当前链============',this.m_chain)
			
			//获取当前余额			
		   this.m_balane = this.dal.WalletManage.getBalance(this.m_asset.contract)
		},
		destroyed() {
			this.dal.Address.clearTempParamsByCarry();
		},
		methods: {
			initword(){
				this.btnstring_carry = this.getLocalStr('btnstring_carry');
				this.seeting_fee_str1 = this.getLocalStr('seeting_fee_str1');
				this.pasd_title = this.getLocalStr("pasd_title")
				this.pasd_err_blank = this.getLocalStr("pasd_err_blank")
				this.pasd_err_tip = this.getLocalStr("pasd_err_tip")
				this.btnstring_confirm = this.getLocalStr("btnstring_confirm")
				this.btnstring_cancle = this.getLocalStr("btnstring_cancle")
				this.title_str6 = this.getLocalStr("title_str6")
				this.title_str7 = this.getLocalStr("title_str7")
				this.title_str8 = this.getLocalStr("title_str8")
				this.title_str9 = this.getLocalStr("title_str9")
				this.tip_use_phone = this.getLocalStr("tip_use_phone")
				this.err_tip_str1 = this.getLocalStr("err_tip_str1")
				this.err_tip_str2 = this.getLocalStr("err_tip_str2")
				this.err_tip_str3 = this.getLocalStr("err_tip_str3")
				this.err_tip_str4 = this.getLocalStr("err_tip_str4")
			},
			goAddressList() {
				let params = {
					address:this.address,
					count:this.count,
					bak:this.bak,
					m_asset:this.m_asset,
					m_feeInfo:this.m_feeInfo,
					backType:1
				}
				this.dal.Address.saveTempParamsByCarry(params);
				
				this.$openPage({
					name: "address-list",
				})
			},
			goSetting() {
				let chain = this.dal.Chain.getChainInfo(this.m_asset.chaintype);
				let params = {
					address:this.address,
					count:this.count,
					bak:this.bak,
					m_asset:this.m_asset,
					m_feeInfo:this.m_feeInfo,
					backType:1
				}
				
				this.dal.Address.saveTempParamsByCarry(params)
				
				this.$openPage({
					name: 'setting-'+chain.name.toUpperCase()+'-fee'
				})
			},
			btnBack: function() {
				this.util.UiUtils.switchBackPage();
			},
			btnScan: function() {
				//#APP-PLUS
				// #ifndef APP-PLUS
				this.util.UiUtils.showToast(this.tip_use_phone)
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
			//点击转账
			btnConfirm() {
				// 对地址数量和矿工费进行校验并打开风险提示框

				// 	if (!this.util.UiUtils.getIsCanTrans()) {
				// 		return;
				// 	}

				let address = this.address.replace(new RegExp(/( )/g), "");
				let count = this.count.replace(new RegExp(/( )/g), "");
				
				if (address.length <= 0) {
					this.util.UiUtils.showToast(this.err_tip_str1)
					return;
				}

				if (count.length <= 0) {
					this.util.UiUtils.showToast(this.err_tip_str2)
					return;
				}
				if (this.m_chain.isgas && !this.m_feeInfo.money) {
					this.util.UiUtils.showToast(this.err_tip_str3)
					return;
				}
				let sum = count * 1 + this.m_feeInfo.money / 100000 * 1;
				if (this.m_balane < sum) {
					this.util.UiUtils.showToast(this.err_tip_str4)
					return;
				}

				let walletInfo = this.dal.WalletManage.getCurrWallet();
				if (this.address.toLowerCase() == walletInfo.address.toLowerCase()) {
					this.util.UiUtils.showToast(this.err_tip_str5)
					return;
				}
				uni.showModal({
					title: this.getLocalStr("tip_title"),
					content: "您确定要转帐吗？",
					confirmText: this.getLocalStr("btnstring_confirm"),
					showCancel: true,
					success: (res)=>{
						if (res.confirm) {
							this.$refs.pasdPop.open();
						}
					}
				});
			},

			cancell() {
				this.password = "";
				this.$refs.pasdPop.close();
			},
			//点击密码提示框的确定
			confirmOk() {
				//检查密码
				if (!this.password) {
					this.util.UiUtils.showToast(this.pasd_err_blank);
					return;
				}
				
				let walletInfo = this.dal.WalletManage.getCurrWallet();
				if(this.password!= walletInfo.password){
					this.util.UiUtils.showToast(this.pasd_err_tip);
					this.password =""
					return;
				}
				let asset = this.m_asset.name;
				let to =  this.address.replace(new RegExp(/( )/g), "");
				let amount = this.count.replace(new RegExp(/( )/g), "");
				let gas = 0;
				if(this.m_chain.isgas){
					gas = this.m_feeInfo.money;
				}
				console.log("=walletInfo==",walletInfo)
				console.log("=to==",to)
				console.log("=amount==",amount)
				console.log("=gas==",gas)
				console.log("=asset==",asset)
				// 转账操作
				if(!this.m_asset.contract){
					this.dal.WalletManage.sendTransaction(asset, to, amount, gas)
				}else{
					let contract = this.m_asset.contract;
					console.log("=contract==",contract)
					this.dal.WalletManage.sendTokenTransaction(asset, to, amount, contract, gas).then(result => {
						console.log("=333=result===",result)
					});
				}
			},
		}
	}
</script>

<style lang="scss">
	@import 'carry-over.scss';
</style>
