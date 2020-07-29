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
import { decode64 } from "@utils/AcrouUtil";
import Loading from 'vue-loading-overlay';
export default {
  data: function() {
    return {
      imgurl: "",
      user: {},
      token: {},
      windowWidth: window.innerWidth,
      screenWidth: screen.width,
      ismobile: false,
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
  },
  methods: {
    render() {
      let path = this.url+"?player=internal"+"&token="+this.token.token+"&email="+this.user.email;
// Easy to debug in development environment
// path = process.env.NODE_ENV === "development"? "/api" + path: "";
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
  beforeMount() {
    this.checkMobile();
    this.mainLoad = true;
    var user = localStorage.getItem("userdata");
    var token = localStorage.getItem("tokendata");
    if(user && token){
      var tokenData = JSON.parse(this.$hash.AES.decrypt(token, this.$pass).toString(this.$hash.enc.Utf8));
      var userData = JSON.parse(this.$hash.AES.decrypt(user, this.$pass).toString(this.$hash.enc.Utf8));
      this.user = userData, this.token = tokenData;
      this.$http.post(window.apiRoutes.mediaTokenTransmitter, {
        email: userData.email,
        token: tokenData.token,
      }).then(response => {
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
    } else {
      this.user = null, this.token = null, this.mainLoad = false;
    }
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
