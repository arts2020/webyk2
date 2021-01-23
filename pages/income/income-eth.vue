<template>
	<view class="income-btc">
		<bar ref="bar"></bar>
		<view @tap="btnBack()" class="safe-header">
			<image src="../../static/image/login/left.svg" />
			<text>{{m_asset}}收益明细</text>
		</view>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<view class="btc-list" v-for="(item, index) in m_items"  :key="index" v-if="haveData">
				<view class="btc-title">
					<text>{{item.asset.toLocaleUpperCase()}}算力奖励</text>
					<view class="date">{{item.created_at}}</view>
				</view>
				<view class="btc-count">{{item.fee}}{{item.asset_unit.toLocaleUpperCase()}}</view>
			</view>
			<noData v-if="noData"></noData>
		</scroll-view>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	import noData from '@/components/no-data/no-data.vue';
	export default {
		components: {
			Bar,
			noData
		},
		created() {
			this.util.UiUtils.showLoading("")
			this.dal.Mine.onGetProfitList(this.m_asset.toLocaleLowerCase());
			this.util.EventUtils.addEventListenerCustom(this.dal.Mine.evtGetProfitList, this.onGetProfitList);
		},
		
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Mine.evtGetProfitList, this.onGetProfitList);
		},
		data(){
			return{
				scrollHeight:'',
				m_asset:"",
				m_items:[],
				haveData:true,
				noData:false
			}
		},
		onLoad(option) {
			if(option && option.query){
				var data = JSON.parse(option.query);
				console.log("==data=",data)
				this.m_asset = data.asset.toLocaleUpperCase();//0 通知，2 公告
			}
		},
		methods: {
			btnBack:function(){
				this.util.UiUtils.switchBackPage();
			},
			onGetProfitList:function(data){
				console.log("===eth====onGetProfitList=====",data)
				this.m_items = [];
				for(let i = 0 ; i < data.data.list.length;i++){
					let it = data.data.list[i];
					if(it.asset == "filecoin"){
						it.asset_unit = "fil"
					}else{
						it.asset_unit = it.asset
					}
					this.m_items.push(it)
					console.log("======data.data.list[i]=",data.data.list[i])
				}
				console.log("======th=",this.m_items)
				if(this.m_items.length == 0){
					this.haveData = false
						this.noData = true
					}else{
						this.noData = false
						this.haveData = true
					}
			}
		},
		onShow() {
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.scrollHeight = res.windowHeight - res.statusBarHeight -44;
				}
			});
		}
	}
</script>

<style lang="scss">
	@import "income-btc.scss"
</style>
