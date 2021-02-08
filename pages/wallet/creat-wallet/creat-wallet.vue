<template>
	<view class="create-index">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" title="创建钱包" @clickLeft="goBack"></uni-nav-bar>
		<view class="create-main">
			<view>
				<view class="top-title">钱包名称</view>
				<view class="input-box">
					<input type="text" placeholder-style="color:#C2C2C2;font-size:26rpx" placeholder="1-12位字符" v-model="walletName" />
				    <uni-icons type="closeempty" size="20" v-if="walletName" @tap="clear('1')"></uni-icons>
				</view>
			</view>
			<view>
				<view class="top-title">设置密码</view>
				<view class="input-box">
					<input @input="inputPasd" type="text" placeholder-style="color:#C2C2C2;font-size:26rpx" password placeholder="输入密码不少于8位数"
					 v-model="password" />
					 <uni-icons type="closeempty" size="20" v-if="password" @tap="clear('2')"></uni-icons>
				</view>
				<view class="tips">{{tip_1}}</view>
			</view>
			<view>
				<view class="top-title">确认密码</view>
				<view class="input-box">
					<input @blur="reconfirm" password type="text" placeholder="重复输入密码" placeholder-style="color:#C2C2C2;font-size:26rpx"
					 v-model="confirmPasd" />
					 <uni-icons type="closeempty" size="20" v-if="confirmPasd" @tap="clear('3')"></uni-icons>
				</view>
				<view class="tips">{{tip_2}}</view>
			</view>
			<view>
				<view class="top-title">设置密码提示</view>
				<view class="input-box">
					<input type="text" placeholder="密码提示(可选)" placeholder-style="color:#C2C2C2;font-size:26rpx" v-model="pasdTip" />
					<uni-icons type="closeempty" size="20" v-if="pasdTip" @tap="clear('4')"></uni-icons>
					
				</view>
			</view>
			<view class="btn_ok" :style="'background-color:'+btn_color" @tap="btnCreate">创建</view>
		</view>
	</view>
</template>

<script>
	import uniIcon from '@/components/uni-icons/uni-icons.vue'
	export default {
		components: {
            uniIcon
		},
		data() {
			return {
				scrollHeight: 0,
				walletName: "",
				password: "",
				confirmPasd: "",
				pasdTip: "",
				tip_1: "",
				tip_2: "",
				coinObj: {}
			}
		},
		onLoad(option) {	
			let params = JSON.parse(option.query);
			if (Object.keys(params).length!=0) {
				this.coinObj = params;
			}
		},
		onShow() {
			// 是否要求恢复到页面刚加载进来时的状态
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight - 44;
				}
			});
		},
		computed: {
			btn_color() {
				if (this.walletName && this.password) {
					return '#0000FF'
				} else {
					return '#C8C7CC'
				}
			}
		},
		methods: {
			clear(str){
				if(str=='1'){
					this.walletName = ""
				}else if(str=='2'){
					this.password = '';
					this.tip_1=""
				}else if(str=='3'){
					this.confirmPasd = "";
					this.tip_2=""
				}else if(str=='4'){
					this.pasdTip = ""
				}
			},
			reconfirm() {
				if (this.password != this.confirmPasd) {
					this.tip_2 = '两次密码不一致';
				} else {
					this.tip_2 = ''
				}
			},
			inputPasd() {
				if (this.password.length < 8) {
					this.tip_1 = "不少于8个字符，建议大小写字母、数字混合"
				} else {
					this.tip_1 = ""
				}

			},
			goBack: function() {
				this.util.UiUtils.switchBackPage();
			},
			btnCreate: function() {
				// 数据校验
				if(!this.walletName){
					this.util.UiUtils.showToast('请输入钱包名称！');
					return;
				}
				if(!this.password){
					this.util.UiUtils.showToast('请输入密码！');
					return;
				}
				if(!this.confirmPasd){
					this.util.UiUtils.showToast('请输入确认密码！');
					return;
				}
				if(this.password != this.confirmPasd){
					this.util.UiUtils.showToast('两次密码不一致！');
					return;
				}
				
				this.util.UiUtils.showLoading("钱包初始化...",1000);
				let params = {
					chaintype: this.coinObj.chaintype,
					name: this.walletName,
					password: this.password,
					tips: this.pasdTip
				}
				setTimeout(()=>{
					this.$openPage({name:'backup-tip',query:params});
				},)
			}
		},
	}
</script>

<style lang="scss" scoped>
	.create-index {
		height: 100%;
		width: 100%;
		min-height: 100vh;
		background-color: #FAFBFF;

		/deep/ .uni-navbar--border {
			border: 0;
		}

		.create-main {
			width: 100%;
			height: 100%;
			padding: 33rpx 36rpx;
			box-sizing: border-box;

			.top-title {
				font-size: 26rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
				color: #121212;
				margin-bottom: 22rpx;
			}

			.input-box {
				width: 100%;
				height: 104rpx;
				border-radius: 10rpx;
				background-color: #FFFFFF;
				margin-bottom: 34rpx;
				display: flex;
				align-items: center;
				
				uni-input {
					width: 85%;
					height: 60rpx;
					margin-left: 32rpx;
					font-size: 26rpx;
				}
			}

			.tips {
				text-align: right;
				font-size: 24rpx;
				color: #3981F3;
			}

			.btn_ok {
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
				box-shadow: 0px 3rpx 26rpx 0px rgba(0, 0, 0, 0.06);
			}
		}
	}
</style>
