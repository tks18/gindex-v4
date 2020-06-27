import Vue from "vue";
import febAlive from "feb-alive";
import VueRouter from "vue-router";
import axios from "axios";
import secret from "../../secret";
import Crypto from "crypto-js";
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
  var token = localStorage.getItem("tokendata");
  var user = localStorage.getItem("userdata");
  if(to.matched.some(record => record.meta.redirect)){
    next({path: "/0:home/"})
  }
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if(token != null && user != null){
      var tokenData = JSON.parse(Crypto.AES.decrypt(token, secret.pass).toString(Crypto.enc.Utf8));
      var userData = JSON.parse(Crypto.AES.decrypt(user, secret.pass).toString(Crypto.enc.Utf8));
      axios.post(window.apiRoutes.verifyRoute, {
        email: userData.email,
        token: tokenData.token
      }).then(response => {
        if(!response.data.auth && !response.data.registered && response.data.tokenuser == null){
          localStorage.removeItem("tokendata");
          localStorage.removeItem("userdata");
          next({ name: 'results', params: { id: 0, cmd: "results", nextUrl: to.fullPath, data: "Your Token Got Expired. Login to Generate Another Token. You will be Redirected to Login Page Automatically." } });
        } else if(!response.data.auth && !response.data.registered && !response.data.tokenuser){
          localStorage.removeItem("tokendata");
          localStorage.removeItem("userdata");
          next({ name: 'results', params: { id: 0, cmd: "results", nextUrl: to.fullPath, data: "User Not Found." } });
        } else {
          if(to.matched.some(record => record.meta.admin)){
            if(userData.admin){
              next();
            } else {
              next({ name: 'results', params: { id: 0, cmd: "results", success: false, data: "You are Unauthorized to View this Page", redirectUrl: '/0:home/' } });
            }
          } else {
            next();
          }
          if(to.matched.some(record => record.meta.superadmin)){
            if(userData.superadmin && userData.admin){
              next();
            } else {
              next({ name: 'results', params: { id: 0, cmd: "results", success: false, data: "You are Unauthorized to View this Page", redirectUrl: '/0:home/' } });
            }
          } else {
            next();
          }
        }
      })
    } else {
      localStorage.removeItem("tokendata");
      localStorage.removeItem("userdata");
      next({ name: 'results', params: { id: 0, cmd: "results", success: false, nextUrl: to.fullPath, data: "You are Not Logged in to View Content. Please Login to Continue", redirectUrl: '/0:login/' } });
    }
  } else if(to.matched.some(record => record.meta.guest)) {
      if(token == null && user == null){
          next();
      }
      else{
        if(to.matched.some(record => record.meta.allow)){
            next();
        } else {
            next({path: '/0:home/'});
        }
      }
  }else {
      next()
  }
});

export default router;
