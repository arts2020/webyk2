<template>
	<view class="visit-index">
        <uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" :title="share_title" @clickLeft="btnBack"></uni-nav-bar>
		<view class="visit-content" :style="'height:'+scrollHeight+'px'">
			<view class="visit-erweima">
				<tki-qrcode ref="qrcode" :cid="cid" :val="val" :size="size" :unit="unit" :background="background" :foreground="foreground"
				 :pdground="pdground" :icon="icon" :iconSize="iconsize" :lv="lv" :onval="onval" :loadMake="loadMake"
				 :usingComponents="usingComponents" :showLoading="showLoading" :loadingText="loadingText" @result="resultImg" />
			</view>
			<view class="btn-list">
				<!-- <view class="btn" @tap="shareWechat">
					<image src="../../../static/image/mine/wechat.png" mode=""></image>
					<view class="btn-title">微信</view>
				</view> -->
				<view class="btn" @click="shareClick">
					<image src="../../../static/image/mine/share-icon.png" mode=""></image>
					<view class="btn-title">{{share_title}}</view>
				</view>
				<view class="btn" @click="btnSavePic">
					<image src="../../../static/image/mine/savePic.png" mode=""></image>
					<view class="btn-title">{{share_save_picture}}</view>
				</view>
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
				scrollHeight: 0,
				m_address: "",
				m_cointype: "",
				qrR: "",
				cid: "",
				usingComponents: "",
				loadingText: "",
				showLoading: "",
				ifShow: true,
				val: 'asdddddddddddddd', // 要生成的二维码值
				size: 217, // 二维码大小
				unit: 'upx', // 单位
				background: '#FFFFFF', // 背景色
				foreground: '#000000', // 前景色
				pdground: '#000000', // 角标色
				icon: '../../../static/image/mine/logo.png', // 二维码图标
				iconsize: 29, // 二维码图标大小
				lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
				onval: false, // val值变化时自动重新生成二维码
				loadMake: true, // 组件加载完成后自动生成二维码
				src: '', // 二维码生成后的图片地址或base64
				userid:''
			}
		},
		created() {
			
			let url = "";
			if (this.PlatformInfo.platform === this.entities.Metadata.PlatForm.ANDROID) {
				url = this.dal.Common.onGetConfigInfo("appload_android_url").value;
			}else if (this.PlatformInfo.platform === this.entities.Metadata.PlatForm.IOS) {
				url = this.dal.Common.onGetConfigInfo("appload_ios_url").value;
			}else if (this.PlatformInfo.platform === this.entities.Metadata.PlatForm.H5_IOS) {
				url = this.dal.Common.onGetConfigInfo("appload_ios_url").value;
			}else if (this.PlatformInfo.platform === this.entities.Metadata.PlatForm.H5_ANDROID) {
				url = this.dal.Common.onGetConfigInfo("appload_android_url").value;
			}else{
				url = this.dal.Common.onGetConfigInfo("appload_android_url").value;
			}
			this.val = url;
			this.initword()
		},
		
		methods: {
			initword(){
				this.share_title = this.getLocalStr("share_title");
				this.share_save_picture = this.getLocalStr("share_save_picture");
			},
			btnBack: function() {
				this.util.UiUtils.switchBackPage();
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
			},
			shareWechat(){
				// #ifdef APP-PLUS
				uni.share({
				    provider: "weixin",
				    scene: "WXSceneSession",
				    type: 0,
				    href: "",
				    title: "uni-app分享",
				    summary: "我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！",
				    imageUrl: this.src,
				    success: function (res) {
				        console.log("success:" + JSON.stringify(res));
				    },
				    fail: function (err) {
				        console.log("fail:" + JSON.stringify(err));
				    }
				});
				// #endif
			}
		},
		onShow() {
			let _this = this;
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight -44;
				}
			});
		}
	}
</script>

<style lang="scss">
	@import "visit.scss"
</style>
