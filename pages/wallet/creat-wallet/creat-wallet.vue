<template>
	<view class="create-index">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" :title="create_wallet_str4" @clickLeft="goBack"></uni-nav-bar>
		<view class="create-main">
			<view>
				<view class="top-title">{{wallet_detail_str7}}</view>
				<view class="input-box">
					<input type="text" placeholder-style="color:#C2C2C2;font-size:26rpx" :placeholder="placeholder_str1" v-model="walletName" />
				    <uni-icons type="closeempty" size="20" v-if="walletName" @tap="clear('1')"></uni-icons>
				</view>
			</view>
			<view>
				<view class="top-title">{{setting_pasd}}</view>
				<view class="input-box">
					<input @input="inputPasd" type="text" placeholder-style="color:#C2C2C2;font-size:26rpx" password :placeholder="placeholder_str2"
					 v-model="password" />
					 <uni-icons type="closeempty" size="20" v-if="password" @tap="clear('2')"></uni-icons>
				</view>
				<view class="tips">{{tip_1}}</view>
			</view>
			<view>
				<view class="top-title">{{confirm_pasd}}</view>
				<view class="input-box">
					<input @blur="reconfirm" password type="text" :placeholder="placeholder_str3" placeholder-style="color:#C2C2C2;font-size:26rpx"
					 v-model="confirmPasd" />
					 <uni-icons type="closeempty" size="20" v-if="confirmPasd" @tap="clear('3')"></uni-icons>
				</view>
				<view class="tips">{{tip_2}}</view>
			</view>
			<view>
				<view class="top-title">{{setting_pasd_tip}}</view>
				<view class="input-box">
					<input type="text" :placeholder="placeholder_str4" placeholder-style="color:#C2C2C2;font-size:26rpx" v-model="pasdTip" />
					<uni-icons type="closeempty" size="20" v-if="pasdTip" @tap="clear('4')"></uni-icons>
					
				</view>
			</view>
			<view class="btn_ok" :style="'background-color:'+btn_color" @tap="btnCreate">{{btnstring_create}}</view>
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
			this.initword()
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
			initword(){
				this.btnstring_create = this.getLocalStr('btnstring_create')
				this.wallet_detail_str7 = this.getLocalStr('wallet_detail_str7');
				this.placeholder_str1 = this.getLocalStr('placeholder_str1');
				this.create_wallet_str4 = this.getLocalStr("create_wallet_str4")
				this.setting_pasd = this.getLocalStr('setting_pasd');
				this.placeholder_str2 = this.getLocalStr('placeholder_str2');
				this.confirm_pasd = this.getLocalStr('confirm_pasd');
				this.placeholder_str3 = this.getLocalStr('placeholder_str3');
				this.setting_pasd_tip = this.getLocalStr('setting_pasd_tip');
				this.placeholder_str4 = this.getLocalStr('placeholder_str4');
				this.err_tip_str6 = this.getLocalStr('err_tip_str6');
				this.err_tip_str7 = this.getLocalStr('err_tip_str7');
				this.err_tip_str8 = this.getLocalStr('err_tip_str8');
				this.err_tip_str9 = this.getLocalStr('err_tip_str9');
				this.err_tip_str10 = this.getLocalStr('err_tip_str10');
				this.err_tip_str11 = this.getLocalStr('err_tip_str11');
			},
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
					this.tip_2 = this.err_tip_str6;
				} else {
					this.tip_2 = ''
				}
			},
			inputPasd() {
				if (this.password.length < 8) {
					this.tip_1 = this.err_tip_str7
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
					this.util.UiUtils.showToast(this.err_tip_str8);
					return;
				}
				if(!this.password){
					this.util.UiUtils.showToast(this.err_tip_str9);
					return;
				}
				if(!this.confirmPasd){
					this.util.UiUtils.showToast(this.err_tip_str10);
					return;
				}
				if(this.password != this.confirmPasd){
					this.util.UiUtils.showToast(this.err_tip_str6);
					return;
				}
				
				this.util.UiUtils.showLoading(this.err_tip_str11,1000);
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
