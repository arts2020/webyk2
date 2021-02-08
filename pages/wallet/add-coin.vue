<template>
	<view class="add-coin">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" title="添加币种" @clickLeft="goBack"></uni-nav-bar>
		<scroll-view scroll-y="true" class="coin-list" :style="'height:'+scrollHeight+'px'">
			<!-- 之前该身份下已经存在的币种不可再选页不可取消  该处value应为字符串要不会有警告-->
			
			<view class="list-item" v-for="(item,index) in coinList" :key="index" @tap="handleChecked(item)">
				<image class="icon" :src="'../../static/image/chain/'+item.img" mode=""></image>
				<view class="coin-name">
					<view class="short-N">{{item.name}}</view>
					<view class="full_N">{{item.alias}}</view>
				</view>
				<label class="checked-icon">
					<image src="../../static/image/mine/checked.png" v-if="ischecked(item.chaintype)" mode=""></image>
				</label>
			</view>
		</scroll-view>
		<view class="confirm_btn">
			<view class="tips">请添加身份钱包下的币种(多选)</view>
			<view class="btn" style="background-color:#4c72ef" @tap="btnConfirmAdd">确定</view>
		</view>
	    <uni-popup type="center" ref="pasdPop" class="pasdTip">
	    	<view class="main-content">
	    		<view class="title">请输入密码</view>
	    		<view class="input-box">
	    			<input type="text" password placeholder="密码" v-model="password" />
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
		name: "add-coin",
		created() {
			this.onRefresh();
		},
		data() {
			return {
				// 可以从不同的地方进入到添加币种的界面,其点击确定按钮后跳转的页面不同
				// 1回到首页(导入身份时添加完币种回到首页)   3钱包管理页  4.身份管理页
				backType:3,
				scrollHeight: 0,
				//app所支持的所有币种的信息
				coinList: [],
				// 当前操纵选中的链列表
				checkedTypes: [],
				
				password:"",
			};
		},
		onLoad(option) {
			if(option.query){
				let params  = JSON.parse(option.query);
				console.log("=params====",params)
				this.backType = params.param.backType;
			}
		},
		onShow() {
			//获取高度
			uni.getSystemInfo({
				success: (res) => {
					this.scrollHeight = res.windowHeight - res.statusBarHeight - 44 - 80;
				}
			});
		},
		computed:{
			btn_color(){
				if(this.checkedTypes.length!=0){
					return '#4c72ef'
				}else{
					return '#C8C7CC'
				}
			}
		},
		methods: {
			onRefresh:function(){
				this.checkedTypes = [];
				this.coinList = this.dal.Chain.getChainList();
				this.myChains = this.dal.Chain.getMineChains();
				for(let i = 0; i < this.myChains.length ;i++){
					let chaintype = this.myChains[i];
					let item = this.coinList.find(el=>el.chaintype == chaintype);
					item.isdefault = true;
					this.checkedTypes.push(item)
				}
			},
			
			ischecked(type) {
				if(this.checkedTypes.some(el => el.chaintype == type)){
					return true;
				}
				return false;
			},
			
			goBack: function() {
				this.util.UiUtils.switchBackPage();
			},
			
			handleChecked(item) {
				if(this.checkedTypes.some(el => el.chaintype == item.chaintype && el.isdefault == true)){
					return true;
				}
				// 如果是当前操作
				let index = this.checkedTypes.findIndex(el=>el.chaintype==item.chaintype);
				if(index!=-1){
					//已选中的再次点击取消
					this.checkedTypes.splice(index,1)
				}else{
					this.checkedTypes.push(item);
				}
				item.isdefault = false;
				this.ischecked(item.chaintype);
			},
			confirmOk(){
				// 在需要输入密码的情况下去验证密码
				if(this.backType==3||this.backType==4){
					//检查密码是否为空
					if(!this.password){
						this.util.UiUtils.showToast('密码不能为空')
						return;
					}
					//检查输入密码是否正确，正确则-关闭弹框---跳转，否则给与密码不对提示

				    this.$refs.pasdPop.close();	
				}
				
				if(this.checkedTypes.length==0){
					this.util.UiUtils.showToast('请至少选择一个币种')
					return;
				}
				
				//给与成功提示
				// 1s后跳转
				let params={}
				
				if(this.backType==1){
					params={
						name:"wallet-index",
						gotype:"switchTab"
					}
				}else if(this.backType==2){
					params={
						name:"backup-tip",
					}
				}else if(this.backType==3){
					params={
						name:"my-wallet-index",
						gotype:"redirectTo"
					}
				}else if(this.backType==4){
					params={
						name:"status-wallet-index",
						gotype:"redirectTo"
					}
				}
	
				// 执行完添加链的操作后跳转	
				for(let i = 0; i < this.checkedTypes.length ;i++){
					let ctype = this.checkedTypes[i];
					this.dal.Chain.addMineChainInfo(ctype);
				}
				
				setTimeout(()=>{					
					this.$openPage(params);
				},1000)
			},
			btnConfirmAdd(){	
				// 在需要输入密码的情况下打开密码提示框
				if(this.backType==3||this.backType==4){
					this.$refs.pasdPop.open();
				}else{
					this.confirmOk()
				}	
			},
			cancell(){
				this.password ="";
				this.$refs.pasdPop.close()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.add-coin {
		width: 100%;
		height: 100%;
		min-height: 100vh;
		background-color: #FFFFFF;
        /deep/ uni-checkbox .uni-checkbox-input{
			border: 0;
			background-color: 0;
		}
		/deep/ .uni-navbar--border{
			border: 0;
		}
		.coin-list {
			width: 100%;
			.list-item {
				width: 100%;
				height: 120rpx;
				display: flex;
				align-items: center;
                border-bottom: 1rpx solid #E7E6ED;
				padding: 0 30rpx 0 34rpx;
				box-sizing: border-box;
				.icon {
					width: 54rpx;
					height: 54rpx;
					margin-right: 22rpx;
				}
                .coin-name {
                	font-family: PingFang SC, PingFang SC-Semibold;					
                	.short-N {
                		font-size: 36rpx;
                		color: #071328;
                		font-weight: 600;
						line-height: 40rpx;
                	}
                	.full-N {
                		font-size: 24rpx;
                		color: #7C7C7C;
						line-height: 30rpx;
                	}
                }
				.checked-icon{
					margin-left: auto;
					image{
						width: 28rpx;
						height: 24rpx;
					}
				}
			}
		}

		.confirm_btn {
			width: 100%;
			height:160rpx;
			background-color: #FFFFFF;
			position: fixed;
			bottom: 47rpx;
			left: 0;
			padding: 30rpx;
			padding-bottom: 0;
			box-sizing: border-box;

			.tips {
				font-size: 24rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
				text-align: left;
				color: #7c7c7c;margin-bottom: 22rpx;
			}

			.btn {
				text-align: center;
				width: 100%;
				height: 88rpx;
				line-height: 88rpx;
				font-size: 32rpx;
				font-family: PingFang SC, PingFang SC-Bold;
				font-weight: 700;
				color: #FFFFFF;
				border-radius: 14rpx;
				box-shadow: 0px 3rpx 26rpx 0px rgba(0,0,0,0.06); 
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
	}
</style>
