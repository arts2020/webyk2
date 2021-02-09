<template>
	<view class="wallet-detail">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" title="钱包详情" @clickLeft="goBack"></uni-nav-bar>
	    <view class="status-info" v-if="!walletInfo.idx">
			<image :src="'../../../static/image/chain/'+walletInfo.img" mode=""></image>
			<text>{{walletInfo.name}}</text>
		</view>
		<view class="wallet-info">
			<view class="wallet_addr">
				<view class="w-title" style="color: #999999;">钱包地址</view>
				<view class="addr">{{walletInfo.address}}</view>
			</view>
			<view class="wallet-Name" @click="goEdit">
				<text class="w-title">钱包名称</text>
				<text class="w-name">{{walletInfo.name}}</text>
				<image class="right_arr" src="../../../static/image/mine/arrow-left.svg" mode=""></image>
			</view>
		</view>
		<view class="wallet-bak" @click="goBak">
			<text class="w-title">备份钱包</text>
			<image class="right_arr" src="../../../static/image/mine/arrow-left.svg" mode=""></image>
		</view>
		<view class="wallet-mode">
			<view class="title-item">
				<text>高级模式</text>
				<image class="right-icon" :src="rightIcon" mode="" @tap="changeContent"></image>
			</view>
			<view class="type-list" v-if="ishowContent">
				<view class="type-item" @tap="goExport(2)">
					<text>导出keystore</text>
					<image class="right_arr" src="../../../static/image/mine/arrow-left.svg" mode=""></image>
				</view>
				<view class="type-item" @tap="goExport(3)">
					<text>导出私钥</text>
					<image class="right_arr" src="../../../static/image/mine/arrow-left.svg" mode=""></image>
				</view>
			</view>
		</view>
		<view class="dele_btn" @tap="removeWallet" v-if="walletInfo.idx">移除</view>
		<uni-popup type="center" ref="pasdPop" class="pasdTip">
			<view class="main-content">
				<view class="title">{{popType==1?'请输入密码':"钱包名称"}}</view>
				<view class="input-box">
					<input v-if="popType==1" type="text" password placeholder="密码" v-model="password" />
				    <input v-if="popType==2" type="text" :placeholder="walletInfo.name" v-model="newWalletName" />
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
		name:"wallet-detail",
		data() {
			return {
				walletInfo:{
					name:"jugwyvda",
					address:"anvjiuy2945-1mf-=2koijc83bjiaov"
				},
				statusInfo:{},
				ishowContent:false,
				rightIcon:"../../../static/image/mine/arrow-left.svg",
				password:"",
				newWalletName:"",
				//弹框类型是1输密码还是2改名称
				popType:1,
				// 2导出keystore  3 导出私钥 1备份钱包
				exportType:1,
			};
		},
		onShow() {
			// 从数据层获取当前钱包信息
			this.walletInfo = this.dal.WalletManage.getCurrWallet();
			console.log(this.walletInfo)
		},
		methods:{
			removeWallet(){
				//删除钱包
				this.dal.NormalWallet.deleteNormalWallet(this.walletInfo.chaintype,this.walletInfo.idx);
				this.util.UiUtils.showToast('移除成功')
				setTimeout(()=>{
					this.$openPage({name:"my-wallet-index",gotype:"redirectTo"});
				},1000)
			},
			goBack(){
				this.util.UiUtils.switchBackPage();
			},
			changeContent(){
				this.ishowContent = !this.ishowContent;
				if(this.ishowContent){
					this.rightIcon = '../../../static/image/index/dowm.svg'
				}else{
					this.rightIcon = '../../../static/image/mine/arrow-left.svg'
				}
			},
			goEdit(){
				this.popType = 2;
				this.$refs.pasdPop.open()
			},
			goBak(){
				this.popType = 1;
				this.exportType = 1;
				this.$refs.pasdPop.open();
			},
			cancell(){
				this.password = "";
				this.newWalletName="";
				this.$refs.pasdPop.close()
			},
			confirmOk(){
				if(this.popType==1){
					//备份钱包 导出keystore或者私钥
					//检查密码是否为空
					if(!this.password){
						this.util.UiUtils.showToast('密码不能为空')
						return;
					}
					//备份钱包
					//导出keystore
					//导出私钥
					this.$openPage({name:"backup-tip",
					query:{
						  bakType:this.exportType,
						  isBak:true,
						  // 将需要的钱包信息传递到备份提示也
						  name:this.walletInfo.name
					    },
					});
						
				}else if(this.popType==2){
					//修改名称
					if(!this.newWalletName){
						this.util.UiUtils.showToast('钱包名称不能为空')
						return;
					}
				}
				this.password = "";
				this.newWalletName="";
				this.$refs.pasdPop.close();
			},
			goExport(e){
              this.exportType=e;
			  this.popType = 1;
			  this.$refs.pasdPop.open();
			},
		}
	}
</script>

<style lang="scss" scoped>
.wallet-detail{
	width: 100%;
	min-height: 100vh; 
	background-color: #FAFBFF; 
	/deep/ .uni-navbar--border{
		border: 0;
	}
	.w-title{
		font-size: 30rpx;
		font-family: PingFang SC, PingFang SC-Regular;
		font-weight: 400;
		color: #121212;
	}
	.status-info{
		width: calc(100% - 72rpx);
		height: 108rpx;
		margin: 20rpx auto 27rpx;
		padding: 0rpx 27rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		image{
			width: 65rpx;
			height: 65rpx;
			margin-right: 30rpx;
		}
	}
	.wallet-info{
		width: calc(100% - 72rpx);
		margin: 16rpx auto;
		padding: 0rpx 27rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		.wallet_addr{
			width: 100%;
			height: 151rpx;
			padding: 35rpx 0rpx 21rpx;
			box-sizing: border-box;
			border-bottom: 1rpx solid #e7e6ed;
			.addr{
				font-size: 28rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
				color: #121212;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
		.wallet-Name{
			width: 100%;
			height: 95rpx;
			display: flex;
			align-items: center;
			.w-name{
				margin-left: auto;
			}
			.right_arr{
				width: 13rpx;
				height: 24rpx;
				margin-left: 30rpx;
			}
		}
		
	}
	.wallet-bak{
		width: calc(100% - 72rpx);
		height: 108rpx;
		margin: 20rpx auto 27rpx;
		padding: 0rpx 27rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		.right_arr{
			width: 13rpx;
			height: 24rpx;
			margin-left: auto;
		}
	}
    .wallet-mode{
		width: calc(100% - 72rpx);
		height: 108rpx;
		margin: 0 auto;
		border-radius: 10rpx;
		.title-item{
			width: 100%;
			height:108rpx;
			padding: 0rpx 27rpx;
			box-sizing: border-box;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.right-icon{
				width: 30rpx;
				height: 30rpx;
			}
		}
		.type-list{
			width: 100%;
			padding: 0rpx 27rpx;
			box-sizing: border-box;
			background-color: #FFFFFF;
			.type-item{
				width: 100%;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size:24rpx;
				color: #8e8e8e;
				.right_arr{
					width: 13rpx;
					height: 24rpx;
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
    .dele_btn{
		width: 647rpx;
		height: 88rpx;
		background: #f57778;
		border-radius: 14rpx;
		box-shadow: 0px 3rpx 26rpx 0px rgba(0,0,0,0.06); 
		color: #FFFFFF;
		font-size: 32rpx;
		font-family: PingFang SC, PingFang SC-Bold;
		font-weight: 700;
		text-align: center;
		line-height: 88rpx;
		position: fixed;
		bottom: 47rpx;
		left: 50%;
		transform: translateX(-50%);
	}
}
</style>
