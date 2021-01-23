<template>
	<view class="money-pwd">
		<bar ref="bar" style="background-color: #FFFFFF;"></bar>
		<view @tap="btnBack()" class="safe-header">
			<image src="../../../static/image/login/left.svg" />
			<text>修改密码</text>
		</view>
		<view class="mine-type">
			<view class="type-list">
				<view class="list-title">
					原始密码
				</view>
				<view class="info-content">
					<QSInput :maxlength="20" fontSize="13px" name="password" placeholder="请输入原始密码" style="height: 30px;display: flex;justify-content: center;align-items: center;" :filterFc="oldPassWordFilterInput"
					 variableName="password" password title="" v-model="password" focusBorderColor="#FFFFFF" blurBorderColor="#FFFFFF"></QSInput>
				</view>
			</view>
			<view class="type-list">
				<view class="list-title">
					新密码
				</view>
				<view class="info-content">
				<QSInput :maxlength="20" fontSize="13px" name="newpassword" placeholder="请输入新密码" style="height: 30px;display: flex;justify-content: center;align-items: center;" :filterFc="newPassWordFilterInput"
					 variableName="newpassword" password title="" v-model="newpassword" focusBorderColor="#FFFFFF" blurBorderColor="#FFFFFF"></QSInput>
				</view>
			</view>
			<view class="type-list">
				<view class="list-title">
					确认密码
				</view>
				<view class="info-content">
					<QSInput :maxlength="20" fontSize="13px" name="againpawword" placeholder="请输入确认密码" style="height: 30px;display: flex;justify-content: center;align-items: center;" :filterFc="newAgainPassWordFilterInput"
						 variableName="againpawword" password title="" v-model="againpawword" focusBorderColor="#FFFFFF" blurBorderColor="#FFFFFF"></QSInput>
				</view>
			</view>
		</view>
		<view @tap="btnConfirm()" class="container-login">确定</view>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	export default {
		components: {
			Bar
		},
		created() {
			this.util.EventUtils.addEventListenerCustom(this.dal.Setting.evtChangePassword, this.onChangePassword);
		},
		
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Setting.evtChangePassword, this.onChangePassword);
		},
		data() {
			return {
				password:"",
				newpassword:"",
				againpawword:"",
				oldPassWordFilterInput(value) {
					return value;
				},
				newPassWordFilterInput(value) {
					return value;
				},
				newAgainPassWordFilterInput(value){
					return value;
				}
			}
		},
		methods: {
			btnBack: function() {
				this.util.UiUtils.switchBackPage();
			},
			
			onChangePassword:function(){
				uni.showModal({
					title: this.getLocalStr("tip_title"),
					content: "密码修改成功，请记住您的新密码",
					confirmText: this.getLocalStr("btnstring_confirm"),
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							this.btnBack();
						}
					}.bind(this)
				});
			},
			
			btnConfirm: function() {
				console.log("=this.password=",this.password)
				console.log("=this.newpassword=",this.newpassword)
				console.log("=this.againpawword=",this.againpawword)
				let password = this.password.replace(new RegExp(/( )/g), "");
				let newpassword = this.newpassword.replace(new RegExp(/( )/g), "");
				let againpawword = this.againpawword.replace(new RegExp(/( )/g), "");
				if (password.length <= 0) {
					this.util.UiUtils.showToast("原始密码不能为空")
					return;
				}
				if (password.length < 6) {
					this.util.UiUtils.showToast("原始密码格式不正确")
					return;
				}
				if (newpassword.length <= 0) {
					this.util.UiUtils.showToast("新密码不能为空")
					return;
				}
				if (newpassword.length < 6) {
					this.util.UiUtils.showToast("新密码不能小于6位")
					return;
				}
				if (againpawword.length <= 0) {
					this.util.UiUtils.showToast("确认密码不能为空")
					return;
				}
				if (againpawword != newpassword) {
					this.util.UiUtils.showToast("两次输入的密码不致")
					return;
				}
				
				this.util.UiUtils.showLoading("修改中...")
				this.dal.Setting.onChangePassword(password,againpawword)
			}
		}
	}
</script>

<style lang="scss">
	@import 'money-pwd.scss';
</style>
