const dynamicImport = require(`@/libs/util.import.${process.env.NODE_ENV}`);

const meta = {
  disableCache: false,
};

const frameIn = [
  {
    path: '/:id(\\d+)::cmd(text)/:path',
    name: 'text',
    component: dynamicImport('GoText'),
    meta: {
      ...meta,
      view: 'text',
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(pdf)/:path',
    name: 'pdf',
    component: dynamicImport('GoPdf'),
    meta: {
      ...meta,
      view: 'pdf',
      requiresAuth: true,
    },
  },
  {
    path: '/',
    name: 'base',
    component: dynamicImport('GoList'),
    meta: {
      ...meta,
      redirect: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(video)/:path',
    name: 'video',
    component: dynamicImport('GoVideo'),
    meta: {
      ...meta,
      view: 'video',
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(audio)/:path',
    name: 'audio',
    component: dynamicImport('GoAudio'),
    meta: {
      ...meta,
      view: 'audio',
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(image)/:path',
    name: 'image',
    component: dynamicImport('GoImg'),
    meta: {
      ...meta,
      view: 'image',
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(search)(/?q=)*',
    name: 'search',
    component: dynamicImport('GoList'),
    meta: {
      ...meta,
      view: 'list',
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+):/:path*',
    name: 'files',
    component: dynamicImport('GoList'),
    meta: {
      ...meta,
      view: 'list',
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(others)/:path',
    name: 'otherFiles',
    component: dynamicImport('GoOthers'),
    meta: {
      ...meta,
      view: 'list',
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(login)/',
    name: 'login',
    component: dynamicImport('static/Users/Login'),
    meta: {
      ...meta,
      guest: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(register)/',
    name: 'register',
    component: dynamicImport('static/Admin/Register'),
    meta: {
      ...meta,
      requiresAuth: true,
      admin: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(invite)/',
    name: 'invite',
    component: dynamicImport('static/Admin/Invite'),
    meta: {
      ...meta,
      requiresAuth: true,
      admin: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(register)/otp',
    name: 'otp',
    component: dynamicImport('static/OtpRegister'),
    meta: {
      ...meta,
      guest: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(home)/',
    name: 'home',
    component: dynamicImport('static/Home'),
    meta: {
      ...meta,
      guest: true,
      allow: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(result)/',
    name: 'results',
    component: dynamicImport('static/ResultPage'),
    meta: {
      ...meta,
      guest: true,
      allow: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(register)/request/user',
    name: 'request',
    component: dynamicImport('static/Request'),
    meta: {
      ...meta,
      guest: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(settings)/request/',
    name: 'requestadmin',
    component: dynamicImport('static/Users/RequestPrivs'),
    meta: {
      ...meta,
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(settings)/changepassword',
    name: 'changepassword',
    component: dynamicImport('static/Users/ChangePassword'),
    meta: {
      ...meta,
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(admin)/',
    name: 'admin',
    component: dynamicImport('static/Admin/AdminArea'),
    meta: {
      ...meta,
      requiresAuth: true,
      admin: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(admin)/manage',
    name: 'manageUsers',
    component: dynamicImport('static/Admin/ManageUsers'),
    meta: {
      ...meta,
      requiresAuth: true,
      admin: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(admin)/posteriors',
    name: 'manageposteriors',
    component: dynamicImport('static/Admin/MainManagePostPage'),
    meta: {
      ...meta,
      requiresAuth: true,
      admin: true,
    },
    children: [
      {
        path: '/:id(\\d+)::cmd(admin)/posteriors/quicklinks',
        name: 'manageposteriors_quicklinks',
        component: dynamicImport('static/Admin/ManagePosts/ManageQuickLinks'),
        meta: {
          ...meta,
          requiresAuth: true,
          admin: true,
        },
      },
      {
        path: '/:id(\\d+)::cmd(admin)/posteriors/categories',
        name: 'manageposteriors_categories',
        component: dynamicImport('static/Admin/ManagePosts/ManageCategories'),
        meta: {
          ...meta,
          requiresAuth: true,
          admin: true,
        },
      },
      {
        path: '/:id(\\d+)::cmd(admin)/posteriors/heros',
        name: 'manageposteriors_heros',
        component: dynamicImport('static/Admin/ManagePosts/ManageHeros'),
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
          'static/Admin/ManagePosts/ManageTrendingPosts',
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
    component: dynamicImport('static/Admin/SiteSettings'),
    meta: {
      ...meta,
      requiresAuth: true,
      admin: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(admin)/spam',
    name: 'managespam',
    component: dynamicImport('static/Admin/ManageSpamUsers'),
    meta: {
      ...meta,
      requiresAuth: true,
      admin: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(settings)/',
    name: 'settings',
    component: dynamicImport('static/Users/Settings'),
    meta: {
      ...meta,
      requiresAuth: true,
    },
  },
  {
    path: '/:id(\\d+)::cmd(delete)/me',
    name: 'deleteme',
    component: dynamicImport('static/Users/DeleteMe'),
    meta: {
      ...meta,
      requiresAuth: true,
    },
  },
];

export default frameIn;
