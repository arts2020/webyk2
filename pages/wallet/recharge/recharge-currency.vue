<template>
	<view class="recharge-currency">
		<uni-nav-bar left-icon="back" :statusBar="true" :fixed="true" title="收款" @clickLeft="btnBack"></uni-nav-bar>
		<view class="main-c">
			<view class="title">
				扫描二维码，充值{{m_cointype}}
			</view>
			<view class="recharge-code">
				<tki-qrcode ref="qrcode" :cid="cid" :val="val" :size="size" :unit="unit" :background="background" :foreground="foreground"
					 :pdground="pdground" :icon="icon" :iconSize="iconsize" :lv="lv" :onval="onval" :loadMake="loadMake"
					 :usingComponents="usingComponents" :showLoading="showLoading" :loadingText="loadingText" />
				<!-- <canvas style="width: 180px;height: 180px;" canvas-id="couponQrcode"></canvas> -->
				<!-- <image style="width: 180px;height: 180px;" src="../../static/image/safe/timg.jpg" /> -->
				
			</view>
			<view class="address">
				<view class="addr-title">钱包地址</view>
				<view class="addr-info">{{m_address}}</view>
			</view>
            <view class="btns">
				<view class="btn" @tap="goShare">
					<uni-icons type="redo" size="30"></uni-icons>
					<text>分享</text>
				</view>
				<view @tap="btnCopyFun()" class="btn">
					<uni-icons type="compose" size="30"></uni-icons>
					<text>复制</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	import qrCode from '@/common/util/qrCode.js';
	export default {
		components: {
			Bar,
			qrCode,
		},
		created() {
			this.m_cointype = this.m_asset.name;
			if(this.m_cointype == "filecoin"){
				// this.val = this.dal.LotusWallter.getAddress();
			}else{
				// this.val = this.dal.Wallter.getAddress();
			}
			this.m_address = this.val;
		},
		onLoad(option) {
			var data = JSON.parse(option.query);
			this.m_asset = data;
		},
		data() {
			return {
				m_address: "",
				m_cointype: "",
				//当前资产
				m_asset:"",
				qrR: "",
				cid: "",
				usingComponents: "",
				loadingText: "",
				showLoading: "",
				ifShow: true,
				val: 'asf1v2s5fee8saccz5', // 要生成的二维码值
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
				src: '' // 二维码生成后的图片地址或base64
			};
		},
		methods: {
			btnBack: function() {
				this.util.UiUtils.switchBackPage();
			},
			btnSavePic:function(){
				this.$refs['qrcode']._saveCode();
			},
			btnCopyFun: function() {
				let self = this;
				uni.setClipboardData({
					data: this.val,
					success: function(data) {
						self.util.UiUtils.showToast("复制成功");
					},
					fail: function(err) {},
					complete: function(res) {}
				});
			},
			goShare(){
				// #ifdef APP-PLUS
					let params = {
						type:"",
						content:"",
						href:""
					}
					 plus.share.sendWithSystem(params, function(){
					        console.log('分享成功');
					    }, function(e){
					        console.log('分享失败：'+JSON.stringify(e));
					    });
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import 'recharge-currency.scss';
</style>
