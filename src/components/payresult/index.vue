<template>
	<div class="wrap pay-result" v-title="'支付结果'">
       <!-- <div class="header">
			<span>支付结果</span>
			<a href="#" class="icon-close"></a>
		</div> -->
		<div class="pay-success">
			<img class="success-img" src="../../assets/images/pay_success.png" alt="">
			<p class="success-text">您的{{payType}}申请已提交，最慢于30分钟时内更新{{payType}}结果</p>
			<p class="success-tips">{{second}}s后返回</p>
		</div>
	
		
	</div>
</template>
<script>
const params = Qs();
export default {
	
  data () {
    return {
    	timer: null,
    	second: 3,
      payType: '还款'
    };
  },
  methods: {
    // 
  },
  mounted() {
    if(params.requestSource == "A1" && params.bizType == "B2"){
      this.payType = "续期"
    }
  	this.timer = setInterval(()=>{
  		this.second--;
  		if(this.second < 1){
        if(params.channel == "weixin") {
          window.location.href = params.url + '?openId=' + params.deviceId;
        }else {
          if(isiOS){
            closeThisPage();
          }else{
              nativeMethod.returnNativeMethod('4', 0, '', '');
          }
        }
  		}
  	}, 1000);
  },
  destroyed() {
  	clearInterval(this.timer);
  }
}
</script>
<style lang="less">



</style>
