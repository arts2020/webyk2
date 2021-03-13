<template>
	<view class="deal-record">
		<uni-nav-bar backgroundColor="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" :title="currentAsset.name"
		 @clickLeft="goBack"></uni-nav-bar>
		<view class="coin-info">
			<view class="title">{{currentAsset.money}}</view>
			<view class="subTitle">≈ ￥ {{currentAsset.rmb}}</view>
		</view>
		<view class="deal-list">
			<view class="nav-menu">
				<view :class="active==0?'menu active-index':'menu'" @tap="updateMenu(0)">{{title_str1}}</view>
				<view :class="active==1?'menu active-index':'menu'" @tap="updateMenu(1)">{{title_str3}}</view>
				<view :class="active==2?'menu active-index':'menu'" @tap="updateMenu(2)">{{title_str2}}</view>
				<view :class="active==3?'menu active-index':'menu'" @tap="updateMenu(3)">{{title_str4}}</view>
			</view>
			<swiper :style="{ height: scrollHeight + 'px',backgroundColor:'#ffffff' }" @change="swiperChange" :current="active">
				<swiper-item>
					<scroll-view scroll-y="true" class="list-content" :refresher-triggered="triggered" :refresher-enabled="true"
					 @refresherrefresh="onRefresh">
						<view class="list-item" v-for="(item,index) in allList" :key="index" @click="goDetail(item)">
							<image class="icon" :src="itemIcon(item.state,item.type)" mode=""></image>
							<view class="info">
								<view class="addr">{{item.show_to_address}}</view>
								<view class="deal-time">{{item.updated_at}}</view>
							</view>
							<view class="right-num" :style="'color:'+Wordcolor(item.state,item.type)"> 
								<view class="num">
									<text v-if="item.type==1">+</text>
									<text v-if="item.type==2">-</text>
									{{item.amount}}
								</view>
								<view class="status">{{stateStr(item.state)}}</view>
							</view>
						</view>
						<noData v-if="allList.length==0" />
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view scroll-y="true" class="list-content" :refresher-triggered="triggered" :refresher-enabled="true"
					 @refresherrefresh="onRefresh">
						<view class="list-item" v-for="(item,index) in rollOutList" :key="index" @click="goDetail(item)">
							<image class="icon" :src="itemIcon(item.state,item.type)"
							 mode=""></image>
							<view class="info">
								<view class="addr">{{item.show_to_address}}</view>
								<view class="deal-time">{{item.updated_at}}</view>
							</view>
							<view class="right-num" :style="'color:'+Wordcolor(item.state,item.type)">
								<view class="num">
									<text v-if="item.type==1">+</text>
									<text v-if="item.type==2">-</text>
									{{item.amount}}
								</view>
								<view class="status">{{stateStr(item.state)}}</view>
							</view>
						</view>
						<noData v-if="rollOutList.length==0" />
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view scroll-y="true" class="list-content" :refresher-triggered="triggered" :refresher-enabled="true"
					 @refresherrefresh="onRefresh">
						<view class="list-item" v-for="(item,index) in rollInList" :key="index" @click="goDetail(item)">
							<image class="icon" :src="itemIcon(item.state,item.type)"
							 mode=""></image>
							<view class="info">
								<view class="addr">{{item.show_to_address}}</view>
								<view class="deal-time">{{item.updated_at}}</view>
							</view>
							<view class="right-num" :style="'color:'+Wordcolor(item.state,item.type)">
								<view class="num">
									<text v-if="item.type==1">+</text>
									<text v-if="item.type==2">-</text>
									{{item.amount}}
								</view>
								<view class="status">{{stateStr(item.state)}}</view>
							</view>
						</view>
						<noData v-if="rollInList.length==0" />
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view scroll-y="true" class="list-content" :refresher-triggered="triggered" :refresher-enabled="true"
					 @refresherrefresh="onRefresh">
						<view class="list-item" v-for="(item,index) in failList" :key="index" @click="goDetail(item)">
							<image class="icon" :src="itemIcon(item.state,item.type)"
							 mode=""></image>
							<view class="info">
								<view class="addr">{{item.show_to_address}}</view>
								<view class="deal-time">{{item.updated_at}}</view>
							</view>
							<view class="right-num" :style="'color:'+Wordcolor(item.state,item.type)">
								<view class="num">
									<text v-if="item.type==1">+</text>
									<text v-if="item.type==2">-</text>
									{{item.amount}}
								</view>
								<view class="status">{{stateStr(item.state)}}</view>
							</view>
						</view>
						<noData v-if="failList.length==0" />
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		<view class="botto_btn">
			<view class="btns">
				<view style="background-color: #8253F3;" @tap="goCollectCash">{{btnstring_receive}}</view>
				<view style="background-color: #4C72EF;" @tap="goTransfer ">{{btnstring_carry}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import noData from '@/components/no-data/no-data.vue';
	export default {
		name: "deal-record",
		components: {
			noData
		},
		created() {
			this.util.EventUtils.addEventListenerCustom(this.dal.Common.evtGetTransferList, this.onRefresh);

			//获取交易列表
			this.getDealData();
		},
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Common.evtGetTransferList, this.onRefresh);
		},

		data() {
			return {
				triggered: true,
				currentAsset: {
					name: "ETH",
					rmb: "12.452",
					money: "123.65"
				},
				//所有交易记录
				allList: [
					
				],
				//转出的
				rollOutList: [
					
				],
				//转入的
				rollInList: [
					
				],
				//失败的
				failList: [
					
				],
				//0全部 1转出 2转入 3失败
				active: 0,
				scrollHeight: 0,
				//state:0 转帐中 1完成 2失败  type:1转入  2转出
				stateStr(state){
					let str = ""
					switch (state){
						case 0:str = this.title_str22;
							break;
						case 1:str = this.title_str23;
							break;
						case 2:str = this.title_str24;
							break;
					}
					return str;
				},
				Wordcolor(state, type) {
					return state == 2 ? '#FF0000' : type == 1 ? '#FF6F00' : '#020526';
				},
				itemIcon(state, type) {
					return state == 2 ? '../../../static/image/index/deal-fail.png' : type == 2 ?
						'../../../static/image/index/rollout.png' : '../../../static/image/index/rollin.png';
				}
			};
		},
		onLoad(option) {
			let params = JSON.parse(option.query);
			if (Object.keys(params).length != 0) {
				console.log('======this.currentAsset======', params)
				this.currentAsset = params;
			}
			this.iniword()
		},
		onShow() {
			//获取高度
			uni.getSystemInfo({
				success: (res) => {
					this.scrollHeight = res.windowHeight - res.statusBarHeight - 44 - 71 - 8 - 46 - 75;
				}
			});
			this.onRefresh(1);
		},
		methods: {
			iniword() {
				this.btnstring_carry = this.getLocalStr("btnstring_carry");
				this.btnstring_receive = this.getLocalStr("btnstring_receive");
				this.title_str1 = this.getLocalStr("title_str1");
				this.title_str2 = this.getLocalStr("title_str2");
				this.title_str3 = this.getLocalStr("title_str3");
				this.title_str4 = this.getLocalStr("title_str4");
				this.title_str22 = this.getLocalStr("title_str22");
				this.title_str23 = this.getLocalStr("title_str23");
				this.title_str24 = this.getLocalStr("title_str24");
			},
			onRefresh() {
				if (!this.triggered) {
					this.triggered = true;
				}
				this.allList = [];
				this.rollInList = [];
				this.rollOutList = [];
				this.failList = [];
				console.log("==this.currentAsset==", this.currentAsset)
				//每次刷新数据  清空之前数据并重新获取
				if (this.currentAsset) {
					this.allList = this.dal.Common.GetTransferList(this.currentAsset.idx, this.currentAsset.address, 0, this.currentAsset
						.contract)
					this.rollOutList = this.dal.Common.GetTransferList(this.currentAsset.idx, this.currentAsset.address, 1, this.currentAsset
						.contract)
					this.rollInList = this.dal.Common.GetTransferList(this.currentAsset.idx, this.currentAsset.address, 2, this.currentAsset
						.contract)
					this.failList = this.dal.Common.GetTransferList(this.currentAsset.idx, this.currentAsset.address, 3, this.currentAsset
						.contract)
				}
				this.allList.forEach(el=>{
					el.show_to_address =  el.to_address?el.to_address.substring(0,7)+'...'+el.to_address.substring(el.to_address.length-7):"no address"
				})
				this.rollOutList.forEach(el=>{
					el.show_to_address =  el.to_address?el.to_address.substring(0,7)+'...'+el.to_address.substring(el.to_address.length-7):"no address"
				})
				this.rollInList.forEach(el=>{
					el.show_to_address =  el.to_address?el.to_address.substring(0,7)+'...'+el.to_address.substring(el.to_address.length-7):"no address"
				})
				this.failList.forEach(el=>{
					el.show_to_address =  el.to_address?el.to_address.substring(0,7)+'...'+el.to_address.substring(el.to_address.length-7):"no address"
				})
				setTimeout(() => {
					this.triggered = false;
				}, 1000)
				console.log(this.allList,this.rollInList,this.rollOutListd)
			},

			getDealData() {
				//根据当前资产类型获取用户所有交易记录  
				//处理地址  从底层获取过来的真实数据中 地址不能改，因为详情页要展示  另加属性去展示处理后的地址
				// let list = ;
				// list.forEach(el=>{
				// 	el.inAddr = el.inAddr?el.inAddr.substring(0,7)+'...'+el.inAddr.substring(el.inAddr.length-7):"no address"
				// 	el.to_address = el.outAddr?el.outAddr.substring(0,7)+'...'+el.outAddr.substring(el.outAddr.length-7):"no address"
				// })
				// this.allList = list;
				//根据字段筛选分组为转入,转出,失败的
				console.log("==this.currentAsset=", this.currentAsset)
				if (this.currentAsset) {
					if(this.currentAsset.asset.toLowerCase() == 'btc'){
						this.dal.Btc.getTransferList(this.currentAsset.address);
					}else{
						if (this.currentAsset.contract) {
							this.dal.Common.onGetTransferList(this.currentAsset.idx, this.currentAsset.address)
						} else {
							this.dal.Common.onGetTransferList(this.currentAsset.idx, this.currentAsset.address)
						}
					}
				}

				// //拿到数据关闭刷新状态
				// setTimeout(() => {
				// 	this.triggered = false;
				// }, 1000)

			},
			goBack() {
				this.util.UiUtils.switchBackPage();
			},
			swiperChange(e) {
				this.active = e.detail.current;
			},
			updateMenu(val) {
				this.active = val;
			},
			goCollectCash() {
				this.$openPage({
					name: "recharge-currency",
					query: this.currentAsset
				})
			},
			goTransfer() {
				this.$openPage({
					name: "carry-over",
					query: this.currentAsset,
					gotype:"redirectTo"
				})
			},
			goDetail(item) {
				console.log("===item==", item)
				this.$openPage({
					name: "deal-record-detail",
					query: item
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.deal-record {
		width: 100%;
		min-height: 100vh;
		background-color: #FFFFFF;

		/deep/ .uni-navbar--border {
			border: 0;
		}

		.coin-info {
			width: 100%;
			height: 142rpx;
			background-color: #FAFBFF;
			border-bottom: 16rpx solid #f5f5f5;
			text-align: center;
			font-family: PingFang SC, PingFang SC-Bold;

			.title {
				font-size: 46rpx;
				font-weight: 700;
				color: #111111;
				margin-bottom: 5rpx;
			}

			.subTitle {
				font-size: 28rpx;
				font-weight: 400;
				color: #989898;
			}
		}

		.deal-list {
			width: 100%;

			.nav-menu {
				width: 100%;
				height: 90rpx;
				display: flex;
				align-items: center;
				background-color: #FFFFFF;
				margin-bottom: 2rpx;

				.menu {
					width: 25%;
					text-align: center;
					line-height: 90rpx;
					font-size: 32rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					text-align: center;
					color: #4d4960;

					&.active-index {
						color: #121212;
					}

					&.active-index::after {
						content: '';
						display: block;
						width: 40%;
						height: 4rpx;
						background-color: #3981F3;
						margin: 0 auto;
					}
				}
			}

			.list-content {
				width: 100%;
				height: 100%;
				background-color: #FFFFFF;

				.list-item {
					width: 100%;
					height: 150rpx;
					display: flex;
					align-items: center;
					padding: 0 30rpx;
					box-sizing: border-box;
					border-bottom: 1rpx solid #e7e6ed;

					.icon {
						width: 61rpx;
						height: 61rpx;
						margin-right: 32rpx;
					}

					.info {
						width: 60%;
						font-family: PingFang SC, PingFang SC-Regular;
						font-weight: 400;

						.addr {
							font-size: 32rpx;
							color: #454e5e;
							margin-bottom: 14rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}

						.deal-time {
							font-size: 26rpx;
							color: #909090;
						}
					}
                   .right-num{
					   text-align: center;
					   margin-left: auto;
					   .num {					   	
					   	font-size: 32rpx;
					   	font-family: PingFang SC, PingFang SC-Semibold;
					   	font-weight: 600;
					   }
					   .status{
						   font-size: 28rpx;
					   }
				   }
				}
			}
		}

		.botto_btn {
			width: 100%;
			height: 88rpx;
			position: fixed;
			bottom: 33rpx;
		}

		.btns {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;

			view {
				width: 292rpx;
				height: 88rpx;
				background: #8253f3;
				border-radius: 14px;
				box-shadow: 0px 3rpx 26rpx 0px rgba(0, 0, 0, 0.06);

				&:first-child {
					margin-right: 42rpx;
				}

				font-size: 32rpx;
				font-family: PingFang SC,
				PingFang SC-Bold;
				font-weight: 700;
				text-align: center;
				color: #ffffff;
				line-height: 88rpx;
				letter-spacing: 5rpx;
			}
		}
	}
</style>
