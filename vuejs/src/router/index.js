import Vue from "vue";
import febAlive from "feb-alive";
import VueRouter from "vue-router";
// routing data
import routes from "./routes";

// rewrite history before router instantiation
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
router.beforeEach(async (to, from, next) => {
  if (process.env.NODE_ENV === "development") {
    console.log("before:");
    console.log(to, from);
  }
  next();
});

router.afterEach((to) => {
  if (process.env.NODE_ENV === "development") {
    console.log("after:");
    console.log(to);
  }
});

export default router;
