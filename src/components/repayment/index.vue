<template>
	<div class="wrap repayment">
       <div class="header">
			<a href="#" class="icon-back"></a>
			<span>还款</span>
			<a href="#" class="head-right">借款详情</a>
		</div>
		<div class="white-block clearfix">
			<div class="fl size14">
				待还金额
				<div class="overdue-help" @click="chargeTips()">
					<em class="grey">(含逾期费)</em>
					<img class="help-icon" src="../../assets/images/apply_help_icon.png" height="34" width="34" alt="">
				</div>
			</div>
			<span class="fr size14">1000元</span>
		</div>
		<div class="white-block clearfix">
			<div class="fl size14">
				已还金额
			</div>
			<span class="fr size14">100元</span>
		</div>
		<div class="white-block clearfix mgt10">
			<div class="fl size14">
				还款金额
			</div>
			<div class="pay-input">
				<input type="number" value="1000" max="999999">元
				<img class="edit-money" src="../../assets/images/edit_money.png" height="38" width="38" alt="">
			</div>
		</div>
		<div class="white-block clearfix">
			<span class="fl size14">优惠券</span>
			<a href="javasctipt:;"  @click = "showCoupon()" class="coupon fr" v-text="coupontext"></a>
		</div>
		<div class="actual-pay">
			实际需支付<span class="orange">1000</span>元
		</div>
		<div class="a-btn">
			<a href="javascript:;">立即还款</a>
			<!-- <a class="grey-bg" href="javascript:;">还款中...</a> -->
		</div>
		<a href="javascript:;" class="apply-renewal">
			资金紧张，申请续期
		</a>
		<div class="overdue-tips">
			您已逾期，无法申请续期
		</div>
		<div class="coupon-modal" v-show="couponStatus">
			<div class="coupon-con">
				<div class="coupon-close">
					<span @click="showCoupon()">关闭</span>
				</div>
				<dl class="usable">
	              <dt>可使用</dt>
	              <dd class="clearfix" @click = "used('5元')"><em>5元</em><p>(单笔借款满1000元可使用)</p></dd>
	              <dd class="clearfix" @click = "used('10元')"><em>10元</em><p>(单笔借款满2000元可使用)</p></dd>
	              <dd class="clearfix" @click = "used('15元')"><em>15元</em><p>(单笔借款满3000元可使用)</p></dd>
	            </dl>
	            <dl class="unusable">
	              <dt>不可使用</dt>
	              <dd class="clearfix"><em>10元</em><p>(单笔借款满2000元可使用)</p></dd>
	            </dl>
			</div>
		</div>
		<div class="overdue-modal" v-show="overdueStatus">
			<div class="overdue-con">
				<div class="overdue-line clearfix">
					<span class="fl">逾期费用：</span>
					<span class="fr">100元</span>
				</div>
				<div class="overdue-line clearfix">
					<span class="fl">费用公式：</span>
					<span class="fr">借款金额*2%*逾期天数</span>
				</div>
				<a class="overdue-close" href="javascript:;"  @click="chargeTips()">我知道了</a>
			</div>
		</div>
	</div>
</template>
<script>

export default {
	
  data () {
    return {
    	couponStatus:false,
    	overdueStatus:false,
    	coupontext:"当前有2张可用优惠券",
    };
  },
  methods: {
	showCoupon(){
		this.couponStatus=!this.couponStatus;
	},
	used(num){
		this.coupontext = num;
		this.couponStatus=!this.couponStatus;

	},
	chargeTips(){
		this.overdueStatus = !this.overdueStatus;
	}
  	
  }
}
</script>
<style lang="less">



</style>
