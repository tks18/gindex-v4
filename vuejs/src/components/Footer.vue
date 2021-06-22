<template>
  <footer class="footer pb-5">
    <div class="content has-text-centered">
      <div v-if="footerLogo" class="footpad footimage">
        <img width="150" height="75" class="gloryimage" :src="footerLogoLink" />
      </div>
      <div class="footpad footer-copyright">
        {{ Date.now() | moment('YYYY') }} | &nbsp;{{ siteTitle }}
      </div>
      <div class="footpad footer-policy">
        <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">
          <img
            alt="Creative Commons License"
            style="border-width: 0"
            src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png"
          />
        </a>
        <br />
        <span
          xmlns:dct="http://purl.org/dc/terms/"
          href="http://purl.org/dc/dcmitype/InteractiveResource"
          property="dct:title"
          rel="dct:type"
          >Google Drive Index
        </span>
        by
        <a
          xmlns:cc="http://creativecommons.org/ns#"
          href="https://github.com/tks18"
          property="cc:attributionName"
          rel="cc:attributionURL"
          >Sudharshan TK
        </a>
        is licensed under a
        <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">
          CCA-NC 4.0 Int. License.
        </a>
        <br />
        Based on a work at
        <a
          xmlns:dct="http://purl.org/dc/terms/"
          href="https://github.com/tks18/gindex-v4"
          rel="dct:source"
          >Github
        </a>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      content: '',
      sitename: '',
      footerLogo: false,
      footerLogoLink: '',
    };
  },
  computed: {
    siteTitle() {
      return window.gds.filter(
        (item, index) => index === this.$route.params.id,
      )[0];
    },
  },
  beforeMount() {
    this.sitename = document.getElementsByTagName('title')[0].innerText;
  },
  mounted() {
    this.footerLogo = window.themeOptions.footer_data.footer_logo;
    if (this.footerLogo) {
      this.footerLogoLink = window.themeOptions.footer_data.footer_logo_link;
    } else {
      this.footerLogoLink = '';
    }
  },
  methods: {},
};
</script>
