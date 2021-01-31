<template>
	<view class="mine-index">
		<uni-nav-bar :statusBar="true" :fixed="true" v-if="!isLogin" right-text="登录" title="未登录" @clickLeft="goBack" @clickRight="goLogin"></uni-nav-bar>
		<uni-nav-bar :statusBar="true" :fixed="true" v-else title="我的"></uni-nav-bar>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<!-- <view class="mine-header">
				<image class="user-img" :src="m_head" />
				<view class="user-info">
					<view @tap="btnIdentity()" class="info-title">
						<text>{{m_username}}</text>
					</view>
					<view class="tel">{{m_phonenumber}}</view>
				</view>
			</view> -->
			<!-- <view class="user-list">
				<view class="list" @tap="btnMyFun(1)">
					<image src="../../static/image/index/suanli.png" />
					<view class="list-label">算力</view>
				</view>
				<view class="list" @tap="btnMyFun(2)">
					<image src="../../static/image/index/wodeshouyi.png" />
					<view class="list-label">收益</view>
				</view>
				<view class="list" @tap="btnMyFun(3)">
					<image src="../../static/image/index/wodeqianbao.png" />
					<view class="list-label">钱包</view>
				</view>
				<view class="list" @tap="btnMyFun(5)">
					<image src="../../static/image/index/gonggao.png" />
					<view class="list-label">订单</view>
				</view>
			</view> -->
			<view class="wallet-manage" @tap="goManageW">
				<image class="wallet-icon" src="../../static/image/index/gonggao.png" mode=""></image>
			    <text>钱包管理</text>
				<image class="right-arr" src="../../static/image/mine/arrow-left.svg" mode=""></image>
			</view>
			<view class="mine-type">
				<view @tap="btnModelFun(8)" class="type-list">
					<view class="list-title">
						<image class="list-icon" src="../../static/image/mine/anquanzhongxin.svg" />
						<text>地址本</text>
					</view>
					<image class="right-icon" src="../../static/image/mine/arrow-left.svg" />
				</view>
				<view @tap="btnModelFun(9)" class="type-list">
					<view class="list-title">
						<image class="list-icon" src="../../static/image/mine/anquanzhongxin.svg" />
						<text>语言设置</text>
					</view>
					<view class="list-title">
						<text style="font-size: 22rpx;font-weight: normal;">简体中文</text>
						<image class="right-icon" style="margin-left: 30rpx;" src="../../static/image/mine/arrow-left.svg" />
					</view>
					
				</view>
				<view @tap="btnModelFun(10)" class="type-list">
					<view class="list-title">
						<image class="list-icon" src="../../static/image/mine/anquanzhongxin.svg" />
						<text>用户协议</text>
					</view>
					<image class="right-icon" src="../../static/image/mine/arrow-left.svg" />
				</view>
				<view @tap="btnModelFun(1)" class="type-list">
					<view class="list-title">
						<image class="list-icon" src="../../static/image/mine/shenfenyanzheng.svg" />
						<text>身份验证</text>
					</view>
					<image class="right-icon" src="../../static/image/mine/arrow-left.svg" />
				</view>
				<view @tap="btnModelFun(2)" class="type-list">
					<view class="list-title">
						<image class="list-icon" src="../../static/image/mine/anquanzhongxin.svg" />
						<text>安全中心</text>
					</view>
					<image class="right-icon" src="../../static/image/mine/arrow-left.svg" />
				</view>
				<view @tap="btnModelFun(3)" class="type-list">
					<view class="list-title">
						<image class="list-icon" src="../../static/image/mine/bangzhuzhongxin.svg" />
						<text>帮助中心</text>
					</view>
					<image class="right-icon" src="../../static/image/mine/arrow-left.svg" />
				</view>
				<view @tap="btnModelFun(4)" class="type-list">
					<view class="list-title">
						<image class="list-icon" src="../../static/image/mine/guanyuwomen.svg" />
						<text>关于我们</text>
					</view>
					<image class="right-icon" src="../../static/image/mine/arrow-left.svg" />
				</view>
				<view @tap="btnModelFun(5)" class="type-list">
					<view class="list-title">
						<image class="list-icon" src="../../static/image/mine/fenxiangwomen.svg" />
						<text>分享我们</text>
					</view>
					<image class="right-icon" src="../../static/image/mine/arrow-left.svg" />
				</view>
				<view @tap="btnModelFun(6)" class="type-list">
					<view class="list-title">
						<image class="list-icon" src="../../static/image/mine/banbenhao.svg" />
						<text>版本号</text>
						<span style="position: absolute;left:80%;">v{{m_vsn}}</span>
					</view>
					<!-- <image class="right-icon" src="../../static/image/mine/arrow-left.svg" /> -->
				</view>
				<view @tap="btnModelFun(7)" class="type-list">
					<view class="list-title">
						<image class="list-icon" src="../../static/image/mine/tuichudenglu.svg" />
						<text>退出登录</text>
					</view>
					<image class="right-icon" src="../../static/image/mine/arrow-left.svg" />
				</view>
			</view>
		</scroll-view>
		<e-modal :visible.sync="visible" @cancel="handleCancel">
			<view style="width: 100%;height: 280px;display: flex;justify-content: center;flex-direction: column;align-items: center;">
				<view style="font-weight: 800;font-size: 20px;margin-bottom: 20px;">资金密码</view>
				<view style="width: 90%;margin-bottom: 15px;">
					警告：若无妥善备份，删除钱包后将无法找回钱包，请慎重处理该操作
				</view>
				<QSInput :maxlength="12" inputwidth="93%" name="password" placeholder="请输入资金密码" :filterFc="passWordFilterInput"
				 variableName="password" password title="" v-model="password" focusBorderColor="#cddce6" blurBorderColor="#cddce6"></QSInput>
				<view style="margin-bottom: 15px;margin-top: 10px;display: flex;flex-direction: row;width: 80%;">
					<button class="button-style" @tap="btnCancel">取消</button>
					<button class="button-style" @tap="btnConfirm">退出</button>
				</view>
			</view>

		</e-modal>
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
			this.util.EventUtils.addEventListenerCustom(this.dal.Account.evtLogOut, this.onLogOut);
			this.util.EventUtils.addEventListenerCustom(this.dal.Character.evtCharacterUpdate, this.onRefresh);
			this.util.EventUtils.addEventListenerCustom(this.dal.Setting.evtCheckCapitalPassword, this.onCheckCapitalPassword);
		},

		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Account.evtLogOut, this.onLogOut);
			this.util.EventUtils.removeEventCustom(this.dal.Character.evtCharacterUpdate, this.onRefresh);
			this.util.EventUtils.removeEventCustom(this.dal.Setting.evtCheckCapitalPassword, this.onCheckCapitalPassword);
		},

		onShow() {
			let _this = this;
			// if (this.dal.Character.isValidLogin() === false) {
			// 	this.util.UiUtils.switchToPage("login-login");
			// 	return;
			// }
			this.isLogin = this.dal.Character.isValidLogin();
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
				m_head: '../../static/image/head/0.png',
				m_username: "",
				m_phonenumber: "",
				scrollHeight: 0,
				password: "",
				visible: false,
				// isWallet: false,
				m_islogout: false,
				id: '',
				m_vsn: "0.0.0",
				passWordFilterInput(value) {
					return value;
				},
				isLogin:false,
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
			goLogin(){
				this.dal.Net.clear();
				this.$openPage({
					name: "login-login",
					query: {},
					gotype: "reLaunch"
				})
			},
			handleCancel() {
				console.log('cancel')
			},
			btnCancel: function() {
				this.visible = false;
			},

			btnConfirm: function(e) {
				let psw = this.password.replace(new RegExp(/( )/g), "");
				if (this.password.length <= 0) {
					this.util.UiUtils.showToast("请输入您的资金密码");
					return;
				}
				this.m_islogout = true;
				this.util.UiUtils.showLoading("检测中...", 30);
				this.dal.Setting.onCheckCapitalPassword(psw);
				this.visible = false;
			},
			onCheckCapitalPassword: function(data) {
				if (this.m_islogout) {
					this.m_islogout = false;
					this.util.UiUtils.showLoading("登出中...")

					this.dal.Account.onLogOut(22);
				}
			},

			onRefresh: function() {
				// this.m_configitem = this.dal.Common.onGetRateInfo("exchange_key");
				this.m_vsn = this.PlatformInfo.vsn;

				// this.isWallet = this.dal.Wallter.isValidWallet();
				console.log("=this.dal.Character.m_playerInfo", this.dal.Character.m_playerInfo)
				if (this.dal.Character.m_playerInfo) {
					this.m_username = this.dal.Character.m_playerInfo.username || this.dal.Character.m_playerInfo.identity_state_text; //'../../static/image/head/3.png'
					let pic = this.dal.Character.m_playerInfo.profile_picture || "0"
					if (this.dal.Character.m_playerInfo.profile_picture) {
						this.m_head = "../../static/image/head/" + this.dal.Character.m_playerInfo.profile_picture + ".png"
						console.log("==this.m_head=", this.m_head)
					}
					let phone = this.dal.Character.m_playerInfo.phone;
					if (phone) {
						this.m_phonenumber = phone.replace(phone.substring(3, 7), "****")
					}
					this.id = this.dal.Character.m_playerInfo.id
				}
			},

			btnMyFun: function(idx) {
				if (idx == 1) { //我的算力
					// this.util.UiUtils.switchToPage("computing-power-power", "mine-mine", {});
				} else if (idx == 2) { //我的收益
					// this.util.UiUtils.switchToPage("income-my-income", "mine-mine", {});
				} else if (idx == 3) { //我的钱包
					// if (!this.isWallet) {
					// 	this.util.UiUtils.switchToPage("mine-creat-wallet", "mine-mine", {});
					// } else {
					// 	this.util.UiUtils.switchToPage("mine-my-wallet-my-wallet", "mine-mine", {});
					// }
				} else if (idx == 4) { //公告
					// this.$openPage({
					// 	name: "notice-notice",
					// 	query: {
					// 		type: 1
					// 	}
					// })
				} else if (idx == 5) { //订单
					// this.$openPage({
					// 	name: "order-list-order-list",
					// 	query: {
					// 		from: 1
					// 	}
					// })
				}
			},

			onLogOut: function(data) {
				console.log("====onLogOut==")
				this.dal.Net.clear();
				// this.util.UiUtils.switchToPage("login-login", "mine-mine", {}, "reLaunch");
				this.$openPage({
					name: "login-login",
					query: {},
					gotype: "reLaunch"
				})
			},
			btnIdentity: function() {
				if (this.dal.Character.m_playerInfo.identity_state == 1) {
					this.$openPage({
						name: "safe-authentication-authentication",
						query: {}
					})
				}
			},
			btnModelFun: function(idx) {
				if (idx == 1) { //身份验证
					this.$openPage({
						name: "safe-authentication-authentication",
						query: {}
					})
				} else if (idx == 2) { //安全中心					
					this.$openPage({
						name: "safe-safe-center",
						query: {}
					})
				} else if (idx == 3) { //帮助中心					
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
				} else if (idx == 7) { //退出登录			
					// this.isWallet = this.dal.Wallter.isValidWallet();
					// if (this.isWallet) {
					// 	this.visible = true;
					// } else {
					// 	uni.showModal({
					// 		title: this.getLocalStr("tip_title"),
					// 		content: "确认退出登录吗？",
					// 		confirmText: this.getLocalStr("btnstring_confirm"),
					// 		showCancel: true,
					// 		success: function(res) {
					// 			if (res.confirm) {
					// 				this.util.UiUtils.showLoading("登出中...")
					// 				this.dal.Account.onLogOut();
					// 			}
					// 		}.bind(this)
					// 	});
					// }
					
					if(this.dal.Character.m_playerInfo.isset_capital_pwd == 1){
						this.visible = true;
					}else{
						uni.showModal({
							title: this.getLocalStr("tip_title"),
							content: "为了您的资金安全，请先设置资金密码后再退出操作",
							confirmText: "设置",
							showCancel: true,
							success: function(res) {
								if (res.confirm) {
									// this.util.UiUtils.showLoading("登出中...")
									// this.dal.Account.onLogOut();
									this.$openPage({name: "safe-safe-center",query: {}})
								}
							}.bind(this)
						});
					}
				}else if(idx == 8){
					// 地址本  
					this.$openPage({name: "address-list",query: {type:2}})
				}else if(idx == 9){
					// 语言设置
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
