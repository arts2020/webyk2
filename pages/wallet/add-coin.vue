<template>
	<view class="add-coin">
		<uni-nav-bar :statusBar="true" :fixed="true" left-icon="back" title="添加币种" @clickLeft="goBack"></uni-nav-bar>
		<scroll-view scroll-y="true" class="coin-list" :style="'height:'+scrollHeight+'px'">
			<checkbox-group @change="handleChecked">
				<view class="list-item" v-for="(item,index) in coinList" :key="index">
					<image class="icon" :src="item.logo" mode=""></image>
					<view class="coin-info">
						<view class="coin-name">
							<view class="short-N">{{item.name}}</view>
							<view class="full_N">{{item.alias}}</view>
						</view>
						<label>
							<!-- 之前该身份下已经存在的币种不可再选页不可取消  该处value应为字符串要不会有警告-->
							<checkbox :value="item.chaintype+''" :disabled="ischecked(item.chaintype)" :checked="ischecked(item.chaintype)" /><text></text>
						</label>
					</view>
				</view>

			</checkbox-group>
		</scroll-view>
		<view class="confirm_btn">
			<view class="tips">请添加身份钱包下的币种(多选)</view>
			<view class="btn" :style="'background-color:'+btn_color" @tap="btnConfirmAdd">确定</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "add-coin",
		data() {
			return {
				// 可以从不同的地方进入到添加币种的界面,其点击确定按钮后跳转的页面不同
				// 1回到首页(导入身份时添加完币种回到首页)  2备份助记词提示页(创建身份时) 3钱包管理页  4.身份管理页
				backType:3,
				scrollHeight: 0,
				//app所支持的所有币种的信息
				coinList: [{
						chaintype: 1,
						logo: "../../static/image/index/eth.png",
						name: "ETH",
						alias: "Ethereum"
					},
					{
						chaintype: 2,
						logo: "../../static/image/index/btc.png",
						name: "BTC",
						alias: "Btcoin"
					},
					{
						chaintype: 3,
						logo: "../../static/image/index/fil.png",
						name: "ATOM",
						alias: "Cosmos"
					},
				],
				//该身份下已有的币种列表
				hasCoinList: [{
					chaintype: 1,
					logo: "../../static/image/index/eth.png",
					name: "ETH",
					alias: "Ethereum"
				}, ],
				// 选中的币种列表
				checkedTypes: []
			};
		},
		onLoad(option) {
			if(option.query){
				let params  = JSON.parse(option.query);
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
					return '#0000FF'
				}else{
					return '#C8C7CC'
				}
			}
		},
		methods: {
			ischecked(type) {
				return this.hasCoinList.some(el => el.chaintype == type)
			},
			goBack: function() {
				this.util.UiUtils.switchBackPage();
			},
			handleChecked(e) {
				this.checkedTypes = e.detail.value;
			},
			btnConfirmAdd(){				
				//未选择时点击无反应
				if(this.checkedTypes.length==0){return;}
				
				//执行添加币种的操作   this.checkedTypes数组中存储了选中的币的链类型
				let list = [];   //要添加的币种对象数组
				this.coinList.forEach(el=>{
					if(this.checkedTypes.includes(el.chaintype+'')){
						list.push(el)
					}
				})
				
				
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
						gotype:"redirectTo"
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
				setTimeout(()=>{
					this.$openPage(params);
				},1000)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.add-coin {
		width: 100%;
		height: 100%;
		min-height: 100vh;
		background-color: #fcfcfc;

		.coin-list {
			width: 100%;
			padding: 0 30rpx;
			box-sizing: border-box;

			.list-item {
				width: 100%;
				height: 150rpx;
				display: flex;
				align-items: center;

				.icon {
					width: 80rpx;
					height: 80rpx;
					margin-right: 30rpx;
					border-radius: 50%;
				}

				.coin-info {
					width: calc(100% - 110rpx);
					border-bottom: 2rpx solid #F2F2F2;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.coin-name {
						.short-N {
							font-size: 28rpx;
							color: #444444;
							font-weight: bold;
						}

						.full-N {
							font-size: 24rpx;
							color: #8e8e8e;
						}
					}

					.checked-icon {
						width: 40rpx;
						height: 40rpx;
						border-radius: 50%;
						margin-left: auto;
					}
				}
			}
		}

		.confirm_btn {
			width: 100%;
			height:160rpx;
			background-color: #FFFFFF;
			position: fixed;
			bottom: 0;
			left: 0;
			padding: 30rpx;
			padding-bottom: 0;
			box-sizing: border-box;

			.tips {
				font-size: 24rpx;
				color: #8e8e8e;
				margin-bottom: 10rpx;
			}

			.btn {
				width: 100%;
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				font-size: 28rpx;
				color: #FFFFFF;
				background-color: #007AFF;
				border-radius: 20rpx;
			}
		}
	}
</style>
