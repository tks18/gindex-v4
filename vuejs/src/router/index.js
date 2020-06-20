import Vue from "vue";
import febAlive from "feb-alive";
import VueRouter from "vue-router";
import axios from "axios";
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
  var tokenData = JSON.parse(localStorage.getItem("tokendata"));
  var userData = JSON.parse(localStorage.getItem("userdata"));
  if(to.matched.some(record => record.meta.redirect)){
    next({path: "/0:home/"})
  }
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if(tokenData != null && userData != null){
      axios.post(window.apiRoutes.verifyRoute, {
        token: tokenData.token
      }).then(response => {
        if(!response.data.auth && !response.data.registered && response.data.tokenuser == null){
          localStorage.removeItem("tokendata");
          localStorage.removeItem("userdata");
          next({ name: 'login', params: { nextUrl: to.fullPath, data: "Your Token Got Expired. Login to Generate Another Token. You will be Redirected to Login Page Automatically." } });
        } else {
          if(to.matched.some(record => record.meta.admin)){
            if(userData.admin){
              next();
            } else {
              next({ name: 'results', params: { data: "You are Unauthorized to View this Page", redirectUrl: '/0:home/' } });
            }
          } else {
            next();
          }
          if(to.matched.some(record => record.meta.superadmin)){
            if(userData.superadmin && userData.admin){
              next();
            } else {
              next({ name: 'results', params: { data: "You are Unauthorized to View this Page", redirectUrl: '/0:home/' } });
            }
          } else {
            next();
          }
        }
      })
    } else {
      localStorage.removeItem("tokendata");
      localStorage.removeItem("userdata");
      next({ name: 'results', params: { nextUrl: to.fullPath, data: "You are Not Logged in to View Content. Please Login to Continue", redirectUrl: '/0:login/' } });
      console.log(to)
    }
  } else if(to.matched.some(record => record.meta.guest)) {
      if(tokenData == null && userData == null){
          next();
      }
      else{
        if(to.matched.some(record => record.meta.home)){
            next();
        } else {
            next({path: '/0:home/'});
        }
      }
  }else {
      next()
  }
});

router.afterEach((to) => {
  if (process.env.NODE_ENV === "development") {
    console.log("after:");
    console.log(to);
  }
});

export default router;
