<!-- 
 表格  
 用于显示表格信息，如VIP等级显示表格
 -->

<template>
	<view class="grid-table-container g-row-set">
		<view class="g-colunm-section" :style="getcolumntyle" v-for="(item , index) in getSortData" :key="index">		<!-- 行  -->
			<view class="g-caption g-cell-set g-border" :class="index==getSortData.length-1?'g-border-right':'' " :style="getItemstyle">
				<text class='text-title'>{{item.title}}</text>
			</view>
			<view class="g-cell-set g-content-cell g-border" :style="getItemstyle" :class="{'g-border-bottom':index2==item.data.length-1 ,
					'g-border-right':index==getSortData.length-1}" v-for="(gridcell , index2) in item.data" :key="index2">
				<text class='text-content'>{{gridcell}}</text>
			</view>
		</view>
	</view>
</template>


<script>
	export default {
		name:'gridtablepanel',
		
		data() {
			return {
				
			}
		},
		methods: {
			
		},
		computed: {
			getcolumntyle(){
				var strw = "width:" + 100/this.tinfo.length +"%;"
				return strw;
			},
			getItemstyle(){
				var strw = "width:100%;";
				var strh = "height:" + this.tcheight +";"
				var str = strw + strh;
				return str;
			},
			
			
			gettablecolumncount(){
				if(this.tinfo.length > 0){
					return this.tinfo[0].data.length + 1;
				}
				return 0;
			},
			
			getSortData() {
				/* var sortdataList = [];
				var datalengt = 0;
				
				for(var i = 0 ; i < this.tinfo.length ; i++){
					var datacell = this.tinfo[i];
					sortdataList.push({str:datacell.title , istitle:true, islastrow: i == this.tinfo.length-1});
					datalengt = datacell.data.length;
				}
				for(var i = 0 ; i < datalengt ; i++){	
					for(var j = 0 ; j < this.tinfo.length ; j++){	
						var datacell = this.tinfo[j];
						sortdataList.push({str:datacell.data[i] , istitle:false , islastcolumn  : i == datalengt-1, 
						islastrow: j == this.tinfo.length-1} );
					}
				} */
				return this.tinfo;  
			}
		},
		
		props: {
			tcheight: {
				type: String,
				default: "40px",
			},
			
			tinfo : {
				type : Array,
				default () {
					return [];
				}
			},
			
			
		},
	}
</script>

<style lang="scss">
	.grid-table-container{
		width: 100%;
		height: 100%;
		
		display: flex;
		border-collapse: collapse; 
	}
	.g-row-set{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	
	.g-colunm-section{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.g-cell-set{
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		
		box-sizing: border-box;
		border-collapse: collapse; 
	}
	.g-caption{
		background-color: $Color12;
	}
	.g-content-cell{
	}
	.text-title{
		font-size: 16px;
		color: $Color_font2;
	}
	.text-content{
		font-size: 16px;
		color: $Color_font2;
	}
	
	.g-border{
		border-top:1px solid $Color_font3;
		border-left:1px solid $Color_font3;
	}
	.g-border-right{
		border-right:1px solid $Color_font3;
	}
	.g-border-bottom{
		border-bottom:1px solid $Color_font3;
	}
	
</style>
