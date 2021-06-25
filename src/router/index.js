import Vue from 'vue';
import febAlive from 'feb-alive';
import VueRouter from 'vue-router';
import axios from 'axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { apiRoutes } from '@/utils/backendUtils';
import {
  decodeSecret,
  getItem,
  setItem,
  removeItem,
} from '@utils/encryptUtils';
// Routing data

import routes from './routes';

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
  mode: 'history',
  scrollBehavior(to, from, savePosition) {
    if (savePosition) {
      return savePosition;
    }
    return {
      x: 0,
      y: 0,
    };
  },
  routes,
});

Vue.use(febAlive, { router });

/**
 * Route interception
 * ASD
 */
router.beforeEach((to, from, next) => {
  NProgress.start();
  setItem('prev', from.name);
  const token = getItem('tokendata');
  const user = getItem('userdata');
  const sessionStore = getItem('sessionStore');
  const session = getItem('sessiondata');
  if (to.matched.some((record) => record.meta.redirect)) {
    next({ path: '/0:home/' });
  }
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (token != null && user != null && session != null) {
      const tokenData = JSON.parse(decodeSecret(token));
      const userData = JSON.parse(decodeSecret(user));
      const sessionData = JSON.parse(decodeSecret(session));
      if (sessionStore !== undefined && sessionStore !== null) {
        if (to.matched.some((record) => record.meta.admin)) {
          if (userData.admin) {
            next({ params: { userinfo: userData, tokeninfo: tokenData } });
          } else {
            next({
              name: 'results',
              params: {
                id: to.params.id,
                cmd: 'results',
                success: false,
                data: 'You are Unauthorized to View this Page',
                redirectUrl: '/',
                tocmd: 'home',
              },
            });
          }
        } else {
          next({ params: { userinfo: userData, tokeninfo: tokenData } });
        }
        if (to.matched.some((record) => record.meta.superadmin)) {
          if (userData.superadmin && userData.admin) {
            next({ params: { userinfo: userData, tokeninfo: tokenData } });
          } else {
            next({
              name: 'results',
              params: {
                id: to.params.id,
                cmd: 'results',
                success: false,
                data: 'You are Unauthorized to View this Page',
                redirectUrl: '/',
                tocmd: 'home',
              },
            });
          }
        } else {
          next({ params: { userinfo: userData, tokeninfo: tokenData } });
        }
      } else {
        axios
          .post(apiRoutes.verifyRoute, {
            email: userData.email,
            token: tokenData.token,
            sessionId: sessionData.sessionid,
          })
          .then((response) => {
            if (
              !response.data.auth &&
              !response.data.registered &&
              response.data.tokenuser == null
            ) {
              removeItem('tokendata');
              removeItem('userdata');
              removeItem('sessiondata');
              next({
                name: 'results',
                params: {
                  id: to.params.id,
                  cmd: 'results',
                  nextUrl: 'home/',
                  data:
                    'Your Token Got Expired. Login to Generate Another Token. You will be Redirected to Login Page Automatically.',
                },
              });
            } else if (
              !response.data.auth &&
              !response.data.registered &&
              !response.data.tokenuser
            ) {
              removeItem('tokendata');
              removeItem('userdata');
              removeItem('sessiondata');
              next({
                name: 'results',
                params: {
                  id: to.params.id,
                  cmd: 'results',
                  nextUrl: to.fullPath,
                  data: 'User Not Found.',
                },
              });
            } else {
              setItem('sessionStore', Date.now());
              if (to.matched.some((record) => record.meta.admin)) {
                if (userData.admin) {
                  next({
                    params: { userinfo: userData, tokeninfo: tokenData },
                  });
                } else {
                  next({
                    name: 'results',
                    params: {
                      id: to.params.id,
                      cmd: 'results',
                      success: false,
                      data: 'You are Unauthorized to View this Page',
                      redirectUrl: '/',
                      tocmd: 'home',
                    },
                  });
                }
              } else {
                next({ params: { userinfo: userData, tokeninfo: tokenData } });
              }
              if (to.matched.some((record) => record.meta.superadmin)) {
                if (userData.superadmin && userData.admin) {
                  next({
                    params: { userinfo: userData, tokeninfo: tokenData },
                  });
                } else {
                  next({
                    name: 'results',
                    params: {
                      id: to.params.id,
                      cmd: 'results',
                      success: false,
                      data: 'You are Unauthorized to View this Page',
                      redirectUrl: '/',
                      tocmd: 'home',
                    },
                  });
                }
              } else {
                next({ params: { userinfo: userData, tokeninfo: tokenData } });
              }
            }
          })
          .catch((e) => {
            next({
              name: 'results',
              params: {
                id: to.params.id,
                cmd: 'result',
                success: false,
                data:
                  'You are Using Proxy / Vpn to Login. Turn Off VPN/ Proxy to Use.',
                noredirect: true,
              },
            });
          });
      }
    } else {
      removeItem('tokendata');
      removeItem('userdata');
      removeItem('sessiondata');
      next({
        name: 'results',
        params: {
          id: to.params.id,
          cmd: 'result',
          success: false,
          nextUrl: to.fullPath,
          data:
            'You are Not Logged in to View Content. Please Login to Continue',
          redirectUrl: '/',
          tocmd: 'login',
        },
      });
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (token == null && user == null) {
      next();
    } else {
      const tokenData = JSON.parse(decodeSecret(token));
      const userData = JSON.parse(decodeSecret(user));
      const sessionData = JSON.parse(decodeSecret(session));
      if (to.matched.some((record) => record.meta.allow)) {
        next({
          params: {
            userinfo: userData,
            tokeninfo: tokenData,
            sessioninfo: sessionData,
          },
        });
      } else {
        next({ name: 'home', params: { id: to.params.id, cmd: 'home/' } });
      }
    }
  } else {
    next();
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
