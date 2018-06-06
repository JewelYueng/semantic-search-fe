// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import config from '@/config/config.js'

Vue.use(ElementUI)
Vue.config.productionTip = false
axios.defaults.withCredentials = true
Vue.prototype.$axios=axios
Vue.prototype.$config=config
// 未登录时跳回登录页面
router.beforeEach((to, from, next) => {
  let toName = to.name;
  if (toName !== 'login') {
    let name = '';
    axios({
      method: 'get',
      url: `http://${config.host}/api/staffs/getLoginInfo`
    }).then(res => {
      name = res.data.data.name;
      if (!name) {
        sessionStorage.setItem('loginFrom', to.path);
        next('/login');
        return;
      } else {
        console.log(name);
        sessionStorage.setItem('userName',name);
        next();
      }
    }).catch(err => {
      console.log(err);
      next('/login');
    })
  } else {
    next();
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
