import Vue from 'vue'
import Router from 'vue-router'
import Result from '@/components/Result'
import Detail from '@/views/Detail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'result-page',
      component: Result
    },
    {
      path: '/detail',
      name: 'detail',
      component: Detail
    }
  ]
})
