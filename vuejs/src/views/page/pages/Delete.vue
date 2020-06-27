<template>
    <div class="content mt-5">
      <TopLinks />
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
      </div>
        <div class="columns is-vcentered is-centered is-multiline">
          <div class="column is-half">
            <div class="columns is-desktop is-multiline is-centered">
              <div class="column is-full">
                <div class="box has-background-danger">
                  <p class="title has-text-weight-bold has-text-white has-text-centered"> Danger </p>
                  <p class="subtitle has-text-weight-bold has-text-white has-text-centered"> Please Use this Feature Wisely </p>
                </div>
              </div>
              <div class="column is-full">
                <div class="box has-background-warning">
                  <p class="title has-text-weight-bold has-text-centered"> Users List </p>
                  <p class="subtitle has-text-weight-bold has-text-centered"> Press the Button to get the List </p>
                  <div class="columns is-multiline is-mobile is-centered">
                    <div v-if="userData.admin && !userData.superadmin" class="column is-two-thirds">
                      <p class="subtitle has-text-weight-semibold">
                        Get Users List
                      </p>
                    </div>
                    <div v-if="userData.admin && !userData.superadmin" class="column is-one-third">
                      <button class="button is-success" @click="modal = true; listname = 'List of all Users';getUser(getUsers);">
                        <span class="icon is-small">
                          <i class="fas fa-user-shield"></i>
                        </span>
                        <span>Users</span>
                      </button>
                    </div>
                    <div v-if="userData.admin && userData.superadmin" class="column is-two-thirds">
                      <p class="subtitle has-text-weight-semibold">
                        Get All Users
                      </p>
                    </div>
                    <div v-if="userData.admin && userData.superadmin" class="column is-one-third">
                      <button class="button is-success" @click="modal = true; listname = 'List of all Users';getUser(getAll);">
                        <span class="icon is-small">
                          <i class="fas fa-user-shield"></i>
                        </span>
                        <span>Users</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div :class=" modal ? 'modal is-active' : 'modal' ">
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title has-text-centered">{{ listname }}</p>
                <button class="delete" @click="modal = false; userList = [];" aria-label="close"></button>
              </header>
              <section class="modal-card-body">
                <div v-if="userList.length == 0" class="columns is-centered is-mobile">
                  <div class="column has-text-centered is-full">
                    <p class="subtitle has-text-black">No Users</p>
                  </div>
                </div>
                <div v-else class="columns is-centered is-mobile" v-for="user in userList" v-bind:key="user.name">
                  <div class="column is-two-thirds">
                    <p class="subtitle has-text-black">{{ user.email }}  ({{ user.role }})</p>
                  </div>
                  <div class="column is-one-third">
                    <button class="button is-danger is-rounded" @click="handleTransport(user); modal = false;">
                      <span class="icon is-small">
                        <i class="fas fa-user-minus"></i>
                      </span>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <div class="column has-text-centered is-half">
            <article :class=" errormessageVisibility ? 'message is-danger' : 'message is-hidden is-danger'">
              <div class="message-header">
                <p>Error Proccessing</p>
                <button class="delete" @click="errormessageVisibility = false" aria-label="delete"></button>
              </div>
              <div class="message-body">
                {{ resultmessage }}
              </div>
            </article>
            <article :class=" successmessageVisibility ? 'message is-success' : 'message is-hidden is-success'">
              <div class="message-header">
                <p>Success !</p>
                <button class="delete" @click="successmessageVisibility = false" aria-label="delete"></button>
              </div>
              <div class="message-body">
                {{ resultmessage }}
              </div>
            </article>
            <h2 class="title has-text-weight-bold has-text-white">Delete Users</h2>
            <p class="is-small has-text-white has-text-weight-bold">Select Users with the Side Buttons</p>
            <form @submit.prevent="handleSubmit">
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
              <label class="subtitle has-text-white"> User's Role(Auto Filled)</label>
              <div class="control mb-3">
                  <input class="is-checkradio is-small is-warning" id="userradio" type="radio" name="role" checked value="user" :disabled="disabled" v-model="role">
                  <label for="userradio" class="subtitle has-text-white">User</label>
                  <input class="is-checkradio is-small is-warning" id="adminradio" type="radio" name="role" value="admin" :disabled="disabled" v-model="role">
                  <label for="adminradio" class="subtitle has-text-white"> Admin</label>
              </div>
              <div class="field">
                <p class="control has-icons-left">
                  <input class="input is-rounded" id="password" type="password" placeholder="Your Admin Password" v-model="password" required>
                  <span class="icon is-small is-left">
                    <i class="fas fa-lock"></i>
                  </span>
                </p>
              </div>
              <button :class=" loading ? 'button is-loading is-rounded is-danger' : 'button is-danger is-rounded' " type="submit" :disabled="buttondisabled">
                <span class="icon">
                  <i class="fas fa-user-minus"></i>
                </span>
                <span>Delete User</span>
              </button>
            </form>
          </div>
        </div>
    </div>
