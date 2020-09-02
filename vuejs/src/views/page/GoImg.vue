<template>
  <div :class="ismobile ? 'content mx-0 mt-2 px-0 g2-content' : 'content ml-5 mt-2 mr-5 pl-5 pr-5 g2-content'">
    <div class="loading">
      <loading :active.sync="mainLoad" :can-cancel="false" :is-full-page="fullpage"></loading>
    </div>
    <figure class="image">
      <img :src="imgurl" :class="!display?'is-hidden':''" @load="loading" />
      <center :class="display?'is-hidden':''">
        <i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>
        <span class="sr-only">Loading...</span>
      </center>
    </figure>
    <hr />
  </div>
</template>

<script>
import { apiRoutes, backendHeaders } from "@/utils/backendUtils";
import { initializeUser, getgds } from "@utils/localUtils";
import { decode64 } from "@utils/AcrouUtil";
import Loading from 'vue-loading-overlay';
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
  data: function() {
    return {
      imgurl: "",
      metatitle: "",
      user: {},
      token: {},
      windowWidth: window.innerWidth,
      screenWidth: screen.width,
      ismobile: false,
      gds: [],
      currgd: {},
      mediaToken: "",
      mainLoad: false,
      fullpage: true,
      display: false
    };
  },
  components: {
    Loading
  },
  computed: {
    url() {
      if (this.$route.params.path) {
        return decode64(this.$route.params.path);
      }
      return ''
    },
    siteName() {
      return window.gds.filter((item, index) => {
        return index == this.$route.params.id;
      })[0];
    },
  },
  methods: {
    render() {
      let path = window.location.origin + encodeURI(this.url)+"?player=internal"+"&token="+this.token.token+"&email="+this.user.email;
// Easy to debug in development environment
// path = process.env.NODE_ENV === "development"? "/api" + path: "";
      this.metatitle = decodeURIComponent(this.url.split('/').pop().split('.').slice(0,-1).join('.'));
      this.imgurl = path;
    },
    checkMobile() {
      var width = this.windowWidth > 0 ? this.windowWidth : this.screenWidth;
      if(width > 966){
        this.ismobile = false
      } else {
        this.ismobile = true
      }
    },
    loading(event) {
      if (event.target.complete == true) {
        this.display = true;
      }
    }
  },
  async beforeMount() {
    this.checkMobile();
    this.mainload = true;
    let gddata = getgds(this.$route.params.id);
    this.gds = gddata.gds;
    this.currgd = gddata.current;
    var userData = await initializeUser();
    if(userData.isThere){
      if(userData.type == "hybrid"){
        this.user = userData.data.user;
        this.logged = userData.data.logged;
      } else if(userData.type == "normal"){
        this.user = userData.data.user;
        this.token = userData.data.token;
        this.logged = userData.data.logged;
      }
    } else {
      this.logged = userData.data.logged;
    }
    await this.$backend.post(apiRoutes.mediaTokenTransmitter, {
      email: userData.data.user.email,
      token: userData.data.token.token,
    }, backendHeaders(this.token.token)).then(response => {
      if(response.data.auth && response.data.registered && response.data.token){
        this.mainLoad = false;
        this.mediaToken = response.data.token;
        this.render();
      } else {
        this.mainLoad = false;
        this.mediaToken = "";
      }
    }).catch(e => {
      console.log(e);
      this.mainLoad = false;
      this.mediaToken = "";
    })
  },
  watch: {
    screenWidth: function() {
      var width = this.windowWidth > 0 ? this.windowWidth : this.screenWidth;
      if(width > 966){
        this.ismobile = false
      } else {
        this.ismobile = true
      }
    },
    windowWidth: function() {
      var width = this.windowWidth > 0 ? this.windowWidth : this.screenWidth;
      if(width > 966){
        this.ismobile = false
      } else {
        this.ismobile = true
      }
    },
  }
};
</script>
