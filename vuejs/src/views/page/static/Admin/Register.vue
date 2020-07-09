<template>
    <div :class="ismobile ? 'content mx-1 mt-2 px-0 is-clipped' : 'content ml-5 mr-5 mt-2 pl-5 pr-5 is-clipped'">
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
      </div>
      <div class="columns is-vcentered is-centered is-multiline">
        <div class="column is-half">
          <div class="columns is-desktop is-multiline is-centered">
            <div class="column is-full">
              <div class="box has-background-primary">
                <p class="title has-text-weight-bold has-text-white has-text-centered">Currently Logged as</p>
                <p class="subtitle has-text-weight-bold has-text-white has-text-centered">Scroll Down to Accept Users</p>
                <div class="columns is-vcentered is-multiline is-mobile">
                  <div class="column is-three-fifths">
                    <p class="subtitle has-text-black">Admin Name</p>
                  </div>
                  <div class="column is-two-fifths">
                    <p class="subtitle has-text-black has-text-weight-bold">{{ user.name }}</p>
                  </div>
                  <div class="column is-three-fifths">
                    <p class="subtitle has-text-black">Currently You are</p>
                  </div>
                  <div class="column is-two-fifths">
                    <p class="subtitle has-text-black has-text-weight-bold">{{ user.role }}</p>
                  </div>
                  <div v-if="user.admin && !user.superadmin" class="column is-full">
                    <p class="subtitle has-text-weight-bold has-text-warning-dark">
                      Your Scope is Restricted to Adding Additional Users. Use the Below Button to get Pending User Requests.
                    </p>
                  </div>
                  <div v-if="user.admin && !user.superadmin" class="column has-text-centered is-full">
                    <button class="button is-white" @click="gotoPage('/request/', 'settings')">
                      <span class="icon is-small">
                        <i class="fas fa-user-shield"></i>
                      </span>
                      <span>Request</span>
                    </button>
                  </div>
                  <div v-if="user.admin && user.superadmin" class="column is-full">
                    <p class="subtitle has-text-weight-bold has-text-danger-dark">
                      Your Scope is Maximum and Can Add Additional Users, Promote Users.Use the Below Buttons to get Pending User Requests.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div :class=" modal ? 'modal is-active' : 'modal' ">
              <div class="modal-background"></div>
              <div class="modal-card">
                <header class="modal-card-head">
                  <p class="modal-card-title has-text-centered">{{ listname }}</p>
                  <button class="delete" @click="modal = false; pendingUserList = [];" aria-label="close"></button>
                </header>
                <section class="modal-card-body">
                  <div v-if="pendingUserList.length == 0" class="columns is-centered is-mobile">
                    <div class="column has-text-centered is-full">
                      <p class="subtitle has-text-black">No Pending User Requests</p>
                    </div>
                  </div>
                  <div v-else class="columns is-centered is-mobile" v-for="user in pendingUserList" v-bind:key="user.name">
                    <div class="column is-6">
                      <p class="subtitle has-text-black">{{ user.email }}</p>
                    </div>
                    <div class="column is-5 has-text-right">
                      <button class="button is-success is-rounded" @click="handleTransport(user, setrole)">
                        <span class="icon is-small">
                          <i class="fas fa-user-plus"></i>
                        </span>
                        <span>Accept</span>
                      </button>
                    </div>
                    <div class="column is-1 has-text-centered">
                      <span class="has-text-danger icon-link" @click="handleDelete(deleteApi, user)">
                        <i class="fas fa-trash-alt"></i>
                      </span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            <div class="column is-full">
              <div class="columns is-dekstop is-multiline">
                <div class="column is-full">
                  <div class="box has-background-dark">
                    <h3 class="title has-text-weight-bold has-text-white has-text-centered">Pending Users</h3>
                    <div class="columns is-mobile is-multiline is-vcentered">
                      <div class="column is-two-thirds">
                        <p class="subtitle has-text-weight-semibold has-text-white">
                          Pending Users
                        </p>
                      </div>
                      <div class="column is-one-third">
                        <button class="button is-success" @click="modal = true; listname = 'Users - Pending';getPendingUsers(pendingusers); setrole = 'user';deleteApi = 'user'">
                          <span class="icon is-small">
                            <i class="fas fa-user-shield"></i>
                          </span>
                          <span>Get</span>
                        </button>
                      </div>
                      <div v-if="user.admin && user.superadmin" class="column is-two-thirds">
                        <p class="subtitle has-text-weight-semibold has-text-white">
                          Pending Admins
                        </p>
                      </div>
                      <div v-if="user.admin && user.superadmin" class="column is-one-third">
                        <button class="button is-success" @click="modal = true; listname = 'Admins - Pending';getPendingUsers(pendingadmin); setrole = 'admin';deleteApi = 'admin'">
                          <span class="icon is-small">
                            <i class="fas fa-user-shield"></i>
                          </span>
                          <span>Get</span>
                        </button>
                      </div>
                      <div v-if="user.admin && user.superadmin" class="column is-two-thirds">
                        <p class="subtitle has-text-weight-semibold has-text-white">
                          Pending Superadmins
                        </p>
                      </div>
                      <div v-if="user.admin && user.superadmin" class="column is-one-third">
                        <button class="button is-success" @click="modal = true; listname = 'Admins - Pending';getPendingUsers(pendingsuperadmin); setrole = 'superadmin';deleteApi = 'superadmin';">
                          <span class="icon is-small">
                            <i class="fas fa-user-shield"></i>
                          </span>
                          <span>Get</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column is centered has-text-centered has-text-white is-two-fifths">
          <article :class=" warnmessageVisibility ? 'message is-warning' : 'message is-hidden is-warning'">
            <div class="message-header">
              <p>Important</p>
              <button class="delete" @click="warnmessageVisibility = false" aria-label="delete"></button>
            </div>
            <div class="message-body">
              <span>Only Pending User and Admin Requests can be Accepted.Use Invite Option to Invite Users.</span>
              <div class="buttons is-centered mt-2">
                <button class="button is-rounded is-danger" @click="gotoPage('/', 'invite')">
                  <span class="icon is-small">
                    <i class="fas fa-user-plus"></i>
                  </span>
                  <span>Invite</span>
                </button>
              </div>
            </div>
          </article>
          <article :class=" errorMessage ? 'message is-danger' : 'message is-hidden is-danger'">
            <div class="message-header">
              <p>Error Proccessing</p>
              <button class="delete" @click="errorMessage = false" aria-label="delete"></button>
            </div>
            <div class="message-body">
              {{ resultmessage }}
            </div>
          </article>
          <article :class=" successMessage ? 'message is-success' : 'message is-hidden is-success'">
            <div class="message-header">
              <p>Success !</p>
              <button class="delete" @click="successMessage = false" aria-label="delete"></button>
            </div>
            <div class="message-body">
              {{ resultmessage }}
            </div>
          </article>
          <h2 class="title has-text-weight-bold has-text-white">Add / Promote Users</h2>
          <p class="is-small has-text-white has-text-weight-bold">User Details will be Autopopulated After Selecting User</p>
          <form @submit.prevent="handleSubmit">
            <div class="field">
              <div class="control has-icons-left has-icons-right">
                <input class="input is-rounded" disabled placeholder=" Recipient's Name (AutoFilled) " id="name" type="text" v-model="name" required autofocus>
                <span class="icon is-small is-left">
                  <i class="fas fa-user"></i>
                </span>
                <span class="icon is-small is-right">
                  <i class="fas fa-check"></i>
                </span>
                <p class="help is-warning">Name of Recipient(Auto Filled)</p>
              </div>
            </div>
            <div class="field">
              <div class="control has-icons-left has-icons-right">
                <input class="input is-rounded is-focused" disabled placeholder="Recipient's Email (AutoFilled)" id="email" type="email" v-model="email" required>
                <span class="icon is-small is-left">
                  <i class="fas fa-envelope"></i>
                </span>
                <span class="icon is-small is-right">
                  <i class="fas fa-check"></i>
                </span>
                <p class="help is-warning">Email of Recipient(Auto Filled)</p>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <textarea class="textarea is-success is-rounded" disabled placeholder="Message From Recipient" id="message" rows="3" v-model="message" required></textarea>
                <p class="help is-warning">Message From Recipient(Auto Filled)</p>
              </div>
            </div>
            <label class="subtitle has-text-white"> User's Role(Auto Filled)</label>
            <div class="control mb-3">
                <input class="is-checkradio is-small is-warning" id="userradio" type="radio" name="role" checked value="user" disabled v-model="role">
                <label for="userradio">User</label>
                <input class="is-checkradio is-small is-warning" id="adminradio" type="radio" name="role" value="admin" disabled v-model="role">
                <label for="adminradio"> Admin</label>
                <input class="is-checkradio is-small is-warning" id="superadminradio" type="radio" name="role" value="superadmin" disabled v-model="role">
                <label for="superadminradio">Superadmin</label>
            </div>
            <p v-if="admin && !superadmin" class="help is-warning">Only Superadmin can Accept Admin & Superadmin users</p>
            <div class="field">
              <p class="control has-icons-left">
                <input class="input is-rounded" id="password" type="password" placeholder="Your Admin Password" v-model="password" required autofocus>
                <span class="icon is-small is-left">
                  <i class="fas fa-lock"></i>
                </span>
              </p>
            </div>
            <div class="field">
              <div class="control">
                <div class="b-checkbox is-warning is-circular is-inline">
                  <input class="styled has-text-success" type="checkbox" id="terms" name="terms" v-model="checked">
                  <label for="terms">
                    <span class="content has-text-white">  I Accept and Read the <a class="has-text-warning" href="https://raw.githubusercontent.com/tks18/gindex-v4/dark-mode-0-1/CONTRIBUTING.md" target="_blank">Community Guidelines</a></span>
                  </label>
                </div>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <div class="b-checkbox is-warning is-circular is-inline">
                  <input class="styled has-text-success" type="checkbox" id="code" name="terms" v-model="codechecked">
                  <label for="code">
                    <span class="content has-text-white">  I Accept and Read the <a class="has-text-warning" href="https://github.com/tks18/gindex-v4/blob/dark-mode-0-1/CODE_OF_CONDUCT.md" target="_blank">Code of Conduct</a></span>
                  </label>
                </div>
              </div>
            </div>
            <div>
            <button :class=" loading ? 'button is-loading is-rounded is-warning' : 'button is-warning is-rounded' " type="submit" :disabled="disabled">
              <span class="icon">
                <i class="fas fa-user-plus"></i>
              </span>
              <span>Add User</span>
            </button>
            <a class="ml-3 button is-rounded is-white" @click="name = ''; email = ''; password = ''; message = ''; role = ''; checked = false; codechecked = false;">
              <span class="icon">
                <i class="fas fa-sync"></i>
              </span>
              <span>Reset</span>
            </a>
            </div>
          </form>
        </div>
      </div>
    </div>
