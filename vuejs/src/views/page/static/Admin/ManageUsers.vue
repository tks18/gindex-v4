<template>
  <div>
    <div class="content mt-2">
      <h1 class="title has-text-centered has-text-weight-bold has-text-white">Manage Your Users</h1>
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
      </div>
      <div class="columns mx-3 is-mobile is-multiline is-vcentered">
        <div class="column is-full">
          <div class="columns is-desktop is-multiline is-vcentered is-centered">
            <div class="column has-text-centered is-3">
              <p class="control has-icons-right">
                <input class="input is-rounded" placeholder="Enter User's Email" autofocus id="email" type="email" v-model="searchEmail">
                <span class="icon is-small is-right">
                  <i class="fas fa-search"></i>
                </span>
              </p>
            </div>
            <div class="column has-text-centered is-3">
              <button @click="handleRefresh" :class=" loading ? 'button is-rounded is-loading is-warning' : 'button is-rounded is-warning'">
                <span class="icon">
                  <i class="fas fa-sync"></i>
                </span>
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
        <div :class=" usermodal ? 'modal is-active' : 'modal'">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title has-text-centered">{{ currentUser.name }}</p>
              <button class="delete" aria-label="close" @click="closeUserModal"></button>
            </header>
            <section class="modal-card-body">
              <div class="columns is-mobile is-centered is-vcentered is-multiline">
                <div class="column is-half">
                  <p class="subtitle has-text-black has-text-weight-normal">Name</p>
                </div>
                <div class="column is-half">
                  <p class="subtitle has-text-black has-text-weight-semibold">{{ currentUser.name }}</p>
                </div>
                <div class="column is-half">
                  <p class="subtitle has-text-black has-text-weight-normal">Email</p>
                </div>
                <div class="column is-half">
                  <p class="subtitle has-text-black has-text-weight-semibold">{{ currentUser.email }}</p>
                </div>
                <div class="column is-half">
                  <p class="subtitle has-text-black has-text-weight-normal">Role</p>
                </div>
                <div class="column is-half">
                  <p class="subtitle has-text-black has-text-weight-semibold">{{ currentUser.role }}</p>
                </div>
                <div class="column is-full">
                  <article :class=" errorMessage ? 'message is-danger' : 'message is-hidden is-danger'">
                    <div class="message-body">
                      <button class="delete" @click="errorMessage = false" aria-label="delete"></button>
                      {{ resultmessage }}
                    </div>
                  </article>
                </div>
                <div class="column is-full">
                  <article :class=" successMessage ? 'message is-success' : 'message is-hidden is-success'">
                    <div class="message-body">
                      <button class="delete" @click="successMessage = false" aria-label="delete"></button>
                      {{ resultmessage }}
                    </div>
                  </article>
                </div>
                <div v-show="!inviteInput && !deleteInput" :class="admin && superadmin ? currentUser.admin && currentUser.superadmin && !currentUser.pending ? 'column has-text-centered is-half' : 'column has-text-right is-quarter' : 'column has-text-centered is-half' ">
                  <button class="button is-rounded is-danger" @click="deleteInput = true;">
                    Delete
                  </button>
                </div>
                <div v-show="!inviteInput && !deleteInput" v-if="admin && superadmin && !currentUser.admin && !currentUser.superadmin && !currentUser.pending" class="column has-text-left is-quarter has-text-centered">
                  <button class="button is-rounded is-primary" @click="inviteInput = true;">
                    Invite as Admin
                  </button>
                </div>
                <div v-show="!inviteInput && !deleteInput" v-if="admin && superadmin && currentUser.admin && !currentUser.superadmin && !currentUser.pending" class="column has-text-left is-quarter has-text-centered">
                  <button class="button is-rounded is-primary" @click="inviteInput = true;">
                    Invite as Superadmin
                  </button>
                </div>
                <div v-show="!inviteInput && !deleteInput" v-if="admin && superadmin && !currentUser.admin && !currentUser.superadmin && currentUser.pending" class="column has-text-left is-quarter has-text-centered">
                  <button class="button is-rounded is-primary" @click="gotoPage('/', 'register')">
                    Grant Admin
                  </button>
                </div>
                <div v-show="!inviteInput && !deleteInput" v-if="admin && superadmin && currentUser.admin && !currentUser.superadmin && currentUser.pending" class="column has-text-left is-quarter has-text-centered">
                  <button class="button is-rounded is-primary" @click="gotoPage('/', 'register')">
                    Grant Superadmin
                  </button>
                </div>
                <div v-if="inviteInput" class="column is-full">
                  <div class="columns is-mobile is-multiline is-centered">
                    <div class="column is-full">
                      <div class="field">
                        <div class="control">
                          <textarea class="textarea is-success is-rounded" placeholder="Message to Him" id="message" rows="3" v-model="inviteMessage" required></textarea>
                        </div>
                      </div>
                    </div>
                    <div class="column has-text-right is-half">
                      <button class="button is-rounded is-primary" @click="handleInvite(currentUser)">
                        Invite
                      </button>
                    </div>
                    <div class="column has-text-left is-half" @click="inviteInput = false;errorMessage = false;">
                      <button class="button is-rounded is-success" >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
                <div v-if="deleteInput" class="column is-full">
                  <div class="columns is-mobile is-multiline is-centered">
                    <div class="column is-full">
                      <div class="field">
                        <p class="control has-icons-left">
                          <input class="input is-rounded is-danger" @keyup.enter="handleUpgradeDelete(currentUser, 'delete')" id="deletePassword" type="password" placeholder="Enter Your Admin Password" v-model="deletePassword">
                          <span class="icon is-small is-left">
                            <i class="fas fa-lock"></i>
                          </span>
                        </p>
                      </div>
                    </div>
                    <div class="column has-text-right is-half">
                      <button class="button is-rounded is-danger"  @click="handleUpgradeDelete(currentUser, 'delete')">
                        Delete
                      </button>
                    </div>
                    <div class="column has-text-left is-half" @click="deleteInput = false;errorMessage = false;">
                      <button class="button is-rounded is-success" >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <div v-if="searchedUsers.length > 0" class="column is-full">
          <table class="table">
            <thead>
              <tr>
                <th class="has-text-white" >Name</th>
                <th class="has-text-white is-hidden-mobile is-hidden-touch" >Email</th>
                <th class="has-text-white is-hidden-mobile is-hidden-touch" >Role</th>
                <th class="has-text-white" >Action</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <th class="has-text-white">Total Users</th>
                <th class="has-text-white">{{ searchedUsers.length }}</th>
              </tr>
            </tfoot>
            <tbody>
              <tr v-for="(user, index) in searchedUsers" v-bind:key="index">
                <th class="has-text-white" >{{ user.name }}</th>
                <th class="has-text-white is-hidden-mobile is-hidden-touch" >{{ user.email.slice(0,30) }}</th>
                <th class="has-text-white is-hidden-mobile is-hidden-touch" >{{ user.role }}</th>
                <th class="has-text-white" >
                  <button class="button is-danger is-rounded" @click="userModal(user)">
                    View
                  </button>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="column is-full">
          <p class="subtitle has-text-centered has-text-white">Please Click Refresh Button to Load Users</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from 'vue-loading-overlay';
