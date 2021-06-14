// Because too many lazy loading pages will cause webpack hot update too slow, so the development environment does not use lazy loading, only the production environment uses lazy loading
const _import = require("@/libs/util.import." + process.env.NODE_ENV);

const meta = {
  // keepAlive: true
  disableCache: false
}

const frameIn = [{
    path: "/:id(\\d+)::cmd(text)/:path",
    name: 'text',
    component: _import("page/GoText"),
    meta: {
      ...meta,
      view: 'text',
      requiresAuth: true,
      hybrid: true,
    }
  },
  {
    path: "/:id(\\d+)::cmd(pdf)/:path",
    name: 'pdf',
    component: _import("page/GoPdf"),
    meta: {
      ...meta,
      view: 'pdf',
      requiresAuth: true,
      hybrid: true,
    }
  },
  {
    path: "/",
    name: 'base',
    component: _import("page/GoList"),
    meta: {
      ...meta,
      redirect: true,
      hybrid: true,
    }
  },
  {
    path: "/:id(\\d+)::cmd(video)/:path",
    name: 'video',
    component: _import("page/GoVideo"),
    meta: {
      ...meta,
      view: 'video',
      requiresAuth: true,
      hybrid: true,
    }
  },
  {
    path: "/:id(\\d+)::cmd(audio)/:path",
    name: 'audio',
    component: _import("page/GoAudio"),
    meta: {
      ...meta,
      view: 'audio',
      requiresAuth: true,
      hybrid: true,
    }
  },
  {
    path: "/:id(\\d+)::cmd(image)/:path",
    name: 'image',
    component: _import("page/GoImg"),
    meta: {
      ...meta,
      view: 'image',
      requiresAuth: true,
      hybrid: true,
    }
  },
  {
    path: "/:id(\\d+)::cmd(search)(/?q=)*",
    name: 'search',
    component: _import("page/GoList"),
    meta: {
      ...meta,
      view: 'list',
      requiresAuth: true,
      hybrid: true,
    }
  },
  {
    path: "/:id(\\d+):/:path*",
    name: 'files',
    component: _import("page/GoList"),
    meta: {
      ...meta,
      view: 'list',
      requiresAuth: true,
      hybrid: true,
    }
  },
  {
    path: "/:id(\\d+)::cmd(others)/:path",
    name: 'otherFiles',
    component: _import("page/GoOthers"),
    meta: {
      ...meta,
      view: 'list',
      requiresAuth: true,
      hybrid: true,
    }
  },
  {
      path: '/:id(\\d+)::cmd(login)/',
      name: 'login',
      component: _import("page/static/Users/Login"),
      meta: {
          ...meta,
          guest: true,
          hybrid: true,
      }
  },
  {
      path: '/:id(\\d+)::cmd(register)/',
      name: 'register',
      component: _import("page/static/Admin/Register"),
      meta: {
          ...meta,
          requiresAuth: true,
          admin: true,
          hybrid: false,
      }
  },
  {
      path: '/:id(\\d+)::cmd(invite)/',
      name: 'invite',
      component: _import("page/static/Admin/Invite"),
      meta: {
          ...meta,
          requiresAuth: true,
          admin: true,
          hybrid: false,
      }
  },
  {
      path: '/:id(\\d+)::cmd(register)/otp',
      name: 'otp',
      component: _import("page/static/OtpRegister"),
      meta: {
          ...meta,
          guest: true,
          hybrid: false,
      }
  },
  {
      path: '/:id(\\d+)::cmd(home)/',
      name: 'home',
      component: _import("page/static/Home"),
      meta: {
          ...meta,
          guest: true,
          allow: true,
          hybrid: true,
      }
  },
  {
      path: '/:id(\\d+)::cmd(result)/',
      name: 'results',
      component: _import("page/static/ResultPage"),
      meta: {
          ...meta,
          guest: true,
          allow: true,
          hybrid: true,
      }
  },
  {
      path: '/:id(\\d+)::cmd(register)/request/user',
      name: 'request',
      component: _import("page/static/Request"),
      meta: {
          ...meta,
          guest: true,
          hybrid: false,
      }
  },
  {
      path: '/:id(\\d+)::cmd(settings)/request/',
      name: 'requestadmin',
      component: _import("page/static/Users/RequestPrivs"),
      meta: {
          ...meta,
          requiresAuth: true,
          hybrid: false,
      }
  },
  {
      path: '/:id(\\d+)::cmd(settings)/changepassword',
      name: 'changepassword',
      component: _import("page/static/Users/ChangePassword"),
      meta: {
          ...meta,
          requiresAuth: true,
          hybrid: false,
      }
  },
  {
      path: '/:id(\\d+)::cmd(admin)/',
      name: 'admin',
      component: _import("page/static/Admin/AdminArea"),
      meta: {
          ...meta,
          requiresAuth: true,
          admin: true,
          hybrid: false,
      }
  },
  {
      path: '/:id(\\d+)::cmd(admin)/manage',
      name: 'manageUsers',
      component: _import("page/static/Admin/ManageUsers"),
      meta: {
          ...meta,
          requiresAuth: true,
          admin: true,
          hybrid: false,
      }
  },
  {
      path: '/:id(\\d+)::cmd(admin)/posteriors',
      name: 'manageposteriors',
      component: _import("page/static/Admin/MainManagePostPage"),
      meta: {
          ...meta,
          requiresAuth: true,
          admin: true,
          hybrid: false,
      },
      children: [
        {
            path: '/:id(\\d+)::cmd(admin)/posteriors/quicklinks',
            name: 'manageposteriors_quicklinks',
            component: _import("page/static/Admin/ManagePosts/ManageQuickLinks"),
            meta: {
                ...meta,
                requiresAuth: true,
                admin: true,
                hybrid: false,
            },
        },
        {
            path: '/:id(\\d+)::cmd(admin)/posteriors/categories',
            name: 'manageposteriors_categories',
            component: _import("page/static/Admin/ManagePosts/ManageCategories"),
            meta: {
                ...meta,
                requiresAuth: true,
                admin: true,
                hybrid: false,
            },
        },
        {
            path: '/:id(\\d+)::cmd(admin)/posteriors/heros',
            name: 'manageposteriors_heros',
            component: _import("page/static/Admin/ManagePosts/ManageHeros"),
            meta: {
                ...meta,
                requiresAuth: true,
                admin: true,
                hybrid: false,
            },
        },
        {
            path: '/:id(\\d+)::cmd(admin)/posteriors/trending',
            name: 'manageposteriors_trending',
            component: _import("page/static/Admin/ManagePosts/ManageTrendingPosts"),
            meta: {
                ...meta,
                requiresAuth: true,
                admin: true,
                hybrid: false,
            },
        },
      ]
  },
  {
      path: '/:id(\\d+)::cmd(admin)/settings',
      name: 'sitesettings',
      component: _import("page/static/Admin/SiteSettings"),
      meta: {
          ...meta,
          requiresAuth: true,
          admin: true,
          hybrid: false,
      }
  },
  {
      path: '/:id(\\d+)::cmd(admin)/spam',
      name: 'managespam',
      component: _import("page/static/Admin/ManageSpamUsers"),
      meta: {
          ...meta,
          requiresAuth: true,
          admin: true,
          hybrid: false,
      }
  },
  {
      path: '/:id(\\d+)::cmd(settings)/',
      name: 'settings',
      component: _import("page/static/Users/Settings"),
      meta: {
          ...meta,
          requiresAuth: true,
          hybrid: false,
      }
  },
  {
      path: '/:id(\\d+)::cmd(delete)/me',
      name: 'deleteme',
      component: _import("page/static/Users/DeleteMe"),
      meta: {
          ...meta,
          requiresAuth: true,
          hybrid: false,
      }
  },
];

export default frameIn;
