<template>
	<view class="recover-index">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" :title="import_wallet_str1" @clickLeft="goBack"></uni-nav-bar>
		<view class="recover-main">
			<view>
				<view class="top-title">{{title}}</view>
				<view class="input-box" style="height: 250rpx;">
					<textarea v-if="coinObj.type == 1" placeholder-style="font-size: 26rpx;color: #C2C2C2;" :placeholder="placeholder_str5" v-model="words" />
				    <textarea v-else placeholder-style="font-size: 26rpx;color: #C2C2C2;" :placeholder="placeholder_str6" v-model="secretKey" />
				</view>
			</view>
			<view>
				<view class="top-title">{{setting_pasd}}</view>
				<view class="input-box">	
					<input @input="inputPasd" type="text" password :placeholder="placeholder_str2" placeholder-style="font-size: 26rpx;color: #C2C2C2;" v-model="password"/>
				<uni-icons type="closeempty" size="20" v-if="password" @tap="clear('2')"></uni-icons>
				</view>
				<view class="tips">{{tip_1}}</view>
			</view>
			
			<view>
				<view class="top-title">{{confirm_pasd}}</view>
				<view class="input-box">
					<input @blur="reconfirm" password type="text" :placeholder="placeholder_str3" placeholder-style="font-size: 26rpx;color: #C2C2C2;" v-model="confirmPasd"/>
				    <uni-icons type="closeempty" size="20" v-if="confirmPasd" @tap="clear('3')"></uni-icons>
				</view>
				<view class="tips">{{tip_2}}</view>
			</view>
			
			<view>
				<view class="top-title">{{setting_pasd_tip}}</view>
				<view class="input-box">
					<input type="text" :placeholder="placeholder_str4" v-model="pasdTip" placeholder-style="font-size: 26rpx;color: #C2C2C2;"/>
				    <uni-icons type="closeempty" size="20" v-if="pasdTip" @tap="clear('4')"></uni-icons>
				</view>
			</view>
		    <view class="btn_ok" :style="'background-color:'+btn_color" @tap="btnRecover">{{btnstring_confirm}}</view>
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
				scrollHeight:0,
				secretKey:"",
				words:"",
				chaintype:"",
				password:"",
				confirmPasd:"",
				pasdTip:"",
				tip_1:"",
				tip_2:"",
				//要导入的钱包所属单链的信息
				coinObj:{},
				title:"助记词"
			}
		},
		onLoad(option) {
			if(option.query){	
				
				this.coinObj = JSON.parse(option.query);
				this.chaintype = this.coinObj.chaintype;
				console.log("==this.chaintype==",this.chaintype)
				if(this.coinObj.type == 1){
					this.title = "助记词"
				}else if(this.coinObj.type==2){
					this.title =  "私钥"
				}
			}
			this.initword();
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
				if((this.words||this.secretKey)&&this.password){
					return '#4C72EF'
				}else{
					return '#C8C7CC'
				}
			}
		},
		methods: {
			initword(){
				this.import_wallet_str1 = this.getLocalStr("import_wallet_str1");
				this.placeholder_str5 = this.getLocalStr('placeholder_str5');
				this.placeholder_str6 = this.getLocalStr('placeholder_str6');
				this.btnstring_confirm = this.getLocalStr('btnstring_confirm')
				this.wallet_detail_str7 = this.getLocalStr('wallet_detail_str7');
				this.placeholder_str1 = this.getLocalStr('placeholder_str1');
				this.create_wallet_str4 = this.getLocalStr("create_wallet_str4")
				this.setting_pasd = this.getLocalStr('setting_pasd');
				this.placeholder_str2 = this.getLocalStr('placeholder_str2');
				this.confirm_pasd = this.getLocalStr('confirm_pasd');
				this.placeholder_str3 = this.getLocalStr('placeholder_str3');
				this.setting_pasd_tip = this.getLocalStr('setting_pasd_tip');
				this.placeholder_str4 = this.getLocalStr('placeholder_str4');
				this.placeholder_str5 = this.getLocalStr('placeholder_str4');
				this.placeholder_str6 = this.getLocalStr('placeholder_str4');
				this.err_tip_str6 = this.getLocalStr('err_tip_str6');
				this.err_tip_str7 = this.getLocalStr('err_tip_str7');
				this.err_tip_str8 = this.getLocalStr('err_tip_str8');
				this.err_tip_str9 = this.getLocalStr('err_tip_str9');
				this.err_tip_str10 = this.getLocalStr('err_tip_str10');
				this.err_tip_str11 = this.getLocalStr('err_tip_str11');
				this.err_tip_str13 = this.getLocalStr('err_tip_str13');
				this.err_tip_str14 = this.getLocalStr('err_tip_str14');
				this.placeholder_str7 = this.getLocalStr("placeholder_str7");
			},
			clear(str){
				if(str=='1'){
					this.secretKey = ""
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
			reconfirm(){
				if(this.password!=this.confirmPasd){
					this.tip_2 = this.err_tip_str6
				}else{
					this.tip_2 = ''
				}
			},
			inputPasd(){
				if(this.password.length<8){
					this.tip_1 = this.err_tip_str7
				}else{
					this.tip_1=""
				}
				
			},
			goBack:function(){
				this.util.UiUtils.switchBackPage();
			},
			btnRecover:function(){
				if(!(this.words||this.secretKey)&&this.password){
					return;
				}
				if(this.coinObj.type == 1){
					// 如果助记词导入就验证助记词
					if(!this.words){
						this.util.UiUtils.showToast(this.placeholder_str7)
						return; 
					}
					if (this.words.length < 12) {
						this.util.UiUtils.showToast(this.err_tip_str14)
						return;
					}
					
				}else if(this.coinObj.type==2){
					//验证私钥
					if(!this.secretKey){
						this.util.UiUtils.showToast(this.placeholder_str6)
						return; 
					}
				}
				
				if(!this.password){
					this.util.UiUtils.showToast(this.err_tip_str9)
					return; 
				}
				if(!this.confirmPasd){
					this.util.UiUtils.showToast(this.err_tip_str10)
					return; 
				}
				if(this.password!=this.confirmPasd){
					this.util.UiUtils.showToast(this.err_tip_str6)
					return; 
				}
				
				
				this.util.UiUtils.showLoading(this.err_tip_str11);
				
				//传参到数据层导入普通钱包，  根据助记词和私钥需要的不同参数传
				let strval = ""
				let importtype = this.entities.Metadata.ImportType.WordType
				if(this.coinObj.type == 1){
					importtype = this.entities.Metadata.ImportType.WordType
					strval = this.words;
				}else if(this.coinObj.type==2){
					importtype = this.entities.Metadata.ImportType.PrivateType
					strval = this.secretKey;
				}
				
				let params = {
					name: "",
					password: this.password,
					passwordtip: this.pasdTip,
					strval:strval,
					importtype:importtype,
					chaintype:this.chaintype
				}

				this.dal.WalletManage.createNormalWallet(params).then(result => {
				    console.log("========import-wallet======result===",result);
					if(result){
						this.util.UiUtils.switchToPage("wallet-index", "import-wallet-wallet",{},"switchTab");
					}else{
						this.util.UiUtils.showToast(this.err_tip_str13)
					}
				})
			},	
		},
	}
</script>

<style lang="scss" scoped>
.recover-index{
	height: 100%;
	width: 100%;
	min-height: 100vh;
	background-color: #FAFBFF;
	/deep/ .uni-navbar--border{
		border: 0;
	}
	.recover-main{
		width: 100%;
		height: 100%;
		padding: 32rpx 36rpx;
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
			
			uni-textarea{
				width: 100%;
				height: 300rpx;
				font-size: 28rpx;
				padding: 36rpx 32rpx;
				box-sizing: border-box;				
			}
			uni-input{
				width: 85%;
				font-size: 26rpx;
				height: 60rpx;
				margin-left: 32rpx;	
			}
		}
		.tips{
			text-align: right;
			font-size: 24rpx;
			color: #3981F3;
		}
		.btn_ok{
			width: 647rpx;
			height: 88rpx;
			font: 32rpx;
			font-weight: 700;
			color: #FFFFFF;
			letter-spacing: 10rpx;
			text-align: center;
			line-height: 88rpx;
			border-radius: 14rpx;
			box-shadow: 0px 3rpx 26rpx 0px rgba(0,0,0,0.06); 
			margin: 60rpx auto 0;
			// position: fixed;
			// bottom: 10rpx;
			// left: 50%;
			// transform: translateX(-50%);
		}
	}
}
</style>
