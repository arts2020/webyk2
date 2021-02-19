<template>
	<view class="setting-fee">
		<uni-nav-bar background-color="#F6F7F9" left-icon="back" :statusBar="true" :fixed="true" :title="seeting_fee_title" @clickLeft="btnBack"></uni-nav-bar>
	    <view class="fee-info">
			<view class="top-box">
				<text>{{seeting_fee_str1}}</text>
				<view class="fee-desc">
					<view class="coin">{{currentFee.money}}{{name}}</view>
					<view class="rmb">￥{{currentFee.rmb}}</view>
				</view>
				<image src="../../../static/image/mine/arrow-left.svg" mode=""></image>
			</view>
			<view class="botto-box">
				{{currentFee.unitPrice}}sat/b * {{workload}}bytes
			</view>
		</view>
		<view class="setting-rate">
			<view class="title">{{seeting_fee_str2}}</view>
			<view class="setting-content">
				<view @tap="handleCheck(index)" class="list-item" v-for="(item,index) in menuList" :key="index">
					<view class="info">
						<view class="p1">{{item.title}}</view>
						<view class="p2">{{item.unitPrice}}&nbsp;&nbsp;sat/b</view>
					</view>
					<text><{{item.time}}{{seeting_fee_str3}}</text>
					<image class="check-icon" v-if="currentFee.index==index" src="../../../static/image/mine/checked.png" mode=""></image>
				    <view v-else style="width: 24rpx;height: 28rpx;"></view>
				</view>
			</view>
		</view>
	    <view class="confirm-ok" @click="btnConfirm">{{btnstring_confirm}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				chaintype:1,
				name:'BTC',
				//当前选中项
				currentFee:{
					money: 0,
					rmb: 0,
					unitPrice: 0,
					//选中的选项下标
					index:0
				},
				workload:0,
				menuList:[],
				paramsObj:{}
			};
		},
		onLoad(option) {
			let params = this.dal.Address.getTempParamsByCarry();
			if (Object.keys(params).length != 0) {
				this.paramsObj = params;
				this.currentFee = params.m_feeInfo;
			}
			this.initword()
		},
		onShow() {
			this.onRefersh();
		},
		methods:{
			initword(){
				this.btnstring_confirm = this.getLocalStr("btnstring_confirm")
				this.seeting_fee_str1 = this.getLocalStr("seeting_fee_str1")
				this.seeting_fee_str2 = this.getLocalStr("seeting_fee_str2")
				this.seeting_fee_str3 = this.getLocalStr("seeting_fee_str3")
				this.seeting_fee_title = this.getLocalStr("seeting_fee_title")
			},
			handleCheck(index){
				this.currentFee.index = index;
				this.currentFee.unitPrice = this.menuList[index].unitPrice;
				this.currentFee.money = this.menuList[index].unitPrice * this.workload;
				this.currentFee.rmb = 31.49
			},
			btnConfirm(){
				//点击确定回到转账页
				this.paramsObj.m_feeInfo = this.currentFee;
				
				this.dal.Address.saveTempParamsByCarry(this.paramsObj);	
				this.$openPage({name:"carry-over",gotype:"redirectTo"})
			},
			btnBack: function() {
				this.dal.Address.saveTempParamsByCarry(this.paramsObj);
				this.$openPage({name:"carry-over",gotype:"redirectTo"})
			},
	        onRefersh(){
				// 根据链的类型获取矿工费数据
				this.workload='78';
				this.menuList=[			
					{
						//每次交易需付的
						unitPrice:'135',
						title: "快速",
						time:'30',
					},					
					{
						//每次交易需付的
						unitPrice:'116',
						title: "缓慢",
						time:'120',
					}
				]
			    
				//刚进入默认拿第一个的
				this.currentFee.unitPrice = this.menuList[0].unitPrice;
			    this.currentFee.money = this.menuList[0].unitPrice * this.workload;
			    this.currentFee.rmb = 31.49
			}
		}
	}
</script>

<style lang="scss" scoped>
.setting-fee{
	width: 100%;
	height: 100%;
	background: #f6f7f9;
	min-height: 100vh;
	/deep/ .uni-navbar--border{
		border: 0;
	}
	.fee-info{
		height: 200rpx;
		background: #ffffff;
		border-radius: 10rpx;
		width: calc(100% - 72rpx);
		margin: 0 auto;
		padding: 0 30rpx;
		box-sizing: border-box;
		.top-box{
			border-bottom: 1rpx solid #E7E6ED;
			width:100%;
			height: 130rpx;
			display: flex;
			align-items: center;
			font-size: 30rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			color: #121212;
			
			.fee-desc{
				text-align: right;
				margin-left: auto;
				.rmb{
					color: #c2c2c2;
				}
			}
			image{
				width: 13rpx;
				height: 24rpx;
				margin-left: 22rpx;
			}
	    }
		.botto-box{
			height: 70rpx;
			line-height: 70rpx;
			text-align: right;
			margin-right: 35rpx;
			font-size: 24rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			text-align: right;
			color: #c2c2c2;
		}
	}
	.setting-rate{
		width: calc(100% - 72rpx);	
		margin: 30rpx auto;
		.title{
			font-size: 26rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			text-align: left;
			color: #121212;
			margin-bottom: 17rpx;
		}
		.setting-content{
			width: 100%;
			padding: 0 30rpx;
			box-sizing: border-box;
			background-color: #FFFFFF;
			border-radius: 10rpx;
			.list-item{
				width: 100%;
				height: 116rpx;
				display: flex;
				align-items: center;
				border-bottom: 1rpx solid #E7E6ED;
				&:last-child{
					border: 0;
				}
				text{
					font-size: 24rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					color: #c2c2c2;
					margin-right: 31rpx;
				}
				.check-icon{
					width: 24rpx;
					height: 28rpx;
				}
				.info{
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					margin-right: auto;
					.p1{
						font-size: 30rpx;
						color: #121212;
						line-height: 40rpx;
					}
					.p2{
						font-size: 28rpx;
						color: #8e8e8e;
						line-height: 40rpx;
					}
				}
			}
		}
	}
    .confirm-ok{
    	position: fixed;
    	bottom: 33rpx;
    	left: 50%;
    	transform: translateX(-50%);
    	width: calc(100% - 102rpx);
    	margin: 0 auto;
    	height: 88rpx;
    	line-height: 88rpx;
    	background: #4c72ef;
    	border-radius: 14rpx;
    	box-shadow: 0px 3rpx 26rpx 0px rgba(0,0,0,0.06);
    	 font-size: 32rpx;
    	 font-family: PingFang SC, PingFang SC-Bold;
    	 font-weight: 700;
    	 text-align: center;
    	 color: #ffffff;
    }
}
</style>
