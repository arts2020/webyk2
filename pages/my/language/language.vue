<template>
	<view class="language">
		<uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" :title="title_str34" @clickLeft="btnBack">
			<view class="save-txt" slot="right" @tap="goSave">{{btnstring_save}}</view>
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
		this.active = this.dal.Setting.getSysLanguage();
		  this.initword();
	      this.onRefresh();
			
		},
		data() {
			return {
				active:  this.entities.Metadata.GameLanguage.CN,
				menuList: []
			};
		},
		methods: {
			initword(){
				this.Language_CN = this.getLocalStr('Language_CN');
				this.Language_EN = this.getLocalStr('Language_EN');
				this.btnstring_save = this.getLocalStr("btnstring_save");
				this.title_str34 = this.getLocalStr("title_str34");
			},
			onRefresh: function() {
				this.menuList = [];
				for (let i = this.entities.Metadata.GameLanguage.CN; i <= this.entities.Metadata.GameLanguage.EN; i++) {
					let item = {
						type: i
					}
					if (i == this.entities.Metadata.GameLanguage.CN) {
						item.name = this.Language_CN
					} else if (i == this.entities.Metadata.GameLanguage.EN) {
						item.name = this.Language_EN
					}
					this.menuList.push(item);
				}
			},

			btnBack: function() {
				this.$openPage({name:"mine-mine",gotype:"switchTab"})
			},
			goSave() {
				console.log("=this.active==",this.active)
				this.dal.Setting.setSysLanguage(this.active)
				this.$openPage({name:"mine-mine",gotype:"reLaunch"});
				// #ifdef APP-PLUS
				plus.runtime.restart();
				// #endif
			},
			handleCheck(e) {
				//console.log("=e==",e)
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
