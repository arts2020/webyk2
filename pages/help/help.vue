<template>
	<view class="help-index">
		<bar ref="bar"></bar>
		<view @tap="btnBack()" class="safe-header">
			<image src="../../static/image/login/left.svg" />
			<text>帮助中心</text>
		</view>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<view class="help-suanli">
				<view class="help-title">算力</view>
				<view class="mine-type">
					<view class="type-list" v-for="(item,index) in typeList" :key="index">
						<view class="mineList">
							<view class="list-title">•&nbsp{{item.name}}？</view>
							<image class="right-icon" :src="item.rightIcon" @click="changeContent(index)" />
						</view>
						<view class="type-content" v-show="item.showContent">
							资产中权益资产的预期回报率是特别高的，会吸引海外资金的流入。
							因此我们认为，美元在未来一个季度的贬值趋势，是比较利好于A股权益市场资产的。 
							中期来看，注意防范美国经济恢复对中国权益市场的冲击
						</view>
					</view>
				</view>
			</view>
			<view class="jiange"></view>
			<view class="help-suanli">
				<view class="help-title">收益</view>
				<view class="mine-type">
					<view class="type-list" v-for="(item,index) in incomeList" :key="index">
						<view class="mineList">
							<view class="list-title">•&nbsp{{item.name}}？</view>
							<image class="right-icon" :src="item.rightImg" @click="incomeContent(index)" />
						</view>
						<view class="type-content" v-show="item.incomeContent">
							资产中权益资产的预期回报率是特别高的，会吸引海外资金的流入。
							因此我们认为，美元在未来一个季度的贬值趋势，是比较利好于A股权益市场资产的。 
							中期来看，注意防范美国经济恢复对中国权益市场的冲击
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	export default {
		components: {
			Bar
		},
		data(){
			return{
				scrollHeight:'',
				typeList:[
					{
						name:'收益如何产生',
						showContent:true,
						rightIcon:'../../static/image/index/dowm.svg'
					},
					{
						name:'什么是算力',
						showContent:false,
						rightIcon:'../../static/image/mine/arrow-left.svg'
					},
					{
						name:'什么是算力到账日期',
						showContent:false,
						rightIcon:'../../static/image/mine/arrow-left.svg'
					}
				],
				incomeList:[
					{
						name:'收益如何产生',
						incomeContent:false,
						rightImg:'../../static/image/mine/arrow-left.svg'
					},
					{
						name:'收益什么时候发放',
						incomeContent:false,
						rightImg:'../../static/image/mine/arrow-left.svg'
					},
					{
						name:'收益产生的是什么',
						incomeContent:false,
						rightImg:'../../static/image/mine/arrow-left.svg'
					},
					{
						name:'预计每日收益如何计算',
						incomeContent:false,
						rightImg:'../../static/image/mine/arrow-left.svg'
					},
					{
						name:'预计年收益回报比如何计算',
						incomeContent:false,
						rightImg:'../../static/image/mine/arrow-left.svg'
					},
					{
						name:'可以退还本金吗',
						incomeContent:false,
						rightImg:'../../static/image/mine/arrow-left.svg'
					}
				],
			}
		},
		onLoad() {
			
		},
		methods: {
			btnBack:function(){
				this.$openPage({name: "mine-mine",query: {}})
			},
			changeContent(index){
				this.typeList[index].showContent = !this.typeList[index].showContent
				if(this.typeList[index].showContent == false){
					this.typeList[index].rightIcon = '../../static/image/mine/arrow-left.svg'
				}else if(this.typeList[index].showContent == true){
					this.typeList[index].rightIcon = '../../static/image/index/dowm.svg'
				}
			},
			incomeContent(index){
				this.incomeList[index].incomeContent = !this.incomeList[index].incomeContent
				if(this.incomeList[index].incomeContent == false){
					this.incomeList[index].rightImg = '../../static/image/mine/arrow-left.svg'
				}else{
					this.incomeList[index].rightImg = '../../static/image/index/dowm.svg'
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
	@import 'help.scss';
</style>
