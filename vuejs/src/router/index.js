import Vue from "vue";
import febAlive from "feb-alive";
import VueRouter from "vue-router";
// 路由数据

import routes from "./routes";
import store from '@/store/index';

// 在router实例化之前重写history
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

// 导出路由 在 main.js 里使用
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
 * 路由拦截
 * 权限验证
 */
router.beforeEach( (to, from, next) => {
  store.dispatch("acrou/cancelToken/cancel")
  if(to.matched.some(record => record.meta.requiresAuth)) {
      if (localStorage.getItem('jwt') == null) {
          console.log("jwt");
          next({
              path: '/0:/login',
              params: { nextUrl: to.fullPath }
          })
      } else {
          let user = JSON.parse(localStorage.getItem('user'))
          if(to.matched.some(record => record.meta.is_admin)) {
              if(user.is_admin == 1){
                console.log("is_admin");
                  next({path: "/0:/"})
              }
              else{
                console.log("else1");
                  next({ path: "/0:/", name: 'userboard'})
              }
          }else {
            console.log("else2");
              next({path: "/0:/"})
          }
      }
  } else if(to.matched.some(record => record.meta.guest)) {
      if(localStorage.getItem('jwt') == null){
        console.log("guest1")
          next({ path: "/0:/login/"})
      }
      else{
        console.log("guest2")
          next({ path: '/0:/'})
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
