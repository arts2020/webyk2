<template>
	<view class="mine-index">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" title="我的"></uni-nav-bar>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			
			<view class="wallet-manage" @tap="goManageW">
				<image class="wallet-icon" src="../../static/image/mine/wallet.png" mode=""></image>
			    <text>钱包管理</text>
				<image class="right-arr" src="../../static/image/mine/arrow-left.svg" mode=""></image>
			</view>
			<view class="mine-type">
				<view @tap="btnModelFun(8)" class="type-list">
					<view class="list-title">
						<image class="list-icon" style="width: 30rpx;height: 37rpx;" src="../../static/image/mine/address.png" />
						<text>地址本</text>
					</view>
					<image class="right-icon" src="../../static/image/mine/arrow-left.svg" />
				</view>
				<view @tap="btnModelFun(9)" class="type-list">
					<view class="list-title">
						<image class="list-icon" src="../../static/image/mine/langage.png" />
						<text>语言设置</text>
					</view>
					<view class="list-title">
						<text style="font-size: 22rpx;font-weight: normal;">简体中文</text>
						<image class="right-icon" style="margin-left: 30rpx;" src="../../static/image/mine/arrow-left.svg" />
					</view>
					
				</view>
				<view @tap="btnModelFun(10)" class="type-list">
					<view class="list-title">
						<image class="list-icon" style="width: 31rpx;height: 34rpx;" src="../../static/image/mine/aggrement.png" />
						<text>用户协议</text>
					</view>
					<image class="right-icon" src="../../static/image/mine/arrow-left.svg" />
				</view>

				<view @tap="btnModelFun(3)" class="type-list">
					<view class="list-title">
						<image class="list-icon" style="width: 34rpx;height: 27rpx;" src="../../static/image/mine/help-center.png" />
						<text>帮助中心</text>
					</view>
					<image class="right-icon" src="../../static/image/mine/arrow-left.svg" />
				</view>
				<view @tap="btnModelFun(4)" class="type-list">
					<view class="list-title">
						<image class="list-icon" src="../../static/image/mine/about-us.png" />
						<text>关于我们</text>
					</view>
					<image class="right-icon" src="../../static/image/mine/arrow-left.svg" />
				</view>
				<view @tap="btnModelFun(5)" class="type-list">
					<view class="list-title">
						<image class="list-icon" src="../../static/image/mine/share-us.png" />
						<text>分享我们</text>
					</view>
					<image class="right-icon" src="../../static/image/mine/arrow-left.svg" />
				</view>
				<view @tap="btnModelFun(6)" class="type-list">
					<view class="list-title">
						<image class="list-icon" src="../../static/image/mine/version.png" />
						<text>版本号</text>
						<span style="position: absolute;left:80%;">v{{m_vsn}}</span>
					</view>
					<!-- <image class="right-icon" src="../../static/image/mine/arrow-left.svg" /> -->
				</view>

			</view>
		</scroll-view>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	export default {
		components: {
			uniNavBar
		},
		created() {
			this.onRefresh();
		},
		
		onShow() {
			let _this = this;
			// if (this.dal.Character.isValidLogin() === false) {
			// 	this.util.UiUtils.switchToPage("login-login");
			// 	return;
			// }
			
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight;
				}
			});
			this.onRefresh();
			// this.dal.Wallter.clear();
			// this.dal.LotusWallter.clear();
		},
		data() {
			return {			
				scrollHeight: 0,			
				id: '',
				m_vsn: "0.0.0",
				// 是否有钱包
				ishaveWallet:true
			}
		},
		methods: {
			goManageW(){
				let params = {}
				if(this.ishaveWallet){
					params.name="my-wallet-index"
				}else{
					params.name="wallet-index",
					params.gotype = "switchTab"
				}
				this.$openPage(params)
			},
			onRefresh: function() {
				this.m_vsn = this.PlatformInfo.vsn;
			},
			btnModelFun: function(idx) {
				if (idx == 3) { //帮助中心					
					this.$openPage({
						name: "help-help",
						query: {}
					})
				} else if (idx == 4) { //关于我们					
					this.$openPage({
						name: "about-us",
						query: {}
					})
				} else if (idx == 5) { //分享我					
					// this.util.UiUtils.switchToPage("register-visit", "mine-mine", {this.id});
					this.$openPage({
						name: "my-visit",
						query: {
							id: this.id
						}
					})

				} else if (idx == 6) { //版本号					
					// this.$openPage({name: "computing-power-power",query: {}})
					this.util.UiUtils.checkUpdate(this.m_vsn)
				}else if(idx == 8){
					// 地址本  
					this.$openPage({name: "address-list",query: {type:2}})
				}else if(idx == 9){
					// 语言设置 
					this.$openPage({name: "language-index"})
				}else if(idx == 10){
					// 用户协议 
					this.$openPage({name: "user-agreement",query: {}})
				}
			
			}
		},
	}
</script>

<style lang="scss">
	@import "index.scss";
</style>
