<template>
	<view class="wallet-detail">
		<uni-nav-bar :statusBar="true" :fixed="true" left-icon="back" title="钱包详情" @clickLeft="goBack"></uni-nav-bar>
	    <view class="wallet-info">
			<view class="wallet_addr">
				<view class="title">钱包地址</view>
				<view class="addr">{{walletInfo.addr}}</view>
			</view>
			<view class="wallet-Name" @click="goEdit">
				<text class="title">钱包名称</text>
				<text class="w-name">{{walletInfo.name}}</text>
				<image class="right_arr" src="../../../static/image/mine/arrow-left.svg" mode=""></image>
			</view>
			<view class="wallet-bak" @click="goBak">
				<text class="title">备份钱包</text>
				<image class="right_arr" src="../../../static/image/mine/arrow-left.svg" mode=""></image>
			</view>
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
		<view class="dele_btn" @tap="removeWallet">移除</view>
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
					addr:"anvjiuy2945-1mf-=2koijc83bjiaov"
				},
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
		onLoad(option) {
			if(option.query){
				let params = JSON.parse(option.query);
				
				if(Object.keys(params).length!=0){
					this.walletInfo = params;
				}
			}
		},
		methods:{
			removeWallet(){
				//删除钱包
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
					this.$openPage({name:"backup-tip",query:{bakType:this.exportType}});
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
	background-color: #F2F2F2; 
	.wallet-info{
		width: 100%;
		margin-top: 50rpx;
		padding: 20rpx 35rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		&>view{
			height: 120rpx;
			width: 100%;
			border-bottom: 1rpx solid #F2F2F2;
		}
		.wallet_addr{
			
		}
		.wallet-Name{
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
		.wallet-bak{
			display: flex;
			align-items: center;
			.right_arr{
				width: 13rpx;
				height: 24rpx;
				margin-left: auto;
			}
		}
	}
    .wallet-mode{
		width: 100%;
		margin-top: 50rpx;
		padding: 20rpx 35rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		.title-item{
			width: 100%;
			height: 90rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.right-icon{
				width: 30rpx;
				height: 30rpx;
			}
		}
		.type-list{
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
    	width: 500rpx;
    	background-color: #efefef;
    	border-radius: 20rpx;
    	padding-top: 30rpx;
    	.title{
    		font-size: 26rpx;
    		color: #444444;
    		font-weight: bold;
    		text-align: center;
    	}
    	.input-box{
    		width: 100%;
    		uni-input{
    			width: 90%;
    			height: 60rpx;
    			line-height: 60rpx;
    			border-radius: 10rpx;
    			padding-left: 20rpx;
    			box-sizing: border-box;
    			background-color: #FFFFFF;
    			margin: 10rpx auto 30rpx;
    			font-size: 24rpx;
    			color: #8e8e8e;
    		}
    	}
    	.btns{
    		width: 100%;
    		font-size: 26rpx;
    		color: #007AFF;
    		font-weight: bold;
    		text-align: center;
    		border-top: 2rpx solid #F2F2F2;
    		display: flex;
    		align-items: center;
    		.cancell{
    			width: 50%;
    			line-height: 60rpx;
    			border-right: 2rpx solid #F2F2F2;
    		}
    		.ok{
    			width: 50%;
    			line-height: 60rpx;
    		}
    	}
    }
    .dele_btn{
		width: 100%;
		margin-top: 50rpx;
		padding: 20rpx 35rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		color: #FF3333;
		font-size: 30rpx;
		text-align: center;
		line-height: 80rpx;
	}
}
</style>
