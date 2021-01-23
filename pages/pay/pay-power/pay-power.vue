<template>
	<view class="pay-power">
		<bar ref="bar"></bar>
		<view @tap="btnBack()" class="safe-header">
			<image src="../../../static/image/login/left.svg" />
			<text>购买算力</text>
		</view>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px'}">
			<image class="header-img" src="../../../static/image/tips/header.png" />
			<view class="pay-info">
				<view class="info-title">{{m_item.name}}</view>
				<view class="content-info">
					<view class="info">
						<text>单价/TB</text>
						<view class="bule">{{m_item.price_cny}}CNY/{{m_item.price}} USDT</view>
					</view>
					<view class="info">
						<text>合约周期</text>
						<view>{{m_item.days}}天</view>
					</view>
					<view class="info">
						<text>技术服务费</text>
						<view>{{m_item.fee * 100}}%(直接从挖矿收益中扣除)</view>
					</view>
					<view class="info">
						<text>电费 THS/天</text>
						<view>{{m_item.electric_fee}}$</view>
					</view>
					<view class="info">
						<text>开挖时间</text>
						<view>{{formatDate(m_item.begintime)}} 开</view>
					</view>
				</view>
				<view class="total">
					<text class="total-title">购买数量</text>
					<view>
						<image @tap="btnSub()" src="../../../static/image/pay/reduce.svg" />
						<text>{{m_count}}</text>
						<image @tap="btnAdd()" src="../../../static/image/pay/add.svg" />
					</view>
				</view>
				<view class="pay-tip">
					<checkbox value="cb" @click="ischecked = !ischecked" :checked="ischecked" style="transform:scale(0.6)" />
					<text @tap="toClick()">确认支付即同意《云存储服务销售以及托管协议》</text>
				</view>

			</view>
			<view class="product-detail" style="width: 100%;display: flex;justify-content: center;">
				<view style="width: 90%; text-align: left;">
					<u-parse :content="m_item.desc" @preview="preview" @navigate="navigate" />
				</view>
			</view>
			<!-- <view class="product-detail">
				<view class="product-header">
					<image src="../../../static/image/pay/hengxian.svg" />
					<text>产品详情</text>
					<image src="../../../static/image/pay/hengxian.svg" />
				</view>
				<view class="product-list">
					<view class="list">
						<image src="../../../static/image/pay/tiqianbuju.svg" />
						<view class="product-title">提前布局</view>
						<view class="product-tip">7天完成超百TB存力集结，创下行业记录</view>
					</view>
					<view class="list">
						<image src="../../../static/image/pay/jiqunzuozhan.svg" />
						<view class="product-title">集群作战</view>
						<view class="product-tip">7天完成超百TB存力集结，创下行业记录</view>
					</view>
					<view class="list">
						<image src="../../../static/image/pay/shouyijishi.svg" />
						<view class="product-title">收益及时</view>
						<view class="product-tip">7天完成超百TB存力集结，创下行业记录</view>
					</view>
				</view>
			</view> -->
			<!-- <view class="product-detail">
				<view class="product-header">
					<image src="../../../static/image/pay/hengxian.svg" />
					<text>产品预期回报率</text>
					<image src="../../../static/image/pay/hengxian.svg" />
				</view>
				<view class="yuqi">88%~228%</view>
				<view class="product-up">提升10-20%</view>
				<view class="up-content">
					资产中权益资产的预期回报率是特别高的，会吸引海外资金的流入。因此我们认为，美元在未来一个季度的贬值趋势，是比较利好于A股权益市场资产的。 中期来看，注意防范美国经济恢复对中国权益市场的冲击
				</view>
			</view> -->
		</scroll-view>
		<view class="footer">
			<view class="footer-content">
				<view class="footer-left">
					合计<text class="total">{{m_total}}</text>
					<text class="unit">USDT</text>
				</view>
				<view v-if="m_item.status_text == '停售'" style="align-items: center;width: 125px;display: flex;">
					<view style="justify-content: right;margin-right: 3px;color: #b1acb4;">(已停售)</view>
					<text @tap="btnBuy()" :class="isOpen ? 'sure-btn' : 'sure-btn2'">确认下单</text>
				</view>
				<text v-if="m_item.status_text != '停售'" style="height: 30px;" @tap="btnBuy()" :class="isOpen ? 'sure-btn' : 'sure-btn2'">确认下单</text>
			</view>
		</view>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	import uParse from '@/components/gaoyia-parse/parse.vue'
	export default {
		components: {
			Bar,
			uParse
		},
		created() {
			this.onGetProductInfo();
			if (this.m_productId) {
				this.dal.Product.onGetProductInfo(this.m_productId);
			}
			this.util.EventUtils.addEventListenerCustom(this.dal.Product.evtGetProductInfo, this.onGetProductInfo);
			this.util.EventUtils.addEventListenerCustom(this.dal.Order.evtAddOrderInfo, this.onAddOrderInfo);
		},

		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Product.evtGetProductInfo, this.onGetProductInfo);
			this.util.EventUtils.removeEventCustom(this.dal.Order.evtAddOrderInfo, this.onAddOrderInfo);
		},
		data() {
			return {
				scrollHeight: 0,
				m_count: 1,
				m_item: {},
				m_total: 0,
				m_price: 0,
				ischecked: false,
				isOpen: false,
			}
		},
		onLoad(option) {
			if (option && option.query) {
				var data = JSON.parse(option.query);
				console.log("==data==", data)
				this.m_productId = data.param.productid;
				console.log("==this.m_productId==", this.m_productId)
			}
		},
		methods: {
			dateFormat: function(fmt, date) {
				let ret;
				const opt = {
					"Y+": date.getFullYear().toString(), // 年
					"m+": (date.getMonth() + 1).toString(), // 月
					"d+": date.getDate().toString(), // 日
					"H+": date.getHours().toString(), // 时
					"M+": date.getMinutes().toString(), // 分
					"S+": date.getSeconds().toString() // 秒
					// 有其他格式化字符需求可以继续添加，必须转化成字符串
				};
				for (let k in opt) {
					ret = new RegExp("(" + k + ")").exec(fmt);
					if (ret) {
						fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
					};
				};
				return fmt;
			},
			formatDate: function(t) {
				let date = new Date(t)
				return this.dateFormat("YYYY-mm-dd", date)
			},
			btnBack: function() {
				this.util.UiUtils.switchBackPage();
			},

			onAddOrderInfo: function(data) {
				console.log("======onAddOrderInfo====", data)
				this.util.UiUtils.switchToPage("pages-pay", "product-product", {
					orderid: data.data.id
				});
			},
			btnBuy: function() {
				if (!this.isOpen) {
					return;
				}
				if (!this.ischecked) {
					this.util.UiUtils.showToast("请阅读并同意<<云存储服务销售以及托管协议>>")
					return;
				}
				let unPayCount = this.dal.Order.getOrderByUnPay();
				if (unPayCount >= 13) {
					this.util.UiUtils.showToast("您有未完成的订单，请完成后再进行下单")
					return;
				}
				let balance = this.dal.UsdtErc20.getBalance()
				if(balance < this.m_total){
					this.util.UiUtils.showToast("您有 "+ balance +" USDT,不够完成订单支付");
					return;
				}
				this.util.UiUtils.showLoading("订单生成中...");
				this.dal.Order.onAddOrderInfo(this.m_productId, this.m_count, this.m_total)
				// this.util.UiUtils.switchToPage("pages-pay", "product-product", {
				// 	productid: this.m_productId,
				// 	count: this.m_count
				// });
			},
			btnAdd: function() {
				this.m_count += 1;
				this.m_total = this.m_price * this.m_count
			},
			btnSub: function() {
				this.m_count -= 1;
				if (this.m_count <= 0) {
					this.m_count = 1;
				}
				this.m_total = this.m_price * this.m_count
			},
			onGetProductInfo: function() {
				this.m_item = this.dal.Product.getProductInfo(this.m_productId);
				this.m_price = this.m_item.price;
				this.m_total = this.m_price * this.m_count
				this.isOpen = this.m_item.status_text == "售卖中"
				console.log("====onGetProductInfo=====", this.m_item)
			},
			preview: function(src, e) {
				// do something
			},
			navigate: function(href, e) {
				// do something
			},
			toClick() {
				this.$openPage({
					name: "xieyi-xieyi",
					query: {},

				})
			}
		},
		onShow() {
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight - 94;
				}
			});
		}
	}
</script>


<style lang="scss">
	@import "pay-power.scss";
	@import url("/components/gaoyia-parse/parse.css");
</style>
