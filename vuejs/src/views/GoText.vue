<template>
  <div
    :class="
      ismobile
        ? 'content mx-0 mt-2 px-0 g2-content'
        : 'content ml-5 mr-5 mt-2 pl-5 pr-5 g2-content'
    "
  >
    <div class="loading">
      <loading
        :active.sync="mainLoad"
        :can-cancel="false"
        :is-full-page="fullpage"
      ></loading>
    </div>
    <codemirror v-model="content" :options="cmOptions" />
  </div>
</template>

<script>
/* eslint-disable import/no-extraneous-dependencies */
import { apiRoutes, backendHeaders } from '@/utils/backendUtils';
import { initializeUser, getgds } from '@utils/localUtils';
import { get_file, decode64 } from '@utils/AcrouUtil';
import { codemirror } from 'vue-codemirror';
import Loading from 'vue-loading-overlay';
import 'codemirror/lib/codemirror.css';
// eslint-disable-next-line import/extensions
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/theme/base16-dark.css';

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
    codemirror,
    Loading,
  },
  data() {
    return {
      metatitle: '',
      path: '',
      content: '',
      user: {},
      token: {},
      session: {},
      windowWidth: window.innerWidth,
      screenWidth: screen.width,
      ismobile: false,
      mediaToken: '',
      gds: [],
      currgd: {},
      mainLoad: false,
      fullpage: true,
      cmOptions: {
        tabSize: 4,
        mode: 'text/javascript',
        // theme: 'base16-dark',
        lineNumbers: true,
        line: true,
      },
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
    this.$backend
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
        `${window.location.origin + encodeURI(this.url)}?player=internal` +
        `&email=${this.user.email}&token=${this.token.token}&sessionid=${this.session.sessionid}`;
      this.metatitle = decodeURIComponent(
        this.url.split('/').pop().split('.').slice(0, -1).join('.'),
      );
      this.content = 'Loading Content';
      get_file({ path, file: {} }, (data) => {
        this.content = data;
      });
    },
    checkMobile() {
      const width = this.windowWidth > 0 ? this.windowWidth : this.screenWidth;
      if (width > 966) {
        this.ismobile = false;
      } else {
        this.ismobile = true;
      }
    },
  },
};
</script>
<style lang="scss">
.CodeMirror {
  height: 650px;
}
</style>
