import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'populars-page',
      component: require('@/components/pages/Populars').default
    },
    {
      path: '/tracks',
      name: 'tracks-page',
      component: require('@/components/pages/Tracks').default
    },
    {
      path: '/albums',
      name: 'albums-page',
      component: require('@/components/pages/Albums').default
    },
    {
      path: '/albums/:name',
      name: 'albums-show',
      component: require('@/components/pages/AlbumsShow').default
    },
    {
      path: '/artists',
      name: 'artists-page',
      component: require('@/components/pages/Artists').default
    },
    {
      path: '/artists/:name',
      name: 'artists-show',
      component: require('@/components/pages/ArtistsShow').default
    },
    {
      path: '/search',
      name: 'search',
      component: require('@/components/pages/Search').default
    },
    { path: '*', redirect: '/' }
  ]
})
