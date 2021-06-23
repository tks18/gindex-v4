<template>
  <div
    :class="
      ismobile
        ? 'content mx-0 mt-2 px-0 g2-content'
        : 'content mx-1 px-1 g2-content'
    "
  >
    <div class="loading">
      <loading
        :active.sync="mainLoad"
        :can-cancel="false"
        :is-full-page="fullpage"
      ></loading>
    </div>
    <div
      class="columns is-desktop is-multiline is-centered is-vcentered mx-0 px-0"
    >
      <div class="column is-full has-text-right">
        <div
          class="columns is-multiline has-text-centered is-centered is-vcentered"
        >
          <div class="column is-two-thirds">
            <p class="subtitle has-text-white has-text-weight-bold">
              {{ pdfname }}
            </p>
          </div>
          <div class="column is-one-third">
            <button
              class="button is-rounded is-netflix-red has-text-white"
              @click="download"
            >
              <span class="icon">
                <i class="fas fa-download fontonly"></i>
              </span>
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
      <div class="column is-full mx-0 px-0">
        <object :data="src" type="application/pdf" width="100%" height="100%">
          <iframe :src="src" width="100%" height="100%" style="border: none">
            <p>
              Your browser does not support PDFs.
              <a :href="src">Download the PDF</a>.
            </p>
          </iframe>
        </object>
      </div>
    </div>
  </div>
</template>

<script>
import { apiRoutes, backendHeaders } from '@/utils/backendUtils';
import { initializeUser, getgds } from '@utils/localUtils';
import Loading from 'vue-loading-overlay';
import { decode64 } from '@utils/AcrouUtil';

export default {
  metaInfo() {
    return {
      title: this.metatitle,
      titleTemplate: (titleChunk) => {
        if (titleChunk && this.siteName) {
          return titleChunk
            ? `${titleChunk} | ${this.siteName}`
            : `${this.siteName}`;
        }
        return 'Loading...';
      },
    };
  },
  components: {
    Loading,
  },
  data() {
    return {
      user: {},
      token: {},
      session: {},
      mediaUrl: '',
      metatitle: '',
      pdfname: '',
      gds: [],
      currgd: {},
      mediaToken: '',
      mainLoad: false,
      fullpage: true,
      windowWidth: window.innerWidth,
      screenWidth: screen.width,
      ismobile: false,
      src: '',
    };
  },
  computed: {
    url() {
      this.checkMobile();
      if (this.$route.params.path) {
        return decode64(this.$route.params.path);
      }
      return '';
    },
    siteName() {
      return window.gds.filter(
        (item, index) => index === this.$route.params.id,
      )[0];
    },
  },
  watch: {
    screenWidth() {
      const width = this.windowWidth > 0 ? this.windowWidth : this.screenWidth;
      if (width > 966) {
        this.ismobile = false;
      } else {
        this.ismobile = true;
      }
    },
    windowWidth() {
      const width = this.windowWidth > 0 ? this.windowWidth : this.screenWidth;
      if (width > 966) {
        this.ismobile = false;
      } else {
        this.ismobile = true;
      }
    },
  },
  async beforeMount() {
    this.checkMobile();
    this.mainload = true;
    const userData = await initializeUser();
    if (userData.isThere) {
      if (userData.type === 'normal') {
        this.user = userData.data.user;
        this.token = userData.data.token;
        this.session = userData.data.session;
        this.logged = userData.data.logged;
      }
    } else {
      this.logged = userData.data.logged;
    }
    await this.$backend
      .post(
        apiRoutes.mediaTokenTransmitter,
        {
          email: userData.data.user.email,
          token: userData.data.token.token,
        },
        backendHeaders(userData.data.token.token),
      )
      .then((response) => {
        if (
          response.data.auth &&
          response.data.registered &&
          response.data.token
        ) {
          this.mainLoad = false;
          this.mediaToken = response.data.token;
          this.getUrl();
        } else {
          this.mainLoad = false;
          this.mediaToken = '';
        }
      })
      .catch((e) => {
        this.mainLoad = false;
        this.mediaToken = '';
      });
  },
  created() {
    const gddata = getgds(this.$route.params.id);
    this.gds = gddata.gds;
    this.currgd = gddata.current;
  },
  methods: {
    checkMobile() {
      const width = this.windowWidth > 0 ? this.windowWidth : this.screenWidth;
      if (width > 966) {
        this.ismobile = false;
      } else {
        this.ismobile = true;
      }
    },
    getUrl() {
      this.pdfname = decodeURIComponent(
        this.url.split('/').pop().split('.').slice(0, -1).join('.'),
      );
      this.src =
        `${window.location.origin + encodeURI(this.url)}?player=internal` +
        `&email=${this.user.email}&token=${this.token.token}&sessionid=${this.session.sessionid}`;
      this.metatitle = this.pdfname;
    },
    download() {
      location.href = this.src;
    },
  },
};
</script>
<style scoped>
object {
  width: 100%;
  height: -webkit-fill-available;
}
</style>
