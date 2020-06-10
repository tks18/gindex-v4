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
      path: '/0:/login',
      name: 'login',
      component: _import("page/Login"),
      meta: {
          ...meta,
          guest: true
      }
  },
  {
      path: '/0:/register',
      name: 'register',
      component: _import("page/Register"),
      meta: {
          ...meta,
          guest: true
      }
  }
];

export default frameIn;
