<template>
	<view class="create-index">
		<uni-nav-bar :statusBar="true" :fixed="true" left-icon="back"  title="创建钱包"  @clickLeft="goBack"></uni-nav-bar>
		<view class="create-main" :style="'height:'+scrollHeight+'px'">
			<view class="top-title">钱包名称</view>
			<view class="input-box">
				<input type="text" placeholder="1-12位字符" v-model="walletName"/>
			</view>
			<view class="input-box">
				<input @input="inputPasd" type="text" password placeholder="密码" v-model="password"/>
			</view>
			<view class="tips">{{tip_1}}</view>
			<view class="input-box">
				<input @blur="reconfirm" password type="text" placeholder="重复输入密码" v-model="confirmPasd"/>
			</view>
			<view class="tips">{{tip_2}}</view>
			<view class="input-box">
				<input type="text" placeholder="密码提示(可选)" v-model="pasdTip"/>
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
	.create-main{
		width: 100%;
		height: 100%;
		padding: 50rpx;
		box-sizing: border-box;
		background-color: #F2F2F2;
		.top-title{
			font-size: 28rpx;
			font-weight: bold;
			color: #444444;
			margin-bottom: 30rpx;
		}
		.input-box{
			width: 100%;
			height: 80rpx;
			border-radius: 20rpx;
			background-color: #FFFFFF;
			margin-bottom: 30rpx;
			display: flex;
			align-items: center;
			uni-input{
				height: 60rpx;
				margin-left: 30rpx;
				font-size: 26rpx;
				color: #8e8e8e;
			}
		}
		.tips{
			text-align: right;
			font-size: 24rpx;
			color: #007AFF;
			margin-bottom: 30rpx;
		}
		.btn_ok{
			width: 100%;
			height: 80rpx;
			font: 28rpx bold;
			color: #FFFFFF;
			letter-spacing: 10rpx;
			text-align: center;
			line-height: 80rpx;
			border-radius: 20rpx;
		}
	}
}
</style>
