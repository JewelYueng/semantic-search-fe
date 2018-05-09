import Vue from 'vue'
import Router from 'vue-router'
import Result from '@/components/Result'
import Detail from '@/views/Detail'
import AdvancedSearch from '@/views/AdvancedSearch'

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
    }, {
      path: '/advancedSearch',
      name: 'advanced-search',
      component: AdvancedSearch
    }
  ]
})
