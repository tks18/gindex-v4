const _import = require('@/libs/util.import.' + process.env.NODE_ENV);

const meta = {
  disableCache: false,
};

const frameIn = [
  {
    path: '/:id(\\d+)::cmd(text)/:path',
    name: 'text',
    component: _import('GoText'),
    meta: {
      ...meta,
      view: 'text',
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(pdf)/:path',
    name: 'pdf',
    component: _import('GoPdf'),
    meta: {
      ...meta,
      view: 'pdf',
      requiresAuth: true,
    },
  },
  {
    path: '/',
    name: 'base',
    component: _import('GoList'),
    meta: {
      ...meta,
      redirect: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(video)/:path',
    name: 'video',
    component: _import('GoVideo'),
    meta: {
      ...meta,
      view: 'video',
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(audio)/:path',
    name: 'audio',
    component: _import('GoAudio'),
    meta: {
      ...meta,
      view: 'audio',
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(image)/:path',
    name: 'image',
    component: _import('GoImg'),
    meta: {
      ...meta,
      view: 'image',
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(search)(/?q=)*',
    name: 'search',
    component: _import('GoList'),
    meta: {
      ...meta,
      view: 'list',
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+):/:path*',
    name: 'files',
    component: _import('GoList'),
    meta: {
      ...meta,
      view: 'list',
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(others)/:path',
    name: 'otherFiles',
    component: _import('GoOthers'),
    meta: {
      ...meta,
      view: 'list',
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(login)/',
    name: 'login',
    component: _import('static/Users/Login'),
    meta: {
      ...meta,
      guest: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(register)/',
    name: 'register',
    component: _import('static/Admin/Register'),
    meta: {
      ...meta,
      requiresAuth: true,
      admin: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(invite)/',
    name: 'invite',
    component: _import('static/Admin/Invite'),
    meta: {
      ...meta,
      requiresAuth: true,
      admin: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(register)/otp',
    name: 'otp',
    component: _import('static/OtpRegister'),
    meta: {
      ...meta,
      guest: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(home)/',
    name: 'home',
    component: _import('static/Home'),
    meta: {
      ...meta,
      guest: true,
      allow: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(result)/',
    name: 'results',
    component: _import('static/ResultPage'),
    meta: {
      ...meta,
      guest: true,
      allow: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(register)/request/user',
    name: 'request',
    component: _import('static/Request'),
    meta: {
      ...meta,
      guest: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(settings)/request/',
    name: 'requestadmin',
    component: _import('static/Users/RequestPrivs'),
    meta: {
      ...meta,
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(settings)/changepassword',
    name: 'changepassword',
    component: _import('static/Users/ChangePassword'),
    meta: {
      ...meta,
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(admin)/',
    name: 'admin',
    component: _import('static/Admin/AdminArea'),
    meta: {
      ...meta,
      requiresAuth: true,
      admin: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(admin)/manage',
    name: 'manageUsers',
    component: _import('static/Admin/ManageUsers'),
    meta: {
      ...meta,
      requiresAuth: true,
      admin: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(admin)/posteriors',
    name: 'manageposteriors',
    component: _import('static/Admin/MainManagePostPage'),
    meta: {
      ...meta,
      requiresAuth: true,
      admin: true,
    },
    children: [
      {
        path: '/:id(\\d+)::cmd(admin)/posteriors/quicklinks',
        name: 'manageposteriors_quicklinks',
        component: _import('static/Admin/ManagePosts/ManageQuickLinks'),
        meta: {
          ...meta,
          requiresAuth: true,
          admin: true,
        },
      },
      {
        path: '/:id(\\d+)::cmd(admin)/posteriors/categories',
        name: 'manageposteriors_categories',
        component: _import('static/Admin/ManagePosts/ManageCategories'),
        meta: {
          ...meta,
          requiresAuth: true,
          admin: true,
        },
      },
      {
        path: '/:id(\\d+)::cmd(admin)/posteriors/heros',
        name: 'manageposteriors_heros',
        component: _import('static/Admin/ManagePosts/ManageHeros'),
        meta: {
          ...meta,
          requiresAuth: true,
          admin: true,
        },
      },
      {
        path: '/:id(\\d+)::cmd(admin)/posteriors/trending',
        name: 'manageposteriors_trending',
        component: _import('static/Admin/ManagePosts/ManageTrendingPosts'),
        meta: {
          ...meta,
          requiresAuth: true,
          admin: true,
        },
      },
    ],
  },
  {
    path: '/:id(\\d+)::cmd(admin)/settings',
    name: 'sitesettings',
    component: _import('static/Admin/SiteSettings'),
    meta: {
      ...meta,
      requiresAuth: true,
      admin: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(admin)/spam',
    name: 'managespam',
    component: _import('static/Admin/ManageSpamUsers'),
    meta: {
      ...meta,
      requiresAuth: true,
      admin: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(settings)/',
    name: 'settings',
    component: _import('static/Users/Settings'),
    meta: {
      ...meta,
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(delete)/me',
    name: 'deleteme',
    component: _import('static/Users/DeleteMe'),
    meta: {
      ...meta,
      requiresAuth: true,
    },
  },
];

export default frameIn;
