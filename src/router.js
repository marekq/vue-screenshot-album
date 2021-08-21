// import vuerouter and amplify
import { createWebHistory, createRouter } from "vue-router";
import { Auth } from 'aws-amplify';

import Home from './components/Home.vue';
import Album from './components/Album';
import Public from './components/Public';
import AuthComponent from './components/Auth.vue';

// define router rules
const routes = [
  { path: '/', component: Home },
  { path: '/public/', component: Public },
  { path: '/album/', component: Album, requiresAuth: true },
  { path: '/auth/', component: AuthComponent }
]

// create vue router with history
const router = createRouter({
    history: createWebHistory(),
    routes
});

// check for auth token
router.beforeResolve((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    Auth.currentAuthenticatedUser().then(() => {
      next()
    }).catch(() => {
      next({
        path: '/auth'
      });
    });
  }
  next()
})

export default router