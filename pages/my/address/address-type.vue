<template>
	<view class="addrress-type">
		<uni-nav-bar background-color="#FAFBFF" left-icon="back" :statusBar="true" :fixed="true" title="选择地址类型" @clickLeft="goBack"></uni-nav-bar>
		<view class="coin-list">
			<view class="list-item" v-for="(item,index) in chainList" :key="index" @click="handleChecked(item)">
				<image class="icon" :src="'../../../static/image/chain/'+item.img" mode=""></image>
				<view class="coin-name">
					<view class="short-N">{{item.name}}</view>
					<view class="full_N">{{item.alias}}</view>
				</view>
				<image v-if="item.chaintype==current_chain" class="checked-icon" src="../../../static/image/mine/checked.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current_chain: 1,
				chainList: [
				]
			};
		},
		onLoad(option) {
			let param = JSON.parse(option.query)
			if(param.chaintype){
				this.current_chain = param.chaintype;
			}
		},
		onShow() {
			this.chainList =  this.dal.Chain.getChainList();
		},
		methods: {
			goBack() {
				this.$openPage({
					name: "address-detail",
					gotype: "redirectTo"
				})
			},
			handleChecked(item) {
				this.$openPage({
					name: "address-detail",
					gotype: "redirectTo",
					query: item
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.addrress-type {
		width: 100%;
		height: 100%;
		min-height: 100vh;
		background-color: #FFFFFF;
		/deep/ .uni-navbar--border{
			border: 0;
		}
		.coin-list {
			width: 100%;
			.list-item {
				width: 100%;
				height: 120rpx;
				display: flex;
				align-items: center;
		        border-bottom: 1rpx solid #E7E6ED;
				padding: 0 40rpx 0 34rpx;
				box-sizing: border-box;
				.icon {
					width: 54rpx;
					height: 54rpx;
					margin-right: 22rpx;
				}
		        .coin-name {
		        	font-family: PingFang SC, PingFang SC-Semibold;					
		        	.short-N {
		        		font-size: 36rpx;
		        		color: #071328;
		        		font-weight: 600;
						line-height: 40rpx;
		        	}
		        	.full-N {
		        		font-size: 24rpx;
		        		color: #7C7C7C;
						line-height: 30rpx;
		        	}
		        }
				.checked-icon{
					margin-left: auto;
					width: 28rpx;
					height: 24rpx;
				}
			}
		}
	}
</style>
