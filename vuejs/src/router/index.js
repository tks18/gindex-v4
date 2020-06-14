import Vue from "vue";
import febAlive from "feb-alive";
import VueRouter from "vue-router";
// Routing data

import routes from "./routes";
import store from '@/store/index';

// Rewrite history before router instantiation
febAlive.resetHistory();

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return VueRouterPush.call(this, location).catch((err) => err);
};
const VueRouterReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return VueRouterReplace.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

// Export route is used in main.js
const router = new VueRouter({
  mode: "history",
  scrollBehavior(to, from, savePosition) {
    if (savePosition) {
      return savePosition;
    } else {
      return {
        x: 0,
        y: 0,
      };
    }
  },
  routes,
});

Vue.use(febAlive, { router });

/**
 * Route interception
 * ASD
 */
router.beforeEach( (to, from, next) => {
  store.dispatch("acrou/cancelToken/cancel")
  // if(to.matched.some(record => record.meta.redirect)){
  //   next({path: "/0:home/"})
  // }
  // if(to.matched.some(record => record.meta.requiresAuth)) {
  //     if (localStorage.getItem('jwt') == null) {
  //         next({
  //             path: '/0:login/',
  //             params: { nextUrl: to.fullPath }
  //         })
  //     } else {
  //       next()
  //     }
  // } else if(to.matched.some(record => record.meta.guest)) {
  //     if(localStorage.getItem('jwt') == null){
  //         next()
  //     }
  //     else{
  //       if(to.matched.some(record => record.meta.home)){
  //         next();
  //       } else {
  //         next({path: '/0:/'})
  //       }
  //     }
  // }else {
  //     next()
  // }
  next();
});

router.afterEach((to) => {
  if (process.env.NODE_ENV === "development") {
    console.log("after:");
    console.log(to);
  }
});

export default router;
