<template>
	<view class="status-manage">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back"  title="管理身份钱包"  @clickLeft="goBack"></uni-nav-bar>
	    <view class="main-c" :style="'height:'+scrollHeight+'px'">
			<view class="statusInfo" @tap="checkStatus">
				<text>{{statusInfo.statusName}}</text>
				<image class="avatar" :src="statusInfo.avatar" mode=""></image>
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
		background-color: #FAFBFF;
		.right-arr{
			width: 13rpx;
			height: 24rpx;
		}
		.statusInfo{
		  width: 100%;
		  height: 160rpx;
		  padding: 0 34rpx 0 43rpx;
		  box-sizing: border-box;
		  display: flex;
		  align-items: center;
		  background-color: #FFFFFF;
		 font-size: 34rpx;
		 font-family: PingFang SC, PingFang SC-Regular;
		 font-weight: 600;
		 color: #121212;
		  .avatar{
			  width: 78rpx;
			  height: 78rpx;
			  border-radius: 50%;
			  margin-right: 30rpx;
			  margin-left: auto;
		  }
		}
	    .bak_wallet{
			width: 100%;
			margin-top: 24rpx;
			.top-c{
				width: 100%;
				height: 106rpx;
				padding: 0 34rpx 0 43rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				background-color: #FFFFFF;
				.right-arr{
					margin-left:30rpx;
				}
				text:first-child{
					margin-right: auto;
					font-size: 34rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 600;
					color: #121212;
				}
			}
			.botto-c{
				width: 100%;
				height: 87rpx;
				padding: 0 34rpx 0 43rpx;
				box-sizing: border-box;
				line-height: 87rpx;
				font-size: 26rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
				text-align: left;
				color: #3981f3;
			}
		}
	    .add-coin{
			width: 100%;
			height: 157rpx;
			padding: 0 34rpx 0 43rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			background-color: #FFFFFF;
			.info{
				width: 80%;
				font-family: PingFang SC, PingFang SC-Regular;
				
				.title{
					font-size: 34rpx;
					color: #121212;
					font-weight: 600;
				}
				.subtitle{
					font-size: 30rpx;
					color: #999999;
					font-weight: 500;
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
