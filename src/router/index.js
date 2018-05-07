import Vue from 'vue'
import Router from 'vue-router'
import Result from '@/components/Result'
import Detail from '@/views/Detail'
import SeniorSearch from '@/views/SeniorSearch'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/search',
      name: 'result-page',
      component: Result
    },
    {
      path: '/detail',
      name: 'detail',
      component: Detail
    },{
      path: '/advancedSearch',
      name: 'senior-search',
      component: SeniorSearch
    }
  ]
})
