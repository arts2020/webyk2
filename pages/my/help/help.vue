<template>
	<view class="help-index">
        <uni-nav-bar background-color="#FAFBFF" :statusBar="true" :fixed="true" left-icon="back" title="帮助中心" @clickLeft="btnBack"></uni-nav-bar>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<view class="hot-question">
				<view class="title">常见问题</view>
				<view class="question-item">
					<view class="question">
						<view class="dot"></view>
						<text>转账不成功怎么办？</text>
					</view>
					<view class="answer"></view>
				</view>
				<view class="question-item">
					<view class="question">
						<view class="dot"></view>
						<text>为什么一定要备份助记词？</text>
					</view>
					<view class="answer"></view>
				</view>
				<view class="question-item">
					<view class="question">
						<view class="dot"></view>
						<text>忘记钱包密码怎么办？</text>
					</view>
					<view class="answer"></view>
				</view>
				<view class="question-item">
					<view class="question">
						<view class="dot"></view>
						<text>收不到币怎么办？</text>
					</view>
					<view class="answer"></view>
				</view>
			</view>
			<view class="question-kind">
				<view class="title">问题分类</view>
				<view class="question-item" v-for="(item,index) in typeList" :key="index" @tap="goCheck(index)">
					<view class="question">
						<view class="dot"></view>
						<text>{{item}}</text>
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
				scrollHeight:'',
				typeList:['快速入门','初阶教程','钱包管理','备份&恢复','代币管理','转账收款'],
				incomeList:[
					{
						name:'收益如何产生',
						incomeContent:false,
						rightImg:'../../../static/image/mine/arrow-left.svg'
					},
					{
						name:'收益什么时候发放',
						incomeContent:false,
						rightImg:'../../../static/image/mine/arrow-left.svg'
					},
					{
						name:'收益产生的是什么',
						incomeContent:false,
						rightImg:'../../../static/image/mine/arrow-left.svg'
					},
					{
						name:'预计每日收益如何计算',
						incomeContent:false,
						rightImg:'../../../static/image/mine/arrow-left.svg'
					},
					{
						name:'预计年收益回报比如何计算',
						incomeContent:false,
						rightImg:'../../../static/image/mine/arrow-left.svg'
					},
					{
						name:'可以退还本金吗',
						incomeContent:false,
						rightImg:'../../../static/image/mine/arrow-left.svg'
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
			goCheck(index){
				this.$openPage({name: "question-answer",query: {index:index}})
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
