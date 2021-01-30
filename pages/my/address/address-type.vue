<template>
	<view class="addrress-type">
		<uni-nav-bar left-icon="back" :status="true" :fixed="true" title="选择地址类型" @clickLeft="goBack"></uni-nav-bar>
	    <view class="coin-list">
			<view class="list-item" v-for="(item,index) in coinList" :key="index" @click="handleChecked(item)">
				<image class="icon" :src="item.logo" mode=""></image>
				<view class="coin-info">
					<view class="coin-name">
						<view class="short-N">{{item.short_name}}</view>
						<view class="full_N">{{item.full_name}}</view>
					</view>
					<image v-if="current_coin==item.short_name" class="checked-icon" src="../../../static/image/wallet/guide_word.png" mode=""></image>
			    </view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current_coin:"",
				coinList:[
					{
						logo:"../../../static/image/index/eth.png",
						short_name:"ETH",
						full_name:"Ethereum"
					},
					{
						logo:"../../../static/image/index/btc.png",
						short_name:"BTC",
						full_name:"Btcoin"
					},
					{
						logo:"../../../static/image/index/fil.png",
						short_name:"ATOM",
						full_name:"Cosmos"
					},
				]
			};
		},
		onLoad(option) {
			// this.dal.Setting.m_allCoin
			let param = JSON.parse(option.query)
			this.current_coin = param.short_name;
		},
		methods:{
			goBack(){
				this.$openPage({name:"address-detail",gotype:"redirectTo"})
			},
			handleChecked(item){
				this.$openPage({name:"address-detail",gotype:"redirectTo",query:item})
			}
		}
	}
</script>

<style lang="scss">
.addrress-type{
	width: 100%;
	height: 100%;
	min-height: 100vh;
	background-color: #fcfcfc;
	.coin-list{
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		.list-item{
			width: 100%;
			height: 150rpx;
			display: flex;
			align-items: center;
			
			.icon{
				width: 80rpx;
				height: 80rpx;
				margin-right: 30rpx;
				border-radius: 50%;
			}
			.coin-info{
				width: calc(100% - 110rpx);
				border-bottom: 2rpx solid #F2F2F2;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.coin-name{
					.short-N{
						font-size: 28rpx;
						color: #444444;
						font-weight: bold;
					}
					.full-N{
						font-size: 24rpx;
						color: #8e8e8e;
					}
				}
				.checked-icon{
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
					margin-left: auto;
				}
			}
		}
	}
}
</style>