</template>
<script>
import TopLinks from "../../common/Top-Links";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
export default {
    components: {
      TopLinks,
      Loading
    },
        props : ["nextUrl"],
        data(){
            return {
                email : "",
                password : "",
                resultmessage: "",
                listname: "",
                successmessageVisibility: false,
                errormessageVisibility: false,
                userList: [],
                modal: false,
                pendingMessage: "",
                getUsers: window.apiRoutes.getUsers,
                getAll: window.apiRoutes.getAll,
                role: "",
                apiurl: "",
                disabled: "",
                buttondisabled: "",
                userData: JSON.parse(this.$hash.AES.decrypt(localStorage.getItem("userdata"), this.$pass).toString(this.$hash.enc.Utf8)),
                userToken: JSON.parse(this.$hash.AES.decrypt(localStorage.getItem("tokendata"), this.$pass).toString(this.$hash.enc.Utf8)),
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
                    this.$http.post(this.apiurl, {
                          email: this.email,
                          adminpass: this.password,
                          adminuseremail: this.userData.email,
                    })
                    .then(response => {
                        if(response){
                          if(response.data.auth && response.data.registered){
                            this.successmessageVisibility = true;
                            this.errormessageVisibility = false;
                            this.resultmessage = response.data.message
                            this.loading = false;
                          } else {
                            this.successmessageVisibility = false;
                            this.errormessageVisibility = true;
                            this.resultmessage = response.data.message
                            this.loading = false;
                          }
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
                } else {
                    this.successmessageVisibility = false;
                    this.errormessageVisibility = true;
                    this.resultmessage = "Passwords Do Not Match"
                    this.password = "";
                    this.loading = false;
                }
            },
            getUser(route) {
              this.modal = true;
              this.loading = true;
              this.$http.post(route, {
                    email: this.userData.email,
              }).then(response => {
                if(response){
                  if(response.data.auth && response.data.registered){
                    this.loading = false;
                    this.userList = response.data.users;
                  } else {
                    this.loading = false;
                    this.pendingMessage = response.data.message;
                  }
                }
              })
            },
            handleTransport(user) {
              this.email = user.email
              if(user.role == 'User'){
                this.role = "user";
              } else if(user.role == 'Admin'){
                this.role = "admin"
              }
            }
        },
        mounted: function(){
          var user = localStorage.getItem("userdata");
          var token = localStorage.getItem("tokendata");
          if(user && token){
            var userData = JSON.parse(this.$hash.AES.decrypt(user, this.$pass).toString(this.$hash.enc.Utf8));
            if(userData.verified){
              if(userData.admin && !userData.superadmin){
                this.loading = false;
                this.role = "user"
                this.disabled = true;
              } else if(userData.admin && userData.superadmin) {
                this.loading = false;
                this.disabled = true;
              } else {
                this.loading = false;
                this.$router.push({ name: 'results', params: { id: 0, cmd: "result", success: false, data: "Authorized Area. Not Allowed", redirectUrl: "/0:home/" } })
              }
            } else {
              this.loading = false;
              this.$router.push({ name: 'results', params: { id: 0, cmd: "result", success: false, data: "Authorized Area. Not Allowed", redirectUrl: "/0:home/" } })
            }
          } else {
            this.loading = false;
            this.$router.push({ name: 'results', params: { id: 0, cmd: "result", success: false, data: "Authorized Area. Not Allowed", redirectUrl: "/0:home/" } })
          }
        },
        watch: {
          role: function() {
            if(this.role == "user"){
              this.apiurl = window.apiRoutes.deleteUser;
            } else if(this.role == "admin") {
              this.apiurl = window.apiRoutes.deleteAdmin;
            }
          },
          password: function() {
            if(this.role.length > 0 && this.email.length > 0 && this.password.length > 0){
              this.buttondisabled = false;
            } else {
              this.buttondisabled = true;
            }
          }
        }
    }
</script>
