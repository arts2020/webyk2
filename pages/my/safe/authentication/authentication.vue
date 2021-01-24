<template>
	<view class="safe-center">
		<bar ref="bar" style="background-color: #FFFFFF;"></bar>
		<view @tap="btnBack()" class="safe-header">
			<image src="../../../static/image/login/left.svg" />
			<text>身份认证</text>
		</view>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<view class="mine-type">
				<view class="tips">
					为了您的资金安全，需要验证您的真实身份，琥珀
					需要年满18周岁，认证信息一经认证不能修改！
				</view>
			</view>
			<view class="upload-content">
				<view class="upload-img">
					<image :src="m_imgUrl1" @click="addOneImg(1)" />
					<view class="upload-tips">请上传身份证正面</view>
					<view class="exam-state" v-if="examState == '0'"></view>
					<view class="exam-state" v-if="examState == '1'">待审核</view>
					<view class="exam-state" v-if="examState == '2'">审核通过</view>
					<view class="exam-state" v-if="examState == '3'" style="background-color: #FFBE29;">审核不通过</view>
				</view>
			</view>
			<view class="upload-content">
				<view class="upload-img">
					<image :src="m_imgUrl2" @click="addOneImg(2)" />
					<view class="upload-tips">请上传身份证背面</view>
					<view class="exam-state" v-if="examState == '0'"></view>
					<view class="exam-state" v-if="examState == '1'">待审核</view>
					<view class="exam-state" v-if="examState == '2'">审核通过</view>
					<view class="exam-state" v-if="examState == '3'" style="background-color: #FFBE29;">审核不通过</view>
				</view>
			</view>
			<view class="container-login" v-if="examState == '2' || examState == '1'" style="color: #c5c8ce;background: linear-gradient(to right, #f7f7f7, #f7f7f7);border-color: #dcdee2;">确认认证</view>
			<view class="container-login" @click="btnUpload()" v-if="examState == '0' || examState == '3'" >确认认证</view>
		</scroll-view>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	export default {
		components: {
			Bar
		},
		data() {
			return {
				scrollHeight: 0,
				m_imgUrl1:'../../../static/image/safe/upload.png',//正面
				m_imgUrl2:'../../../static/image/safe/upload-bei.png',//背面
				examState:'0'
			}
		},
		created() {
			console.log("==this.dal.Character.m_playerInfo=" + JSON.stringify(this.dal.Character.m_playerInfo))
			this.util.EventUtils.addEventListenerCustom(this.dal.Setting.evtAuthentication, this.onAuthentication);
			this.util.EventUtils.addEventListenerCustom(this.dal.Character.evtCharacterUpdate, this.onRefresh);
		},

		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Setting.evtAuthentication, this.onAuthentication);
			this.util.EventUtils.removeEventCustom(this.dal.Account.evtCharacterUpdate, this.onRefresh);
		},
		
		methods: {
			onRefresh:function(){
				console.log("=======1=onRefresh========");
				let item = this.dal.Character.m_playerInfo;
				console.log('=========33333=======' , item.verify_state)
				// if(item.hasOwnProperty('m_imgUrl1') == false){
				// 	this.m_imgUrl1 = "../../../static/image/safe/upload.png"
				// }
				// if(item.hasOwnProperty('m_imgUrl2') == false){
				// 	this.m_imgUrl2 = "../../../static/image/safe/upload-bei.png"
				// }
				if(item.imgurl != ''){
					this.m_imgUrl1 = item.imgurl
				}else{
					this.m_imgUrl1 = "../../../static/image/safe/upload.png"
				}
				if(item.imgurl2 != ''){
					this.m_imgUrl2 = item.imgurl2
				}else{
					this.m_imgUrl2 = "../../../static/image/safe/upload-bei.png"
				}
				this.examState = item.verify_state
				if(item.imgurl.length <= 0 || item.imgurl2.length <= 0){
					this.examState = 0;
				}
				
			},
			
			onAuthentication: function() {
				uni.showModal({
					title: this.getLocalStr("tip_title"),
					content: "身份证信息上传成功，正在等待审核",
					confirmText: this.getLocalStr("btnstring_confirm"),
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							
						}
					}.bind(this)
				});
			},
			btnBack: function() {
				this.$openPage({
					name: "mine-mine",
					query: {}
				})
			},
			addOneImg(ftype) {
				let that = this;
				var logininfo = this.dal.Account.getLoginInfo();
				let token = logininfo.m_sUserToken;
				uni.chooseImage({
					count: 1,
					success: function(chooseImageRes) {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						// console.log('====11111====' + tempFilePaths[0])
						// console.log('====token====' + token)
						uni.uploadFile({
							url: that.PlatformInfo.host + "/api/v1/upload", //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name:'file',
							formData: {
								'type': 'image',
								'token': token
							},
							success: function(uploadFileRes) {
								var str1 = JSON.parse(uploadFileRes.data)
								let url = that.PlatformInfo.host.substr(0,18)
								console.log('--=str1=1=' + url);
								if(ftype == 1){
									that.m_imgUrl1 = url + str1.url;
								}else{
									that.m_imgUrl2 = url + str1.url;
								}
							}
						});
					}
				});
			},
			
			btnUpload:function(){
				this.dal.Setting.onAuthentication(this.m_imgUrl1,this.m_imgUrl2)
			}
		},
		onLoad() {
			this.onRefresh();
		},
		onShow() {
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight - 44;
				}
			});
		}

	}
</script>

<style lang="scss">
	@import 'authentication.scss';
</style>
