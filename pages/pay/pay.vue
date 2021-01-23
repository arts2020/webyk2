<template>
	<view class="pay-index">
		<bar ref="bar"></bar>
		<view  class="safe-header">
			<view style="display: flex;justify-content: space-between;width: 90%;">
				<view @tap="btnBack()" style="display: flex;align-items: center;">
					<image src="../../static/image/login/left.svg" />
					<text>支付</text>
				</view>
				<text v-if="isbuy" @tap="btnCancle()">取消订单</text>
			</view>

		</view>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px'}">
			<view class="pay-content">
				<view class="pay-header">
					<image class="pay-icon" src="../../static/image/tips/pay.svg" />
					<view class="pay-title">
						<view class="title"><text>订单支付</text>(订单号:{{m_item.order_no}}）</view>
						<view v-if="m_state == 1 || m_state == 3">
							<view class="title-tip">已关闭</view>
						</view>
						<view v-else-if="m_state == 2">
							<view class="title-tip">已完成</view>
						</view>
						<view v-else>
							<view class="title-tip">剩余{{m_time_desc}}自动关闭</view>
						</view>
					</view>
				</view>
				<view class="pay-info">
					<view class="info-title">{{m_item.order_product.product_name}}</view>
					<view class="content-info">
						<view class="info">
							<text>单价/{{m_item.unit}}</text>
							<view class="bule">{{m_item.order_product.price_cny}}CNY/{{m_item.order_product.price}} USDT</view>
						</view>
						<view class="info">
							<text>合约周期</text>
							<view>{{m_item.order_product.days}}天</view>
						</view>
						<view class="info">
							<text>购买数量</text>
							<view>{{m_item.order_product.product_count}}</view>
						</view>
						<view class="info">
							<text>技术服务费</text>
							<view>{{m_item.order_product.fee * 100}}%(直接从挖矿收益中扣除)</view>
						</view>
					</view>
					<view class="total">
						总计(USDT)<text>{{m_item.total}}</text>
					</view>
				</view>
				<view @tap="btnBuy()" :class="(isbuy) ? 'container-login' : 'container-login2'">
					<text>确认支付</text>
				</view>
			</view>
		</scroll-view>
		<e-modal :visible.sync="visible" @cancel="handleCancel">
			<view style="width: 100%;height: 220px;display: flex;justify-content: center;flex-direction: column;align-items: center;">
				<view style="font-weight: 800;font-size: 20px;margin-bottom: 20px;">资金密码</view>
				<QSInput :maxlength="12" inputwidth="93%" name="password" placeholder="请输入资金密码" :filterFc="passWordFilterInput"
				 variableName="password" password title="" v-model="password" focusBorderColor="#cddce6" blurBorderColor="#cddce6"></QSInput>
				<view style="margin-bottom: 15px;display: flex;flex-direction: row;width: 80%;">
					<button class="button-style" @tap="btnCancel">取消</button>
					<button class="button-style" @tap="btnConfirm">购买</button>
				</view>
			</view>

		</e-modal>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	export default {
		components: {
			Bar
		},
		created() {
			// this.setTimes();
			this.util.EventUtils.addEventListenerCustom(this.dal.Wallter.evtTransResult, this.onTransResult);
			this.util.EventUtils.addEventListenerCustom(this.dal.Order.evtPayment, this.onPayment);
			this.util.EventUtils.addEventListenerCustom(this.dal.Setting.evtCheckCapitalPassword, this.onCheckCapitalPassword);
			this.util.EventUtils.addEventListenerCustom(this.dal.Order.evtGetOrderById, this.onOrderInfo);
			this.util.EventUtils.addEventListenerCustom(this.dal.Order.evtCancelOrder, this.onCancelOrder);
		},

		destroyed() {
			console.log("====2222==destroyed====")
			if(this.m_id_timeout){
				clearTimeout(this.m_id_timeout)
			}
			this.util.EventUtils.removeEventCustom(this.dal.Wallter.evtTransResult, this.onTransResult);
			this.util.EventUtils.removeEventCustom(this.dal.Order.evtPayment, this.onPayment);
			this.util.EventUtils.removeEventCustom(this.dal.Setting.evtCheckCapitalPassword, this.onCheckCapitalPassword);
			this.util.EventUtils.removeEventCustom(this.dal.Order.evtGetOrderById, this.onOrderInfo);
			this.util.EventUtils.removeEventCustom(this.dal.Order.evtCancelOrder, this.onCancelOrder);
		},

		data() {
			return {
				m_item: {},
				m_time_desc: "",
				m_endtime: 0,
				m_state : 0,
				scrollHeight: 0,
				m_total: 0,
				m_productId: 0,
				m_count: 0,
				visible: false,
				password: "",
				isbuy: false,//是否过期
				passWordFilterInput(value) {
					return value;
				},
			}
		},
		onLoad(option) {
			console.log("==option==", option)
			if (option) {
				var data = JSON.parse(option.query);
				console.log("==data==", data)
				this.m_orderid = data.param.orderid;
				console.log("==this.m_orderid==", this.m_orderid)

				this.onOrderInfo(2);
			}
		},
		methods: {
			setTimes: function() {
				if(this.m_state > 0){
					this.isbuy = false;
					return
				}
				var nowTime = parseInt(new Date().getTime()/1000);
				var ms = this.m_endtime - nowTime;
				var day = Math.floor(ms / (60 * 60 * 24));
				var hour = Math.floor(ms / (60 * 60)) % 24;
				var minute = Math.floor(ms / (60)) % 60;
				var second = Math.floor(ms) % 60;
				
				if (day > 0) {
					this.m_time_desc = day + "天" + hour + "小时 " + minute + "分 " + second + " 秒"
				} else if (hour > 0) {
					this.m_time_desc =  " " + hour + "小时" + minute + "分" + second + " 秒"
				} else if (minute > 0) {
					this.m_time_desc = " " + minute + "分" + second + "秒 "
				} else if (second > 0) {
					this.m_time_desc =  " " + second + "秒 "
				} else {
					this.m_time_desc = ' 0' + "秒";
				}
				// console.log('====setTimes===second===', second)
				if (ms >= 0) {
					this.m_state = this.m_item.state
					this.m_id_timeout = setTimeout(function() {
						this.setTimes();
					}.bind(this), 1000)
				}else{
					this.m_state = 1
					this.onOrderInfo(3);
				}
			},
			btnBack: function() {
				this.util.UiUtils.switchBackPage();
			},

			onPayment: function() {
				// uni.showModal({
				// 	title: this.getLocalStr("tip_title"),
				// 	content: "恭喜您！您的订单支付完成",
				// 	confirmText: this.getLocalStr("btnstring_confirm"),
				// 	showCancel: false,
				// 	success: function(res) {
				// 		if (res.confirm) {
				// 			this.util.UiUtils.switchToPage("tip-page-pay-tip", "pay-pay", {});
				// 		}
				// 	}.bind(this)
				// });
			},

			onOrderInfo: function(from) {
				console.log("===from=",from)
				console.log("====this.m_orderid=====", this.m_orderid)
				let item = this.dal.Order.onGetOrderByOrderId(this.m_orderid);
				if(!item){
					return;
				}
				this.m_item = item;
				this.m_endtime = this.m_item.expired_at;
				
				this.m_total = this.m_item.total;
				var nowTime = parseInt(new Date().getTime()/1000);
				var ms = this.m_endtime - nowTime;
				
				if(this.m_state == 0){
					this.isbuy = true;
				}else{
					this.isbuy = false;
				}
				if(ms <= 0){
					this.m_state = 1;
					this.isbuy = false;
				}
				console.log('==this.isbuy=',this.isbuy)
				console.log('==this.m_state=',this.m_state)
				console.log('==ms=',ms)
				if(this.isbuy){
					setTimeout(function() {
						this.setTimes();
					}.bind(this), 1000)
				}
			},
			
			btnCancle: function() {
				uni.showModal({
					title: this.getLocalStr("tip_title"),
					content: "您确定要取消订单吗？",
					confirmText: this.getLocalStr("btnstring_confirm"),
					showCancel: true,
					success: function(res) {
						if (res.confirm) {
							this.dal.Order.onCancelOrder(this.m_orderid,"用户申请取消")
						}
					}.bind(this)
				});
			},
			
			onCancelOrder:function(){
				this.util.UiUtils.showToast("订单取消成功");
				this.onOrderInfo(1);
			},
			
			btnBuy: function() {
				if(!this.isbuy){
					return;
				}
				let balance = this.dal.UsdtErc20.getBalance()
				console.log("=balance==",balance)
				console.log("=this.m_total==",this.m_total)
				if(balance < this.m_total){
					this.util.UiUtils.showToast("您的USDT余额不足，请充值后继续购买");
					return;
				}
				
				if (!this.util.UiUtils.getIsCanTrans()) {
					return;
				}
				
				this.password = "";
				// this.isWallet = this.dal.Wallter.isValidWallet();
				// if (this.isWallet) {
				// 	this.visible = true;
				// } else {
					// this.util.UiUtils.showToast("请先开启钱包");
					uni.showModal({
						title: this.getLocalStr("tip_title"),
						content: "您的钱包暂未开启，请问去开启您的钱包吗？",
						confirmText: this.getLocalStr("btnstring_confirm"),
						showCancel: true,
						success: function(res) {
							if (res.confirm) {
								this.util.UiUtils.switchToPage("mine-creat-wallet", "mine-mine", {});
							}
						}.bind(this)
					});
				// }
			},

			handleCancel() {
				console.log('cancel')
			},
			btnCancel: function() {
				this.visible = false;
			},

			btnConfirm: function(e) {
				console.log("=====dddd=====", this.password);
				console.log("==m_password=", this.dal.Wallter.m_password)
				let psw = this.password.replace(new RegExp(/( )/g), "");
				if (this.password.length <= 0) {
					this.util.UiUtils.showToast("请输入您的资金密码");
					return;
				}
				this.isbuy = false;
				this.util.UiUtils.showLoading("检测中...",30);
				this.dal.Setting.onCheckCapitalPassword(psw);
				this.visible = false;
			},
			onCheckCapitalPassword: function(data) {
				console.log("==onCheckCapitalPassword==data=", data)
				this.util.UiUtils.showLoading("订单提交中...",30);
				let pkey = this.dal.Wallter.getPrivateKey();
				if (pkey.substring(0, 2) == "0x") {
					pkey = pkey.substring(2, pkey.length);
				}
				console.log('==self.dal.Wallet.getPrivateKey=', pkey)
				this.onSendTran(pkey);
			},

			//链上交易成功后
			onTransResult: function(data) {
				console.log("==data=",data)
				if(!data.tx){
					return;
				}
				this.dal.Order.onPayment(this.m_orderid, data.tx);
				this.util.UiUtils.switchToPage("tip-page-pay-tip", "pay-pay", {});
			},

			onSendTran: async function(pkey) {
				this.util.UiUtils.showLoading("订单支付中...",30);
				// 	
				let address = this.dal.Common.onGetRateInfo("coll_usdt_address");
				let price = await this.dal.Wallter.getGasPriceAsync();
				console.log('==this.price==', price)
				console.log('==this.address==', address)
				console.log('==this.m_total==', this.m_total)
				this.util.UiUtils.showLoading("订单支付中...");
				this.dal.UsdtErc20.sendTransaction(address.value, this.m_total, price.average)
			}
		},
		onShow() {
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight - 44;
				}
			});
		}
	}
</script>

<style lang="scss">
	@import "pay.scss";

	.button-style {
		transform: scale(0.7);
		margin-top: 30px;
		max-height: 45px;
		width: 150px;
		color: #FFFFFF;
		border: 1px solid #007AFF;
		background: #FFFFFF;
		color: #007AFF;
	}
</style>
