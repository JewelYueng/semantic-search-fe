import Vue from 'vue'
import Router from 'vue-router'
import Search from '@/views/Search'
import Detail from '@/views/Detail'
import AdvancedSearch from '@/views/AdvancedSearch'
import Assessment from '@/views/Assessment'
import Login from '@/views/Login'
import Index from '@/views/Index'
import Assessments from '@/views/AssessmentRecordList'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/detail',
      name: 'detail',
      component: Detail
    }, {
      path: '/advancedSearch',
      name: 'advanced-search',
      component: AdvancedSearch
    },{
      path: '/assessment/:standardId',
      name: 'assessment',
      component: Assessment
    },{
      path: '/login',
      name: 'login',
      component: Login,
    },{
      path:'/assessments',
      name: 'assessments',
      component: Assessments
    }
  ]
})
