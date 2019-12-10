import Vue from 'vue'
import Router from 'vue-router'
import Recom from './components/recom'
import Singer from './components/singer'
import Rank from './components/rank'
import Search from './components/search'
import Detail from './components/detail/detail'
import Person from './components/person/person.vue'
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/recom',
    name: 'one',
    component: Recom,
    children: [
      { path: ':id',
        name: '2',
        component: Detail
      }
    ]
  },
  {
    path: '/singer',
    name: 'two',
    component: Singer,
    children: [
      { path: ':id',
        name: '1',
        component: Detail
      }
    ]
  },
  {
    path: '/rank', name: 'three', component: Rank },
  {
    path: '/search', name: 'four', component: Search
  },
  {
    path: '/', name: 'five', redirect: '/recom'
  },
  {
    path: '/person', component: Person
  }
  ]

})
