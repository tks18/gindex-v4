<template>
    <div :class="ismobile ? 'content mx-1 mt-2 px-0' : 'content ml-5 mt-2 mr-5 pl-5 pr-5'">
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
      </div>
      <div class="columns is-multiline is-centered is-vcentered">
        <div class="column has-text-centered is-half">
          <h2 class="title has-text-weight-bold has-text-white">Invite Users</h2>
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
          <form @submit.prevent="handleSubmit">
            <div class="field">
              <p class="control has-icons-left has-icons-right">
                <input class="input is-rounded" placeholder="Your Name" id="invitename" type="text" v-model="name" required autofocus>
                <span class="icon is-small is-left">
                  <i class="fas fa-user"></i>
                </span>
                <span class="icon is-small is-right">
                  <i class="fas fa-check"></i>
                </span>
              </p>
            </div>
            <div class="field">
              <p class="control has-icons-left has-icons-right">
                <input class="input is-rounded is-focused" placeholder="Email" id="email" type="email" v-model="email" required>
                <span class="icon is-small is-left">
                  <i class="fas fa-envelope"></i>
                </span>
                <span class="icon is-small is-right">
                  <i class="fas fa-check"></i>
                </span>
              </p>
            </div>
            <label class="subtitle has-text-white"> Invite for Role</label>
            <div class="control mb-3">
                <input class="is-checkradio is-small is-success" id="userradio" type="radio" name="role" checked value="user" :disabled="disabled" v-model="role">
                <label for="userradio" class="subtitle has-text-weight-bold has-text-white">User</label>
                <input class="is-checkradio is-small is-success" id="adminradio" type="radio" name="role" value="admin" :disabled="disabled" v-model="role">
                <label for="adminradio" class="subtitle has-text-weight-bold has-text-white"> Admin</label>
                <input class="is-checkradio is-small is-success" id="superadminradio" type="radio" name="role" value="superadmin" :disabled="disabled" v-model="role">
                <label for="superadminradio" class="subtitle has-text-weight-bold has-text-white">Superadmin</label>
            </div>
            <div class="field">
              <div class="control">
                <textarea class="textarea is-success is-rounded" placeholder="Message to Him" id="message" rows="3" v-model="message" required></textarea>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <div class="b-checkbox is-success is-circular is-inline">
                  <input class="styled has-text-success" type="checkbox" id="terms" name="terms" v-model="checked">
                  <label for="terms">
                    <span class="content has-text-white">  I Accept and Read the <a class="has-text-success" href="https://raw.githubusercontent.com/tks18/gindex-v4/dark-mode-0-1/CONTRIBUTING.md" target="_blank">Community Guidelines</a></span>
                  </label>
                </div>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <div class="b-checkbox is-success is-circular is-inline">
                  <input class="styled has-text-success" type="checkbox" id="code" name="terms" v-model="codechecked">
                  <label for="code">
                    <span class="content has-text-white">  I Accept and Read the <a class="has-text-success" href="https://github.com/tks18/gindex-v4/blob/dark-mode-0-1/CODE_OF_CONDUCT.md" target="_blank">Code of Conduct</a></span>
                  </label>
                </div>
              </div>
            </div>
            <button :class=" loading ? 'button is-loading is-rounded is-netflix-red is-medium' : 'button is-netflix-red is-rounded is-medium' " type="submit" :disabled="buttondisabled" >
              <span class="icon">
                <i class="fas fa-user-plus"></i>
              </span>
              <span>Invite User</span>
            </button>
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
          metatitle: "Invite Users",
          user: {},
          admin: false,
          superadmin: false,
          disabled: true,
          role: "",
          apiurl: "",
          gds: [],
          currgd: {},
          successMessage: false,
          errorMessage: false,
          name : "",
          email : "",
          message: "",
          checked: "",
          codechecked: "",
          buttondisabled: true,
          resultmessage: "",
          loading: false,
          fullpage: true,
      }
    },
    methods : {
        handleSubmit(e) {
          this.metatitle = "Pulling Your Email Service..."
          this.loading = true;
            e.preventDefault()
            if(this.checked && this.codechecked && this.name.length > 0 && this.email.length > 0 && this.message.length > 0){
              this.$backend.post(this.apiurl, {
                    name: this.name,
                    email: this.email,
                    message: this.message,
                    adminuseremail: this.user.email,
              }, backendHeaders(this.token.token))
              .then(response => {
                  if(response){
                    if(response.data.auth && response.data.registered){
                      this.loading = false;
                      this.successMessage = true;
                      this.errorMessage = false;
                      this.metatitle = "Invite Sent...";
                      this.resultmessage = response.data.message
                    } else {
                      this.loading = false;
                      this.successMessage = false;
                      this.errorMessage = true;
                      this.metatitle = "Invite Failed...";
                      this.resultmessage = response.data.message
                    }
                  }
              })
              .catch(error => {
                  this.metatitle = "Invite Failed...";
                  this.resultmessage = error;
                  this.successMessage = false;
                  this.errorMessage = true;
              });
            } else {
              this.loading = false;
              this.successMessage = false;
              this.errorMessage = true;
              this.metatitle = "Invite Failed...";
              this.resultmessage = "> You Need to Accept Community Guidelines."
              this.checked = false;
            }
        },
        validateData() {
          const emailRegex = /[a-z1-9].+@+[a-z1-9A-Z].+[.][a-z]+/g
          if(emailRegex.test(this.email) && this.checked && this.codechecked && this.name.length > 0 && this.email.length > 0 && this.message.length > 0){
            this.buttondisabled = false;
          } else {
            this.buttondisabled = true;
          }
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
    mounted(){
      this.loading = true;
      if(this.user.admin && this.user.superadmin){
        this.apiurl = apiRoutes.inviteUser;
        this.admin = true, this.superadmin = true, this.role = 'user', this.disabled = false, this.loading = false;
      } else if(this.user.admin && !this.user.superadmin) {
        this.apiurl = apiRoutes.inviteUser;
        this.admin = true, this.superadmin = false, this.role = 'user', this.disabled = true, this.loading = false;
      } else {
        this.loading = false;
        this.$router.push({ name: 'results', params: { id: 0, cmd: "result", success: false, data: "UnAuthorized Route. Not Allowed.", redirectUrl: "/0:home/" } })
      }
    },
    created() {
      let gddata = getgds(this.$route.params.id);
      this.gds = gddata.gds;
      this.currgd = gddata.current;
    },
    watch: {
      role: function() {
        if(this.role == "user"){
          this.apiurl = apiRoutes.inviteUser;
          this.validateData();
        } else if(this.role == "admin"){
          this.apiurl = apiRoutes.inviteAdmin;
          this.validateData();
        } else if(this.role == "superadmin"){
          this.validateData();
          this.apiurl = apiRoutes.inviteSuperAdmin;
        }
      },
      name: "validateData",
      email: "validateData",
      message: "validateData",
      checked: "validateData",
      codechecked: "validateData",
    },
  }
</script>
