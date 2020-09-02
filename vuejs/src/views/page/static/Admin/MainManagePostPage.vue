<template>
  <div :class="ismobile ? 'content mx-1 mt-2 px-0' : 'content ml-5 mt-2 mr-5 pl-5 pr-5 '">
    <h1 class="title has-text-centered has-text-weight-bold has-text-white">Manage Different Posteriors</h1>
    <div class="columns is-multiline is-centered is-vcentered">
      <div class="column is-two-thirds">
        <div class="box has-background-light">
          <div class="columns is-mobile is-vcentered is-multiline">
            <div class="column is-two-thirds">
              <p class="subtitle has-text-weight-bold">Manage Quicklinks</p>
            </div>
            <div class="column has-text-right is-one-third">
              <button class="button is-netflix-red is-rounded" @click="gotoPage('/posteriors/quicklinks','admin')">
                <span class="icon is-small">
                  <i class="fas fa-user-plus"></i>
                </span>
                <span>Manage</span>
              </button>
            </div>
            <div class="column is-two-thirds">
              <p class="subtitle has-text-weight-bold">Manage Trending</p>
            </div>
            <div class="column has-text-right is-one-third">
              <button class="button is-netflix-red is-rounded" @click="gotoPage('/posteriors/Trending','admin')">
                <span class="icon is-small">
                  <i class="fas fa-user-plus"></i>
                </span>
                <span>Manage</span>
              </button>
            </div>
            <div class="column is-two-thirds">
              <p class="subtitle has-text-weight-bold">Manage Categories</p>
            </div>
            <div class="column has-text-right is-one-third">
              <button class="button is-netflix-red is-rounded" @click="gotoPage('/posteriors/categories','admin')">
                <span class="icon is-small">
                  <i class="fas fa-user-plus"></i>
                </span>
                <span>Manage</span>
              </button>
            </div>
            <div class="column is-two-thirds">
              <p class="subtitle has-text-weight-bold">Manage Hero Posters</p>
            </div>
            <div class="column has-text-right is-one-third">
              <button class="button is-netflix-red is-rounded" @click="gotoPage('/posteriors/heros','admin')">
                <span class="icon is-small">
                  <i class="fas fa-user-plus"></i>
                </span>
                <span>Manage</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <feb-alive>
        <router-view ></router-view>
    </feb-alive>
  </div>
</template>
<script>
import {
  initializeUser,
  getgds,
} from "@utils/localUtils";
export default {
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
  data: function(){
    return {
      metatitle: "Manage Spam",
      logged: false,
      user: {},
      admin: false,
      superadmin: false,
      loading: false,
      gds: [],
      currgd: {},
    }
  },
  methods: {
    gotoPage(url, cmd) {
      if(cmd){
        this.$router.push({ path: '/'+ this.currgd.id + ':' + cmd + url })
      } else {
        this.$router.push({ path: '/'+ this.currgd.id + ':' + url })
      }
    },
  },
  computed: {
    siteName() {
      return window.gds.filter((item, index) => {
        return index == this.$route.params.id;
      })[0];
    },
    ismobile() {
      var width = window.innerWidth > 0 ? window.innerWidth : screen.width;
      if(width > 966){
        return false
      } else {
        return true
      }
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
}
</script>
