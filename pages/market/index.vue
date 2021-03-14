<template>
	<view class="market-index">
		<bar ref="bar"></bar>
		<view class="nav-menu">
			<view :class="active==0?'menu active-index':'menu'" @tap="updateMenu(0)">{{mark_index_title_2}}</view>
			<view :class="active==1?'menu active-index':'menu'" @tap="updateMenu(1)">{{mark_index_title_1}}</view>

			<!-- <uni-icons v-if="active==1" type="search" class="search-icon" size="20" color="#000000" @tap="goAdd"></uni-icons> -->
		</view>
		<!-- 行情  -->
		<Quotation class="quotation-content" v-if="active==0"/>
				
		<!-- 交易 -->
		<web-view ref="scope" v-else  :webview-styles="webviewStyles" src="http://119.8.55.19:3000"></web-view>
	</view>
</template>

<script>
	import Bar from '@/components/uni-status-bar/uni-status-bar.vue';
	import Quotation from './quotation/quotation.vue'
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	export default {
		components: {
			Bar,
			Quotation,
			uniIcons
		},
		onReady() {
			this.topHeight = uni.getSystemInfoSync().statusBarHeight + 44;
			this.webChild= this.$mp.page.$getAppWebview().children()[0];
			if(this.webChild){
				this.webChild.setStyle({
					top: this.topHeight,
					height:this.scrollHeight
				})
			}
			
		},
		onLoad() {
			this.initWord()
		},
		created() {
			this.util.EventUtils.addEventListenerCustom(this.dal.Setting.evtGetLanguage, this.initWord);
		},
		destroyed() {
			this.util.EventUtils.removeEventCustom(this.dal.Setting.evtGetLanguage, this.initWord);
		},
		onShow() {
			//获取高度
			uni.getSystemInfo({
				success: (res) => {
					this.scrollHeight = res.windowHeight - res.statusBarHeight - 54;
				}
			});
			this.onRefersh();
			this.initWord();
		},
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#FF6666',
					},
				},
				active: 0,
				isRefersh: "",
				scrollHeight: 0,
				assetArr: [{
						chaintype: 2,
						img: "btc.png",
						name: "BTC",
						alias: "Btcoin"
					},
					{
						chaintype: 3,
						img: "fil.png",
						name: "ATOM",
						alias: "Cosmos"
					},
				],
				coin_L: 0,
				coin_R: 0,
				output_num: "",
				input_num: "",
			}
		},
		methods: {
			initWord() {
				console.log("========market====index=========")
				//获取所有中文文字  mark_trans_str1
				this.mark_index_title_1 = this.getLocalStr("mark_index_title_1");
				this.mark_index_title_2 = this.getLocalStr("mark_index_title_2");
				this.mark_trans_str1 = this.getLocalStr("mark_trans_str1");
				this.mark_trans_str2 = this.getLocalStr("mark_trans_str2");
				this.mark_trans_str3 = this.getLocalStr("mark_trans_str3");
				this.mark_trans_str4 = this.getLocalStr("mark_trans_str4");
				this.btnstring_change = this.getLocalStr("btnstring_change");
			},
			onRefersh() {
				// 交易那里的  重新获取获取所有资产

			},
			goAdd() {
				this.$openPage({
					name: "quotation-search"
				});
			},
			swiperChange(e) {
				this.active = e.detail.current;
			},
			updateMenu(val) {
				this.active = val;
				if(val==0){return;}
				this.$nextTick(()=>{
					this.webChild= this.$mp.page.$getAppWebview().children()[0];
					if(this.webChild){
						this.webChild.setStyle({
							top: this.topHeight,
							height:this.scrollHeight
						})
					}				
				})				
			},
			pickerChangeLeft(e) {
				this.coin_L = e.target.value
			},
			pickerChangeRight(e) {
				this.coin_R = e.target.value
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'index.scss'
</style>
