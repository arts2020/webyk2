<template>
	<view class="carry-over">
		<uni-nav-bar background-color="#F6F7F9" left-icon="back" :statusBar="true" :fixed="true" right-icon="scan" :title="m_asset.name+'转账'"
		 @clickLeft="btnBack" @clickRight="btnScan"></uni-nav-bar>
		<view class="carry-addr">
			<view class="carry-title">收款地址</view>
			<view class="addr">
				<textarea type="text" placeholder="输入或粘贴钱包地址" v-model="address" placeholder-class="tipClass" />
				<image src="../../../../static/image/index/address.png" mode="" @tap="goAddressList"></image>
			</view>
		</view>
		<view class="carry-count">
			<view class="carry-title">
				<text>金额</text><text>{{m_balane || 0}} {{m_asset.name}}</text>
			</view>
			<view class="count">
				<view class="input-count">
					<input type="text" placeholder="0" placeholder-class="tipClass-2" v-model="count" />
				</view>
				<view class="bak">
					<text>备注</text>
					<input type="text" v-model="bak" />
				</view>
			</view>
		</view>
		<view class="fee" @tap="goSetting" v-if="m_chain.isgas">
			<text>矿工费</text>
			<view class="fee-info">
				<view class="coin">{{m_feeInfo.money}}</view>
				<view class="rmb">￥{{m_feeInfo.rmb}}</view>
			</view>
			<image src="../../../../static/image/mine/arrow-left.svg" mode=""></image>
		</view>
		<view class="confirm-ok" @click="btnConfirm">转账</view>
		<uni-popup type="center" ref="pasdPop" class="pasdTip">
			<view class="main-content">
				<view class="title">请输入密码</view>
				<view class="input-box">
					<input type="text" password placeholder="密码" v-model="password" />
				</view>
				<view class="btns">
					<view class="cancell" @click="cancell">取消</view>
					<view class="ok" @click="confirmOk">确定</view>
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
					money: "0",
					rmb: "0",
				}
			}
		},
		onLoad(option) {
			let params = JSON.parse(option.query);
			if(Object.keys(params).length!=0){
				console.log("=====当前代币信息========",params)
				this.m_asset = params;
				if(params.money){
					this.m_feeInfo ={
						money:params.money,
						rmb:params.rmb
					}
				}
			}
		},
		onShow() {
			//获取临时地址
			let item = this.dal.Address.getTempAddress()
			if (Object.keys(item).length != 0) {
				this.address = item.address;
			}
			this.m_chain = this.dal.Chain.getAssets(this.m_asset.chaintype);
			console.log('==========当前链============',this.m_chain)
			//获取当前余额
			this.m_balane = this.dal.WalletManage.getBalance();
		},
		methods: {
			goAddressList() {
				this.$openPage({
					name: "address-list",
					query: {
						type: 1,
						chaintype:this.m_asset.chaintype,
						name:this.m_asset.name
					}
				})
			},
			goSetting() {
				let chain = this.dal.Chain.getChainInfo(this.m_asset.chaintype)
				this.$openPage({
					name: 'setting-'+chain.name+'-fee',
					query: {
						chaintype:this.m_asset.chaintype,
						name:this.m_asset.name
					}
				})
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
			//点击转账
			btnConfirm() {
				// 对地址数量和矿工费进行校验并打开风险提示框

				// 	if (!this.util.UiUtils.getIsCanTrans()) {
				// 		return;
				// 	}

				let address = this.address.replace(new RegExp(/( )/g), "");
				let count = this.count.replace(new RegExp(/( )/g), "");
				
				if (address.length <= 0) {
					this.util.UiUtils.showToast("请输入转出的地址")
					return;
				}

				if (count.length <= 0) {
					this.util.UiUtils.showToast("请输入转出的数额")
					return;
				}
				if (this.m_chain.isgas && !this.m_feeInfo.money) {
					this.util.UiUtils.showToast("请选择矿工费")
					return;
				}
				let sum = count * 1 + this.m_feeInfo.money / 100000 * 1;
				if (this.m_balane < sum) {
					this.util.UiUtils.showToast("可用余额不足")
					return;
				}

				let walletInfo = this.dal.WalletManage.getCurrWallet();
				if (this.address.toLowerCase() == walletInfo.address) {
					this.util.UiUtils.showToast("不允许对自己进行转帐")
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
					this.util.UiUtils.showToast("请输入密码");
					return;
				}
				
				let walletInfo = this.dal.WalletManage.getCurrWallet();
				if(this.password!= walletInfo.password){
					this.util.UiUtils.showToast('密码不正确');
					this.password =""
					return;
				}
				// 转账操作
				
			},
		}
	}
</script>

<style lang="scss">
	@import 'carry-over.scss';
</style>
