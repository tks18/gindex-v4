const backendBaseUrl = window.backend;

export const apiRoutes = {
  checkEmail: backendBaseUrl+'/checkmail',
  loginRoute: backendBaseUrl+'/login',
  registerRoute: backendBaseUrl+'/register/user',
  otpRegister: backendBaseUrl+'/register/approve/otp',
  requestRoute: backendBaseUrl+'/request/user',
  verifyRoute: backendBaseUrl+'/user/verify',
  changePasswordRoute: backendBaseUrl+'/user/changepassword',
  requestadminroute: backendBaseUrl+'/request/admin',
  requestsuperadminroute: backendBaseUrl+'/request/superadmin',
  getPendingUsers: backendBaseUrl+'/get/pending/users',
  getPendingAdmins: backendBaseUrl+'/get/pending/admins',
  getPendingSuperAdmins: backendBaseUrl+'/get/pending/superadmins',
  deletePendingUsers: backendBaseUrl+'/request/remove/user',
  deletePendingAdmins: backendBaseUrl+'/request/remove/admin',
  deletePendingSuperAdmins: backendBaseUrl+'/request/remove/superadmin',
  upgradeAdmin: backendBaseUrl+'/register/approve/admin',
  upgradeSuperAdmin: backendBaseUrl+'/register/approve/superadmin',
  inviteUser: backendBaseUrl+'/invite/user',
  inviteAdmin: backendBaseUrl+'/invite/admin',
  inviteSuperAdmin: backendBaseUrl+'/invite/superadmin',
  addSpamUser: backendBaseUrl+'/spam/user',
  quickaddSpam: backendBaseUrl+'/spam/quickadd',
  addSpamAdmin: backendBaseUrl+'/spam/admin',
  addSpamSuperAdmin: backendBaseUrl+'/spam/superadmin',
  removeSpamUser: backendBaseUrl+'/spam/remove/user',
  removeSpamAdmin: backendBaseUrl+'/spam/remove/admin',
  removeSpamSuperadmin: backendBaseUrl+'/spam/remove/superadmin',
  getSpamUsers: backendBaseUrl+'/get/spam/users',
  getSpamAdmins: backendBaseUrl+'/get/spam/admins',
  getSpamSuperadmins: backendBaseUrl+'/get/spam/superadmins',
  deleteUser: backendBaseUrl+'/delete/user',
  deleteMe: backendBaseUrl+'/user/delete',
  deleteAdmin: backendBaseUrl+'/delete/admin',
  mediaTokenTransmitter: backendBaseUrl+'/media/generate',
  mediaTokenVerify: backendBaseUrl+'/media/verify',
  getUsers: backendBaseUrl+'/get/users',
  forgotPass: backendBaseUrl+'/user/forgotpass',
  getAll: backendBaseUrl+'/get/all',
  getAdmins: backendBaseUrl+'/get/admins',
  getSuperAdmins: backendBaseUrl+'/get/superadmins',
  setSiteSettings: backendBaseUrl+'/settings/set',
  getSiteSettings: backendBaseUrl+'/settings/get',
}

export function backendHeaders(token){
  return {
    headers: {
        token: token
    },
  }
}
