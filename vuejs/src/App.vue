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
    checkVersion() {
      let g2index_version = window.gdconfig.version;
      let app_version = process.env.VUE_APP_G2INDEX_VERSION;
      if (!g2index_version || app_version !== g2index_version) {
        this.$notify({
          title: this.$t("notify.title"),
          dangerouslyUseHTMLString: true,
          message: this.$t("checkVersion.tips").replace("${url}", this.github),
          duration: 0,
          type: "success",
        });
      }
    },
  },
};
</script>
