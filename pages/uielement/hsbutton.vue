<!-- 
 btntype : String   '0'为白 '1'为蓝 '2'为红 '3'为绿
 
 -->

<template>
	<view class="button-base-container" :style="getbuttonSizeStyle" >
		<view :style="getBGStyle"  class="btn-base-set" v-on:click="onClick" v-on:touchcancel="onCancle" v-on:touchstart="onStart" v-on:touchend="onEnd">
			<slot name="center"/>
			<text :style="getFoneStyle" v-if="textstr.length>0">{{textstr}}</text>
		</view>
	</view>
	
</template>

<script>
	export default {
		components: {
		},
		
		props:{
			/* 0为白 1为蓝 2为红 3为绿色*/
			btntype : { 
				type : String,
				default : '0',
			},
			fontsize : {
				type : String,
				default : "16px",
			},
			/* 按钮文字 */
			textstr : {
				type : String,
				default : "",
			},
			
			enable :{
				type : Boolean,
				default : true,
			},
			
			/* sizetype从小到大分五个档  0-4 若不设此值则要给此组件宽高过来*/
			sizetype :{
				type : String,
				default : '-1',
			},
		},
		
		computed: {
			getbuttonSizeStyle(){
				var widthset = '';
				var heightset = '';
				
				/* if(this.bwidth.length != 0 && this.bheight.length != 0){
					widthset = "width : " + this.bwidth + ";";
					heightset = "height : " + this.bheight + ";";
				}else */
				var sizeset = parseInt(this.sizetype);
				if(sizeset >= 0 && sizeset <5){
					var sizewlist = ['10vw' , '20vw' ,'30vw' ,'50vw' ,'80vw'];
					heightset = "height : 30px;";
					widthset = "width : " + sizewlist[sizeset] + ";";
				}
				return widthset + heightset;
			},
			getBGStyle() {
				var bgcolorstr = "";
				var btype = parseInt(this.btntype);
				if(btype > 3 ){
					btype = 3;
				}
				if(!this.enable){
					bgcolorstr = this.m_disenablecolor[btype];
				}else if(this.m_isPress){
					bgcolorstr = this.m_presscolor[btype]
				}else{
					bgcolorstr = this.m_normalcolor[btype]
				}
				var colorset = "background-color:" + bgcolorstr + ";"; /* */
				
				var borderset = '';
				if(btype == 0){
					borderset = "border: 1px solid rgba(0, 0, 0, 0.38) ;";
				}
				
				var shadowset = 'box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.08);';
				
				
				// uni.cclog("==456456456===" , btype)
				return colorset + borderset + shadowset;
			},
			getFoneStyle(){
				var textcolorstr = '';
				var btype = parseInt(this.btntype);
				if(btype > 2 ){
					btype = 2;
				}
				if(!this.enable){
					textcolorstr = this.m_textdisenablecolor[btype];
				}else if(this.m_isPress){
					textcolorstr = this.m_textpresscolor[btype];
				}else{
					textcolorstr = this.m_textnormalcolor[btype];
				}
				var colorset = "color:" + textcolorstr + ";";
				
				var sizeset = "font-size : " + this.fontsize + ";";
				return colorset + sizeset;
			},
		},
		
		data() {
			return {
				m_isPress : false,
				m_normalcolor : ["#fff" , "#007dff" , "#dc1717" , "#21cb21"],
				m_presscolor : ["#c8c8c8" , '#055ebb' , '#ab1717' , "#21cb21"],
				m_disenablecolor : ['#c8c8c8' , '#c8c8c8' , '#c8c8c8', '#c8c8c8'],
				m_textnormalcolor : ['#282828' , '#eeeeee' , '#eeeeee', '#eeeeee'],
				m_textpresscolor : ['#282828' , '#eeeeee' , '#eeeeee', '#eeeeee'],
				m_textdisenablecolor : ['#eeeeee' , '#eeeeee' , '#eeeeee', '#eeeeee'],
			}
		},
		methods: {
			onClick(e) {
				if(!this.enable){
					return ;
				}
				this.m_isPress = false;
				this.$emit('click');
			},
			onCancle(e) {
				if(!this.enable){
					return ;
				}
				this.m_isPress = false;
			},
			onStart(e) {
				if(!this.enable){
					return ;
				}
				this.m_isPress = true;
			},
			onEnd(e) {
				if(!this.enable){
					return ;
				}
				this.m_isPress = false;
			}
			
			
		},
	}	
	
</script>

<style lang="scss">
	.button-base-container{
		width: 100%;
		height: 100%;
	}
	.btn-base-set{
		width: 100%;
		height: 100%;
		border-radius: 5px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		
		/* background-color: aqua; */
	}
</style>
