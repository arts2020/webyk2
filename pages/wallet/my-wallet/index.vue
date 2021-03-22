<template>
	<view class="wallet-index">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" :title="wallet_title_str1" @clickLeft="btnBack"></uni-nav-bar>
	    <view class="main-content" :style="{ height: scrollHeight + 'px' }">
			<scroll-view class="main-left" scroll-y="true" >
				<view class="nav-menu">
					<view class="menu-item" :class="{'activeClass':active==-1}">
						<image src="../../../static/image/index/all.png" mode="" @tap="handleChecked(-1)"></image>
					</view> 
					<view class="menu-item" :class="{'activeClass':active==item.chaintype}" v-for="(item,index) in m_mychains" :key="index" @tap="handleChecked(item.chaintype)">
						<image :src="'../../../static/image/chain/'+item.img" mode=""></image>
					</view>
				</view>
			</scroll-view>
			<scroll-view class="main-right" scroll-y="true" >
				<view class="current-c" v-if="active!=-1">
					<view v-show="currentList.length" class="list-item" v-for="(item,index) in currentList" :key="index" :style="'background: url(../../../static/image/chain/'+item.bgcImg+') no-repeat center;background-size: 100% 100%;'" @tap="goDetail(item)">
						<view class="wallet-name">
							<text>{{item.name}}</text>
							<text>...</text>
						</view>
						<view class="wallet-addr">{{item.showAddress}}</view>
					</view>
					<noData v-show="!currentList.length"></noData>
				</view>
				<view class="main-c" v-if="active==-1">
					<view class="top-title">
						<text>{{wallet_title_str2}}</text>
						<text @tap="goManage">{{btnstring_manage}}</text>
					</view>
					<view class="menu-list">
						<view class="list-item" v-for="(item,index) in identity_wallets" :key="index" :style="'background: url(../../../static/image/chain/'+item.bgcImg+') no-repeat center;background-size: 100% 100%;'" @tap="goDetail(item)">
							<view class="wallet-name">
								<text>{{item.name}}</text>
								<text>...</text>
							</view>
							<view class="wallet-addr">{{item.showAddress}}</view>
						</view>
						<view class="add-coin" @tap="goAddCoin">
							<view class="tip-msg">
								<view class="tip-title">{{wallet_title_str3}}</view>
								<view class="content">{{wallet_title_str4}}</view>
							</view>
							<uni-icons type="plus" size="20" color="#c2c2c2"></uni-icons>
						</view>
					</view>
					<view class="create-import" v-if="single_wallets.length">
						<view class="top-title">{{btnstring_create}}/{{btnstring_import}}</view>
						<view class="list-item" @tap="goDetail(item)" :style="'background: url(../../../static/image/chain/'+item.bgcImg+') no-repeat center;background-size: 100% 100%;'" v-for="(item,index) in single_wallets" :key="index">
							<view class="wallet-name">
								<text>{{item.name}}</text>
								<text>...</text>
							</view>
							<view class="wallet-addr">{{item.showAddress}}</view>
						</view>
					</view>

				</view>
			</scroll-view>
			<view class="btn-ok" @tap="goAddWallet">
				<uni-icons type="plusempty" size="30" color="#7C7C7C"></uni-icons>
				<text>{{wallet_title_str6}}</text>
			</view>
		    <uni-popup type="bottom" ref="selectPop">
				<view class="statusPop">
					<view class="top-menu">
						<view class="top-title">{{wallet_title_str5}}</view>
						<view class="menu" @tap="goCreate">{{btnstring_create}}</view>
						<view class="menu" @tap="goImport">{{btnstring_import}}</view>
					</view>
					<view class="botto-btn" @tap="cancell">{{btnstring_cancle}}</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import noData from '@/components/no-data/no-data.vue';
	export default {
		components:{
			noData
		},
		data() {
			return {
				scrollHeight: 0,
				active:-1,
				identity_wallets:[
					{
						chaintype:1,
						img:"eth.png",
						name:"ETH",
						alias:"Ethereum",
						showAddress:"ajdbiaeuudiiiiiiaaan ldjsn cjhf",
						bgcImg:"ethImg.png"
					},
					{
						chaintype:2,
						img:"btc.png",
						name:"BTC",
						alias:"Bitcoin",
						showAddress:"ajdbiaeuudiiiiiiaaan ldjsn cjhf",
						bgcImg:"btcImg.png"
					},
				],
				single_wallets:[
					{
						chaintype:1,
						img:"../../../static/image/chain/index.png",
						name:"lisa",
						showAddress:"ajdbiaeuudiiiiiiaaan ldjsn cjhf",
						bgcImg:"../../../static/image/mine/import-wallet.png"
					}
				],
				// 选中后钱包列表
				currentList:[],
				//左侧已经有的链
				m_mychains:[]
			}
		},
		onLoad() {
			this.initword();
		},
		onShow() {
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight - 44 - 52;
				}
			});
			this.onRefresh();
		},
		methods: {
			initword(){
				this.btnstring_cancle = this.getLocalStr("btnstring_cancle");
				this.btnstring_create = this.getLocalStr("btnstring_create");
				this.btnstring_import = this.getLocalStr("btnstring_import");
				this.btnstring_manage = this.getLocalStr("btnstring_manage");
				
				this.wallet_title_str1 = this.getLocalStr("wallet_title_str1");
				this.wallet_title_str2 = this.getLocalStr("wallet_title_str2");
				this.wallet_title_str3 = this.getLocalStr("wallet_title_str3");
				this.wallet_title_str4 = this.getLocalStr("wallet_title_str4");
				this.wallet_title_str5 = this.getLocalStr("wallet_title_str5");
				this.wallet_title_str6 = this.getLocalStr("wallet_title_str6");
			},
			cancell(){
				this.$refs.selectPop.close()
			},
			goCreate(){
				this.$refs.selectPop.close()
				this.$openPage({name:"creat-wallet-status"})
			},
			goImport(){
				this.$refs.selectPop.close()
				this.$openPage({
					name: "import-wallet-recover"
				})
			},
			//添加币种
			goAddCoin(){
				if(this.identity_wallets.length){
					//有身份
					this.util.UiUtils.switchToPage("wallet-add-coin", "creat-wallet-status",{backType:3});
				}else{
					// 没有身份时去导入或创建身份
					this.$refs.selectPop.open()
				}
			},
			//去到管理身份界面
            goManage(){
				if(this.identity_wallets.length){
					this.$openPage({name:"status-wallet-index"})
				}else{
					this.$refs.selectPop.open()
				}
			},
			// 去到钱包详情界面，钱包详情界面 身份钱包和普通钱包有区别，进行状态控制
			goDetail(item){
				console.log('=== 当前钱包===',item)
				this.$openPage({name:"my-wallet-detail",query:item})
			},
			// 去添加钱包
			goAddWallet(){
				this.$openPage({name:"wallet-add-wallet"})
			},			
			handleChecked(chaintype){
			    this.currentList = [];		
				this.active = chaintype;
				if(chaintype!=-1){
					// 选中主链中一种,加入活动列表,并从普通钱包列表中筛选该类型的普通钱包加入活动列表
					let list1 = this.single_wallets.filter(el=>el.chaintype==chaintype);
					let list2 = this.identity_wallets.filter(el=>el.chaintype==chaintype);
					console.log(list1,list2)
					this.currentList = [...list2,...list1];
					console.log(this.currentList)
				}
			},
			onRefresh:function(){	
			 this.identity_wallets = [];
			 this.single_wallets=[];
			 this.m_mychains = [];
			 this.currentList = [];
			  let chains = this.dal.Chain.getChainList();
			  
			  // 身份钱包数据
			  let  mineChains = this.dal.MainWallet.getMainWallets();
			  //添加logo图标和背景图
			  mineChains.forEach(el=>{
				  let item = chains.find(e=>e.chaintype==el.chaintype);
				  el.name = el.name?el.name:item.name;
				  el.img=item.img || 'default.png';
				  el.bgcImg = item.img.split('.')[0]+'bg.png';
				  el.showAddress = el.address?el.address.substring(0,7)+'...'+el.address.substring(el.address.length-7):"no address"
			  })
			  this.identity_wallets = mineChains;
			  
			  //普通钱包数据
			  let normalWallets= this.dal.NormalWallet.getNormalWallets();
			    //添加logo图标和背景图
			  normalWallets.forEach(el=>{
				  let item = chains.find(e=>e.chaintype==el.chaintype);
				  el.img=item.img || 'default.png';
				  el.bgcImg = item.img.split('.')[0]+'bg.png';
				  el.showAddress = el.address?el.address.substring(0,7)+'...'+el.address.substring(el.address.length-7):"no address"
			  })
			  this.single_wallets = normalWallets;	
			  
			  //获取当前已经有的链
			  let mychains = this.dal.Chain.getMineChains();
			  mychains.forEach(el=>{
				 if(typeof el != 'object'){
					 let item = chains.find(e=>e.chaintype==el);
					let temp = {
						chaintype:el,
						img:item.img ||'default.png'
					}
					this.m_mychains.push(temp)
				 }
			  })
			  console.log('=====钱包列表=====',this.identity_wallets,this.single_wallets,this.dal.Chain.getMineChains())
			},
			btnBack: function() {
				this.util.UiUtils.switchToPage("mine-mine", "create-wallter", {});
			},			
		},
		
	}
