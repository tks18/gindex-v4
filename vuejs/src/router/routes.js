// Because too many lazy loading pages will cause webpack hot update too slow, so the development environment does not use lazy loading, only the production environment uses lazy loading
const _import = require("@/libs/util.import." + process.env.NODE_ENV);

const meta = {
  // keepAlive: true
  disableCache: false
}

const frameIn = [{
    path: "/:id(\\d)::cmd(text)/:path",
    component: _import("page/GoText"),
    meta: {
      ...meta,
      view: 'text',
      requiresAuth: true,
    }
  },
  {
    path: "/:id(\\d)::cmd(pdf)/:path",
    component: _import("page/GoPdf"),
    meta: {
      ...meta,
      view: 'pdf',
      requiresAuth: true,
    }
  },
  {
    path: "/",
    component: _import("page/GoList"),
    meta: {
      ...meta,
      redirect: true,
    }
  },
  {
    path: "/:id(\\d)::cmd(video)/:path",
    component: _import("page/GoVideo"),
    meta: {
      ...meta,
      view: 'video',
      requiresAuth: true,
    }
  },
  {
    path: "/:id(\\d)::cmd(audio)/:path",
    component: _import("page/GoAudio"),
    meta: {
      ...meta,
      view: 'audio',
      requiresAuth: true,
    }
  },
  {
    path: "/:id(\\d)::cmd(image)/:path",
    component: _import("page/GoImg"),
    meta: {
      ...meta,
      view: 'image',
      requiresAuth: true,
    }
  },
  {
    path: "/:id(\\d)::cmd(search)(/?q=)*",
    component: _import("page/GoList"),
    meta: {
      ...meta,
      view: 'list',
      requiresAuth: true,
    }
  },
  {
    path: "/:id(\\d):/:path*",
    component: _import("page/GoList"),
    meta: {
      ...meta,
      view: 'list',
      requiresAuth: true,
    }
  },
  {
      path: '/:id(\\d)::cmd(login)/',
      name: 'login',
      component: _import("page/pages/Login"),
      meta: {
          ...meta,
          guest: true
      }
  },
  {
      path: '/:id(\\d)::cmd(invite)/user',
      name: 'inviteuser',
      component: _import("page/pages/InviteUser"),
      meta: {
          ...meta,
          requiresAuth: true,
          admin: true,
      }
  },
  {
      path: '/:id(\\d)::cmd(invite)/admin',
      name: 'inviteadmin',
      component: _import("page/pages/InviteAdmin"),
      meta: {
          ...meta,
          requiresAuth: true,
          admin: true,
          superadmin: true,
      }
  },
  {
      path: '/:id(\\d)::cmd(invite)/superadmin',
      name: 'invitesuperadmin',
      component: _import("page/pages/InviteSuperAdmin"),
      meta: {
          ...meta,
          requiresAuth: true,
          admin: true,
          superadmin: true,
      }
  },
  {
      path: '/:id(\\d)::cmd(register)/user',
      name: 'register',
      component: _import("page/pages/Register-user"),
      meta: {
          ...meta,
          requiresAuth: true,
          admin: true
      }
  },
  {
      path: '/:id(\\d)::cmd(register)/admin',
      name: 'upgradeadmin',
      component: _import("page/pages/AcceptAdmin"),
      meta: {
          ...meta,
          requiresAuth: true,
          admin: true,
          superadmin: true
      }
  },
  {
      path: '/:id(\\d)::cmd(register)/superadmin',
      name: 'upgradesuperadmin',
      component: _import("page/pages/AcceptSuperAdmin"),
      meta: {
          ...meta,
          requiresAuth: true,
          admin: true,
          superadmin: true,
      }
  },
  {
      path: '/:id(\\d)::cmd(register)/otp',
      name: 'otp',
      component: _import("page/pages/OTP-Register"),
      meta: {
          ...meta,
          guest: true,
      }
  },
  {
      path: '/:id(\\d)::cmd(home)/',
      name: 'home',
      component: _import("page/pages/Home"),
      meta: {
          ...meta,
          guest: true,
          allow: true
      }
  },
  {
      path: '/:id(\\d)::cmd(result)/',
      name: 'results',
      component: _import("page/pages/ResultPage"),
      meta: {
          ...meta,
          guest: true,
          allow: true,
      }
  },
  {
      path: '/:id(\\d)::cmd(register)/request/user',
      name: 'request',
      component: _import("page/pages/Request"),
      meta: {
          ...meta,
          guest: true,
      }
  },
  {
      path: '/:id(\\d)::cmd(register)/request/admin',
      name: 'requestadmin',
      component: _import("page/pages/Request-admin"),
      meta: {
          ...meta,
          requiresAuth: true,
      }
  },
  {
      path: '/:id(\\d)::cmd(register)/request/superadmin',
      name: 'requestsuperadmin',
      component: _import("page/pages/Request-Superadmin"),
      meta: {
          ...meta,
          requiresAuth: true,
          admin: true
      }
  },
  {
      path: '/:id(\\d)::cmd(settings)/changepassword',
      name: 'changepassword',
      component: _import("page/pages/ChangePassword"),
      meta: {
          ...meta,
          requiresAuth: true,
      }
  },
  {
      path: '/:id(\\d)::cmd(admin)/',
      name: 'admin',
      component: _import("page/pages/AdminArea"),
      meta: {
          ...meta,
          requiresAuth: true,
          admin: true,
      }
  },
  {
      path: '/:id(\\d)::cmd(settings)/',
      name: 'settings',
      component: _import("page/pages/Settings"),
      meta: {
          ...meta,
          requiresAuth: true,
      }
  },
  {
      path: '/:id(\\d)::cmd(delete)/user',
      name: 'deleteuser',
      component: _import("page/pages/DeleteUser"),
      meta: {
          ...meta,
          requiresAuth: true,
          admin: true
      }
  },
  {
      path: '/:id(\\d)::cmd(delete)/admin',
      name: 'deleteadmin',
      component: _import("page/pages/DeleteAdmin"),
      meta: {
          ...meta,
          requiresAuth: true,
          admin: true,
          superadmin: true,
      }
  },
  {
      path: '/:id(\\d)::cmd(delete)/me',
      name: 'deleteme',
      component: _import("page/pages/DeleteMe"),
      meta: {
          ...meta,
          requiresAuth: true
      }
  },
];

export default frameIn;
