<template>
	<view class="status-manage">
		<uni-nav-bar :statusBar="true" :fixed="true" left-icon="back"  title="管理身份钱包"  @clickLeft="goBack"></uni-nav-bar>
	    <view class="main-c" :style="'height:'+scrollHeight+'px'">
			<view class="statusInfo" @tap="checkStatus">
				<image class="avatar" :src="statusInfo.avatar" mode=""></image>
				<text>{{statusInfo.statusName}}</text>
				<image class="right-arr" src="../../../static/image/mine/arrow-left.svg" mode=""></image>
			</view>
			<view class="bak_wallet" @tap="goBak">
				<view class="top-c">
					<text>备份钱包</text>
					<text v-if="isBak">已备份</text>
					<text v-else>未备份</text>
					<image class="right-arr" src="../../../static/image/mine/arrow-left.svg" mode=""></image>
				</view>
				<view class="botto-c">备份钱包以使将来恢复身份钱包下的多币资产</view>
			</view>
			<view class="add-coin" @tap="goAddCoin">
				<view class="info">
					<view class="title">添加币种</view>
					<view class="subtitle">支持EOS,CKB,BCH,LTC,DOT,FIL</view>
				</view>
				<image class="right-arr" src="../../../static/image/mine/arrow-left.svg" mode=""></image>
			</view>
		</view>
		<uni-popup type="center" ref="pasdPop" class="pasdTip">
			<view class="main-content">
				<view class="title">请输入密码</view>
				<view class="input-box">
					<input type="text" placeholder="密码" password v-model="password" />
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
		name:"status-manage",
		data() {
			return {
				statusInfo:{
					avatar:"../../../static/image/head/2.png",
					statusName:"asdfzx"
				},
				scrollHeight:0,
				isBak:false,
				password:""
			};
		},
		onShow() {
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight -44;
				}
			});
		},
		methods:{
			goBack:function(){
				this.util.UiUtils.switchBackPage();
			},
			checkStatus(){
				this.$openPage({name:"status-wallet-info"})
			},
			goBak(){
				this.$refs.pasdPop.open()
			},
			goAddCoin(){
				this.util.UiUtils.switchToPage("wallet-add-coin", "status-wallet-index",{backType:4});
			},
			confirmOk(){
				if(!this.password){
					this.util.UiUtils.showToast('密码不能为空')
					return;
				}
				
				//检查输入密码是否正确，正确则跳转到备份页，否则给与密码不对提示
				this.password="";
				this.$refs.pasdPop.close()
				this.$openPage({name:"backup-tip"});
			},
			cancell(){
				this.password="";
				this.$refs.pasdPop.close()
			}
		}
	}
	
</script>

<style lang="scss" scoped>
.status-manage{
	width: 100%;	
	.main-c{
		width: 100%;
		padding-top: 30rpx;
		background-color: #F2F2F2;
		.right-arr{
			width: 40rpx;
			height: 40rpx;
			margin-left: auto;
		}
		.statusInfo{
		  width: 100%;
		  height: 150rpx;
		  padding: 0 30rpx;
		  box-sizing: border-box;
		  display: flex;
		  align-items: center;
		  background-color: #FFFFFF;
		  font-size: 28rpx;
		  font-weight: bold;
		  color: #444444;
		  .avatar{
			  width: 100rpx;
			  height: 100rpx;
			  border-radius: 50%;
			  margin-right: 40rpx;
		  }
		}
	    .bak_wallet{
			width: 100%;
			margin-top: 60rpx;
			.top-c{
				width: 100%;
				height: 120rpx;
				padding: 0 30rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				background-color: #FFFFFF;
				.right-arr{
					margin-left:20rpx;
				}
				text:first-child{
					margin-right: auto;
					font-size: 28rpx;
					color: #444444;
					font-weight: bold;
				}
			}
			.botto-c{
				width: 100%;
				height: 80rpx;
				padding: 0 30rpx;
				box-sizing: border-box;
				line-height: 80rpx;
			}
		}
	    .add-coin{
			width: 100%;
			margin-top: 30rpx;
			width: 100%;
			height: 120rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			background-color: #FFFFFF;
			.info{
				width: 80%;
				.title{
					font-size: 28rpx;
					color: #444444;
					font-weight: bold;
				}
				.subtitle{
					font-size: 24rpx;
					color: #8e8e8e;
				}
			}
		}
	}
    .main-content{
    	width: 569rpx;
    	height: 320rpx;
    	background: #ffffff;
    	border: 1rpx solid #707070;
    	border-radius: 21rpx;
    	padding-top: 26rpx;
    	box-sizing: border-box;
    	.title{
    		font-size: 30rpx;
    		font-family: PingFang SC, PingFang SC-Regular;
    		font-weight: 400;
    		color: #071328;
    		text-align: center;
    		font-weight: bold;
    	}
    	.input-box{
    		width: 505rpx;
    		height: 77rpx;	
    		background: #f6f5f8;
    		margin: 42rpx auto 49rpx;
    		uni-input{
    			width: 100%;
    			height: 77rpx;
    			line-height: 77rpx;
    			border-radius: 10rpx;
    			padding-left: 20rpx;
    			box-sizing: border-box;
    			background: #f6f5f8;
    			font-size: 30rpx;
    			font-family: PingFang SC, PingFang SC-Regular;
    			font-weight: 400;
    			color: #c2c2c2;
    		}
    	}
    	.btns{
    		width: 100%;
    		font-size: 26rpx;
    		color: #007AFF;
    		font-weight: bold;
    		text-align: center;
    		border-top: 1rpx solid #E7E6ED;
    		display: flex;
    		align-items: center;
    		font-size: 30rpx;
    		font-family: PingFang SC, PingFang SC-Regular;
    		font-weight: 400;
    		.cancell{
    			color: #C2C2C2;
    			width: 50%;
    			line-height: 60rpx;
    			border-right: 1rpx solid #E5E5E5;
    		}
    		.ok{
    			color: #4C72EF;
    			width: 50%;
    			line-height: 60rpx;
    		}
    	}
    }
}
</style>