</script>

<style lang="scss" scoped>
	.wallet-index{
		width: 100%;
		height: 100%;
		min-height: 100vh;
		background-color: #FFFFFF;
		/deep/ .uni-navbar--border{
			border: 0;
		}
		.main-content{
			width: 100%;
			display: flex;
			justify-content: space-between;
			.main-left{
				width: 122rpx;
				height: 100%;
				.nav-menu{
					width: 100%;
					height: 100%;
					padding-top: 20rpx;
					.menu-item{
						width: 100%;
						height: 71rpx;	
						margin-bottom: 39rpx;
						position: relative;
						text-align: center;
						&.activeClass::after{
						  content: '';
						  display: block;
						  width: 4rpx;
						  height: 40rpx;
						  background-color: #3981F3;
						  position: absolute;
						  top: 50%;
						  right: 0;
						  transform: translateY(-50%);
					    }
						image{
							width: 71rpx;
							height: 71rpx;
							border-radius: 50%;
						}
					}
				}
			}
			.main-right{
				width: 605rpx;
				height: 100%;
				padding: 36rpx 36rpx 0 0;
				
				box-sizing: border-box;
				.top-title{
					margin-bottom: 22rpx;
					font-size: 30rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 500;
					color: #121212;
					display: flex;
					align-items: center;
					justify-content: space-between;
					text:last-child{
						font-size: 26rpx;
						font-weight: 400;
						color: #4c72ef;
					}
				}
			    .list-item{
			    	width: 100%;
			    	height: 122rpx;
			    	margin-bottom: 27rpx;
			        border-radius: 20rpx;
			    	padding: 17rpx 27rpx 0 32rpx;
			    	box-sizing: border-box;
			    	color: #FFFFFF;
			    	.wallet-name{
			    		display: flex;
			    		align-items: center;
			    		justify-content: space-between;
			    		font-size: 36rpx;
			    		font-family: PingFang SC, PingFang SC-Semibold;
			    		font-weight: 600;
			    		line-height: 50rpx;
			    		text:last-child{
			    			letter-spacing: 10rpx;
			    		}
			    	}
			    	.wallet-addr{
						width: 80%;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
			    		font-size: 30rpx;
			    		font-family: PingFang SC, PingFang SC-Regular;
			    		font-weight: 400;
			    		line-height: 37rpx;
			    	}
			    }
			    
				.add-coin{
					width: 100%;
					height: 122rpx;
					margin-bottom: 27rpx;
					background: url(../../../static/image/chain/addCoin.png) no-repeat center;
					background-size: 100% 100%;
					border-radius: 20rpx;
					padding: 17rpx 27rpx 0 32rpx;
					box-sizing: border-box;
					
					display: flex;
					align-items: center;
					justify-content: space-between;
					.tip-msg{
						width: calc(100% - 80rpx);
						font-family: PingFang SC, PingFang SC-Semibold;
						color: #7c7c7c;
						.tip-title{
							font-size: 36rpx;
							font-weight: 400;
							line-height: 50rpx;
						}
						.content{
							font-size: 30rpx;
							font-weight: 400;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							line-height: 42rpx;
							color: #c2c2c2;
						}
					}
				}

			}
		    .btn-ok{
		    	width: 100%;
		    	height: 104rpx;
				line-height: 104rpx;
				text-align: center;
		    	background: #ffffff;
		    	box-shadow: 0px -3rpx 16rpx 0px rgba(0,0,0,0.06);
				font-size: 30rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
				color: #7c7c7c;
				position: fixed;
				bottom: 0;
				
		    }
		    .statusPop{
				width: 100%;
				.top-title{
					font-size: 30rpx;
					color: #121212;
					line-height: 80rpx;
					text-align: center;
				}
				.top-menu{
					width: 100%;
					border-radius: 10rpx 10rpx 0 0;
					background-color: #FFFFFF;
					margin-bottom: 30rpx;
					.menu{
						width: 100%;
						height: 110rpx;
						line-height: 110rpx;
						text-align: center;
						color: #0000FF;
						font-size: 28rpx;
						&:nth-child(2){
							border-bottom: 1rpx solid #F2F2F2;
						}
					}
				}
				.botto-btn{
					width: 100%;
					height: 110rpx;
					line-height: 110rpx;
					text-align: center;
					color: #808080;
					font-size: 28rpx;
					background-color: #FFFFFF;
					border-radius: 10rpx 10rpx 0 0;
				}
			}
		}
	
	}
</style>
