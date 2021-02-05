<template>
	<view class="create-index">
		<uni-nav-bar background-color="#F6F7F9" :statusBar="true" :fixed="true" left-icon="back"  title="创建钱包"  @clickLeft="goBack"></uni-nav-bar>
		<view class="create-main">
			<view>
				<view class="top-title">钱包名称</view>
				<view class="input-box">
					<input type="text" placeholder-style="color:#C2C2C2;font-size:26rpx" placeholder="1-12位字符" v-model="walletName"/>
				</view>
			</view>
			<view>
				<view class="top-title">钱包名称</view>
				<view class="input-box">
					<input @input="inputPasd" type="text" placeholder-style="color:#C2C2C2;font-size:26rpx" password placeholder="密码" v-model="password"/>
				</view>
				<view class="tips">{{tip_1}}</view>
			</view>
			<view>
				<view class="top-title">钱包名称</view>
				<view class="input-box">
					<input @blur="reconfirm" password type="text" placeholder="重复输入密码" placeholder-style="color:#C2C2C2;font-size:26rpx" v-model="confirmPasd"/>
				</view>
				<view class="tips">{{tip_2}}</view>
			</view>
			<view>
				<view class="top-title">钱包名称</view>
				<view class="input-box">
					<input type="text" placeholder="密码提示(可选)" placeholder-style="color:#C2C2C2;font-size:26rpx" v-model="pasdTip"/>
				</view>
			</view>
		    <view class="btn_ok" :style="'background-color:'+btn_color" @tap="btnCreate">创建</view>
		</view>
	</view>
</template>

<script>	
	export default {
		components: {
			
		},
		data() {
			return {
				scrollHeight:0,
				walletName:"",
				password:"",
				confirmPasd:"",
				pasdTip:"",
				tip_1:"",
				tip_2:"",
				coinObj:{}
			}
		},
		onLoad(option) {
			if(option.query){
				this.coinObj = JSON.parse(option.query)
			}
		},
		onShow() {
			// 是否要求恢复到页面刚加载进来时的状态
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight -44;
				}
			});
		},
		computed:{
			btn_color(){
				if(this.walletName&&this.password){
					return '#0000FF'
				}else{
					return '#C8C7CC'
				}
			}
		},
		methods: {
			reconfirm(){
				if(this.password!=this.confirmPasd){
					this.tip_2 = '两次密码不一致'
				}else{
					this.tip_2 = ''
				}
			},
			inputPasd(){
				if(this.password.length<8){
					this.tip_1 = "不少于8个字符，建议大小写字母、数字混合"
				}else{
					this.tip_1=""
				}
				
			},
			goBack:function(){
				this.util.UiUtils.switchBackPage();
			},
			btnCreate:function(){
				// 还没有输入钱包名称和密码时点击按钮不给予操作
				if(!(this.walletName&&this.password)){return;}
				
				this.util.UiUtils.showLoading("钱包初始化...");
				let params = {
					type:this.coinObj.chaintype,
					walletName:this.walletName,
					password:this.password,
					pasdTip:this.pasdTip,
				}
				//传参到数据层添加普通钱包
				
				//给出成功提示
				
				//1s后跳转到备份助记词提示页
				setTimeout(()=>{
					this.util.UiUtils.switchToPage("backup-tip", "creat-wallet-wallet",{},"redirectTo");
				},1000)
			}
		},
	}
</script>

<style lang="scss" scoped>
.create-index{
	height: 100%;
	width: 100%;
	min-height: 100vh;
	background-color: #F6F7F9;
	/deep/ .uni-navbar--border{
		border: 0;
	}
	.create-main{
		width: 100%;
		height: 100%;
		padding: 33rpx 36rpx;
		box-sizing: border-box;
		.top-title{
			font-size: 26rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			color: #121212;
			margin-bottom: 22rpx;
		}
		.input-box{
			width: 100%;
			height: 104rpx;
			border-radius: 10rpx;
			background-color: #FFFFFF;
			margin-bottom: 34rpx;
			display: flex;
			align-items: center;
			font-size: 26rpx;
			color: #444444;
			uni-input{
				height: 60rpx;
				margin-left: 32rpx;
			}
		}
		.tips{
			text-align: right;
			font-size: 24rpx;
			color: #007AFF;
		}
		.btn_ok{
			width: 100%;
			height: 88rpx;
			margin-top: 68rpx;
			font: 32rpx;
			font-weight: 700;
			color: #FFFFFF;
			letter-spacing: 10rpx;
			text-align: center;
			line-height: 88rpx;
			border-radius: 14rpx;
			box-shadow: 0px 3rpx 26rpx 0px rgba(0,0,0,0.06); 
		}
	}
}
</style>
