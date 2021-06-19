const dynamicImport = (path) => {
  const env = process.env.NODE_ENV;
  if (env === 'production') {
    return import('@/views/' + path);
  } else {
    return require('@/views/' + path).default;
  }
};

const meta = {
  disableCache: false,
};

const frameIn = [
  {
    path: '/:id(\\d+)::cmd(text)/:path',
    name: 'text',
    component: dynamicImport('page/GoText'),
    meta: {
      ...meta,
      view: 'text',
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(pdf)/:path',
    name: 'pdf',
    component: dynamicImport('page/GoPdf'),
    meta: {
      ...meta,
      view: 'pdf',
      requiresAuth: true,
    },
  },
  {
    path: '/',
    name: 'base',
    component: dynamicImport('page/GoList'),
    meta: {
      ...meta,
      redirect: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(video)/:path',
    name: 'video',
    component: dynamicImport('page/GoVideo'),
    meta: {
      ...meta,
      view: 'video',
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(audio)/:path',
    name: 'audio',
    component: dynamicImport('page/GoAudio'),
    meta: {
      ...meta,
      view: 'audio',
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(image)/:path',
    name: 'image',
    component: dynamicImport('page/GoImg'),
    meta: {
      ...meta,
      view: 'image',
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(search)(/?q=)*',
    name: 'search',
    component: dynamicImport('page/GoList'),
    meta: {
      ...meta,
      view: 'list',
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+):/:path*',
    name: 'files',
    component: dynamicImport('page/GoList'),
    meta: {
      ...meta,
      view: 'list',
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(others)/:path',
    name: 'otherFiles',
    component: dynamicImport('page/GoOthers'),
    meta: {
      ...meta,
      view: 'list',
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(login)/',
    name: 'login',
    component: dynamicImport('page/static/Users/Login'),
    meta: {
      ...meta,
      guest: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(register)/',
    name: 'register',
    component: dynamicImport('page/static/Admin/Register'),
    meta: {
      ...meta,
      requiresAuth: true,
      admin: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(invite)/',
    name: 'invite',
    component: dynamicImport('page/static/Admin/Invite'),
    meta: {
      ...meta,
      requiresAuth: true,
      admin: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(register)/otp',
    name: 'otp',
    component: dynamicImport('page/static/OtpRegister'),
    meta: {
      ...meta,
      guest: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(home)/',
    name: 'home',
    component: dynamicImport('page/static/Home'),
    meta: {
      ...meta,
      guest: true,
      allow: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(result)/',
    name: 'results',
    component: dynamicImport('page/static/ResultPage'),
    meta: {
      ...meta,
      guest: true,
      allow: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(register)/request/user',
    name: 'request',
    component: dynamicImport('page/static/Request'),
    meta: {
      ...meta,
      guest: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(settings)/request/',
    name: 'requestadmin',
    component: dynamicImport('page/static/Users/RequestPrivs'),
    meta: {
      ...meta,
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(settings)/changepassword',
    name: 'changepassword',
    component: dynamicImport('page/static/Users/ChangePassword'),
    meta: {
      ...meta,
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(admin)/',
    name: 'admin',
    component: dynamicImport('page/static/Admin/AdminArea'),
    meta: {
      ...meta,
      requiresAuth: true,
      admin: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(admin)/manage',
    name: 'manageUsers',
    component: dynamicImport('page/static/Admin/ManageUsers'),
    meta: {
      ...meta,
      requiresAuth: true,
      admin: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(admin)/posteriors',
    name: 'manageposteriors',
    component: dynamicImport('page/static/Admin/MainManagePostPage'),
    meta: {
      ...meta,
      requiresAuth: true,
      admin: true,
    },
    children: [
      {
        path: '/:id(\\d+)::cmd(admin)/posteriors/quicklinks',
        name: 'manageposteriors_quicklinks',
        component: dynamicImport(
          'page/static/Admin/ManagePosts/ManageQuickLinks',
        ),
        meta: {
          ...meta,
          requiresAuth: true,
          admin: true,
        },
      },
      {
        path: '/:id(\\d+)::cmd(admin)/posteriors/categories',
        name: 'manageposteriors_categories',
        component: dynamicImport(
          'page/static/Admin/ManagePosts/ManageCategories',
        ),
        meta: {
          ...meta,
          requiresAuth: true,
          admin: true,
        },
      },
      {
        path: '/:id(\\d+)::cmd(admin)/posteriors/heros',
        name: 'manageposteriors_heros',
        component: dynamicImport('page/static/Admin/ManagePosts/ManageHeros'),
        meta: {
          ...meta,
          requiresAuth: true,
          admin: true,
        },
      },
      {
        path: '/:id(\\d+)::cmd(admin)/posteriors/trending',
        name: 'manageposteriors_trending',
        component: dynamicImport(
          'page/static/Admin/ManagePosts/ManageTrendingPosts',
        ),
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
    component: dynamicImport('page/static/Admin/SiteSettings'),
    meta: {
      ...meta,
      requiresAuth: true,
      admin: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(admin)/spam',
    name: 'managespam',
    component: dynamicImport('page/static/Admin/ManageSpamUsers'),
    meta: {
      ...meta,
      requiresAuth: true,
      admin: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(settings)/',
    name: 'settings',
    component: dynamicImport('page/static/Users/Settings'),
    meta: {
      ...meta,
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(delete)/me',
    name: 'deleteme',
    component: dynamicImport('page/static/Users/DeleteMe'),
    meta: {
      ...meta,
      requiresAuth: true,
    },
  },
];

export default frameIn;
