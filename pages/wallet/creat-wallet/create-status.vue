<template>
	<view class="create-status">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" title="创建身份" @clickLeft="goBack"></uni-nav-bar>

		<view class="create-main" v-if="isNext" :style="'height:'+scrollHeight+'px'">
			<view class="top-title">创建身份，你将会有身份下的多链钱包，比如ETH、BTC ...</view>
			<view>
				<view class="top-title">身份名</view>
				<view class="input-box">
					<input type="text" placeholder="身份名" placeholder-style="font-size: 26rpx;color: #C2C2C2;" v-model="statusName" />
				</view>
			</view>
			<view>
				<view class="top-title">输入密码</view>
				<view class="input-box">
					<input @input="inputPasd" type="text" placeholder-style="font-size: 26rpx;color: #C2C2C2;" password placeholder="密码"
					 v-model="password" />
				</view>
				<view class="tips">{{tip_1}}</view>
			</view>
			<view>
				<view class="top-title">确认密码</view>
				<view class="input-box">
					<input @blur="reconfirm" password type="text" placeholder-style="font-size: 26rpx;color: #C2C2C2;" placeholder="重复输入密码"
					 v-model="confirmPasd" />
				</view>
				<view class="tips">{{tip_2}}</view>
			</view>
			<view>
				<view class="top-title">密码提示</view>
				<view class="input-box">
					<input type="text" placeholder="密码提示(可选)" placeholder-style="font-size: 26rpx;color: #C2C2C2;" v-model="pasdTip" />
				</view>
			</view>
			<view class="btn_ok" :style="'background-color:'+btnCreate_color" @tap="btnCreate">创建</view>
		</view>

		<view class="aggrement" v-else :style="'height:'+scrollHeight+'px'">
			<scroll-view scroll-y="true" class="aggr-c">
				<view class="aggr-title">YouKey服务协议</view>
				<view>
					1、用户在使用本服务前需要注册一个“陌陌”帐号。“陌陌”帐号应当使用手机号码绑定注册，请用户使用尚未与“陌陌”帐号绑定的手机号码，以及未被陌陌科技根据本协议封禁的手机号码注册“陌陌”帐号。陌陌科技可以根据用户需求或产品需要对帐号注册和绑定的方式进行变更，而无须事先通知用户。
				</view>
				<view>
					2、“陌陌”系基于地理位置的移动社交产品，用户注册时应当授权陌陌科技公开及使用其地理位置信息方可成功注册“陌陌”帐号。故用户完成注册即表明用户同意陌陌科技提取、公开及使用用户的地理位置信息。如用户需要终止向其他用户公开其地理位置信息，可自行设置为隐身状态。
				</view>
				<view>
					3、鉴于“陌陌”帐号的绑定注册方式，您同意陌陌科技在注册时将使用您提供的手机号码及/或自动提取您的手机号码及自动提取您的手机设备识别码等信息用于注册。您同意给予运营商授权，授权运营商有权自动提取您的手机号码进行认证并用于“陌陌”账号注册，您保证遵守运营商的相关服务条款（点击查看服务条款），如运营商对您的手机号认证成功，则您的注册即完成。如您不同意对运营商的授权和/或服务条款或者是您的手机号认证失败，您可以手动修改运营商提取的手机号码，采取验证码方式进行注册登录。
				</view>
				<view>
					4、在用户注册及使用本服务时，陌陌科技需要搜集能识别用户身份的个人信息以便陌陌科技可以在必要时联系用户，或为用户提供更好的使用体验。陌陌科技搜集的信息包括但不限于用户的姓名、性别、年龄、出生日期、身份证号、地址、学校情况、公司情况、所属行业、兴趣爱好、常出没的地方、个人说明；陌陌科技同意对这些信息的使用将受限于第三条用户个人隐私信息保护的约束。
				</view>
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
		name: "create-status",
		onShow() {
			// this.dal.Setting.onGetUserAgree();
		},
		data() {
			return {
				scrollHeight: 0,
				content: "",
				// 是否下一步
				isNext: false,
				// 是否同意协议
				isAgree: false,
				statusName: "",
				password: "",
				confirmPasd: "",
				pasdTip: "",
				tip_1: "",
				tip_2: "",
			};
		},
		onShow() {
			// 是否要求恢复到页面刚加载进来时的状态
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight - 44;
				}
			});
		},
		computed: {
			btn_color() {
				if (this.isAgree) {
					return '#0000FF'
				} else {
					return '#C8C7CC'
				}
			},
			btnCreate_color() {
				if (this.statusName && this.password) {
					return '#0000FF'
				} else {
					return '#C8C7CC'
				}
			}
		},
		methods: {
			handleCheck(evt) {
				if (evt.target.value) {
					this.isAgree = true;
				}
			},
			goNext() {
				if (!this.isAgree) {
					return;
				}
				this.isNext = true;
			},
			goBack() {
				this.util.UiUtils.switchBackPage();
			},
			handleAgreement(data) {
				this.content = data.data;
			},
			reconfirm() {
				if (this.password != this.confirmPasd) {
					this.tip_2 = '两次密码不一致'
				} else {
					this.tip_2 = ''
				}
			},
			inputPasd() {
				if (this.password.length < 8) {
					this.tip_1 = "不少于8个字符，建议大小写字母、数字混合"
				} else {
					this.tip_1 = ""
				}

			},
			btnCreate: function() {
				if (!(this.statusName && this.password)) {
					return;
				}
				// this.util.UiUtils.showLoading("身份初始化...");
				this.util.UiUtils.switchToPage("wallet-add-coin", "creat-wallet-status", {
					backType: 2,
					name: this.statusName,
					password: this.password,
					tips: this.pasdTip,
				}, "redirectTo");
			},
		}
	}
