<template>
	<view class="selecttab-container">
		<view class="main-section" @click.stop="onClickArrow">
			<text>{{getTextStr}}</text>
			<HsIcon v-if="showarrow" type="arrow_down_gray" size='18px' />
		</view>
		
		<view class="tab-section" v-if="m_isShowTab">
			<view class="tab-cell" v-for="(item , index) in infolist" :key='index'  @click.stop="onClickCell(index , item)" >
				<text>{{item.name}}</text>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		
	    data() {
	    	return {
	    		m_isShowTab: false,
				currentIndex: this.selectindex,
	    	}
	    },
		
		props: {
			selectindex: {
				type: Number,
				default: 0,
			},
			infolist : {
				type: Array,
				default(){
					return [];
				},
			},
			showarrow: {
				type: Boolean,
				default: true,
			},
			
			fixedString : {
				type: String,
				default: '',
			},
		},
		
		computed: {
			getTextStr(){
				var str = '';
				if(this.fixedString.length > 0){
					str = this.fixedString;
				}else if(this.currentIndex >= 0 && this.currentIndex < this.infolist.length){
					str = this.infolist[this.currentIndex].name;
				}
				return str
			},
		},
		
		methods: {
			onClickArrow(e) {
				this.m_isShowTab = !this.m_isShowTab;
			},
			onClickCell(index , item){
				this.m_isShowTab = false;
				this.currentIndex = index;
				this.$emit("selectedtab" , item);
			},
			hideTab(){
				this.m_isShowTab = false;
			}
		},
		
	}
</script>

<style lang="scss">
	.selecttab-container{
		position: relative;
		width: 100%;
		height: 100%;
		background-color: white;
	}
	
	.main-section{
		width: 100%;
		height: 100%;
		
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		
		text{
			font-size: 16px;
			color: $Color_font4;
			margin: 0px 12px;
		}
	}
	
	.tab-section{
		position: absolute;
		z-index: 200;
		width: 100%;
		background-color: $Color_bg1;
		
		border-radius: 3px;
		box-shadow: 2px 2px 5px #ADADAD;
		display: flex;
		flex-direction: column;
		
		
		.tab-cell{
			width: 100%;
			height: 40px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background-color: white;
			margin-bottom: 1px;
			text{
				font-size: 16px;
			}
			
		}
		
	}
	
	
</style>
