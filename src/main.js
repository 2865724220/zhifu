import Vue from 'vue'
import router from './router'
import App from './components/app'
import axios from 'axios'
import './assets/less/index.less';
require('es6-promise').polyfill();
Vue.config.productionTip = false;
const $http = axios.create({
  baseURL: "/api/fastpayment",
  responseType: 'json',
  headers: {'X-Requested-With': 'XMLHttpRequest'},
  timeout: 60000
});
$http.interceptors.request.use( config => {
  config.headers['sessionid'] = Qs().sessionId || null;
  return config;
}, error => {
  return Promise.reject(error);
});
$http.interceptors.response.use(function(res){
  return Promise.resolve(res.data);
},function(error){
  return Promise.reject(error);
});
Vue.prototype.$http = $http;

Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = binding.value;
  }
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