</script>

<style lang="scss" scoped>
	.create-status {
		width: 100%;
		height: 100%;
		min-height: 100vh;

		/deep/ .uni-navbar--border {
			border: 0;
		}

		.aggrement {
			width: 100%;
			padding: 22rpx 30rpx;
			box-sizing: border-box;
			background-color: #FFFFFF;

			.aggr-c {
				width: 100%;
				height: calc(100% - 150rpx);
				font-size: 30rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 500;
				text-align: left;
				color: #333333;

				.aggr-title {
					font-size: 36rpx;
					font-family: PingFang SC, PingFang SC-Bold;
					font-weight: 700;
					text-align: center;
					color: #111111;
					margin-bottom: 25rpx;
				}
			}

			.btn-box {
				width: 100%;
				height: 239rpx;
				padding: 31rpx 51rpx 47rpx;
				box-sizing: border-box;
				background: #ffffff;
				box-shadow: 0px -3rpx 40rpx 0px rgba(0, 0, 0, 0.08);
				position: fixed;
				bottom: 0rpx;
				left: 0rpx;

				label {
					font-size: 30rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					color: #4c72ef;
				}

				.btn_ok {
					width: 100%;
					height: 88rpx;
					background: #4c72ef;
					border-radius: 14rpx;
					box-shadow: 0px 3rpx 26rpx 0px rgba(0, 0, 0, 0.06);
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

		.create-main {
			width: 100%;
			height: 100%;
			padding: 32rpx 36rpx;
			box-sizing: border-box;
			background-color: #FAFBFF;

			.top-title {
				font-size: 26rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
				color: #121212;
				margin-bottom: 22rpx;
			}

			.input-box {
				width: 100%;
				height: 104rpx;
				border-radius: 10rpx;
				background-color: #FFFFFF;
				margin-bottom: 34rpx;
				display: flex;
				align-items: center;
				color: #444444;
				font-size: 26rpx;

				uni-textarea {
					width: 100%;
					height: 335rpx;
					padding: 36rpx 32rpx;
					box-sizing: border-box;
				}

				uni-input {
					height: 60rpx;
					margin-left: 32rpx;
				}
			}

			.tips {
				text-align: right;
				font-size: 24rpx;
				color: #3981F3;
			}

			.btn_ok {
				width: 647rpx;
				height: 88rpx;
				font: 32rpx;
				font-weight: 700;
				color: #FFFFFF;
				letter-spacing: 10rpx;
				text-align: center;
				line-height: 88rpx;
				border-radius: 14rpx;
				box-shadow: 0px 3rpx 26rpx 0px rgba(0, 0, 0, 0.06);
				margin: 60rpx auto 0;
				// position: fixed;
				// bottom: 10rpx;
				// left: 50%;
				// transform: translateX(-50%);
			}
		}
	}
</style>
