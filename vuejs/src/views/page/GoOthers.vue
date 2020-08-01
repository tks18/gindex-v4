<template>
  <div :class="ismobile ? 'content mx-0 mt-2 px-0 g2-content' : 'content ml-5 mt-2 mr-5 pl-5 pr-5 g2-content'">
    <div class="loading">
      <loading :active.sync="mainLoad" :can-cancel="false" :is-full-page="fullpage"></loading>
    </div>
    <div class="columns has-text-centered is-mobile is-multiline is-centered is-vcentered">
      <div class="column is-full">
        <p class="subtitle has-text-white has-text-weight-bold">Your Requested File is <span class="has-text-netflix-only">{{ objName }}</span>.</p>
        <p class="subtitle has-text-white">{{ checkPath ? "This File is Supported by us, but Not Supported by your Browser. You can only Download the File" : "We Don't Support these Formats online. Your only Option is to Download" }}</p>
        <button class="button is-netflix-red is-rounded" @click="downloadButton">
          <span class="icon">
           <i class="fas fa-download"></i>
         </span>
         <span>Download</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { decode64, checkExtends } from "@utils/AcrouUtil";
import Loading from 'vue-loading-overlay';
export default {
  data: function() {
    return {
      obj: "",
      objName: "",
      user: {},
      token: {},
      downloadUrl: "",
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
    checkPath() {
      return checkExtends(this.$route.params.path);
    }
  },
  methods: {
    render() {
      let path = window.location.origin + encodeURI(this.url)+"?player=download"+"&token="+this.mediaToken+"&email="+this.user.email;
      this.obj = path;
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
    },
    downloadButton() {
      window.open(this.obj);
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
          this.objName = this.url.split('/').pop().split('.').slice(0,-1).join('.');
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
