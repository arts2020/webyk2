<template>
	<view class="recharge-currency" :style="'background-color:'+bgcolor">
		<uni-nav-bar :background-color="bgcolor" color="#ffffff" left-icon="back" :statusBar="true" :fixed="true" :title="btnstring_receive" @clickLeft="btnBack"></uni-nav-bar>
		<view class="main-c">
			<view class="title">
				{{title_str5}}{{m_cointype}}
			</view>
			<view class="recharge-code">
				<tki-qrcode ref="qrcode" :cid="cid" :val="val" :size="size" :unit="unit" :background="background" :foreground="foreground"
					 :pdground="pdground" :icon="icon" :iconSize="iconsize" :lv="lv" :onval="onval" :loadMake="loadMake"
					 :usingComponents="usingComponents" :showLoading="showLoading" :loadingText="loadingText" />
				<!-- <canvas style="width: 180px;height: 180px;" canvas-id="couponQrcode"></canvas> -->
				<!-- <image style="width: 180px;height: 180px;" src="../../static/image/safe/timg.jpg" /> -->
				
			</view>
			<view class="address">
				<view class="addr-title">{{wallet_detail_str2}}</view>
				<view class="addr-info">{{m_address}}</view>
			</view>
           
		</view>
		<view class="btns">
			<view class="btn" @tap="goShare">
				<image src="../../../static/image/index/share.png" mode=""></image>
				<text>{{share_title}}</text>
			</view>
			<view @tap="btnCopyFun()" class="btn">
				<image src="../../../static/image/index/copy.png" mode=""></image>
				<text>{{copy}}</text>
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
		data() {
			return {
				bgcolor:"",
				currentWallet:{},
				m_currentAsset:{},
				m_address: "",
				m_cointype: "ETH",
				qrR: "",
				cid: "",
				usingComponents: "",
				loadingText: "",
				showLoading: "",
				ifShow: true,
				val: '', // 要生成的二维码值
				size: 400, // 二维码大小
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
		onLoad(option) {
			let params = JSON.parse(option.query);
			if(Object.keys(params).length!=0){
				this.m_currentAsset = params;
			}
			this.initword();
		},
		onShow() {
			this.onRefersh()
		},
		methods: {
			initword(){
				this.btnstring_receive = this.getLocalStr('btnstring_receive')
				this.copy = this.getLocalStr('copy')
				this.share_title = this.getLocalStr('share_title')
				this.wallet_detail_str2 = this.getLocalStr('wallet_detail_str2')
				this.title_str5 = this.getLocalStr('title_str5')
				this.copy_success = this.getLocalStr("copy_success")
			},
			btnBack: function() {
				this.util.UiUtils.switchBackPage();
			},
			onRefersh(){	
				this.currentWallet = this.dal.WalletManage.getCurrWallet();
				// 给二维码要生成的内容赋值
				this.val = this.currentWallet.address;
				//给地址赋值
				this.m_address = this.currentWallet.address;
				//给链类型赋值
				let m_chain = this.dal.Chain.getChainInfo(this.currentWallet.chaintype);
				this.m_cointype = this.m_currentAsset.name?this.m_currentAsset.name:m_chain.name;
				//根据链的类型选背景色
				switch (this.currentWallet.chaintype){
					case 1:this.bgcolor='#4C72EF';
						break;
					case 2:this.bgcolor='#FE9E02';
						break;
					case 3:this.bgcolor='#F57778';
						break;
					case 4:this.bgcolor='#42C1CA';
						break;
					case 5:this.bgcolor='#3A3556';
						break;
					default:this.bgcolor = '#4C72EF'
						break;
				}
			},
			btnSavePic:function(){ 
				this.$refs['qrcode']._saveCode();
			},
			btnCopyFun: function() {
				let self = this;
				uni.setClipboardData({
					data: this.val,
					success: function(data) {
						self.util.UiUtils.showToast(self.copy_success);
					},
					fail: function(err) {},
					complete: function(res) {}
				});
			},
			goShare(){
				// #ifdef APP-PLUS
					let params = {
						type:"text",
						content:"asdas",
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
