<template>
	<div v-show="visible" class="toast-wrap">
		<div class="toast-con">
			<span>{{message}}</span>
		</div>
	</div>
</template>
<script>

export default {

// props:{
// 	content: {
// 		type: String,
//         default: ''
// 	},
// 	show:{
// 		type: Boolean,
//         default: false
// 	}
// },
	
  data () {
    return {
       visible: false,
       message: '',

    };
  },
  methods: {
  	
  
  },
  mounted() {
  	// console.log(this.$props);
  },
  destroyed() {
  	
  }
}
</script>
<style lang="less">
	.toast-wrap {
	    position: absolute;
	    top: 0;
	    left: 0;
	    width: 100%;
	    height: 100%;
	    overflow: hidden;
	}
	.toast-con{
		span{
		    display: block;
		    padding: 14px 20px;
		    margin: 40% 20% 0;
		    color: #fff;
		    font-size: 14px;
		    background: rgba(0, 0, 0, 0.5);
		    text-align: center;
		    border-radius: 4px;
		}
	}


</style>
