<template>
  <div :class="ismobile ? 'content mx-0 mt-2 px-0 g2-content' : 'content mx-1 px-1 g2-content'">
    <div class="loading">
      <loading :active.sync="mainLoad" :can-cancel="false" :is-full-page="fullpage"></loading>
    </div>
    <div class="columns is-desktop is-multiline is-centered is-vcentered mx-0 px-0">
      <div class="column has-text-white is-full has-text-centered mx-0 px-0">
        {{currentPage}} / {{pageCount}}
      </div>
      <div class="column is-half has-text-centered mx-0 px-0">
        <div class="columns is-mobile is-centered is-vcentered">
          <div class="column is-half">
            <button class="button is-netflix-red is-rounded" @click="previousPage">
              Previous
            </button>
          </div>
          <div class="column is-half">
            <button class="button is-netflix-red is-rounded" @click="nextPage">
              Next Page
            </button>
          </div>
        </div>
      </div>
      <div class="column is-full mx-0 px-0">
        <div class="columns is-desktop is-multiline is-centered is-vcentered mx-0 px-0">
          <div class="column is-half mx-0 px-0" >
            <pdf
                :src="mediaUrl"
                :page="page"
                @num-pages="pageCount = $event"
                @page-loaded="currentPage = $event"
            ></pdf>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pdf from "vue-pdf/src/vuePdfNoSssNoWorker";
import Loading from 'vue-loading-overlay';
import { decode64 } from "@utils/AcrouUtil";
export default {
  data: function() {
    return {
      user: {},
      token: {},
      mediaUrl: "",
      mediaToken: "",
      mainLoad: false,
      fullpage: true,
      windowWidth: window.innerWidth,
      screenWidth: screen.width,
      ismobile: false,
      currentPage: 0,
      pageCount: 0,
      page: 1,
    };
  },
  components: {
    pdf,
    Loading
  },
  computed: {
    url() {
      this.checkMobile();
      if (this.$route.params.path) {
        return decode64(this.$route.params.path);
      }
      return ''
    },
  },
  methods: {
    checkMobile() {
      var width = this.windowWidth > 0 ? this.windowWidth : this.screenWidth;
      if(width > 966){
        this.ismobile = false
      } else {
        this.ismobile = true
      }
    },
    getUrl(){
      this.mediaUrl = window.location.origin + encodeURI(this.url)+"?player=internal"+"&email="+this.user.email+"&token="+this.token.token;
    },
    previousPage() {
      if(this.page == 1){
        this.page = 1;
      } else {
        this.page = this.page - 1;
      }
    },
    nextPage() {
      if(this.page >= this.pageCount){
        this.page = this.currentPage
      } else {
        this.page++;
      }
    }
  },
  beforeMount() {
    this.mainLoad = true;
    this.checkMobile();
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
          this.getUrl();
          console.log(this.mediaUrl)
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
  mounted(){

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
<style scoped>
object{
    width: 100%;
    height: -webkit-fill-available;
}
</style>
