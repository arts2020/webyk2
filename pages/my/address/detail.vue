<template>
	<view class="address-detail">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" :title="address_detail_title" @clickLeft="goBack">
			<view slot="right" :style="{'color':addressObj.address?'#4C72EF':'#8e8e8e'}" @tap="goSave">{{btnstring_save}}</view>
		</uni-nav-bar>
	    <view class="coin" @tap="goChioce">
			<image class="wallet-icon" :src="'../../../static/image/chain/'+addressObj.img" mode=""></image>
			<text>{{addressObj.name}}</text>
			<image class="right-arr" src="../../../static/image/mine/arrow-left.svg" mode=""></image>
		</view>
		<view class="addr_info">
			<view class="title">{{address_detail_str1}}</view>
			<view class="addr_description">
				<view class="addr_item">
					<textarea style="height: 80rpx;" type="text" :placeholder="address_detail_str2" placeholder-class="tipClass" v-model="addressObj.address" />
					<uni-icons type="scan" size="20" color="#444444" style="font-weight: 600;" @tap="goScan"></uni-icons>
				</view>
				<view class="addr_item">
					<input type="text" :placeholder="address_detail_str3" placeholder-class="tipClass" v-model="addressObj.username" />
				</view>
				<view class="addr_item">
					<input type="text" :placeholder="address_detail_str4" placeholder-class="tipClass" v-model="addressObj.bak" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 点击
				addressObj:{},
				//保留的参数对象
				paramsObj:{}
			};
		},
		onLoad(option) {
			this.initword();
			// 获取临时地址信息,如果从添加进来，临时地址信息只有默认链有数据，其他为空； 如果点地址列表进来获取的临时地址信息全都有
			this.addressObj = JSON.parse(JSON.stringify(this.dal.Address.getTempAddress()));
			// 选择的地址类型后将数据传递过来更新此处地址对象中有关链的属性数据
			let params = JSON.parse(option.query);
			//如果去了选择地址类型页而没有选择只是返回，或者添加地址时用了默认的地址类型，
			//则不会有参数传递到此，params对象为空，就不会改变临时地址对象数据
			if(Object.keys(params).length!=0){
				console.log(params)
				
				this.paramsObj = params;
				
				this.addressObj.chaintype = params.chaintype;
				this.addressObj.name = params.name;
				this.addressObj.img= params.img;
			}
		},
		methods:{
			initword(){
				this.btnstring_save = this.getLocalStr("btnstring_save");
				this.address_detail_title = this.getLocalStr("address_detail_title");
				this.address_detail_str1 = this.getLocalStr("address_detail_str1");
				this.address_detail_str2 = this.getLocalStr("address_detail_str2");
				this.address_detail_str3 = this.getLocalStr("address_detail_str3");
				this.address_detail_str4 = this.getLocalStr("address_detail_str4");
			},
			goScan(){
				uni.scanCode({
				    success:(res)=>{
				        this.addressObj.address = res.result;
				    }
				});
			},
			goBack(){
				// this.util.UiUtils.switchBackPage();
				
				this.$openPage({name:"address-list",gotype:"redirectTo"})
			},
			async goSave(){
				if(!this.addressObj.address){
					this.util.UiUtils.showToast("地址不能为空")
					return;
				}
				if(!this.addressObj.username){
					this.util.UiUtils.showToast("名称不能为空")
					return;
				}
				//根据不同链验证是否是有效的地址
				if(this.addressObj.chaintype==1){
					if(!this.dal.Eth.isValidAddress(this.addressObj.address)){
						this.util.UiUtils.showToast("不是有效的"+this.addressObj.name+"地址")
						return;
					}
				}
				
				this.dal.Address.saveAddress(this.addressObj)
				
				this.util.UiUtils.showToast("保存成功")
				
				setTimeout(()=>{
					this.$openPage({name:"address-list",gotype:"redirectTo"})
				},500)
			},
			goChioce(){
				this.$openPage({name:"address-type",query:{chaintype:this.addressObj.chaintype},gotype:"redirectTo"})
			}
		}
	}
</script>

<style lang="scss" scoped>
.address-detail{
	min-height: 100vh;
	height: 100%;
	width: 100%;
	background-color: #FAFBFF;
	/deep/ .uni-navbar--border{
		border: 0;
	}
	.coin{
		margin: 22rpx auto 26rpx;
		padding: 0 17rpx;
		box-sizing: border-box;
		border-radius: 10rpx;
		background-color: #FFFFFF;
		width: calc(100% - 72rpx);
		height: 104rpx;
		display: flex;
		align-items: center;
		.wallet-icon{
			width: 67rpx;
			height: 67rpx;
			margin-right: 22rpx;
		}
		.right-arr{
			width: 13rpx;
			height: 24rpx;
			margin-left: auto;
		}
	}
    .addr_info{
		width: 100%;
		.title{
			font-size: 26rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 500;
			color: #121212;
			margin-bottom: 22rpx;
			padding-left: 56rpx;
			box-sizing: border-box;
		}
		.addr_description{
			margin: 0 auto;
			width: calc(100% - 72rpx);
			height: 324rpx;
			border-radius: 10rpx;
			background-color: #FFFFFF;
			.addr_item{
				width: 100%;
				height: 108rpx;
				border-bottom: 1rpx solid #ebebeb;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 30rpx 0 32rpx;
				box-sizing: border-box;
				uni-input{
					width: 90%;
					font-size: 26rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					color: #121212;
					overflow: hidden;
				}
				.tipClass{
					font-size: 26rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					color: #c2c2c2;
				}
			}
		}
	}
}
</style>
