<template>
  <div :class="ismobile ? 'content mx-0 mt-2 px-0 g2-content' : 'content ml-5 mr-5 mt-2 pl-5 pr-5 g2-content'">
    <div class="loading">
      <loading :active.sync="mainLoad" :can-cancel="false" :is-full-page="fullpage"></loading>
    </div>
    <codemirror v-model="content" :options="cmOptions" />
  </div>
</template>

<script>
import { get_file, decode64 } from "@utils/AcrouUtil";
import { codemirror } from 'vue-codemirror'
import Loading from 'vue-loading-overlay';

// import base style
import 'codemirror/lib/codemirror.css'
// import language js
import 'codemirror/mode/javascript/javascript.js'
// import theme style
import 'codemirror/theme/base16-dark.css'
export default {
  data: function () {
    return {
      path: "",
      content: "",
      user: {},
      token: {},
      windowWidth: window.innerWidth,
      screenWidth: screen.width,
      ismobile: false,
      mediaToken: "",
      mainLoad: false,
      fullpage: true,
      cmOptions: {
        tabSize: 4,
        mode: 'text/javascript',
        // theme: 'base16-dark',
        lineNumbers: true,
        line: true
      }
    };
  },
  computed: {
    url () {
      if (this.$route.params.path) {
        return decode64(this.$route.params.path);
      }
      return ''
    }
  },
  components: {
    codemirror,
    Loading
  },
  methods: {
    render () {
      let path = this.url;
      this.content = this.$t("page.text.loading");
      get_file({ path: path, file: {} }, data => {
        this.content = data;
      });
    },
    checkMobile() {
      var width = this.windowWidth > 0 ? this.windowWidth : this.screenWidth;
      if(width > 966){
        this.ismobile = false
      } else {
        this.ismobile = true
      }
    },
  },
  beforeMount() {
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
    this.checkMobile();
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
<style lang="scss">
.CodeMirror {
  height: 650px;
}
</style>
