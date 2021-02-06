<template>
	<view class="help-index">
        <uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" :title="title" @clickLeft="btnBack"></uni-nav-bar>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<view class="hot-question">
				<view class="title">{{topic1}}</view>
				<view class="question-item" v-for="(item,index) in hotList" :key="index" @tap="goCheck(index,1)">
					<view class="question">
						<view class="dot"></view>
						<text>{{item.question}}</text>
					</view>
					<view class="answer"></view>
				</view>
			</view>
			<view class="question-kind">
				<view class="title">{{topic2}}</view>
				<view class="question-item" v-for="(item,index) in typeList" :key="index" @tap="goCheck(index,2)">
					<view class="question">
						<view class="dot"></view>
						<text>{{item.kindTitle}}</text>
					</view>
					<image src="../../../static/image/mine/arrow-left.svg" mode=""></image>
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
				title:"",
				topic1:"",
				topic2:"",
				scrollHeight:'',				
				hotList:[],
				typeList:[],
			}
		},
		onLoad() {
			this.title = uni.getLocalStr("help_title");
			this.topic1 = uni.getLocalStr("help_title_1");
			this.topic2 = uni.getLocalStr("help_title_2");
			this.hotList = uni.getLocalStr("help_hotQuestion");
			this.typeList = uni.getLocalStr("help_question_kind");
		},
		methods: {
			btnBack:function(){
				this.$openPage({name: "mine-mine",query: {}})
			},
			goCheck(index,type){
				this.$openPage({name: "question-answer",query: {index:index,type:type}})
			},
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
