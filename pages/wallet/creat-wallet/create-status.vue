<template>
	<view class="create-status">
		<uni-nav-bar :status="true" :fixed="true" left-icon="back" title="创建身份" @clickLeft="goBack"></uni-nav-bar>
	    
		<view class="create-main" v-if="isNext" :style="'height:'+scrollHeight+'px'">
				<view class="top-title">创建身份，你将会有身份下的多链钱包，比如ETH、BTC。。。</view>
				<view class="input-box">
					<input type="text" placeholder="身份名" v-model="statusName"/>
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
			    <view class="btn_ok" :style="'background-color:'+btnCreate_color" @tap="btnCreate">创建</view>
		</view>
		
		<view class="aggrement"  v-else :style="'height:'+scrollHeight+'px'">
			<scroll-view scroll-y="true" class="aggr-c" >
				<rich-text :nodes="content"></rich-text>
			</scroll-view>
			<view class="btn-box">
				<radio-group @change="handleCheck">
					<label>
						<radio value="aggr" /><text>我已阅读并同意服务条款</text>
					</label>
				</radio-group>
				<view class="btn_ok" :style="'background-color:'+btn_color" @tap="goNext">确认</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		name:"create-status",
		onShow() {
			this.dal.Setting.onGetUserAgree();
		},
		created() {
			this.util.EventUtils.addEventListenerCustom(this.dal.Setting.evtGetAgreement, this.handleAgreement);
		    this.util.EventUtils.addEventListenerCustom(this.dal.Wallter.evtCreateStatus, this.createStatus);
		},
		destroyed() {
			this.util.EventUtils.addEventListenerCustom(this.dal.Setting.evtGetAgreement, this.handleAgreement);
		    this.util.EventUtils.addEventListenerCustom(this.dal.Wallter.evtCreateStatus, this.createStatus);
		},
		data() {
			return {
				scrollHeight:0,
				content:"",
				// 是否下一步
				isNext:false,
				// 是否同意协议
				isAgree:false,
				statusName:"",
				password:"",
				confirmPasd:"",
				pasdTip:"",
				tip_1:"",
				tip_2:"",
			};
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
				if(this.isAgree){
					return '#0000FF'
				}else{
					return '#C8C7CC'
				}
			},
			btnCreate_color(){
				if(this.statusName&&this.password){
					return '#0000FF'
				}else{
					return '#C8C7CC'
				}
			}
		},
		methods:{
			handleCheck(evt){
				if(evt.target.value){
					this.isAgree=true;
				}
			},
			goNext(){
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
			btnCreate:function(){
				this.util.UiUtils.showLoading("身份初始化...");
				this.dal.Wallter.onCreateStatus({
					statusName:this.statusName,
					password:this.password,
					pasdTip:this.pasdTip,
				})
			},	
			createStatus(data){
				uni.showToast({
					title:data.msg
				})
				setTimeout(()=>{
					this.util.UiUtils.switchToPage("backup-tip", "creat-wallet-status",{},"redirectTo");
				},1000)
			}
		}
	}
</script>

<style lang="scss" scoped>
.create-status{
	width: 100%;
	height: 100%;
	min-height: 100vh;
	background-color: #F2F2F2;
	.aggrement{
		width: 100%;
		padding: 0rpx 20rpx;
		box-sizing: border-box;
		.aggr-c{
			width: 100%;
			height: calc(100% - 150rpx);
		}
		.btn-box{
			width: calc(100% - 40rpx);
			height: 150rpx;
			position: fixed;
			bottom: 10rpx;
			left: 20rpx;
			.btn_ok{
				width: 100%;
				height: 80rpx;
				border-radius: 20rpx;
				background-color: #0000FF;
				font: 28rpx bold;
				color: #FFFFFF;
				text-align: center;
				line-height: 100rpx;
				margin-top: 20rpx;
			}
		}
	}
	.create-main{
		width: 100%;
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