export default {
  components: {
    Loading,
  },
  data(){
    return {
      user: {},
      token: {},
      users: [],
      gds: [],
      currgd: {},
      deletePassword: "",
      errorMessage: false,
      successMessage: false,
      inviteAdmin: window.apiRoutes.inviteAdmin,
      inviteSuperAdmin:  window.apiRoutes.inviteSuperAdmin,
      deleteUser: window.apiRoutes.deleteUser,
      deleteAdmin: window.apiRoutes.deleteAdmin,
      inviteInput: false,
      deleteInput: false,
      inviteApi: "",
      inviteMessage: "",
      resultmessage: "",
      currentUser: {},
      usermodal: false,
      searchedUsers: [],
      apiurl: "",
      searchEmail: "",
      admin: false,
      superadmin: false,
      loading: false,
      fullpage: true,
    }
  },
  methods: {
    handleRefresh() {
      this.loading = true;
      if(this.apiurl.length > 0){
        this.$http.post(this.apiurl, {
            email: this.user.email,
        }).then(response => {
          if(response.data.auth && response.data.registered){
            this.loading = false;
            this.users = response.data.users;
            this.searchedUsers = response.data.users;
          } else {
            console.log(response);
          }
        })
      }
    },
    gotoPage(url, cmd) {
      if(cmd){
        this.$router.push({ path: '/'+ this.currgd.id + ':' + cmd + url })
      } else {
        this.$router.push({ path: '/'+ this.currgd.id + ':' + url })
      }
    },
    handleUpgradeDelete(user, action) {
      this.loading = true;
      let route = "";
      if(action == "delete"){
        if(user.role == "User"){
          route = this.deleteUser;
        } else {
          route = this.deleteAdmin;
        }
      }
      this.$http.post(route, {
            email: user.email,
            adminpass: this.deletePassword,
            adminuseremail: this.user.email,
      }).then(response => {
        if(action == "delete"){
          if(response.data.auth && response.data.registered && response.data.deleted){
            this.usermodal = false;
            this.currentUser = {};
            this.errorMessage = false;
            this.successMessage = false;
            this.inviteInput = false;
            this.deleteInput = false;
            this.deletePassword = "";
            this.loading = false;
            this.handleRefresh();
          } else {
            this.loading = false;
            this.errorMessage = true
            this.successMessage = false;
            this.resultmessage = response.data.message;
          }
        }
      })
    },
    handleInvite(user) {
      this.loading = true;
      let route = "";
      if(user.role == "User"){
        route = this.inviteAdmin;
      } else {
        route = this.inviteSuperAdmin;
      }
      if(user.role == "Admin" || user.role == "User" && this.inviteMessage.length >0){
        this.$http.post(route, {
              email: user.email,
              message: this.inviteMessage,
              adminuseremail: this.user.email,
        }).then(response => {
          if(response.data.auth && response.data.registered){
            this.successMessage = true;
            this.errorMessage = false;
            this.resultmessage = response.data.message;
            this.loading = false;
          } else {
            this.successMessage = false;
            this.errorMessage = true;
            this.resultmessage = response.data.message;
            this.loading = false;
          }
        })
      } else {
        console.log(this.inviteMessage);
      }
    },
    userModal(user){
      this.usermodal = true;
      this.errorMessage = false;
      this.successMessage = false;
      this.currentUser = user;
      let route = "";
      if(user.role == "User"){
        route = window.apiRoutes.getPendingAdmins;
      } else if(user.role == "Admin"){
        route = window.apiRoutes.getPendingSuperAdmins;
      }
      console.log(route);
      if(user.role == "User" || user.role == "Admin"){
        this.loading = true;
        this.$http.post(route, {
              adminuseremail: this.user.email,
        }).then(response => {
          if(response){
            console.log(response);
            if(response.data.auth && response.data.registered){
              response.data.users.forEach((pendingUser) => {
                if(pendingUser.email == user.email){
                    this.loading = false;
                    this.currentUser.pending = true;
                } else {
                  this.loading = false;
                  this.currentUser.pending = false;
                }
              });
            } else {
              this.loading = false;
              this.currentUser.pending = false
            }
          } else {
            this.loading = false;
            this.currentUser.pending = false
          }
        })
      } else {
        this.loading = false;
        this.currentUser.pending = false
      }
    },
    closeUserModal() {
      this.usermodal = false;
      this.currentUser = {};
      this.errorMessage = false;
      this.successMessage = false;
      this.inviteInput = false;
      this.deleteInput = false;
      this.deletePassword = "";
    }
  },
  beforeMount() {
    this.loading = true;
    var token = localStorage.getItem("tokendata")
    var user = localStorage.getItem("userdata");
    if (user != null && token != null){
      var tokenData = JSON.parse(this.$hash.AES.decrypt(token, this.$pass).toString(this.$hash.enc.Utf8));
      var userData = JSON.parse(this.$hash.AES.decrypt(user, this.$pass).toString(this.$hash.enc.Utf8));
      this.user = userData, this.token = tokenData, this.loading = false;
    } else {
      this.user = null, this.token = null, this.loading = false;
    }
  },
  mounted() {
    if(this.user.admin && this.user.superadmin){
      this.admin = true, this.superadmin = true,this.loading = false;
      this.apiurl = window.apiRoutes.getAll;
    } else if(this.user.admin && !this.user.superadmin) {
      this.admin = true, this.superadmin = false,this.loading = false;
      this.apiurl = window.apiRoutes.getUsers;
    } else {
      this.$router.push({ name: 'results', params: { id: this.currgd.id, cmd: "result", data: "UnAuthorized Route.", redirectUrl: "/", tocmd: 'home' } })
    }
  },
  created() {
    if (window.gds) {
      this.gds = window.gds.map((item, index) => {
        return {
          name: item,
          id: index,
        };
      });
      let index = this.$route.params.id;
      if (this.gds) {
        this.currgd = this.gds[index];
      }
    }
  },
  watch: {
    searchEmail: function(){
      if(this.users.length){
        var escapedSearch = this.searchEmail;
        var searchRegex = new RegExp(escapedSearch,"g")
        this.searchedUsers = this.users.filter(user => {
          return searchRegex.test(user.email)
        })
      }
    }
  }
}
</script>
