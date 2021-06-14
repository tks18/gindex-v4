<template>
  <div id="app" class="mx-0 blur-part my-0 px-0 py-0">
    <Layout ref="layout" />
  </div>
</template>

<script>
import util from "@/libs/util";
import Layout from "./views/Layout";
import { removeItem } from '@utils/encryptUtils';
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
    // this.checkVersion();
    this.netflix_black = window.themeOptions.prefer_netflix_black
  },
  methods: {
    i18nHandle(val) {
      util.cookies.set("lang", val);
      document.querySelector("html").setAttribute("lang", val);
    },
    delTemps() {
      window.addEventListener('beforeunload', () => {
        removeItem("hybridToken");
        removeItem("sessionStore");
        removeItem("prev");
      });
    },
  },
};
</script>
