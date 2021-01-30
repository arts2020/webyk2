<template>
	<view class="agreement">
		<uni-nav-bar :status="true" :fixed="true" left-icon="back" title="用户协议" @clickLeft="goBack"></uni-nav-bar>
		<rich-text :nodes="content" v-if="content"></rich-text>
		<noData ref="nodata" v-else/>
	</view>
</template>

<script>
	import noData from '@/components/no-data/no-data.vue'
	export default {
		name:"agreement",
		components:{
			noData
		},
		onShow() {
			this.dal.Setting.onGetUserAgree();
		},
		created() {
			this.util.EventUtils.addEventListenerCustom(this.dal.Setting.evtGetAgreement, this.handleAgreement);
		},
		destroyed() {
			this.util.EventUtils.addEventListenerCustom(this.dal.Setting.evtGetAgreement, this.handleAgreement);
		},
		data() {
			return {
				content:""
			};
		},
		methods:{
			goBack(){
				this.util.UiUtils.switchBackPage();
			},
			handleAgreement(data){
				this.content = data.data;
			}
		}
	}
</script>

<style lang="scss" scoped>
.agreement{
	width: 100%;
}
</style>
