<!-- 
用于多个view的滚动显示组件中的 显示第几个view的点点。 
原生组件不好用，难以控制 . app端不支持点击选择

所以自行封装了一个，支持比较局限
 -->



<template>
	<view class="dot-section">
		<view v-for="(item , index) in dataList" class='base-dots' :class="{'normal-dots':selectindex != index , 'selected-dots':selectindex == index}" :key="index" @click.stop="selectStyle(index)" />
	</view>
</template>


<script>
	export default {
		
		data() {
			return {
				selectindex : 0,
			}
		},
		
		props: {
			dataList : {
				type : Array,
				default () {
					return []
				}
			},
			currentindex: {
				type: Number,
				default: 0
			},
		},
		
		update(){
			uni.cclog("====update=====");
		},
		watch: {
			currentindex(newvalue){	/* 传进来的是下标 */
				this.selectindex = newvalue;
			}
		},
		
		methods: {
			selectStyle: function(index) {
				this.selectindex = index;
				uni.cclog("====selectStyle=1111====", index);
				this.$emit("selectTarget", index); /* 传出去的是下标 */
				
			},
		},
		
		
		
		
	}
	
</script>



<style>
	.dot-section{
		/* width: 100%; */
		/* height: 30rpx; */
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: center;
	}
	.base-dots {
		width: 12upx;
		height: 12upx;
		border-radius: 50%;
		background: #000000;
		opacity: .3;
		margin-left: 15upx;
		box-sizing: border-box;
	}
	.normal-dots {
		opacity: .3;
	}
	.selected-dots {
		opacity: .9;
		width: 13upx;
		height: 13upx;
	}
	
</style>
