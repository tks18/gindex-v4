<template>
  <div v-if="admin" :class="ismobile ? 'content mx-1 mt-2 px-0' : 'content ml-5 mt-2 mr-5 pl-5 pr-5 '">
    <h1 class="title has-text-centered has-text-weight-bold has-text-white">Your Admin Zone</h1>
    <div class="loading">
      <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
    </div>
    <div class="columns has-text-white is-centered is-multiline">
      <div class="column is-half">
        <div class="columns is-multiline is-desktop is-centered">
          <div class="column is-full">
            <div class="box has-background-light">
              <h2 class="title has-text-centered has-text-weight-bold">Related to New Users</h2>
              <div class="columns is-vcentered is-centered is-multiline is-mobile">
                <div class="column is-two-thirds">
                  <p class="subtitle has-text-weight-bold">Add a User</p>
                </div>
                <div class="column has-text-centered is-one-third">
                  <button class="button is-rounded is-netflix-red" @click="gotoPage('/', 'register')">
                    <span class="icon is-small">
                      <i class="fas fa-user-plus"></i>
                    </span>
                    <span>Add</span>
                  </button>
                </div>
                <div class="column is-two-thirds">
                  <p class="subtitle has-text-weight-bold">Invite Users</p>
                </div>
                <div class="column has-text-centered is-one-third">
                  <button class="button is-rounded is-netflix-red" @click="gotoPage('/', 'invite')">
                    <span class="icon is-small">
                      <i class="fas fa-user-plus"></i>
                    </span>
                    <span>Invite</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-half">
        <div class="box has-background-light">
          <div class="columns is-centered is-multiline is-mobile">
            <h2 class="title has-text-centered has-text-weight-bold">Related to Existing Users</h2>
            <div class="column is-two-thirds">
              <p class="subtitle has-text-weight-bold">Manage Existing Users</p>
            </div>
            <div class="column has-text-centered is-one-third">
              <button class="button is-rounded is-netflix-red" @click="gotoPage('/manage', 'admin')">
                <span class="icon is-small">
                  <i class="fas fa-user-plus"></i>
                </span>
                <span>Manage</span>
              </button>
            </div>
            <div class="column is-two-thirds">
              <p class="subtitle has-text-weight-bold">Manage Spam Users</p>
            </div>
            <div class="column has-text-centered is-one-third">
              <button class="button is-rounded is-netflix-red" @click="gotoPage('/spam', 'admin')">
                <span class="icon is-small">
                  <i class="fas fa-hand-paper"></i>
                </span>
                <span>Manage</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-two-thirds">
        <div class="box has-background-light">
          <h2 class="title has-text-centered has-text-weight-bold">Manage Global Site Settings</h2>
          <div class="columns is-centered is-vcentered is-multiline is-mobile">
            <div class="column is-two-thirds">
              <p class="subtitle has-text-weight-bold">Go to Settings</p>
            </div>
            <div class="column has-text-centered is-one-third">
              <button class="button is-rounded is-netflix-red" @click="gotoPage('/settings', 'admin')">
                <span class="icon is-small">
                  <i class="fas fa-user-cog"></i>
                </span>
                <span>Settings</span>
              </button>
            </div>
            <div class="column is-two-thirds">
              <p class="subtitle has-text-weight-bold">Manage Posteriors</p>
            </div>
            <div class="column has-text-centered is-one-third">
              <button class="button is-rounded is-netflix-red" @click="gotoPage('/posteriors', 'admin')">
                <span class="icon is-small">
                  <i class="fas fa-user-cog"></i>
                </span>
                <span>Settings</span>
              </button>
            </div>
          </div>
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
        data() {
          return {
            notify: true,
            metatitle: "Admin Area",
            user: {},
            token: {},
            admin: false,
            gds: [],
            currgd: {},
            superadmin: false,
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
        }
      }
</script>