</template>
<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
export default {
    components: {
      Loading
    },
        props : ["nextUrl"],
        data(){
            return {
                user: {},
                admin: false,
                superadmin: false,
                name : "",
                email : "",
                namedisabled: false,
                adminmessage: "",
                disabled: true,
                deleteApi: "",
                password : "",
                apiurl: "",
                role: "",
                setrole: "",
                gds: [],
                currgd: {},
                successMessage: false,
                errorMessage: false,
                warnmessageVisibility: true,
                modal: false,
                resultmessage: "",
                message: "",
                checked: false,
                codechecked: false,
                pendingMessage: "",
                columnVisibility: false,
                loading: false,
                fullpage: true,
                pendingadmin: window.apiRoutes.getPendingAdmins,
                pendingsuperadmin: window.apiRoutes.getPendingSuperAdmins,
                pendingusers: window.apiRoutes.getPendingUsers,
                pendingUserList: [],
                listname: "",
            }
        },
        methods : {
            handleSubmit(e) {
              this.loading = true;
                e.preventDefault()
                if (this.name.length > 0 && this.email.length > 0 && this.password && this.password.length > 0 && this.checked && this.role.length > 0 && this.codechecked)
                {
                  this.$http.post(this.apiurl, {
                        name: this.name,
                        email: this.email,
                        adminpass: this.password,
                        adminuseremail: this.user.email,
                  })
                  .then(response => {
                      if(response){
                        if(response.data.auth && response.data.registered){
                          this.loading = false;
                          this.successMessage = true;
                          this.errorMessage = false;
                          this.resultmessage = response.data.message
                        } else {
                          this.loading = false;
                          this.successMessage = false;
                          this.errorMessage = true;
                          this.resultmessage = response.data.message
                        }
                      }
                  })
                  .catch(error => {
                      console.error(error);
                  });
                } else {
                    this.loading = false;
                    this.successMessage = false;
                    this.errorMessage = true;
                    this.resultmessage = "Fill in the Form Properly"
                    this.password = "";
                }
            },
            handleTransport(user, role){
              this.modal = false;
              this.name = user.name;
              this.role = role;
              this.message = user.message
              this.email = user.email;
            },
            getPendingUsers(route) {
              this.modal = true;
              this.loading = true;
              this.$http.post(route, {
                    adminuseremail: this.user.email,
              }).then(response => {
                if(response){
                  if(response.data.auth && response.data.registered){
                    this.loading = false;
                    this.columnVisibility = true;
                    this.pendingUserList = response.data.users;
                  } else {
                    this.loading = false;
                    this.columnVisibility = false;
                    this.pendingMessage = response.data.message;
                  }
                }
              })
            },
            gotoPage(url, cmd) {
              if(cmd){
                this.$router.push({ path: '/'+ this.currgd.id + ':' + cmd + url })
              } else {
                this.$router.push({ path: '/'+ this.currgd.id + ':' + url })
              }
            },
            validateData() {
              if(this.name.length > 0 && this.email.length > 0 && this.password && this.password.length > 0 && this.checked && this.role.length > 0 && this.codechecked && this.password.length > 0){
                this.disabled = false;
              } else {
                this.disabled = true;
              }
            },
            handleDelete(post, user) {
              this.loading = true;
              let route = "";
              let reloadRoute = "";
              if(post == "user"){
                route = window.apiRoutes.deletePendingUsers;
                reloadRoute = this.pendingusers;
              } else if(post == "admin"){
                route = window.apiRoutes.deletePendingAdmins;
                reloadRoute = this.pendingadmin;
              } else if(post == "superadmin"){
                reloadRoute = this.pendingsuperadmin;
                route = window.apiRoutes.deletePendingSuperAdmins;
              }
              this.$http.post(route, {
                email: user.email,
                adminuseremail: this.user.email
              }).then(response => {
                if(response){
                  if(response.data.auth && response.data.removed){
                    this.pendingUserList = [];
                    this.getPendingUsers(reloadRoute);
                    this.loading = false;
                  } else {
                    this.loading = false;
                    this.modal = true;
                  }
                } else {
                  this.loading = false;
                }
              })
            }
        },
        computed: {
          ismobile() {
            var width = window.innerWidth > 0 ? window.innerWidth : screen.width;
            if(width > 966){
              return false
            } else {
              return true
            }
          }
        },
        beforeMount() {
          this.loading = true;
          var user = localStorage.getItem("userdata");
          var token = localStorage.getItem("tokendata");
          if(user && token){
            var userData = JSON.parse(this.$hash.AES.decrypt(user, this.$pass).toString(this.$hash.enc.Utf8));
            this.user = userData;
            this.loading = false;
          } else {
            this.user = null;
            this.loading = false;
          }
        },
        mounted(){
          this.loading = true;
          if(this.user.admin && this.user.superadmin){
            this.admin = true, this.superadmin = true, this.loading = false;
          } else if(this.user.admin && !this.user.superadmin) {
            this.admin = true, this.superadmin = false, this.loading = false;
          } else {
            this.loading = false;
            this.$router.push({ name: 'results', params: { id: this.currgd.id, cmd: "result", success: false, data: "UnAuthorized Route. Not Allowed.", redirectUrl: "/", tocmd: "home" } })
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
          role: function() {
            if(this.role == "admin"){
              this.namedisabled = true;
              this.validateData();
              this.apiurl = window.apiRoutes.upgradeAdmin
            } else if(this.role == "superadmin"){
              this.namedisabled = true;
              this.validateData();
              this.apiurl = window.apiRoutes.upgradeSuperAdmin
            } else {
              this.namedisabled = false;
              this.validateData();
              this.apiurl = window.apiRoutes.registerRoute
            }
          },
          name: "validateData",
          email: "validateData",
          message: "validateData",
          password: "validateData",
          checked: "validateData",
          codechecked: "validateData"
        },
    }
</script>
