<template>
  <div class="is-clipped">
    <div v-if="logged" :class="ismobile ? 'content mx-1 mt-2 px-0' : 'content ml-5 mt-2 mr-5 pl-5 pr-5'">
      <h1 class="title has-text-centered has-text-weight-bold has-text-white">Settings</h1>
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
      </div>
      <div class="columns has-text-white is-centered is-multiline">
        <div class="column is-two-thirds">
          <div class="box has-background-light">
            <h3 class="title has-text-centered has-text-weight-bold has-text-info-dark">Your Details</h3>
            <div class="columns is-vcentered is-centered is-multiline is-mobile">
              <div class="column has-text-centered is-full">
                <figure class="image special-image is-128x128 is-inline-block">
                  <img class="is-rounded" :src="avatar" @click="alerts('Avatar Under Development')">
                </figure>
              </div>
              <div class="column is-three-fifths">
                <p class="subtitle">Name</p>
              </div>
              <div class="column is-two-fifths">
                <p class="subtitle has-text-weight-bold">{{ user.name }}</p>
              </div>
              <div class="column is-three-fifths">
                <p class="subtitle">Email</p>
              </div>
              <div class="column is-two-fifths">
                <p class="subtitle has-text-weight-bold">{{ user.email }}</p>
              </div>
              <div class="column is-three-fifths">
                <p class="subtitle">Current Role</p>
              </div>
              <div class="column is-two-fifths">
                <p class="subtitle has-text-weight-bold">{{ user.role }}</p>
              </div>
              <div v-if="!admin && !superadmin || admin && !superadmin" class="column is-three-fifths">
                <p class="subtitle">Request More Scopes</p>
              </div>
              <div v-if="!admin && !superadmin || admin && !superadmin" class="column has-text-centered is-two-fifths">
                <button class="button is-netflix-red" @click="gotoPage('/request/', 'settings')">
                  <span class="icon is-small">
                    <i class="fas fa-user-shield"></i>
                  </span>
                  <span>Request</span>
                </button>
              </div>
              <div v-if="admin && superadmin" class="column has-text-centered is-full">
                <p class="subtitle has-text-warning-dark has-text-weight-bold">You Have Maximum Access to this Website</p>
              </div>
              <div class="column is-three-fifths">
                <p class="subtitle">Last Token Issue Date</p>
              </div>
              <div class="column is-two-fifths">
                <p class="subtitle has-text-weight-bold">{{ token.issuedate | moment("dddd, MMMM Do YYYY [at] hh:mm A") }}</p>
              </div>
              <div class="column is-three-fifths">
                <p class="subtitle">Last Token Expiry Date</p>
              </div>
              <div class="column is-two-fifths">
                <p class="subtitle has-text-weight-bold">{{ token.expirydate | moment("dddd, MMMM Do YYYY [at] hh:mm A") }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-vcentered is-one-third">
          <div class="columns is-multiline is-desktop is-centered">
            <div class="column is-full">
              <div class="box has-background-light">
                <h3 class="title has-text-centered has-text-weight-bold">Your Preferences</h3>
                <div class="columns is-vcentered is-centered is-multiline is-mobile">
                  <div class="column is-three-fifths">
                    <p class="subtitle">Change Your Avatar</p>
                  </div>
                  <div class="column has-text-centered is-two-fifths">
                    <button class="button is-rounded is-netflix-red" @click="alerts('Under Development')">
                      <span class="icon is-small">
                        <i class="far fa-user-circle"></i>
                      </span>
                      <span>Change</span>
                    </button>
                  </div>
                  <div class="column is-three-fifths">
                    <p class="subtitle">Change Your Password</p>
                  </div>
                  <div class="column has-text-centered is-two-fifths">
                    <button class="button is-rounded is-netflix-red" @click="gotoPage('/changepassword/', 'settings')">
                      <span class="icon is-small">
                        <i class="fas fa-lock"></i>
                      </span>
                      <span>Change</span>
                    </button>
                  </div>
                  <div class="column is-three-fifths">
                    <p class="subtitle">Change Your Email</p>
                  </div>
                  <div class="column has-text-centered is-two-fifths">
                    <button class="button is-rounded is-netflix-red" @click="alerts('Under Development')">
                      <span class="icon is-small">
                        <i class="fas fa-envelope"></i>
                      </span>
                      <span>Change</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-full">
              <div class="box has-background-danger">
                <h3 class="title has-text-centered has-text-white has-text-weight-bold">Danger Zone</h3>
                <div class="columns is-vcentered is-centered is-multiline is-mobile">
                  <div class="column is-three-fifths">
                    <p class="subtitle has-text-white">Delete Your Account</p>
                  </div>
                  <div class="column is-two-fifths">
                    <button class="button is-rounded is-warning" @click="gotoPage('/me/', 'delete')">
                      <span class="icon is-small">
                        <i class="fas fa-user-times"></i>
                      </span>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
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
            user: {},
            token: {},
            metatitle: "Settings",
            logged: false,
            avatar: "",
            gds: [],
            currgd: {},
            admin: false,
            superadmin: false,
            loading: false,
            fullpage: true,
          }
        },
        methods: {
          alerts(text) {
            window.alert(text);
          },
          gotoPage(url, cmd) {
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
        mounted() {
          this.metatitle = this.user.name+" | "+"Settings";
          if(this.user.avatar){
            this.avatar = this.user.avatar;
          } else {
            this.avatar = 'https://cdn.statically.io/img/www.joyonlineschool.com/static/emptyuserphoto.png?w=64&h=64&quality=100&f=auto';
          }
        },
        created() {
          let gddata = getgds(this.$route.params.id);
          this.gds = gddata.gds;
          this.currgd = gddata.current;
        }
      }
</script>
