<template>
  <footer class="footer pb-5">
    <div class="content has-text-centered">
      <div v-if="disclaimer" class="footpad footer-disclaimer">
        <span class="disclaimer-head">Disclaimer:</span> &nbsp; Our resources are only for learning and communication, not for any commercial use. Please abide by the laws and regulations of your country, and any illegal behavior shall be borne by the user himself.
      </div>
      <div v-if="footerLogo" class="footpad footimage">
        <img width="150" height="75" class="gloryimage" :src="footerLogoLink">
      </div>
      <div class="footpad footicons">
        Github - <a class="icon-tag" href="https://github.com/tks18/gindex-v4">Shan.tk</a> | Support Me!
      </div>
      <div v-if="copyright" class="footpad footer-copyright">
        Copyright&nbsp;<i class="fas fa-copyright"></i> {{ Date.now() | moment("YYYY") }} | &nbsp;{{ siteTitle }}
      </div>
      <div v-if="license" class="footpad footer-policy">
        Licensed under FrontEnd - <a href="https://github.com/tks18/gindex-v4/blob/dark-mode-0-1/LICENSE" target="_blank"> GPL 3.0 </a> | Backend - <a href="https://github.com/tks18/gindex-v4/blob/dark-mode-0-1/vuejs/LICENSE" target="_blank">MIT</a>
      </div>
      <div v-if="codeofconduct" class="footpad footer-code">
        Please Read our <a href="https://github.com/tks18/gindex-v4/blob/dark-mode-0-1/CODE_OF_CONDUCT.md" target="_blank">Code of Conduct</a> | <a href="https://raw.githubusercontent.com/tks18/gindex-v4/dark-mode-0-1/CONTRIBUTING.md" target="_blank">Community Guidelines</a>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  props: {},
  data: function () {
    return {
      content: "",
      sitename: "",
      disclaimer: "",
      copyright: "",
      license: "",
      codeofconduct: "",
      footerLogo: false,
      footerLogoLink: "",
    };
  },
  components: {},
  methods: {},
  computed: {
    siteTitle() {
      return window.gds.filter((item, index) => {
        return index == this.$route.params.id;
      })[0];
    },
  },
  beforeMount(){
    this.sitename = document.getElementsByTagName("title")[0].innerText;
  },
  mounted() {
    this.copyright = window.themeOptions.footer_data.copyright;
    this.disclaimer = window.themeOptions.footer_data.disclaimer;
    this.license = window.themeOptions.footer_data.license;
    this.codeofconduct = window.themeOptions.footer_data.license;
    this.footerLogo = window.themeOptions.footer_data.footer_logo
    if(this.footerLogo){
      this.footerLogoLink = window.themeOptions.footer_data.footer_logo_link;
    } else {
      this.footerLogoLink = "";
    }
  },
};
</script>
