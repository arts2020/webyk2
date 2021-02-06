<template>
	<view class="language">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" title="选择语言" @clickLeft="btnBack">
			<view class="save-txt" slot="right" @tap="goSave">保存</view>
		</uni-nav-bar>
		<radio-group @change="handleCheck">
			<view class="list-item" v-for="(item,index) in menuList" :key="index">
				<text>{{item}}</text>
				<label>
					<radio color="#FFFFFF" :value="index+''" :checked="active==index"/>
				</label>
			</view>
		</radio-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				active:0,
				menuList:['简体中文','繁体中文','英文']
			};
		},
		methods:{
			btnBack:function(){
				this.util.UiUtils.switchBackPage();
			},
			goSave(){
				
			},
			handleCheck(e){
				this.active = e.detail.value;
			}
		}
	}
</script>

<style lang="scss" scoped>
.language{
	width: 100%;
	background-color: #FFFFFF;
	.save-txt{
		font-size: 30rpx;
		font-family: PingFang SC, PingFang SC-Bold;
		font-weight: 700;
		color: #4c72ef;
	}
	.list-item{
		width: calc(100% - 70rpx);
		margin: 0 auto;
		height: 107rpx;
		border-bottom: 1rpx solid #ebebeb;
		display: flex;
		align-items: center;
		justify-content: space-between;
		text{
			font-size: 34rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 600;
			color: #121212;
		}
		/deep/ uni-radio .uni-radio-input{
			border: 0;
			
		}
		/deep/ uni-radio .uni-radio-input.uni-radio-input-checked::before{
			color: #009A80;
			font-size: 50rpx;
		}
	}
}
</style>
