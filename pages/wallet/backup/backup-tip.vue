<template>
	<view class="create-index">
		<uniNavBar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" title="备份" @clickLeft="btnBack"></uniNavBar>
		<view class="create-list">
			<view class="tip-title">备份提示</view>
			<view class="tip-cotent">获取{{str1}}等于获取钱包资产所有权</view>
			<view class="line"></view>
			<view class="tip-list">
				<image src="../../../static/image/index/warning.png" />
				<view>使用纸笔正确抄写，并保管至安全的地方</view>
			</view>
			<view class="tip-list">
				<image src="../../../static/image/index/warning.png" />
				<view>{{str2}}丢失无法找回，请务必备份{{str2}}</view>
			</view>
		</view>
		<view @tap="goNext" class="container-login" >下一步</view>
		<uni-popup type="bottom" class="tip-pop" ref="popup">
			<view class="pop-main">
				<uni-icons @tap="cancell" type="closeempty" size="30" color="#000000" class="cancell-icon"></uni-icons>
				<image class="noPhoto" src="../../../static/image/index/bak_tip.png" mode=""></image>
				<view class="title">请勿截屏</view>
				<view class="subTitle">请勿截屏和分享，这将可能被第三方恶意软件收集，造成资产损失</view>
				<view class="ok_btn" @tap="btnNext">我知道了</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'	
	export default {
		components: {			
			uniPopup
		},
		data() {
			return {
				//备份提示，1备份助记词  2备份keystore 3备份私钥
				//根据不同情况显示不同提示
				bakType:2,
				scrollHeight: 0,
				str1:"助记词",
				str2:"助记词",
				paramsObj:{}
			}
		},
		onLoad(option) {
			if(option.query){
				let params = JSON.parse(option.query);
				if(Object.keys(params).length!=0){
					
					this.paramsObj = params;
					if(params.bakType){
						this.bakType = params.bakType;
					}else{
						this.bakType = 1;
					}
					switch (params.bakType){
						case 1:this.str1="助记词"; this.str2="助记词";
							break;
						case 2:this.str1="助记词"; this.str2="助记词";
							break;
						case 3:this.str1="私钥和密码"; this.str2="私钥";
							break;
						default:this.str1="助记词"; this.str2="助记词";
							break;
					}
				}
			}			
		},
		methods: {
			btnBack:function(){
				this.util.UiUtils.switchBackPage();
			},
			goNext(){
				this.$refs.popup.open()
			},
			cancell(){
				this.$refs.popup.close()
			},
			btnNext:function(){
				// 从创建钱包那边  从钱包详情那边   都传递相应的参数来到该页面，
				// 将他们传递的参数保存在paramsObj,传递到下个页面，备份助记词，或者备份私钥或keystore 在各自相应的页面组装所需数据
				console.log(this.bakType)
				if(this.bakType==1){
					this.$openPage({name:"backup-info",query:this.paramsObj});
				}else if(this.bakType==2){
					this.$openPage({name:"backup-keystore",query:this.paramsObj});
				}else if(this.bakType==3){
					this.$openPage({name:"backup-private",query:this.paramsObj});
				}
				
				this.$refs.popup.close()
			}
		},
		onShow() {
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight -44;
				}
			});
		}
	}
</script>

<style lang="scss" scoped>
.create-index{
	height: 100%;
	width: 100%;
	overflow: hidden;
	background-color: #FFFFFF;
	/deep/ .uni-navbar--border{
		border: 0;
	}
	.create-list{
		width: 100%;
		.tip-title{
			padding: 71rpx 0 20rpx 50rpx;
			box-sizing: border-box;
			font-size: 38rpx;
			font-family: PingFang SC, PingFang SC-Semibold;
			font-weight: 600;
			text-align: left;
			color: #071328;
		}
		.tip-cotent{
			padding: 0rpx 0 41rpx 50rpx;
			box-sizing: border-box;
			font-size: 28rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			text-align: left;
			color: #071328;           
		}
		.line{
			width: 100%;
			height: 1rpx;
			background-color: #e7e6ed;
			margin-bottom: 33rpx;
		}
		.tip-list{
			width: 100%;
			padding: 0 55rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			margin-bottom: 23rpx;
			image{
				width: 22rpx;
				height: 22rpx;
				margin-right: 15rpx;
			}
			view{
				font-size: 26rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
				text-align: left;
				color: #909090;
			}
		}
	}
	.container-login {
		width: 647rpx;
		height: 88rpx;
		line-height: 88rpx;
		margin: 0 auto;
		background: #4c72ef;
		border-radius: 14rpx;
		box-shadow: 0px 3rpx 26rpx 0px rgba(0,0,0,0.06); 
		font-size: 32rpx;
		font-family: PingFang SC, PingFang SC-Bold;
		font-weight: 700;
		text-align: center;
		color: #ffffff;
		position: fixed;
		bottom: 47rpx;
		left: 50%;
		transform: translateX(-50%);
	}
    .pop-main{
		width: 100%;
		height: 670rpx;
		background: #ffffff;
		border-radius: 32rpx 32rpx 0 0;
		position: relative;
		text-align: center;
		.cancell-icon{
			position: absolute;
			top: 0rpx;
			right: 30rpx;
		}
		.noPhoto{
			width: 350rpx;
			height: 200rpx;
			margin: 86rpx 0 47rpx;
		}
		.title{
			font-size: 32rpx;
			font-family: PingFang SC, PingFang SC-Medium;
			font-weight: 700;
			color: #121212;
		}
		.subTitle{
			padding: 0 67rpx;
			box-sizing: border-box;
			font-size: 28rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			text-align: center;
			color: #7c7c7c;
			line-height: 42rpx;
		}
		.ok_btn{
			width: 647rpx;
			height: 88rpx;
			line-height: 88rpx;
			opacity: 1;
			background: #4c72ef;
			border-radius: 14rpx;
			box-shadow: 0px 3rpx 26rpx 0px rgba(0,0,0,0.06); 
			font-size: 32rpx;
			font-family: PingFang SC, PingFang SC-Bold;
			font-weight: 700;
			text-align: center;
			color: #ffffff;
			margin: 35rpx auto;
		}
	}
}
</style>
