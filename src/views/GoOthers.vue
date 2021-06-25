<template>
  <div
    :class="
      ismobile
        ? 'content mx-0 mt-2 px-0 g2-content'
        : 'content ml-5 mt-2 mr-5 pl-5 pr-5 g2-content'
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
      class="columns has-text-centered is-mobile is-multiline is-centered is-vcentered"
    >
      <div class="column is-full">
        <p class="subtitle has-text-white has-text-weight-bold">
          Your Requested File is
          <span class="has-text-netflix-only">
            {{ objName }}
          </span>
        </p>
        <p class="subtitle has-text-white">
          {{
            checkPath
              ? 'This File is Supported by us, but Not Supported by your Browser. You can only Download the File'
              : "We Don't Support these Formats online. Your only Option is to Download"
          }}
        </p>
        <button
          class="button is-rounded is-netflix-red has-text-white"
          @click="downloadButton"
        >
          <span class="icon">
            <i class="fas fa-download"></i>
          </span>
          <span>Download</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { apiRoutes, backendHeaders } from '@/utils/backendUtils';
import { initializeUser, getgds } from '@utils/localUtils';
import { decode64, checkExtends } from '@utils/AcrouUtil';
import Loading from 'vue-loading-overlay';

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
      obj: '',
      objName: '',
      metatitle: '',
      user: {},
      token: {},
      session: {},
      gds: [],
      currgd: {},
      downloadUrl: '',
      windowWidth: window.innerWidth,
      screenWidth: screen.width,
      ismobile: false,
      mediaToken: '',
      mainLoad: false,
      fullpage: true,
      display: false,
    };
  },
  computed: {
    url() {
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
    checkPath() {
      return checkExtends(this.$route.params.path);
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
    const gddata = getgds(this.$route.params.id);
    this.gds = gddata.gds;
    this.currgd = gddata.current;
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
          this.objName = decodeURIComponent(this.url.split('/').pop());
          this.metatitle = this.objName;
          this.render();
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
  methods: {
    render() {
      const path =
        `${window.location.origin + encodeURI(this.url)}?player=download` +
        `&token=${this.mediaToken}&email=${this.user.email}&sessionid=${this.session.sessionid}`;
      this.obj = path;
    },
    checkMobile() {
      const width = this.windowWidth > 0 ? this.windowWidth : this.screenWidth;
      if (width > 966) {
        this.ismobile = false;
      } else {
        this.ismobile = true;
      }
    },
    loading(event) {
      if (event.target.complete === true) {
        this.display = true;
      }
    },
    downloadButton() {
      window.open(this.obj);
    },
  },
};
</script>
