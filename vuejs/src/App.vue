<template>
  <div id="app" class="mx-0 my-0 px-0 py-0" :style=" netflix_black ? 'background-color: #222222' : 'background-color: black;'">
    <Layout ref="layout" />
  </div>
</template>

<script>
import util from "@/libs/util";
import Layout from "./views/Layout";

export default {
  name: "App",
  components: {
    Layout,
  },
  data: function() {
    return {
      github: "https://github.com/tks18/gindex-v4",
      netflix_black: false,
    };
  },
  watch: {
    "$i18n.locale": "i18nHandle",
  },
  created() {
    this.i18nHandle(this.$i18n.locale);
    this.delTemps();
  },
  mounted() {
    this.checkVersion();
    this.netflix_black = window.themeOptions.prefer_netflix_black
  },
  methods: {
    i18nHandle(val) {
      util.cookies.set("lang", val);
      document.querySelector("html").setAttribute("lang", val);
    },
    delTemps() {
      window.addEventListener('beforeunload', () => {
        localStorage.removeItem("hybridToken");
        localStorage.removeItem("sessionStore");
      });
    },
    checkVersion() {
      let appVersion = window.version;
      this.$http.get("https://api.github.com/repos/tks18/gindex-v4/releases/latest").then(response => {
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
    },
  },
};
</script>
