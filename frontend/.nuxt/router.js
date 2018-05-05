import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const _7985080a = () => import('../pages/index.vue' /* webpackChunkName: "pages/index" */).then(m => m.default || m)
const _4d286eec = () => import('../pages/register.vue' /* webpackChunkName: "pages/register" */).then(m => m.default || m)
const _406b7c7b = () => import('../pages/admin/index.vue' /* webpackChunkName: "pages/admin/index" */).then(m => m.default || m)
const _e635c1dc = () => import('../pages/login.vue' /* webpackChunkName: "pages/login" */).then(m => m.default || m)
const _7bbb3e9c = () => import('../pages/admin/user.vue' /* webpackChunkName: "pages/admin/user" */).then(m => m.default || m)
const _0a131f92 = () => import('../pages/admin/login.vue' /* webpackChunkName: "pages/admin/login" */).then(m => m.default || m)
const _70a0247c = () => import('../pages/admin/room.vue' /* webpackChunkName: "pages/admin/room" */).then(m => m.default || m)
const _3d76bf2c = () => import('../pages/chat/_id.vue' /* webpackChunkName: "pages/chat/_id" */).then(m => m.default || m)



const scrollBehavior = (to, from, savedPosition) => {
  // SavedPosition is only available for popstate navigations.
  if (savedPosition) {
    return savedPosition
  } else {
    let position = {}
    // If no children detected
    if (to.matched.length < 2) {
      // Scroll to the top of the page
      position = { x: 0, y: 0 }
    }
    else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
      // If one of the children has scrollToTop option set to true
      position = { x: 0, y: 0 }
    }
    // If link has anchor, scroll to anchor by returning the selector
    if (to.hash) {
      position = { selector: to.hash }
    }
    return position
  }
}


export function createRouter () {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,
    routes: [
		{
			path: "/",
			component: _7985080a,
			name: "index"
		},
		{
			path: "/register",
			component: _4d286eec,
			name: "register"
		},
		{
			path: "/admin",
			component: _406b7c7b,
			name: "admin"
		},
		{
			path: "/login",
			component: _e635c1dc,
			name: "login"
		},
		{
			path: "/admin/user",
			component: _7bbb3e9c,
			name: "admin-user"
		},
		{
			path: "/admin/login",
			component: _0a131f92,
			name: "admin-login"
		},
		{
			path: "/admin/room",
			component: _70a0247c,
			name: "admin-room"
		},
		{
			path: "/chat/:id?",
			component: _3d76bf2c,
			name: "chat-id"
		}
    ],
    fallback: false
  })
}
