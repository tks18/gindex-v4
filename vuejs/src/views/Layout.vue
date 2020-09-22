<template>
  <div>
    <section class="section show-part mx-0 my-0 px-0 py-0">
      <Head v-if="showInfo"></Head>
        <!-- <keep-alive> -->
        <feb-alive>
            <router-view ></router-view>
        </feb-alive>
        <!-- </keep-alive> -->
        <Footer v-if="showInfo"></Footer>
    </section>
  </div>
</template>

<script>
import { initializeUser } from "@utils/localUtils";
import Head from "./common/Head";
import Footer from "./common/Footer";
export default {
  data: function () {
    return {
      showInfo: true,
      logged: false,
      admin: false,
    };
  },
  components: {
    Head,
    Footer: Footer,
  },
  methods: {
    assignUserInfo() {
      var userData = initializeUser();
      if(userData.isThere){
        this.logged = userData.data.logged;
        this.admin = userData.data.admin;
      } else {
        this.logged = userData.data.logged;
      }
    },
    changeFooter() {
      if(this.$route.name == 'home' && !this.logged){
        this.showInfo = false;
      } else {
        this.showInfo = true;
      }
    },
    checkVersion() {
      if(this.admin){
        let appVersion = window.version;
        this.$backend.get("https://api.github.com/repos/tks18/gindex-v4/releases/latest").then(response => {
          if(response.data.name){
            let latestVersion = response.data.name;
            if(appVersion != latestVersion){
              this.$notify({
                title: "Update Available",
                dangerouslyUseHTMLString: true,
                message: `Update to ${latestVersion} Available`,
                duration: 0,
                type: "warning",
              });
            }
          }
        })
      }
    },
  },
  beforeMount() {
    this.assignUserInfo();
    this.changeFooter();
    this.checkVersion();
  },
  created() {
    this.$bus.$on('logged', () => {
      this.assignUserInfo();
      this.changeFooter()
    })
    this.$bus.$on('logout', () => {
      this.changeFooter()
      this.assignUserInfo();
    })
  },
  updated() {
    this.changeFooter()
    this.assignUserInfo();
  },
  watch: {
    "$route": function() {
      if(this.$route.name == 'home' && !this.logged){
        this.showInfo = false;
      } else {
        this.showInfo = true;
      }
    }
  },
};
</script>
