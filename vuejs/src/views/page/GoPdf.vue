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
import { initializeUser, getgds } from "@utils/localUtils";
import pdf from "vue-pdf/src/vuePdfNoSssNoWorker";
import Loading from 'vue-loading-overlay';
import { decode64 } from "@utils/AcrouUtil";
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
      user: {},
      token: {},
      mediaUrl: "",
      metatitle: "",
      gds: [],
      currgd: {},
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
    siteName() {
      return window.gds.filter((item, index) => {
        return index == this.$route.params.id;
      })[0];
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
      this.metatitle = decodeURIComponent(this.url.split('/').pop().split('.').slice(0,-1).join('.'));
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
  async beforeMount() {
    this.checkMobile();
    this.mainload = true;
    var userData = await initializeUser();
    if(userData.isThere){
      if(userData.type == "hybrid"){
        this.user = userData.data.user;
        this.$ga.event({eventCategory: "User Initialized",eventAction: "Hybrid - "+this.siteName,eventLabel: "PDF",nonInteraction: true})
        this.logged = userData.data.logged;
      } else if(userData.type == "normal"){
        this.$ga.event({eventCategory: "User Initialized",eventAction: "Normal - "+this.siteName,eventLabel: "PDF",nonInteraction: true})
        this.user = userData.data.user;
        this.token = userData.data.token;
        this.logged = userData.data.logged;
      }
    } else {
      this.logged = userData.data.logged;
    }
    await this.$http.post(window.apiRoutes.mediaTokenTransmitter, {
      email: userData.data.user.email,
      token: userData.data.token.token,
    }).then(response => {
      if(response.data.auth && response.data.registered && response.data.token){
        this.mainLoad = false;
        this.mediaToken = response.data.token;
        this.getUrl();
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
  created() {
    let gddata = getgds(this.$route.params.id);
    this.gds = gddata.gds;
    this.currgd = gddata.current;
    this.$ga.page({
      page: "/PDF/"+this.url.split('/').pop()+"/",
      title: decodeURIComponent(this.url.split('/').pop().split('.').slice(0,-1).join('.'))+" - "+this.siteName,
      location: window.location.href
    });
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
