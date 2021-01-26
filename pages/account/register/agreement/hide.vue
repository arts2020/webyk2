<template>
	<view class="agreement-index">
		<bar ref="bar"></bar>
		<view @tap="btnBack()" class="safe-header">
			<image src="../../../../static/image/login/left.svg" />
			<text>隐私条款</text>
		</view>
		<scroll-view class="uni-content" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
			<view class="agreement-content">
				<view class="content">我们尊重用户和网站访问者（统称为“您”）的隐私，并承诺尽力保护您的在线隐私。本隐私政策概述了珀芯POO管理、
				收集、维护和处理用户个人数据的流程。我们可能不时更新本隐私政策。我们会在此页面上发布新的隐私政策来通知您任何变更。
				我们建议您定期查看此隐私政策来了解变更。本隐私政策的变更自其发布在此网页之时生效。</view>
				<view class="title">1. 信息收集</view>
				<view class="content">我们可能会使用您的个人数据来提供和改进珀芯POOL向您提供的矿机共享服务（“服务”），
				并改善您在本网站上的使用体验。“个人数据”是指与被识别或可识别的人有关的任何信息。当您为使用服务创建帐户时，
				我们会收集您提供给我们的信息。我们还使用各种技术来收集和存储信息，包括Cookie、像素标签、本地存储
				（如浏览器网络存储或应用程序数据缓存、数据库和服务器日志）。您使用服务或本网站，即表示您同意我们按照本隐私政策收集和使用信息。
				除非本隐私政策另有规定，否则本隐私政策中使用的术语与我们的服务协议具有相同的含义。</view>
				<view class="title">1.1 注册</view>
				<view class="content">创建账户时，需要您提供数据，包括您的电子邮箱，电话，密码或其他信息。
				如果您拒绝提供上述信息，我们将无法向您提供服务。</view>
				<view class="title">1.2 支付信息</view>
				<view class="content">您的支付信息将发送至我们的第三方支付处理商，您的使用视为授权我们可以存储您的加密钱包地址，
				我们可以通过我们的第三方支付处理商访问并保留用户信息。</view>
				<view class="title">1.3 日志信息</view>
				<view class="content">珀芯POOL会在您访问我们的网站和登录您的帐户时收集您的浏览器发送的信息（“日志数据”）。
				此日志数据可能包括以下信息：您的计算机的互联网协议（“IP”）地址、浏览器类型、浏览器版本、您访问的服务的页面、
				访问时间和日期、在这些页面上花费的时间和其他统计数据。此外，我们可能会使用Google Analytics等第三方服务来收集、
				监控和分析此类信息，以提升我们服务的功能性。这些第三方服务提供商有自己的隐私政策来说明他们如何使用此类信息。
				这些第三方服务提供商只能在代表我们执行任务所需时查看使用您的个人数据。</view>
				<view class="title">1.4 我们如何使用您的信息</view>
				<view class="content">我们可能会使用您提供的个人信息用于下列目的：
				（1）向您展示我们的网站及其内容;;
				（2）将您识别为我们系统中的用户;;
				（3）处理您的订单;;
				（4）提供客户服务;;
				（5）回应您的要求;
				（6）为您提供产品更新;
				（7）改善我们的网站;
				（8）发送与我们产品相关的新闻通讯，调查，优惠和其他宣传材料;
				（9）与您沟通;
				（10）管理风险并保护本网站，我们的服务和您免受欺诈;
				（11）遵守所有适用的法律和法规，并执行本网站和珀芯POOL服务协议;
				（12）其他征得您同意的目的。</view>
				<view class="title">1.5 关于Cookie的信息</view>
				<view class="content">为了使您获得更好的网站访问体验，我们使用“Cookie”来允许本网站识别您的浏览器并存储用户偏好和其他信息。
				如果您的浏览器或浏览器附加服务允许，您可修改对Cookie的接受程度或拒绝我们的Cookie。</view>
				<view class="title">2. 第三方服务提供商</view>
				<view class="content">我们可能会聘请第三方公司为我提供业务相关服务。这些第三方只能在为我们提供服务的期间访问您的个人数据，
				并且有义务不得透露或将其用于任何其他目的。但我们向三方服务商提供您个人数据的行为，不视为我们对三方服务商的用户信息
				侵权或隐私侵权行为承担任何法律责任。</view>
				<view class="title">3. 信息安全</view>
				<view class="content">虽然我们致力于保护我们的网站和服务，但您有责任保护和维护您的个人信息安全，并验证我们维护的有关您的个
				人信息是否准确和最新。您必须防止未经授权访问您的帐户。使用共享计算机时请务必注销，并且不要向未经授权的人员披露您的帐户密码和
				任何其他帐户注册信息。然而，没有一个通过因特网传输的方法或电子存储方法是100％安全的。因此，在我们尽力保护您的个人信息的同时，
				我们无法保证其绝对的安全性。我们无法保证您传输到我们网站和/或通过我们的服务的个人信息的安全性。任何个人信息的传输均由您自行
				承担风险。</view>
				<view class="title">4. 国际数据传输</view>
				<view class="content">通过提交您的信息，您同意您的信息（包括个人数据）可能会传输和保存到您所在国家/地区管辖范围之外的计算机
				和系统。若发生该等传输，我们会尽力确保您的信息得到和您所在国家/地区规定的程度基本一致的保护。但我们无法对该种保护行为所带来的
				结果承担任何法律责任。</view>
				<view class="title">5. 第三方链接</view>
				<view class="content">我们的服务可能包含链接指向非我们运营的第三方网站。如果您点击第三方链接，您将被引导至该第三方网站。
				本隐私政策不适用于其他第三方网站。我们强烈建议您查看所访问的网站的隐私政策。珀芯POOL无法管控任何第三方网站或服务的内
				容和隐私政策，也不承担任何责任。</view>
				<view class="title">6. 个人数据使用目的变更</view>
				<view class="content">如果我们决定将您的个人数据用于本隐私政策声明以外的任何其他目的，我们将进行通知并为您提供一个有效
				的退出途径，供您选择不让自己的个人数据用于本隐私政策规定外的其他目的。我们可能会向您发送有关新服务和新活动的电子邮件。
				您可以在我们发送的每封电子邮件中选择“取消订阅”功能来拒绝接收珀芯POOL的宣传性电子邮件。但是，您同意使用服务的用户应继续接收
				与服务相关的其他重要电子邮件。</view>
				<view class="title">7. 信息保存时间</view>
				<view class="content">除非适用法律法规有存留要求，我们只会在达成本政策所述目的所需的期限内保留和存储您的个人信息。
				在法律允许的情况下，我们可能会存储一定的个人信息用于备案或通过法律途径保障自身的权益。我们的信息存储行为均是按照法律、
				法规的要求来行使，我们不对信息存储的行为承担任何法律上的责任。</view>
				<view class="title">8. 如何了解，获取，更改或删除您的个人信息</view>
				<view class="content">如果您想确认我们正在处理您的数据，访问我们可能拥有的有关您的个人数据，更正我们收集的您的个人
				信息，或删除我们收集的您的个人信息，您可以使用本隐私政策规定的联系方式与我们联系。</view>
				<view class="title">9. 如何联系我们</view>
				<view class="content">如果您对本隐私政策有任何疑问，请与我们联系。</view>
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
		data() {
			return {
				scrollHeight: 0,
			}
		},
		onLoad() {
			
		},
		methods: {
			btnBack:function(){
				this.util.UiUtils.switchBackPage2();
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
	@import "agreement.scss"
</style>
