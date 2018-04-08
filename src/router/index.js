import Vue from 'vue';
import Router from 'vue-router';
import App from '../components/app'
import bankChange from '../components/bankchange';
// import repayment from '../components/repayment';
import payWay from '../components/payway';
import payResult from '../components/payresult/';
Vue.use(Router);
export default new Router({
  routes: [
  	{
  		path: '/',
  		name: 'app',
  		component: App,
  		children: [
  			{
		      path: 'app',
		      component: payWay
		    },
		    {
		      path: 'bankChange',
		      component: bankChange
		    },
        //  {
        //   path: 'repayment',
        //   component: repayment
        // },
        {
          path: 'payResult',
          component: payResult
        },
		    { path: '*', redirect: 'app' }
  		]
  	}]
});
