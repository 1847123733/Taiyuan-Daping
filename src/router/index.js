import Vue from 'vue'
import Router from 'vue-router'
import Page from '../views'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', redirect: '/login'},
    {path: '/login', component: Page.Login},
    {path: '/home', component: Page.Home},
    {path: '/index', component: Page.Index},
  ]
})
