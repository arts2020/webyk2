<template>
	<view class="create-status">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" :title="import_wallet_str3" @clickLeft="goBack"></uni-nav-bar>

		<view class="create-main" v-if="isNext">
			<view>
				<view class="top-title">{{title_str12}}</view>
				<view class="input-box" style="height: 250rpx;">
					<textarea placeholder-style="font-size: 26rpx;color: #C2C2C2;" :placeholder="placeholder_str5" v-model="words" />
					</view>
				</view>
				<view>
					<view class="top-title">{{setting_pasd}}</view>
					<view class="input-box">
						<input @input="inputPasd" type="text" placeholder-style="font-size: 26rpx;color: #C2C2C2;" password :placeholder="placeholder_str2" v-model="password"/>
					<uni-icons type="closeempty" size="20" v-if="password" @tap="clear('2')"></uni-icons>
					</view>
					<view class="tips">{{tip_1}}</view>
				</view>
				<view>
					<view class="top-title">{{confirm_pasd}}</view>
					<view class="input-box">
						<input @blur="reconfirm" password type="text" placeholder-style="font-size: 26rpx;color: #C2C2C2;" :placeholder="placeholder_str3" v-model="confirmPasd"/>
					<uni-icons type="closeempty" size="20" v-if="confirmPasd" @tap="clear('3')"></uni-icons>
					</view>
					<view class="tips">{{tip_2}}</view>
				</view>
				<view>
					<view class="top-title">{{setting_pasd_tip}}</view>
					<view class="input-box">
						<input type="text" :placeholder="placeholder_str4" placeholder-style="font-size: 26rpx;color: #C2C2C2;" v-model="pasdTip"/>
					<uni-icons type="closeempty" size="20" v-if="pasdTip" @tap="clear('4')"></uni-icons>
					</view>
				</view>
			    <view class="btn_ok" :style="'background-color:'+btnCreate_color" @tap="btnCreate">{{import_wallet_str3}}</view>
		</view>
		
		<view class="aggrement"  v-else>
			<scroll-view scroll-y="true" class="aggr-c" >
				<rich-text :nodes="aggrement"></rich-text>
			</scroll-view>
			<view class="btn-box">
				<radio-group @change="handleCheck">
					<label>
						<radio value="aggr" /><text>{{title_str11}}</text>
					</label>
				</radio-group>
				<view class="btn_ok" :style="'background-color:'+btn_color" @tap="goNext">{{btnstring_confirm}}</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import agreeAndHelp from '@/static/js/agreeAndHelp.js'
	import uniIcon from '@/components/uni-icons/uni-icons.vue'
	export default {
		name:"create-status",
		components: {
		    uniIcon
		},
		data() {
			return {
				scrollHeight:0,
				content:"",
				// 是否下一步
				isNext:false,
				// 是否同意协议
				isAgree:false,
				words:"",
				password:"",
				confirmPasd:"",
				pasdTip:"",
				tip_1:"",
				tip_2:"",
				aggrement:""
			};
		},
		onLoad() {
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
			//获取协议
			this.aggrement = agreeAndHelp.my_aggrement;
		},
		computed:{
			btn_color(){
				if(this.isAgree){
					return '#4C72EF'
				}else{
					return '#C8C7CC'
				}
			},
			btnCreate_color(){
				if(this.words&&this.password){
					return '#4C72EF'
				}else{
					return '#C8C7CC'
				}
			}
		},
		methods:{
			initword(){
				this.title_str12 = this.getLocalStr("title_str12")
				this.title_str11 = this.getLocalStr("title_str11")
				this.placeholder_str5 = this.getLocalStr("placeholder_str5")
				
				this.btnstring_confirm = this.getLocalStr("btnstring_confirm");
				this.status_name = this.getLocalStr('status_name');
				this.import_wallet_str3 = this.getLocalStr("import_wallet_str3")
				
				this.setting_pasd = this.getLocalStr('setting_pasd');
				this.placeholder_str2 = this.getLocalStr('placeholder_str2');
				this.confirm_pasd = this.getLocalStr('confirm_pasd');
				this.placeholder_str3 = this.getLocalStr('placeholder_str3');
				this.setting_pasd_tip = this.getLocalStr('setting_pasd_tip');
				this.placeholder_str4 = this.getLocalStr('placeholder_str4');
				
				this.err_tip_str6 = this.getLocalStr('err_tip_str6');
				this.err_tip_str7 = this.getLocalStr('err_tip_str7');
				this.err_tip_str14 = this.getLocalStr('err_tip_str14');
				this.err_tip_str9 = this.getLocalStr('err_tip_str9');
				this.err_tip_str10 = this.getLocalStr('err_tip_str10');
				this.err_tip_str11 = this.getLocalStr('err_tip_str11');
				this.err_tip_str15 = this.getLocalStr('err_tip_str15');
				this.placeholder_str5 = this.getLocalStr('placeholder_str5');
			},
			clear(str){
				if(str=='1'){
					this.words = ""
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
			handleCheck(evt){
				if(evt.target.value){
					this.isAgree=true;
				}
			},
			goNext(){
				if(!this.isAgree){return;}
				this.isNext=true;
			},
			goBack(){
				this.util.UiUtils.switchBackPage();
			},
			handleAgreement(data){
				this.content = data.data;
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
			btnCreate:function(){
				if(!(this.words&&this.password)){return;}
				
				if(!this.words){
					this.util.UiUtils.showToast(this.placeholder_str5)
					return; 
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
				
				if (this.words.length < 12) {
					this.util.UiUtils.showToast(this.err_tip_str14)
					return;
				}
				
				this.util.UiUtils.showLoading(this.err_tip_str11);
				
				let params = {
					name: "identity_name",
					password: this.password,
					tips: this.pasdTip,
					words:this.words,
					importtype:this.entities.Metadata.ImportType.WordType
				}
				
				this.dal.WalletManage.createMainWallet(params).then(result => {
				    console.log("========createMainWallet======result===",result);
					if(result){
						this.util.UiUtils.switchToPage("wallet-add-coin", "creat-wallet-status",{backType:1});
					}else{
						this.util.UiUtils.hideLoading();
						this.util.UiUtils.showToast(this.err_tip_str15)
					}
				})
			},	
		}
	}
</script>

<style lang="scss" scoped>
.create-status{
	width: 100%;
	height: 100%;
	min-height: 100vh;
	/deep/ .uni-navbar--border{
		border: 0;
	}
	.aggrement{
		width: 100%;
		padding: 22rpx 30rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		.aggr-c{
			width: 100%;
			height: calc(100% - 150rpx);
			font-size: 30rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 500;
			text-align: left;
			color: #333333;
			.aggr-title{
				font-size: 36rpx;
				font-family: PingFang SC, PingFang SC-Bold;
				font-weight: 700;
				text-align: center;
				color: #111111;
				margin-bottom: 25rpx;
			}
		}
		.btn-box{
			width: 100%;
			height: 239rpx;
			padding: 31rpx 51rpx 47rpx;
			box-sizing: border-box;
			background: #ffffff;
			box-shadow: 0px -3rpx 40rpx 0px rgba(0,0,0,0.08);
			position: fixed;
			bottom: 0rpx;
			left: 0rpx;
			label{
				font-size: 30rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
				color: #4c72ef;
			}
			.btn_ok{
				width: 100%;
				height: 88rpx;
				background: #4c72ef;
				border-radius: 14rpx;
				box-shadow: 0px 3rpx 26rpx 0px rgba(0,0,0,0.06); 
				font-size: 32rpx;
				font-family: PingFang SC, PingFang SC-Bold;
				font-weight: 700;
				text-align: center;
				color: #ffffff;
				text-align: center;
				line-height: 88rpx;
				margin-top: 31rpx;
			}
		}
	}
	.create-main{
		width: 100%;
		height: 100%;
		padding: 32rpx 36rpx;
		box-sizing: border-box;
		background-color: #FAFBFF;
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
			uni-textarea{
				font-size: 26rpx;
				width: 100%;
				height: 300rpx;
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
			font-size: 26rpx;
			color: #3981F3;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
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
