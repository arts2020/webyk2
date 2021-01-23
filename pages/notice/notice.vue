<template>
	<view class="notice-index">
		<view @tap="btnBack()" class="safe-header" :style="{marginTop:topheight + 'px'}">
			<image src="../../static/image/login/left.svg" />
			<text>公告</text>
		</view>
		<image class="visit-img" src="../../static/image/safe/notice.svg" />
	    <view class="visit-tabs">
			<view class="tab-list" :class="[0 == currentIndex ? 'active' : '']" :items="0" :current="currentIndex" @click="onClickItem(0)">
				<text>活动公告</text>
				<view :class="[0 == currentIndex ? 'henxian' : '']"  :items="0" :current="currentIndex"></view>
			</view>
			<view class="tab-list" :class="[1 == currentIndex ? 'active' : '']" :items="1" :current="currentIndex" @click="onClickItem(1)">
				<text>通知</text>
				<view :class="[1 == currentIndex ? 'henxian' : '']" :items="1" :current="currentIndex"></view>
			</view>
		</view>
		<view class="notice-content">
			<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px'}">
				<view class="content-list" v-for="(item,index) in m_items"  :key="index" @click="toDetail(item)" v-if="haveData">
					<view class="list">
						<image src="../../static/image/notice/notice-btc.svg" />
						<view class="title">
							<text>{{item.title}}</text>
							<view>{{item.shortdesc}}</view>
						</view>
					</view>
					<view class="date">{{item.created_at}}</view>
				</view>
				<noData v-if="noData"></noData>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import noData from '@/components/no-data/no-data.vue';
	export default {
		components: {
			noData
		},
		created() {
			console.log("==this.m_type=",this.m_type)
			this.currentIndex = this.m_type;
			this.dal.Common.onGetNotice(this.currentIndex);
			this.util.EventUtils.addEventListenerCustom(this.dal.Common.evtGetNotice, this.onGetNotice);
		},
		
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Common.evtGetNotice, this.onGetNotice);
		},
		
		data(){
			return{
				m_type:0,
				topheight:0,
				currentIndex:0,
				scrollHeight:'',
				m_items:[],
				icons : [ "../../static/image/notice/notice-btc.svg",
				"../../static/image/notice/notice-online.svg",
				"../../static/image/notice/notice-prodect.svg",
				"../../static/image/notice/notice-shuangshiyi.svg",
				"../../static/image/notice/notice-suanli.svg"],
				haveData:true,
				noData:false
			}
		},
		onLoad(option) {
			if(option && option.query){
				var data = JSON.parse(option.query);
				console.log("==data=",data)
				this.m_type = data.type;//0 通知，1 公告
			}
		},
		methods: {
			onClickItem(idx){
				this.currentIndex = idx
				this.dal.Common.onGetNotice(this.currentIndex);
			},
			
			btnBack:function(){
				this.util.UiUtils.switchBackPage();
			},
			//通知/公告
			onGetNotice:function(data){
				this.m_notices = this.dal.Common.getNoitces();
				this.m_items = [];
				let idx = 0;
				for(let i = 0; i < this.m_notices.length; i++){
					let item = this.m_notices[i];
					if(idx >= 5){
						idx = 0;
					}else{
						idx = idx + 1;
					}
					item.imgsrc = this.icons[idx];
					this.m_items.push(item)
				}
				if(this.m_items.length == 0){
					this.haveData = false
						this.noData = true
					}else{
						this.noData = false
						this.haveData = true
					}
			},
			toDetail(item){
				this.$openPage({name: "notice-detail",query: {id:item.id}})
			}
		},
		onShow() {
			let _this = this;
			//获取高度
			uni.getSystemInfo({
				success(res) {
					_this.topheight = res.statusBarHeight;
					_this.scrollHeight = res.windowHeight-114-res.statusBarHeight;
				}
			});
		}
	}
</script>

<style lang="scss">
	@import "notice.scss"
</style>
