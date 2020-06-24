<template>
    <div class="content registration-page is-clipped">
      <TopLinks />
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
      </div>
        <h4>Register</h4>
        <p style="color: #bac964;">{{ databasemessage }}</p>
        <p style="color: #f6f578;">{{ resultmessage }}</p>
        <form @submit.prevent="handleSubmit">
            <label for="name"> > Recipient Name</label>
            <div>
                <input id="name" disabled type="text" v-model="name" required autofocus>
            </div>

            <label for="email" > > Recipient E-Mail Address</label>
            <div>
                <input id="email" type="email" v-model="email" required>
            </div>
            <label> Select User's Role</label>
            <div class="control">
              <label class="radio">
                <input type="radio" name="role" checked value="user" :disabled="!superadmin && !admin" v-model="role">
                User
              </label>
              <label class="radio">
                <input type="radio" name="role" value="admin" :disabled="!superadmin" v-model="role">
                Admin
              </label>
              <label class="radio">
                <input type="radio" name="role" value="superadmin" :disabled="!superadmin" v-model="role" checked>
                Superadmin
              </label>
            </div>
            <p v-if="admin && !superadmin" class="help is-success">Only Superadmin can Accept Admin & Superadmin users</p>
            <label for="password"> > Your Admin Password</label>
            <div>
                <input id="password" type="password" v-model="password" required>
            </div>
            <div class="checkbox">
              <Checkbox color="#ff9595" id="terms" name="terms" v-model="checked">
                I Accept and Read the <a class="guidelines" href="https://github.com/tks18/gindex-v4/blob/dark-mode-0-1/CODE_OF_CONDUCT.md" target="_blank">Community Guidelines</a>
              </Checkbox>
            </div>
            <div>
                <button class="registration-button" type="submit">
                    Register
                </button>
            </div>
            <p style="color: #bac964;">Note: Only Pending User Requests can be Added and Not Anybody.</p>
        </form>
        <hr>
        <div class="pendingusers">
          <button class="getuserbutton" type="submit" @click="getPendingUsers(pendingusers)">Reload Request List</button>
          <p style="color: #bac964;">{{ pendingMessage }}</p>
          <div :class=" modal ? 'modal is-active' : 'modal' ">
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">Modal title</p>
                <button class="delete" @click="modal = false" aria-label="close"></button>
              </header>
              <section class="modal-card-body">
                <div v-for="user in pendingUserList" v-bind:key="user.name" @click="handleTransport(user.name, user.email, 'user')" class="columns is-mobile is-multiline is-centered">
                  <div class="col-data column is-hidden-mobile is-3">
                    <p>{{ user.name }}</p>
                  </div>
                  <div class="col-data column is-3">
                    <p>{{ user.email }}</p>
                  </div>
                  <div class="col-data column is-hidden-mobile is-3">
                    <p>{{ user.message }}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import TopLinks from "../../common/Top-Links";
import Checkbox from "vue-material-checkbox";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
export default {
    components: {
      TopLinks,
      Checkbox,
      Loading
    },
        props : ["nextUrl"],
        data(){
            return {
                name : "",
                email : "",
                namedisabled: false,
                password : "",
                apiurl: "",
                role: "",
                admin: false,
                pendingadmin: window.apiRoutes.getPendingAdmins,
                pendingsuperadmin: window.apiRoutes.getPendingSuperAdmins,
                pendingusers: window.apiRoutes.getPendingUsers,
                superadmin: false,
                modal: false,
                resultmessage: "",
                databasemessage: "",
                userData: JSON.parse(this.$hash.AES.decrypt(localStorage.getItem("userdata"), this.$pass).toString(this.$hash.enc.Utf8)),
                userToken: JSON.parse(this.$hash.AES.decrypt(localStorage.getItem("tokendata"), this.$pass).toString(this.$hash.enc.Utf8)),
                checked: false,
                pendingUserList: [],
                pendingMessage: "",
                columnVisibility: false,
                loading: true,
                fullpage: true,
            }
        },
        methods : {
            handleSubmit(e) {
              this.loading = true;
                e.preventDefault()
                if (this.password && this.password.length > 0)
                {
                  if(this.checked){
                    if(this.role.length > 0){
                      console.log(this.apiurl)
                      this.$http.post(this.apiurl, {
                            name: this.name,
                            email: this.email,
                            adminpass: this.password,
                            adminuseremail: this.userData.email,
                      })
                      .then(response => {
                          if(response){
                            if(response.data.auth && response.data.registered){
                              this.loading = false;
                              this.resultmessage = response.data.message
                            } else {
                              this.loading = false;
                              this.resultmessage = response.data.message
                            }
                          }
                      })
                      .catch(error => {
                          console.error(error);
                      });
                    } else {
                      this.loading = false;
                      this.resultmessage = "> Select User's Role."
                    }
                  } else {
                    this.loading = false;
                    this.resultmessage = "> You Need to Accept Community Guidelines."
                  }
                } else {
                    this.loading = false;
                    this.resultmessage = "> Passwords Do Not Match"
                    this.password = "";
                }
            },
            handleTransport(name, email, role){
              this.modal = false;
              this.name = name;
              this.role = role;
              this.email = email;
            },
            getPendingUsers(route) {
              this.modal = true;
              this.loading = true;
              this.$http.post(route, {
                    adminuseremail: this.userData.email,
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
        },
        mounted: function(){
          this.loading = true;
          this.$http.post(window.apiRoutes.homeRoute).then(response => {
            console.log(response);
            if(response.status == '200'){
              this.databasemessage = `🟢 Database is Live. You can Login. Ping - ${response.data.ping}ms`
            } else {
              this.databasemessage = "🔴 Database Offline / under Maintenance. Please Try Later"
            }
          })
          var user = localStorage.getItem("userdata");
          var token = localStorage.getItem("tokendata");
          if(user && token){
            var userData = JSON.parse(this.$hash.AES.decrypt(user, this.$pass).toString(this.$hash.enc.Utf8));
            if(userData.verified){
              if(userData.admin && userData.superadmin){
                this.loading = false;
                this.superadmin = true;
                this.admin = true;
                this.resultmessage = `You are Currently Logged in as ${userData.name} as ${userData.role}`
              } else if(userData.admin && !userData.superadmin) {
                this.superadmin = false;
                this.admin = true;
                this.loading = false;
                this.resultmessage = userData.admin
              }
            } else {
              this.superadmin = false;
              this.admin = false;
              this.loading = false;
              this.resultmessage = userData.admin
            }
          } else {
            this.superadmin = false;
            this.admin = false;
            this.loading = false;
            this.resultmessage = "Unauthorized";
          }
        },
        watch: {
          role: function() {
            if(this.role == "admin"){
              this.namedisabled = true;
              this.apiurl = window.apiRoutes.upgradeAdmin
            } else if(this.role == "superadmin"){
              this.namedisabled = true;
              this.apiurl = window.apiRoutes.upgradeSuperAdmin
            } else {
              this.namedisabled = false;
              this.apiurl = window.apiRoutes.registerRoute
            }
          }
        }
    }
</script>
