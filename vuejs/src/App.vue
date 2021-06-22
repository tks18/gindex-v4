<template>
  <div id="app" class="mx-0 blur-part my-0 px-0 py-0">
    <Navbar v-if="showInfo"></Navbar>
    <feb-alive>
      <router-view></router-view>
    </feb-alive>
    <Footer v-if="showInfo"></Footer>
  </div>
</template>

<script>
import { initializeUser } from '@utils/localUtils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { removeItem } from '@utils/encryptUtils';

export default {
  name: 'App',
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      github: 'https://github.com/tks18/gindex-v4',
      netflix_black: false,
      showInfo: true,
      logged: false,
      admin: false,
    };
  },
  watch: {
    $route() {
      if (this.$route.name === 'home' && !this.logged) {
        this.showInfo = false;
      } else {
        this.showInfo = true;
      }
    },
  },
  created() {
    this.$bus.$on('logged', () => {
      this.assignUserInfo();
      this.changeFooter();
    });
    this.$bus.$on('logout', () => {
      this.changeFooter();
      this.assignUserInfo();
    });
    this.delTemps();
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
  mounted() {
    this.netflix_black = window.themeOptions.prefer_netflix_black;
  },
  methods: {
    assignUserInfo() {
      const userData = initializeUser();
      if (userData.isThere) {
        this.logged = userData.data.logged;
        this.admin = userData.data.admin;
      } else {
        this.logged = userData.data.logged;
      }
    },
    changeFooter() {
      if (this.$route.name === 'home' && !this.logged) {
        this.showInfo = false;
      } else {
        this.showInfo = true;
      }
    },
    checkVersion() {
      if (this.admin) {
        const appVersion = window.version;
        try {
          this.$backend
            .get('https://api.github.com/repos/tks18/gindex-v4/releases')
            .then((response) => {
              if (response.data) {
                const latestVersion = response.data.filter((releases) => {
                  const frontendRegex = /^(frontend).+/;
                  return frontendRegex.test(releases.tag_name);
                });
                if (latestVersion.length > 0) {
                  if (appVersion !== latestVersion[0].tag_name) {
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
          this.$notify({
            title: 'Failed',
            dangerouslyUseHTMLString: true,
            message: `Update Cheking Failed`,
            duration: 0,
            type: 'error',
          });
        }
      }
    },
    delTemps() {
      window.addEventListener('beforeunload', () => {
        removeItem('sessionStore');
        removeItem('prev');
      });
    },
  },
};
</script>
