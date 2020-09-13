<template>
    <div :class="ismobile ? 'content mx-1 mt-2 px-0 is-clipped' : 'content ml-5 mr-5 mt-2 pl-5 pr-5 is-clipped'">
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
      </div>
      <div class="columns is-vcentered is-centered is-multiline">
        <div class="column is-half">
          <div class="columns is-desktop is-multiline is-centered">
            <div :class=" modal ? 'modal is-active' : 'modal' ">
              <div class="modal-background"></div>
              <div class="modal-card">
                <header class="modal-card-head">
                  <p class="modal-card-title has-text-centered">{{ listname }}</p>
                  <button class="delete" @click="modal = false; pendingUserList = [];" aria-label="close"></button>
                </header>
                <section v-bind:key="actionKey" class="modal-card-body">
                  <div v-if="pendingUserList.length == 0" class="columns is-centered is-mobile">
                    <div class="column has-text-centered is-full">
                      <p class="subtitle has-text-black">No Pending User Requests</p>
                    </div>
                  </div>
                  <div v-else class="columns is-centered is-multiline is-mobile" v-for="(user, index) in pendingUserList" v-bind:key="index">
                    <div class="column is-6">
                      <p class="subtitle has-text-black">{{ user.email }}</p>
                    </div>
                    <div class="column is-6 has-text-right">
                      <button class="button is-netflix-red is-rounded" @click="handleUserActions(user.email)">{{ action[user.email] ? "Close" : "Actions" }}</button>
                    </div>
                    <div v-show="action[user.email]" class="column has-text-centered is-full">
                      <div class="box has-background-light">
                        <div class="columns is-mobile is-multiline is-centered">
                          <div :class="ismobile ? 'column is-half' : 'column is-one-third'">
                            <button class="button is-netflix-red is-rounded" @click="handleTransport(user, setrole)">
                              Accept
                            </button>
                          </div>
                          <div :class="ismobile ? 'column is-half' : 'column is-one-third'">
                            <button class="button is-netflix-red is-rounded" @click="handleDelete(deleteApi, user)">
                              Reject
                            </button>
                          </div>
                          <div :class="ismobile ? 'column is-full' : 'column is-one-third'">
                            <button class="button is-netflix-red is-rounded" @click="handleSpam(deleteApi, user)">
                              Mark as Spam
                            </button>
                          </div>
                        </div>
                      </div>
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
                        <button class="button is-netflix-red" @click="modal = true; listname = 'Users - Pending';getPendingUsers(pendingusers); setrole = 'user';deleteApi = 'user'">
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
                        <button class="button is-netflix-red" @click="modal = true; listname = 'Admins - Pending';getPendingUsers(pendingadmin); setrole = 'admin';deleteApi = 'admin'">
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
                        <button class="button is-netflix-red" @click="modal = true; listname = 'Admins - Pending';getPendingUsers(pendingsuperadmin); setrole = 'superadmin';deleteApi = 'superadmin';">
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
            <div>
            <button :class=" loading ? 'button is-loading is-rounded is-netflix-red' : 'button is-netflix-red is-rounded' " type="submit" :disabled="disabled">
              <span class="icon">
                <i class="fas fa-user-plus"></i>
              </span>
              <span>Add User</span>
            </button>
            <a class="ml-3 button is-rounded is-white" @click="name = ''; email = ''; message = ''; role = '';">
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
import {
  initializeUser,
  getgds,
} from "@utils/localUtils";
import { apiRoutes, backendHeaders } from "@/utils/backendUtils";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
export default {
    components: {
      Loading
    },
    metaInfo() {
      return {
        title: this.metatitle,
        titleTemplate: (titleChunk) => {
          if(titleChunk && this.siteName){
            return titleChunk ? `${titleChunk} | ${this.siteName}` : `${this.siteName}`;
          } else {
            return "Loading..."
          }
        },
      }
    },
        props : ["nextUrl"],
        data(){
            return {
                metatitle: "Add / Upgrade Users",
                user: {},
                admin: false,
                superadmin: false,
                name : "",
                email : "",
                action: {},
                actionKey: 0,
                namedisabled: false,
                adminmessage: "",
                disabled: true,
                deleteApi: "",
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
                pendingMessage: "",
                columnVisibility: false,
                loading: false,
                fullpage: true,
                pendingadmin: apiRoutes.getPendingAdmins,
                pendingsuperadmin: apiRoutes.getPendingSuperAdmins,
                pendingusers: apiRoutes.getPendingUsers,
                pendingUserList: [],
                listname: "",
            }
        },
        methods : {
            handleSubmit(e) {
              this.metatitle = "Registering the User...";
              this.loading = true;
                e.preventDefault()
                if (this.name.length > 0 && this.email.length > 0 && this.role.length > 0)
                {
                  this.$backend.post(this.apiurl, {
                        name: this.name,
                        email: this.email,
                        adminuseremail: this.user.email,
                  }, backendHeaders(this.token.token))
                  .then(response => {
                      if(response){
                        if(response.data.auth && response.data.registered){
                          this.loading = false;
                          this.successMessage = true;
                          this.errorMessage = false;
                          this.metatitle = "Success...";
                          this.resultmessage = response.data.message
                        } else {
                          this.loading = false;
                          this.successMessage = false;
                          this.errorMessage = true;
                          this.metatitle = "Failed...";
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
              this.metatitle = "Getting Pending List";
              this.modal = true;
              this.loading = true;
              this.$backend.post(route, {
                    adminuseremail: this.user.email,
              }, backendHeaders(this.token.token)).then(response => {
                if(response){
                  if(response.data.auth && response.data.registered){
                    this.loading = false;
                    this.columnVisibility = true;
                    this.metatitle = "Got the List";
                    this.pendingUserList = response.data.users;
                    response.data.users.forEach((user) => {
                      return this.action[user.email] = false;
                    });
                  } else {
                    this.loading = false;
                    this.columnVisibility = false;
                    this.metatitle = "Failed...";
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
              if(this.name.length > 0 && this.email.length > 0 && this.role.length > 0){
                this.disabled = false;
              } else {
                this.disabled = true;
              }
            },
            handleUserActions(email){
              if(!this.action[email]){
                this.actionKey = this.actionKey + 1;
                this.action[email] = true;
              } else {
                this.actionKey = this.actionKey + 1;
                this.action[email] = false;
              }
            },
            async handleSpam(post, user) {
              this.loading = true;
              this.metatitle = "Adding Spammers...";
              await this.$backend.post(apiRoutes.quickaddSpam, {
                email: user.email,
                adminuseremail: this.user.email
              }, backendHeaders(this.token.token)).then(response => {
                if(response){
                  if(response.data.auth && response.data.registered){
                    this.handleDelete(post, user);
                    this.metatitle = "Adding Spammers...";
                  } else {
                    this.metatitle = "Failed to Add";
                    this.loading = false;
                  }
                }
              })
            },
            handleDelete(post, user) {
              this.metatitle = "Deleting from the List";
              this.loading = true;
              let route = "";
              let reloadRoute = "";
              if(post == "user"){
                route = apiRoutes.deletePendingUsers;
                reloadRoute = this.pendingusers;
              } else if(post == "admin"){
                route = apiRoutes.deletePendingAdmins;
                reloadRoute = this.pendingadmin;
              } else if(post == "superadmin"){
                reloadRoute = this.pendingsuperadmin;
                route = apiRoutes.deletePendingSuperAdmins;
              }
              this.$backend.post(route, {
                email: user.email,
                adminuseremail: this.user.email
              }, backendHeaders(this.token.token)).then(response => {
                if(response){
                  if(response.data.auth && response.data.removed){
                    this.pendingUserList = [];
                    this.metatitle = "Removed";
                    this.getPendingUsers(reloadRoute);
                    this.loading = false;
                  } else {
                    this.metatitle = "Failed to Remove";
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
          },
          siteName() {
            return window.gds.filter((item, index) => {
              return index == this.$route.params.id;
            })[0];
          },
        },
        beforeMount() {
          this.loading = true;
          var userData = initializeUser();
          if(userData.isThere){
            if(userData.type == "hybrid"){
              this.user = userData.data.user;
              this.logged = userData.data.logged;
              this.loading = userData.data.loading;
            } else if(userData.type == "normal"){
              this.user = userData.data.user;
              this.token = userData.data.token;
              this.logged = userData.data.logged;
              this.loading = userData.data.loading;
              this.admin = userData.data.admin;
              this.superadmin = userData.data.superadmin;
            }
          } else {
            this.logged = userData.data.logged;
            this.loading = userData.data.loading;
          }
        },
        created() {
          let gddata = getgds(this.$route.params.id);
          this.gds = gddata.gds;
          this.currgd = gddata.current;
        },
        watch: {
          role: function() {
            if(this.role == "admin"){
              this.namedisabled = true;
              this.validateData();
              this.apiurl = apiRoutes.upgradeAdmin
            } else if(this.role == "superadmin"){
              this.namedisabled = true;
              this.validateData();
              this.apiurl = apiRoutes.upgradeSuperAdmin
            } else {
              this.namedisabled = false;
              this.validateData();
              this.apiurl = apiRoutes.registerRoute
            }
          },
          name: "validateData",
          email: "validateData",
          message: "validateData",
        },
    }
</script>
