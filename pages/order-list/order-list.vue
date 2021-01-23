<template>
	<view class="order-list">
		<bar ref="bar"></bar>
		<view @tap="btnBack(3)" class="safe-header">
			<image src="../../static/image/login/left.svg" />
			<text>订单列表</text>
		</view>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px'}">
			<view class="order-list-info">
				<view class="list" v-for="(item , index) in m_items" :key="index" v-if="haveData">
					<view class="header">
						<view class="order-code">订单编号：{{item.order_no}}</view>
						<view class="order-state">
							<view v-if="item.state == 1" style="width: 95px;justify-content:right;display: flex;">
								<text style="background-color: #FFFFFF;color: #D1D1D1;">({{item.state_txt}})</text>
								<text @tap="btnDelete(item.id)" class="cancle-pay">删除</text>
							</view>
							<view v-else-if="item.state == 3">
								<text class="quit-pay">{{item.state_txt}}</text>
							</view>
							<view v-else-if="item.state == 2" style="align-items: center;width: 130px;justify-content:flex-end;display: flex;">
								<text style="background-color: #FFFFFF;color: #D1D1D1;">(已支付)</text>
								<view v-if= "item.verify_state == 0" >
									<text class="complay-pay">审核中</text>
								</view>
								<view v-else-if="item.verify_state == 1">
									<text class="complay-pay">审核通过</text>
								</view>
								<view v-else>
									<text style="background-color: #FFFFFF;color: #D1D1D1;">未通过</text>
								</view>
							</view>
							<view v-else>
								<text @tap="btnBuy(item.id,item.state)">{{item.state_txt}}</text>
								<image src="../../static/image/mine/arrow-left.svg" />
							</view>
						</view>
					</view>
					<view class="info">
						<view class="title">{{item.order_product.product_name}}</view>
						<view class="base-info">
							<view class="unit">单<text>价：</text></view>
							<view class="content">{{item.order_product.price}}USDT/{{item.unit}} {{item.order_product.price_cny}}CNY </view>
						</view>
						<view class="base-info">
							<view class="unit">购买数量：</view>
							<view class="content">{{item.order_product.product_count}}{{item.unit}}</view>
						</view>
						<view class="base-info">
							<view class="unit">交易时间：</view>
							<view class="content">{{item.created_at}} </view>
						</view>
						<view class="base-info">
							<view class="unit">支付金额：</view>
							<view class="content">{{item.amount}}USDT/{{item.amount_cny}}CNY</view>
						</view>
					</view>
				</view>
				<noData v-if="noData"></noData>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	import noData from '@/components/no-data/no-data.vue';
	export default {
		components: {
			Bar,
			noData
		},
		created() {
			this.onRefresh();
			this.util.EventUtils.addEventListenerCustom(this.dal.Order.evtGetOrderByUid, this.onGetOrderByUid);
			this.util.EventUtils.addEventListenerCustom(this.dal.Order.evtDeleteOrder, this.onDeleteOrder);
		},

		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Order.evtGetOrderByUid, this.onGetOrderByUid);
			this.util.EventUtils.removeEventCustom(this.dal.Order.evtDeleteOrder, this.onDeleteOrder);
		},
		data() {
			return {
				m_items: {},
				scrollHeight: 0,
				haveData:true,
				noData:false
			}
		},
		onLoad(option) {
			console.log("==option==", option)
			if (option && option.query) {
				var data = JSON.parse(option.query);
				console.log("==data.param=", data)
				if (data.param) {
					this.m_from = data.param.from; //1 我的订单，2购买
				} else {
					this.m_from = data.from; //1 我的订单，2购买
				}
			}
		},
		
		onShow() {
			console.log("==onShow2222==")
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight - 44;
				}
			});
			
			console.log("===2==this.m_items=",this.m_items)
			
			uni.startPullDownRefresh();
			setTimeout(function () {
				this.dal.Order.onGetOrderByUid();
			}.bind(this), 1000);
		},
		onPullDownRefresh() {
			console.log('refresh');
			this.dal.Order.onGetOrderByUid();
			// this.onRefresh();
			// setTimeout(function () {
			// 	uni.stopPullDownRefresh();
			// }, 1000);
		},
		methods: {
			btnBack: function(from) {
				console.log("==this.m_from=", this.m_from)
				if (this.m_from == 1) {
					// this.util.UiUtils.switchToPage("home-index", "pay-tip",{});
					uni.navigateBack();
				} else if (this.m_from == 2) {
					this.util.UiUtils.switchToPage("mine-mine", "order-order", {});
				} else {
					uni.navigateBack();
				}
			},
			btnOrder: function(orderid) {
				this.util.UiUtils.switchToPage("pay-pay-power", "order-list", {
					orderid: orderid
				});
			},
			
			onDeleteOrder:function(){
				this.util.UiUtils.showToast("订单删除成功");
				this.onRefresh();
			},
			
			btnDelete:function(orderid){
				uni.showModal({
					title: this.getLocalStr("tip_title"),
					content: "您确定要删除已取消的订单吗？",
					confirmText: this.getLocalStr("btnstring_confirm"),
					showCancel: true,
					success: function(res) {
						if (res.confirm) {
							this.util.UiUtils.showLoading("删除中...");
							this.dal.Order.onDeleteOrder(orderid,"订单删除")
						}
					}.bind(this)
				});
			},
			
			btnBuy: function(orderid, state) {
				if (state == 1 || state == 2) {
					return;
				}
				let amount = 111;
				this.util.UiUtils.switchToPage("pages-pay", "product-product", {
					orderid: orderid
				});
			},
			onGetOrderByUid:function(){
				uni.stopPullDownRefresh();
				this.onRefresh();
			},
			onRefresh: function() {
				let items = this.dal.Order.onGetOrders();
				for (let i = 0; i < items.length; i++) {
					let item = items[i];
				console.log("=====item.state=",item.state)
					if (item.pay_state == 0) { //支付状态: 0未支付 1已支付
						item.state_txt = "待支付";
					} else if (item.state == 1) {
						item.state_txt = "已支付";
					} else {
						item.state_txt = "";
					}
					if (item.state == 1) { //订单状态: 0已确认 1已取消 2已完成 3 删除
						item.state_txt = "已取消";
					} else if (item.state == 2) {
						item.state_txt = "已完成";
					} else if (item.state == 3) {
						item.state_txt = "已删除";
					}
				}
				this.m_items = items;
				if(this.m_items.length == 0){
					this.haveData = false
					this.noData = true
				}else{
					this.noData = false
					this.haveData = true
				}
			},
		},
	}
</script>

<style lang="scss">
	@import "order-list.scss"
</style>
