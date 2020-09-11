<template>
  <div v-if="admin" :class="ismobile ? 'content mx-1 mt-2 px-0' : 'content ml-5 mt-2 mr-5 pl-5 pr-5 '">
    <h1 class="title has-text-centered has-text-weight-bold has-text-white">Manage Global Site Settings</h1>
    <div class="loading">
      <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
    </div>
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
    <div class="columns is-centered is-multiline is-vcentered">
      <div class="column is-two-thirds">
        <div class="box has-background-light">
          <form @submit.prevent="handleSavePrefs">
            <div class="columns is-multiline is-mobile">
              <div class="column is-two-thirds">
                <p class="subtitle has-text-weight-bold">Allow User Requests</p>
              </div>
              <div class="column is-one-third">
                <div class="field">
                  <input type="checkbox" id="request" name="request" v-model="request" class="switch is-danger">
                  <label for="request">
                    <span class="content">{{ request ? "Allowed" : "Disallowed" }}</span>
                  </label>
                </div>
              </div>
              <div class="column is-two-thirds">
                <p class="subtitle has-text-weight-bold">Allow Admin and Superadmin Requests</p>
              </div>
              <div class="column is-one-third">
                <div class="field">
                  <input type="checkbox" id="adminreqs" name="adminreqs" v-model="adminreqs" class="switch is-danger">
                  <label for="adminreqs">
                    <span class="content">{{ adminreqs ? "Allowed" : "Disallowed" }}</span>
                  </label>
                </div>
              </div>
              <div class="column is-two-thirds">
                <p class="subtitle has-text-weight-bold">Enable TMDB Api Support</p>
              </div>
              <div class="column is-one-third">
                <div class="field">
                  <input type="checkbox" id="tmdb" name="tmdb" v-model="tmdb" class="switch is-danger">
                  <label for="tmdb">
                    <span class="content">{{ tmdb ? "Allowed" : "Disallowed" }}</span>
                  </label>
                </div>
              </div>
              <div class="column has-text-centered is-full">
                <button class="button is-netflix-red" type="submit" :disabled="disabled">
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
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
      Loading,
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
    data() {
      return {
        notify: true,
        metatitle: "Site Settings",
        user: {},
        token: {},
        disabled: true,
        admin: false,
        superadmin: false,
        request: true,
        resultmessage: "",
        successMessage: false,
        errorMessage: false,
        adminreqs: true,
        tmdb: false,
        defaultData: {
          request: true,
          adminreqs: true,
          tmdb: false,
        },
        gds: [],
        currgd: {},
        loading: false,
        fullpage: true,
      }
    },
    methods: {
      gotoPage: function(url, cmd){
        if(cmd){
          this.$router.push({ path: '/'+ this.currgd.id + ':' + cmd + url })
        } else {
          this.$router.push({ path: '/'+ this.currgd.id + ':' + url })
        }
      },
      getSiteSettings(){
        this.loading = true;
        this.$backend.post(apiRoutes.getSiteSettings).then(response => {
          if(response.data.auth && response.data.registered){
            this.request = response.data.data.requests;
            this.adminreqs = response.data.data.adminRequests;
            this.tmdb = response.data.data.tmdb;
            this.defaultData.request = response.data.data.requests;
            this.defaultData.adminreqs = response.data.data.adminRequests;
            this.defaultData.tmdb = response.data.data.tmdb;
            this.loading = false;
          } else {
            this.request = this.defaultData.request;
            this.adminreqs = this.defaultData.adminreqs;
            this.tmdb = this.defaultData.tmdb;
            this.loading = false;
          }
        })
      },
      checkButtonDisability() {
        if(this.request !== this.defaultData.request){
          this.disabled = false;
        } else if(this.adminreqs !== this.defaultData.adminreqs) {
          this.disabled = false;
        } else if(this.tmdb !== this.defaultData.tmdb) {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
      },
      handleSavePrefs(){
        this.loading = true;
        this.$backend.post(apiRoutes.setSiteSettings, {
          email: this.user.email,
          settings: {
            requests: this.request,
            adminRequests: this.adminreqs,
            tmdb: this.tmdb
          }
        }, backendHeaders(this.token.token)).then(async response => {
          this.loading = false;
          if(response.data.auth && response.data.registered && response.data.changed){
            await this.getSiteSettings();
            this.successMessage = true;
            this.errorMessage = false;
            this.resultmessage = response.data.message;
            this.loading = false;
            this.disabled = true;
          } else {
            await this.getSiteSettings();
            this.successMessage = false;
            this.errorMessage = true;
            this.resultmessage = response.data.message;
            this.loading = false;
            this.disabled = true;
          }
        })
      },
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
    mounted() {
      this.getSiteSettings();
    },
    created() {
      let gddata = getgds(this.$route.params.id);
      this.gds = gddata.gds;
      this.currgd = gddata.current;
    },
    watch: {
      request: "checkButtonDisability",
      adminreqs: "checkButtonDisability",
      tmdb: "checkButtonDisability"
    }
  }
</script>
