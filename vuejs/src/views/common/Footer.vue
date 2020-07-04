<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <div class="footpad footer-disclaimer">
        <span class="disclaimer-head">Disclaimer:</span> &nbsp; Our resources are only for learning and communication, not for any commercial use. Please abide by the laws and regulations of your country, and any illegal behavior shall be borne by the user himself.
      </div>
      <div v-if="footerLogo" class="footpad footimage">
        <img width="150" height="75" class="gloryimage" :src="footerLogoLink">
      </div>
      <div class="footpad footicons">
        Github - <a class="icon-tag" href="https://github.com/tks18/gindex-v4">Shan.tk</a> | Support Me!
      </div>
      <div class="footpad footer-copyright">
        Copyright&nbsp;<i class="fas fa-copyright"></i> {{ Date.now() | moment("YYYY") }} | &nbsp;{{ currgd.name }}
      </div>
      <div class="footpad footer-policy">
        Licensed under FrontEnd - <a href="https://github.com/tks18/gindex-v4/blob/dark-mode-0-1/LICENSE" target="_blank"> GPL 3.0 </a> | Backend - <a href="https://github.com/tks18/gindex-v4/blob/dark-mode-0-1/vuejs/LICENSE" target="_blank">MIT</a>
      </div>
      <div class="footpad footer-code">
        Please Read our <a href="https://github.com/tks18/gindex-v4/blob/dark-mode-0-1/CODE_OF_CONDUCT.md" target="_blank">Code of Conduct</a> | <a href="https://raw.githubusercontent.com/tks18/gindex-v4/dark-mode-0-1/CONTRIBUTING.md" target="_blank">Community Guidelines</a>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  props: {},
  watch: {},
  data: function () {
    return {
      content: "",
      footerLogo: false,
      gds: [],
      currgd: {},
      footerLogoLink: "",
    };
  },
  components: {},
  methods: {},
  mounted() {
    this.footerLogo = window.themeOptions.footer_logo
    if(this.footerLogo){
      this.footerLogoLink = window.themeOptions.footer_logo_link;
    } else {
      this.footerLogoLink = "";
    }
  },
  created() {
    if (window.gds && window.gds.length > 0) {
      this.gds = window.gds.map((item, index) => {
        return {
          name: item,
          id: index,
        };
      });
      let index = this.$route.params.id;
      if (this.gds && this.gds.length >= index) {
        this.currgd = this.gds[index];
      }
    }
  },
};
</script>
