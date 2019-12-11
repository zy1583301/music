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
    meta:{title:'推荐页'},
    children: [
      { path: ':id',
        name: '2',
        component: Detail,
        meta:{title:'详情页'}
      }
    ]
  },
  {
    path: '/singer',
    name: 'two',
    component: Singer,
    meta:{title:'歌手页'},
    children: [
      { path: ':id',
        name: '1',
        component: Detail,
        meta:{title:'详情页'}
      }
    ]
  },
  {
    path: '/rank',
    name: 'three',
    component: Rank,
    meta:{title:'排行页'},
    children: [
      { path: ':id',
        name: '3',
        component: Detail,
        meta:{title:'详情页'}
      }
    ]
  },
  {
    path: '/search', name: 'four', component: Search
  },
  {
    path: '/', name: 'five', redirect: '/recom'
  },
  {
    path: '/person', component: Person,meta:{title:'个人页'}
  }
  ]

})
