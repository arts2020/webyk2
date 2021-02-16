<template>
	<view class="address-list">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back"  :title="address_title" @clickLeft="goBack">
			<view class="add-txt" slot="right" @tap="goAdd">{{btnstring_add}}</view>
		</uni-nav-bar>
	    <view class="addr-list">
	    	<view class="list-item" v-for="(item,index) in addresssList" :key="index" @click="handleChecked(item)">
	    		<image class="icon" :src="'../../../static/image/chain/'+item.img" mode=""></image>
	    		<view class="addr-info">
	    			<view class="user-N">{{item.username}}</view>
	    			<view class="user_addr">{{item.address}}</view>
					<view class="bak">{{item.bak}}</view>
	    	    </view>
	    	</view>
	    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 列表页点击返回方向,1返回转账界面,2去到地址详情页
				backType:2,
				addresssList:[],
				chaintype:null,
				//连续要传递保留的参数
				paramsObj:{}
			};
		},
		onLoad(option) {
			// if(option.query){
			// 	let params = JSON.parse(option.query);
			// 	if(Object.keys(params).length!=0){
			// 		this.paramsObj = params;
			// 		console.log(params)
			// 		this.backType  = params.backType;
			// 		this.chaintype = params.chaintype;
			// 	}
			// }
			let params = this.dal.Address.getTempParamsByCarry();
			if(Object.keys(params).length!=0){
				this.paramsObj = params;
				console.log(params)
				this.backType  = params.backType;
				this.chaintype = params.m_asset.chaintype;
			}
			this.initword()
		},
		onShow() {
			uni.startPullDownRefresh();
			this.addresssList = [];
			//添加默认图标
			let list = [];
			if(this.chaintype){
				list = this.dal.Address.getAddressByType(this.chaintype);
			}else{
				list = this.dal.Address.getAddressList();
			}
			list.forEach(el=>{
				if(!el.img){
					el.img = 'default.png'
				}
			})
			this.addresssList = list;
			setTimeout(()=>{
				uni.stopPullDownRefresh() 
			}, 1000);
			
		},
		methods:{
			initword(){
				this.address_title = this.getLocalStr("address_title");
				this.btnstring_add = this.getLocalStr("btnstring_add");
			},
			goBack(){
				this.util.UiUtils.switchBackPage();
			},
			goAdd(){
				//保存临时地址  从转账那里过来chaintype有值 设为临时地址类型   从个人中心进来没有值设置默认链为ETH
				let list = this.dal.Chain.getChainList();
				let tempItem = {}
				if(this.chaintype){
					tempItem=list.find(el=>el.chaintype == this.chaintype);
				}else{
					tempItem =list.find(el=>el.chaintype == this.entities.Metadata.ChainType.ETH);
				}
				let item = {
					chaintype:tempItem.chaintype,
					name:tempItem.name,
					username:'',
					address:'',
					bak:'',
					img:tempItem.img
				}
				this.dal.Address.saveTempAddress(item);
				
				this.$openPage({name:"address-detail",gotype:"redirectTo"})
			},
			handleChecked(item){
				//保存临时地址
				this.dal.Address.saveTempAddress(item);
				// 1返回转账界面,2去到地址详情页  如果都不是就默认不动
				if(this.backType==1){
					//更改转账页的参数并保存
					this.paramsObj.address = item.address;
					this.dal.Address.saveTempParamsByCarry(this.paramsObj);
					// 跳到转账页面  转账页有之前页面传过来的参数  
					this.$openPage({name:"carry-over",gotype:"redirectTo"})
				}else if(this.backType==2){
					this.$openPage({name:"address-detail",gotype:"redirectTo"})
				}else{
					return;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.address-list{
	width: 100%;
	height: 100%;
	min-height: 100vh;
	background-color: #FFFFFF;
	.add-txt{
		font-size: 30rpx;
		font-family: PingFang SC, PingFang SC-Bold;
		font-weight: 700;
		color: #4c72ef;
	}
	.addr-list{
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		.list-item{
			width: 100%;
			height: 221rpx;
			display: flex;
			align-items: center;
			border-bottom:1rpx solid #ebebeb;
			.icon{
				width: 67rpx;
				height: 67rpx;
				border-radius: 50%;
				margin-right: 21rpx;
			}
			.addr-info{
				width: calc(100% - 143rpx);
				.user-N{
					font-size: 34rpx;
					font-family: PingFang SC, PingFang SC-Semibold;
					font-weight: 600;
					color: #121212;
					line-height: 48rpx;
				}
				.user_addr{
					word-break: break-all;
					font-size: 30rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 500;
					color: #121212;
					display: -webkit-box;    
					-webkit-box-orient: vertical;    
					-webkit-line-clamp: 2;    
					overflow: hidden; 
					line-height: 42rpx;
				}
				.bak{
					font-size: 26rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					color: #7c7c7c;
					line-height: 42rpx;
				}
			}
		}
	}
}
</style>
