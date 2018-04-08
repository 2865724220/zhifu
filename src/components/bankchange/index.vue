<template>
	<div class="wrap bank-change" v-title="'更换银行卡'">
       <!-- <div class="header">
			<a href="#" class="icon-back"></a>
			<span>更换银行卡</span>
		</div> -->
		<div class="grey-tip">
			请绑定您本人的银行卡
		</div>
		<div class="from-wrapper">
			<div class="clearfix input-line">
				<span class="l">卡号</span>
				<input class="full-input" type="number" v-model="bankCardNo" placeholder="请输入您银行卡卡号"/>
			</div>
			<div class="clearfix input-line">
				<span class="l">卡类型</span>
				<div class="card-type">
					<img class="bank-logo" :src="imgSrc"  alt="logo">
					<span>{{bankName}}</span>
				</div>
			</div>
			<div class="clearfix input-line">
				<span class="l">手机号</span>
				<input class="full-input" type="number" v-model="mobile" placeholder="请输入您银行预留的手机号" />
			</div>
			<div class="clearfix input-line">
				<span class="l">验证码</span>
                <div class="security-input-w">
                    <input class="security-input" type="text" v-model="smsCode" placeholder="请输入验证码" />
                    <div class="sec-time"  @click="flag && sendSmsCode()"><i>{{codeText}}</i></div>
                </div>
			</div>
		</div>
		<div class="a-btn" :class="{'redColor':isiOS261}">
			<a href="javascript:;" @click="filled && bindCard()" :class="{'grey-bg':!filled}">绑定新卡</a>
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
            bankCardNo: '',
            mobile: '',
            cardType: '',
            bankName: '',

            tradeNo: '',
            smsCode: '',
            confirmBind: false,

            arr: [],

        	codeText:"点击获取",
        	timer : 60,
        	flag : true,
        	Interval : null,
            timerBankNo: null,
            passwordStatus: false,
            toastCon: '',
            bankCode: '',
            isSending:false,
            isiOS261: (isiOS && params.appVersion >'2.6.1')? true : false,
        };
    },
    computed:{
        imgSrc(){
            return bankIcons[this.bankCode] || bankIcons.default;
        },
        filled(){
            return /^([1-9])([0-9]{15,18})$/.test(this.bankCardNo)
                && /^1[3-9]\d{9}$/.test(this.mobile)
                && this.smsCode && this.smsCode.length == 6;
        }
    },
    watch: {
        bankCardNo: function(val, oldVal){
            if(/^([1-9])([0-9]{15,18})$/.test(this.bankCardNo)){
                if(this.timerBankNo){
                    clearTimeout(this.timerBankNo);
                }
                this.timerBankNo = setTimeout(()=>{
                    this.bankName = '';
                    this.$http.post('/queryCardBin', {
                        bankCardNo: this.bankCardNo,
                        orderId: params.bizId,
                        userId: params.userId,
                        "mobile": params.mobile,
                        "deviceId": params.deviceId,
                        "requestSource":params.requestSource
                    }).then(res=>{
                        if(res.data&&res.data.isSupport){
                            this.bankName = res.data.bank_description;
                            this.cardType = res.data.card_type;
                            this.bankCode = res.data.bank_id;
                            // 新需求(17.11.09 17:20)
                            if(this.cardType != 1){
                                this.$toast({
                                    message : '当前只可使用借记卡进行后续操作',
                                    duration : 2000
                                });
                            }
                        }else{
                            this.$toast({
                                message : res.responseMsg,
                                duration : 2000
                            });
                        }
                    }, err => {
                        this.$toast({
                            message : err.responseMsg,
                            duration : 2000
                        });
                    });
                }, 800);
            }
        }
    },
    methods: {
        verfifyCode(){
            if(!this.tradeNo){
                this.$toast({
                    message : '请重新获取验证码',
                    duration : 2000
                });
                return;
            }
            if(this.confirmBind){//非绑卡的时候禁止多次点击
                return;
            }
            this.confirmBind = true;
            if(this.smsCode && this.smsCode.length == 6){
                this.$http.post('/confirmDebitBankCard', {
                    tradeNo: this.tradeNo,
                    smsCode: this.smsCode,
                    "userId": params.userId,
                    "mobile": params.mobile,
                    "deviceId": params.deviceId,
                    "requestSource":params.requestSource
                }).then(res => {
                    if(res.responseCode == '1000'){
                        this.$router.push('app');
                    }else{
                        this.confirmBind = false;
                        this.$toast({
                            message : res.responseMsg,
                            duration : 2000
                        });
                    }
                },err => {
                    this.confirmBind = false;
                    this.$toast({
                        message : '绑卡失败',
                        duration : 2000
                    });
                });
            }else{
                this.$toast({
                    message : '请输入六位验证码',
                    duration : 2000
                });
            }
        },
    	update () {
            if(this.timer >1) {
                this.timer--;
                this.codeText = this.timer + "s后重新获取";
                this.flag = false;
            }else{
    		    this.timer = 60;
                this.codeText = '点击获取';
                this.flag = true;
                clearInterval(this.Interval);
            }
        },
    	sendSmsCode() {
            if(!(/^([1-9])([0-9]{15,18})$/.test(this.bankCardNo))){
                this.$toast({
                    message : "请正确输入银行卡号！",
                    duration : 2000
                });
                return;
            }
            if(!(/^1[3-9]\d{9}$/.test(this.mobile))){
                this.$toast({
                    message : "请正确输入手机号！",
                    duration : 2000
                });
                return;
            }
            if(this.cardType != 1){
                this.$toast({
                    message : '当前只可使用借记卡进行后续操作',
                    duration : 2000
                });
                return;
            }
            if(this.isSending){
                return;
            }
            this.isSending = true;
            this.$http.post('/verifyDebitBankCard', {
                "bankCardNo": this.bankCardNo,
                "bankCode": this.bankCode,
                "bankName": this.bankName,
                "cardType": this.cardType,
                "bankPhoneNo": this.mobile.trim(),
                "orderId": params.bizId,
                "userId": params.userId,
                "mobile": params.mobile,
                "deviceId": params.deviceId,
                "requestSource":params.requestSource
            }).then(res =>{
                this.isSending = false;
                this.codeText = this.timer + "s后重新获取";
                if(this.flag == true){
                    this.Interval = setInterval(this.update, 1000);
                    this.flag = false;
                }
                if(res.responseCode == "1000"){
                    this.tradeNo = res.data.trans_id;
                }else{
                    this.$toast({
                        message : res.responseMsg,
                        duration : 2000
                    });
                }

            }, err => {
                this.isSending = false;
                this.$toast({
                    message : err.responseMsg || '发送验证码失败',
                    duration : 2000
                });
            });
    	},
        bindCard() {
            if(this.cardType == 1){
                this.verfifyCode();
            }else{
                this.$toast({
                    message : '当前只可使用借记卡进行后续操作',
                    duration : 2000
                });
            }
        }
    },
    mounted() {
    	// 
    },
    destroyed() {
        clearTimeout(this.timerBankNo);
    	clearInterval(this.Interval);
    }
}
</script>
<style lang="less">



</style>
