<template>
	<div class="wrap pay-way" v-title="'还款方式'">
       <!-- <div class="header">
			<a href="#" class="icon-back"></a>
			<span>还款方式</span>
		</div> -->
		<div class="text-6">
			支付金额
		</div>
		<div class="money-num">
			<em>￥</em>
			<span v-cloak>{{(params.repayMoney/100).toFixed(2)}}</span>
			<em>元</em>
		</div>
		<div class="bank-pay clearfix">
		    <img class="bank-logo" :src="imgSrc"  alt="">
			<span v-cloak>{{defaultBank.bankName}} ({{lastNum}})</span>
			<!-- <a href="javascript:;" @click="changeBank()" class="new-bank">使用新卡支付</a> -->
		</div>
		
		<div class="a-btn">
			<a href="javascript:;" @click="passwordModal()" :class="{redColor:isiOS261}">立即支付</a>
		</div>
		<div class="password-modal" v-show="showModal">
			<div class="password-body">
				<div class="password-title" :class="{'redColor':isiOS261}">
					<span>{{checkPayPwd?'请输入交易密码':'设置交易密码'}}</span>
					<em @click="passwordModal()">关闭</em>
				</div>
				<div class="password-con clearfix">
					<ul class="password-dot clearfix">
						<li v-for="i in 6" :class="{active: i <= arr.length}">
							<i>.</i>
						</li>
					</ul>
					<a v-if="isiOS263" href="javascript:;" @click="forgetPassword()" class="forget-password">忘记交易密码？</a>
				</div>
			</div>
			<div class="keyboard" v-show="keyboardStatus">
				<ul class="board-num clearfix">
					<li @touchstart="keydown(1)">
						<span>1</span>
					</li>
					<li @touchstart="keydown(2)">
						<span>2</span>
					</li>
					<li @touchstart="keydown(3)">
						<span>3</span>
					</li>
					<li @touchstart="keydown(4)">
						<span>4</span>
					</li>
					<li @touchstart="keydown(5)">
						<span>5</span>
					</li>
					<li @touchstart="keydown(6)">
						<span>6</span>
					</li>
					<li @touchstart="keydown(7)">
						<span>7</span>
					</li>
					<li @touchstart="keydown(8)">
						<span>8</span>
					</li>
					<li @touchstart="keydown(9)">
						<span>9</span>
					</li>
					<li @click="passwordModal()">
						<span>关闭</span>
					</li>
					<li @touchstart="keydown(0)">
						<span>0</span>
					</li>
					<li @touchstart="deleteNum()">
                        <span>删除</span>
						<!-- <img class="keyboard-delete" src="../../assets/images/keyboard-delete.jpg"  alt="删除"/> -->
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
import Vue from 'vue';
import toast from '../common/toast/toast';
Vue.use(toast);
const params = Qs();
const bankIcons ={
	default:require('../../assets/images/bankLogo/default.png'),
	ICBC:require('../../assets/images/bankLogo/工商银行.png'),
	ABC:require('../../assets/images/bankLogo/农业银行.png'),
	CCB:require('../../assets/images/bankLogo/建设银行.png'),
	BCOM:require('../../assets/images/bankLogo/交通银行.png'),
	BOB:require('../../assets/images/bankLogo/北京银行.png'),
	BOC:require('../../assets/images/bankLogo/中国银行.png'),
	CEB:require('../../assets/images/bankLogo/光大银行.png'),
	CIB:require('../../assets/images/bankLogo/兴业银行.png'),
	CITIC:require('../../assets/images/bankLogo/中信银行.png'),
	CMB:require('../../assets/images/bankLogo/招商银行.png'),
	CMBC:require('../../assets/images/bankLogo/民生银行.png'),
	GDB:require('../../assets/images/bankLogo/广发银行.png'),
	HXB:require('../../assets/images/bankLogo/华夏银行.png'),
	PAB:require('../../assets/images/bankLogo/平安银行.png'),
	PSBC:require('../../assets/images/bankLogo/邮政银行.png'),
	SHB:require('../../assets/images/bankLogo/上海银行.png'),
	SPDB:require('../../assets/images/bankLogo/浦发银行.png')
}
export default {
    components: {
        toast
    },
    data () {
        return {
            params: params,
        	passwordStatus:false,
        	showModal:false,
        	arr: [],
        	keyboardStatus:true,
        	passwordTimer:null,

        	data: {},
        	loading: false,
        	checkPayPwd: true,
        	defaultBank: {},
            lastNum: '',
            isiOS263: isiOS ? params.appVersion >= '2.6.3' : true,
            isiOS261: (isiOS && params.appVersion >'2.6.1')? true : false,
        };
    },
    computed: {
    	imgSrc(){
    		return bankIcons[this.defaultBank.bankNewCode] || bankIcons.default;
    	}
    },
    methods: {
    	forgetPassword(){
            if(params.channel == "weixin") {
                window.location.href = params.url + 'getTransactionPassword';
            }else {
                if(isiOS){
                    forgetPwd();
                }else{
                    nativeMethod.forgetPwd();
                }
            }
    	},
    	changeBank() {
    		this.$router.push('bankChange');
    	},
        passwordModal() {
            if(this.loading){
                return;
            }
        	this.showModal = !this.showModal;
        	this.arr = [];
        },
        keydown (i) {
        	if(this.arr.length < 6){
          		this.arr.push(i)
        	}
        	if(this.arr.length == 6){
        		this.showModal = !this.showModal;
                if(this.loading){
                    return;
                }
                this.loading = true;// 如果再执行就不继续请求了
        		if(this.checkPayPwd){
        			this.pay();
        		}else{
        			this.setPwd();
        		}
    		}
        },
        deleteNum() {
        	this.arr.pop();
        },
        setPwd(){
        	this.$http.post('/createPayPwd', {
        		userId: params.userId,
        		payPwd: this.arr.join(''),
                "userId": params.userId,
        		"mobile": params.mobile,
                "deviceId": params.deviceId
        	}).then(res => {
                this.loading = false;
        		if(res.responseCode == '1000'){
        			this.$toast({
                        message : "设置成功！",
                        duration : 2000
                    });
        		}else{
        			this.$toast({
                        message : res.responseMsg || "设置失败！",
                        duration : 2000
                    });
        		}
        	}, err => {
                this.loading = false;
                this.$toast({
                    message : err.responseMsg || "设置失败！",
                    duration : 2000
                });
            });
        },
        pay(){
            this.$http.post('/confirmPay', {
                "amount": params.couponMoney,
                "bizId": params.bizId,
                "couponId": params.couponId,
                "exextData": "",
                "payPwd": this.arr.join(''),
                "userId": params.userId,
                "bizType": params.bizType,
                "withholdingAmount": params.repayMoney,
                "mobile": params.mobile,
                "requestSource":params.requestSource,
                "deviceId": params.deviceId,
                "expireDate": params.createTime,
                /*"sign": params.sign ? params.sign:''*/
            }).then(res => {
            	this.arr = [];
                if(res.responseCode == '1000' || res.responseCode == '2000'){
                    this.$router.push('payResult');
                }else{
                    this.loading = false;
                	this.$toast({
                        message :  res.responseMsg || "支付失败！",
                        duration : 2000
                    });
                }
            }, err => {
                this.loading = false;
                this.$toast({
                    message : err.responseMsg || "支付失败！",
                    duration : 2000
                });
            });
        }
    },
    mounted() {
    	this.$http.post('/user',{
                 "userId": params.userId,
                 "mobile": params.mobile,
                 "deviceId": params.deviceId,
        }).then(res=>{
			if(res.responseCode == '1000'){
				this.data = res.data;
				this.checkPayPwd = res.data.checkPayPwd;
				this.defaultBank = res.data.userCardList[0];
            let no = this.defaultBank.card_no;
            this.lastNum = no && no.length > 4 ? no.substr(no.length - 4, no.length) : '';
			}else{
                this.$toast({
                    message : res.msg || "系统繁忙",
                    duration : 2000
                });
            }
		}, err => {
            this.$toast({
                message : err.msg || "系统繁忙",
                duration : 2000
            });
        });
    },
    destroyed() {
    	clearTimeout(this.passwordTimer);
    }
}
</script>
<style lang="less">



</style>
