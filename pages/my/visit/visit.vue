<template>
	<view class="visit-index">
		<view @tap="btnBack()" class="safe-header" :style="{marginTop:topheight + 'px'}">
			<image src="../../../static/image/safe/left1.svg" />
			<text>邀请好友</text>
		</view>
		<view class="visit-content">
			<view class="visit-logo">
				<image src="../../../static/image/safe/logo.svg" />
			</view>
			<view class="visit-title">琥珀POOL</view>
			<view class="visit-erweima">
				<!-- <image src="../../../static/image/safe/timg.jpg" /> -->
				<tki-qrcode ref="qrcode" :cid="cid" :val="val" :size="size" :unit="unit" :background="background" :foreground="foreground"
				 :pdground="pdground" :icon="icon" :iconSize="iconsize" :lv="lv" :onval="onval" :loadMake="loadMake"
				 :usingComponents="usingComponents" :showLoading="showLoading" :loadingText="loadingText" @result="resultImg" />


			</view>
			<view class="visit-tips">立即扫码注册</view>
			<view class="visit-tips">还有更多福利等你来拿</view>
			<view class="container-login" @tap="btnSavePic()">保存图片</view>
		</view>
		<view class="btn-list">
			<view class="btn" @tap="shareClick()">
				<image src="../../../static/image/safe/weixin.svg" />
				<view class="btn-title">分享好友</view>
			</view>
			<view class="btn" @tap="btnCopyFun()">
				<image src="../../../static/image/safe/lianjie.svg" />
				<view class="btn-title">拷贝链接</view>
			</view>
		</view>
	</view>
</template>

<script>
	import qrCode from '../../../common/util/qrCode.js';
	export default {
		components: {
			qrCode,
		},
		data() {
			return {
				topheight: 0,
				m_address: "",
				m_cointype: "",
				qrR: "",
				cid: "",
				usingComponents: "",
				loadingText: "",
				showLoading: "",
				ifShow: true,
				val: '', // 要生成的二维码值
				size: 360, // 二维码大小
				unit: 'upx', // 单位
				background: '#FFFFFF', // 背景色
				foreground: '#000000', // 前景色
				pdground: '#000000', // 角标色
				icon: '', // 二维码图标
				iconsize: 40, // 二维码图标大小
				lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
				onval: false, // val值变化时自动重新生成二维码
				loadMake: true, // 组件加载完成后自动生成二维码
				src: '', // 二维码生成后的图片地址或base64
				userid:''
			}
		},
		created() {
			let userid = this.dal.Character.m_playerInfo.m_nUserId
			let url = "";
			if (this.PlatformInfo.platform === this.entities.Metadata.PlatForm.ANDROID) {
				url = this.dal.Common.onGetRateInfo("appload_android_url").value;
			}else if (this.PlatformInfo.platform === this.entities.Metadata.PlatForm.IOS) {
				url = this.dal.Common.onGetRateInfo("appload_ios_url").value;
			}else if (this.PlatformInfo.platform === this.entities.Metadata.PlatForm.H5_IOS) {
				url = this.dal.Common.onGetRateInfo("appload_ios_url").value;
			}else if (this.PlatformInfo.platform === this.entities.Metadata.PlatForm.H5_ANDROID) {
				url = this.dal.Common.onGetRateInfo("appload_android_url").value;
			}else{
				url = this.dal.Common.onGetRateInfo("appload_android_url").value;
			}
			this.val = url
		},
		
		methods: {
			btnBack: function() {
				this.$openPage({
					name: "mine-mine",
					query: {}
				})
			},
			btnSavePic: function() {
				this.$refs['qrcode']._saveCode();
			},
			resultImg(data) {
				this.src = data
			},
			btnCopyFun: function() {
				let self = this;
				uni.setClipboardData({
					data: self.val,
					success: function(data) {
						self.util.UiUtils.showToast("复制成功");
					},
					fail: function(err) {},
					complete: function(res) {}
				});
			},
			shareClick() {
				uni.shareWithSystem({
					type: 'image',
					imageUrl: this.src,
					success: function(res) {
						console.log("success:" + JSON.stringify(res));
						if(res.errMsg == 'shareWithSystem:ok'){
							return
						}
					}.bind(this),
					fail: function(err) {
						console.log("fail:" + JSON.stringify(err));
						this.util.UiUtils.showToast("分享失败，微信未安装");
						//this.save(e);
					}.bind(this)
				});


			}
		},
		onShow() {
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.topheight = res.statusBarHeight;
				}
			});
		}
	}
</script>

<style lang="scss">
	@import "visit.scss"
</style>
