<template>
	<view class="language">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" title="选择语言" @clickLeft="btnBack">
			<view class="save-txt" slot="right" @tap="goSave">保存</view>
		</uni-nav-bar>
		<view class="list-item" v-for="(item,index) in menuList" :key="index" @tap="handleCheck(item.type)">
			<text>{{item.name}}</text>
			<image class="checked-icon" v-if="active==item.type" src="../../../static/image/mine/checked.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	export default {
		created() {
				this.onRefresh();
		},
		data() {
			return {
				active: this.entities.Metadata.GameLanguage.CN,
				menuList: []
			};
		},
		methods: {
			onRefresh: function() {
				this.menuList = [];
				for (let i = this.entities.Metadata.GameLanguage.CN; i <= this.entities.Metadata.GameLanguage.EN; i++) {
					let item = {
						type: i
					}
					if (i == this.entities.Metadata.GameLanguage.CN) {
						item.name = "简体中文"
					} else if (i == this.entities.Metadata.GameLanguage.EN) {
						item.name = "英文"
					}
					this.menuList.push(item);
				}
			},

			btnBack: function() {
				this.util.UiUtils.switchBackPage();
			},
			goSave() {
				console.log("=this.active==",this.active)
				this.dal.Setting.setSysLanguage(this.active)
			},
			handleCheck(e) {
				console.log("=e==",e)
				this.active = parseInt(e)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.language {
		width: 100%;
		background-color: #FFFFFF;

		.save-txt {
			font-size: 30rpx;
			font-family: PingFang SC, PingFang SC-Bold;
			font-weight: 700;
			color: #4c72ef;
		}

		.list-item {
			width: calc(100% - 70rpx);
			margin: 0 auto;
			height: 107rpx;
			border-bottom: 1rpx solid #ebebeb;
			display: flex;
			align-items: center;
			justify-content: space-between;

			text {
				font-size: 34rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 600;
				color: #121212;
			}

		   .checked-icon{
			   width: 24rpx;
			   height: 28rpx;
			   margin-left: auto;
		   }
		}
	}
</style>
