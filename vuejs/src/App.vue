<template>
  <v-app id="app" class="mx-0 my-0 px-0 py-0">
    <navdrawer v-if="showInfo" />
    <navbar v-if="showInfo" />
    <v-main>
      <feb-alive>
        <router-view></router-view>
      </feb-alive>
    </v-main>
    <Footer v-if="showInfo"></Footer>
  </v-app>
</template>

<script>
import util from '@/libs/util';
import { initializeUser } from '@/utils/localUtils';
import navbar from '@/components/navbar';
import navdrawer from '@/components/navdrawer';
import Footer from '@/views/common/Footer';
import { removeItem } from '@/utils/encryptUtils';
export default {
  name: 'App',
  components: {
    navbar,
    navdrawer,
    Footer: Footer,
  },
  data: function () {
    return {
      github: 'https://github.com/tks18/gindex-v4',
      netflix_black: false,
      showInfo: true,
      logged: false,
      admin: false,
    };
  },
  watch: {
    '$i18n.locale': 'i18nHandle',
    $route: function () {
      if (this.$route.name == 'home' && !this.logged) {
        this.showInfo = false;
      } else {
        this.showInfo = true;
      }
    },
  },
  created() {
    this.i18nHandle(this.$i18n.locale);
    this.delTemps();
    this.$bus.$on('logged', () => {
      this.assignUserInfo();
      this.changeFooter();
    });
    this.$bus.$on('logout', () => {
      this.changeFooter();
      this.assignUserInfo();
    });
  },
  mounted() {
    // this.checkVersion();
    this.netflix_black = window.themeOptions.prefer_netflix_black;
  },
  methods: {
    assignUserInfo() {
      var userData = initializeUser();
      if (userData.isThere) {
        this.logged = userData.data.logged;
        this.admin = userData.data.admin;
      } else {
        this.logged = userData.data.logged;
      }
    },
    changeFooter() {
      if (this.$route.name == 'home' && !this.logged) {
        this.showInfo = false;
      } else {
        this.showInfo = true;
      }
    },
    checkVersion() {
      if (this.admin) {
        let appVersion = window.version;
        try {
          this.$backend
            .get('https://api.github.com/repos/tks18/gindex-v4/releases')
            .then((response) => {
              if (response.data) {
                let latestVersion = response.data.filter((releases) => {
                  const frontendRegex = /^(frontend).+/;
                  return frontendRegex.test(releases.tag_name);
                });
                if (latestVersion.length > 0) {
                  if (appVersion != latestVersion[0].tag_name) {
                    this.$notify({
                      title: 'Update Available',
                      dangerouslyUseHTMLString: true,
                      message: `Frontend Update - ${latestVersion[0].tag_name} is Available`,
                      duration: 0,
                      type: 'warning',
                    });
                  }
                }
              }
            });
        } catch {
          console.error;
        }
      }
    },
    i18nHandle(val) {
      util.cookies.set('lang', val);
      document.querySelector('html').setAttribute('lang', val);
    },
    delTemps() {
      window.addEventListener('beforeunload', () => {
        removeItem('hybridToken');
        removeItem('sessionStore');
        removeItem('prev');
      });
    },
  },
  beforeMount() {
    this.assignUserInfo();
    this.changeFooter();
    this.checkVersion();
  },
  updated() {
    this.changeFooter();
    this.assignUserInfo();
  },
};
</script>
