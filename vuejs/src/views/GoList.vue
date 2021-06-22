<template>
  <div :class="ismobile ? 'mt-2' : 'ml-5 mt-2 mr-5 pl-5 pr-5'">
    <div class="loading">
      <loading
        :active.sync="mainLoad"
        :can-cancel="false"
        :is-full-page="fullpage"
      ></loading>
    </div>
    <div v-loading="loading" class="golist">
      <div class="has-text-right my-2 py-2">
        <div class="my-1">
          <span
            class="has-text-netflix has-text-weight-semibold"
            @click="
              $notify({
                title: 'Under Construction',
                message: 'Wait for Another Update.',
                type: 'info',
              })
            "
            >Not Finding Your Movie ?
          </span>
        </div>
      </div>
      <bread-crumb ref="breadcrumb"></bread-crumb>
      <list-view
        :data="files"
        :original-data="files"
        :icons="getIcon"
        :sort-it="sortIt"
        :action="action"
      />
      <!-- <grid-view
        class="g2-content"
        :data="files"
        v-if="mode !== 'list'"
        :getIcon="getIcon"
        :action="action"
        :thum="thum"
      /> -->
      <infinite-loading
        v-show="!loading"
        ref="infinite"
        spinner="bubbles"
        @infinite="infiniteHandler"
      >
        <div slot="no-more"></div>
        <div slot="no-results"></div>
      </infinite-loading>
      <div
        v-show="loading"
        class="has-text-centered no-content"
        :style="
          'background: url(' +
          loadImage +
          ') no-repeat 50% 50%;height: 240px;line-height: 240px;text-align: center;margin-top: 20px;'
        "
      ></div>
    </div>
    <div
      class="is-divider"
      :data-content="'Total' + ' ' + files.length + ' ' + 'Item'"
    ></div>
    <Markdown v-if="renderHeadMD && headmd.display" :option="headmd"></Markdown>
    <Markdown
      v-if="renderReadMeMD && readmemd.display"
      :option="readmemd"
    ></Markdown>
    <viewer
      v-if="viewer && images && images.length > 0"
      ref="viewer"
      :images="images"
      class="is-hidden"
      :options="{ toolbar: true, url: 'data-source' }"
      @inited="inited"
    >
      <img
        v-for="image in images"
        :key="image.path"
        :src="thum(image.thumbnailLink)"
        :data-source="
          image.path +
          '?player=internal' +
          '&email=' +
          user.email +
          '&token=' +
          token.token
        "
        :alt="image.name"
        class="image"
      />
    </viewer>
  </div>
</template>

<script>
import {
  formatDate,
  formatFileSize,
  checkoutPath,
  checkView,
} from '@utils/AcrouUtil';
import { orderBy, sortBy } from 'lodash';
import { initializeUser, getgds, icon } from '@utils/localUtils';
import Loading from 'vue-loading-overlay';
import notify from '@/components/notification';
import { apiRoutes, backendHeaders } from '@utils/backendUtils';
import BreadCrumb from '@/components/BreadCrumb';
import ListView from '@/components/list';
import Markdown from '@/components/Markdown';
import InfiniteLoading from 'vue-infinite-loading';

export default {
  name: 'GoList',
  components: {
    BreadCrumb,
    ListView,
    Markdown,
    InfiniteLoading,
    Loading,
  },
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
  data() {
    return {
      metatitle: '',
      infiniteId: +new Date(),
      loading: true,
      windowWidth: window.innerWidth,
      screenWidth: screen.width,
      ismobile: false,
      loadImage: '',
      currentLocation: '',
      gds: [],
      user: {},
      token: {},
      session: {},
      currgd: {},
      sort: {
        name: true,
        modifiedTime: true,
        absoluteSize: true,
      },
      page: {
        page_token: null,
        page_index: 0,
      },
      files: [],
      mainLoad: false,
      fullpage: true,
      viewer: false,
      readmeLink: '',
      headLink: '',
      headmd: { display: false, file: {}, path: '' },
      readmemd: { display: false, file: {}, path: '' },
    };
  },
  computed: {
    images() {
      return this.files.filter((file) => file.mimeType.indexOf('image') !== -1);
    },
    siteName() {
      return window.gds.filter(
        (item, index) => index === this.$route.params.id,
      )[0];
    },
    renderHeadMD() {
      return window.themeOptions.render.head_md || false;
    },
    renderReadMeMD() {
      return window.themeOptions.render.readme_md || false;
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
  mounted() {
    this.metatitle = 'Getting Files...';
    this.checkMobile();
    if (window.themeOptions.loading_image) {
      this.loadImage = window.themeOptions.loading_image;
    } else {
      this.loadImage = 'https://i.ibb.co/bsqHW2w/Lamplight-Mobile.gif';
    }
    if (window.themeOptions.render.readme_md) {
      this.readmeLink = window.themeOptions.render.readme_md_link;
    } else {
      this.readmeLink = '';
    }
    if (window.themeOptions.render.head_md) {
      this.headLink = window.themeOptions.render.head_md_link;
    } else {
      this.headLink = '';
    }
  },
  created() {
    this.initializeUser();
    this.render();
    const gddata = getgds(this.$route.params.id);
    this.gds = gddata.gds;
    this.currgd = gddata.current;
  },
  methods: {
    infiniteHandler($state) {
      if (!this.page.page_token) {
        return;
      }
      this.page.page_index++;
      this.render($state);
    },
    render($state) {
      this.metatitle = 'Getting Files...';
      this.headmd = { display: false, file: '', path: '' };
      this.readmemd = { display: false, file: '', path: '' };
      const { path } = this.$route;
      const password = localStorage.getItem(`password${path}`);
      const { q } = this.$route.query;
      const p = {
        q: q ? decodeURIComponent(q) : '',
        password: password || null,
        ...this.page,
      };
      this.axios
        .post(path, p)
        .then((res) => {
          const body = res.data;
          if (body) {
            // Determine the response status
            if (body.error && body.error.code === '401') {
              this.checkPassword(path);
              return;
            }
            const { data } = body;
            if (!data) return;
            this.page = {
              page_token: body.nextPageToken,
              page_index: body.curPageIndex,
            };
            if ($state) {
              this.files.push(...this.buildFiles(data.files));
            } else {
              this.files = this.buildFiles(data.files);
            }
            if (data.files) {
              this.renderMd();
            }
          }
          if (body.nextPageToken) {
            this.$refs.infinite.stateChanger.loaded();
          } else {
            this.$refs.infinite.stateChanger.complete();
          }
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    buildFiles(files) {
      const lastName = decodeURIComponent(
        this.$route.fullPath.split('/').slice(0, -1).join('/').split('/').pop(),
      );
      this.metatitle =
        lastName.slice(lastName.length - 1, lastName.length) === ':'
          ? 'Root'
          : lastName;
      const { path } = this.$route;
      return !files
        ? []
        : sortBy(
            orderBy(
              files.map((item) => {
                const p = path + checkoutPath(item.name, item);
                const isFolder =
                  item.mimeType === 'application/vnd.google-apps.folder';
                const size = isFolder ? '-' : formatFileSize(item.size);
                return {
                  path: p,
                  ...item,
                  modifiedTime: formatDate(item.modifiedTime),
                  size,
                  absoluteSize: item.size,
                  isFolder,
                };
              }),
              ['file'],
              ['asc'],
            ),
            [(q) => !q.isFolder],
          );
    },
    checkPassword(path) {
      // eslint-disable-next-line no-alert
      const pass = prompt('Directory encryption, please enter password', '');
      localStorage.setItem(`password${path}`, pass);
      if (pass != null && pass !== '') {
        this.render(path);
      } else {
        this.$router.go(-1);
      }
    },
    checkMobile() {
      const width = this.windowWidth > 0 ? this.windowWidth : this.screenWidth;
      if (width > 966) {
        this.ismobile = false;
      } else {
        this.ismobile = true;
      }
    },
    async initializeUser() {
      const userData = await initializeUser();
      if (userData.isThere) {
        if (userData.type === 'normal') {
          this.user = userData.data.user;
          this.session = userData.data.session;
          this.token = userData.data.token;
        }
      } else {
        this.logged = userData.data.logged;
      }
    },
    thum(url) {
      return url ? `/${this.$route.params.id}:view?url=${url}` : '';
    },
    inited(viewer) {
      this.$viewer = viewer;
    },
    action(file, target) {
      const { cmd } = this.$route.params;
      if (file.mimeType === 'application/vnd.google-apps.shortcut') {
        this.$notify({
          title: 'notify.title',
          message: 'error.shortcut_not_down',
          type: 'warning',
        });
        return;
      }
      if (cmd && cmd === 'search') {
        this.goSearchResult(file, target);
        return;
      }
      if (file.mimeType.startsWith('image/') && target === 'view') {
        this.viewer = true;
        this.$nextTick(() => {
          const index = this.images.findIndex(
            (item) => item.path === file.path,
          );
          this.$viewer.view(index);
        });
        return;
      }
      this.target(file, target);
    },
    target(file, target) {
      const { path } = file;
      if (target === '_blank') {
        if (file.mimeType === 'application/vnd.google-apps.folder') {
          window.open(window.location.origin + path);
          return;
        }
        window.open(window.location.origin + checkView(path));
        return;
      }
      if (target === 'down') {
        this.$notify({
          title: 'Downloading Now',
          message: 'Generating Links and Downloading',
          type: 'success',
        });
        this.mainLoad = true;
        this.$backend
          .post(
            apiRoutes.mediaTokenTransmitter,
            {
              email: this.user.email,
              token: this.token.token,
            },
            backendHeaders(this.token.token),
          )
          .then((response) => {
            if (
              response.data.auth &&
              response.data.registered &&
              response.data.token
            ) {
              const link =
                `${
                  window.location.origin +
                  encodeURI(path.replace(/^\/(\d+:)\//, '/$1down/'))
                }?player=download` +
                `&email=${this.user.email}&token=${response.data.token}&sessionid=${this.session.sessionid}`;
              this.mainLoad = false;
              location.href = link;
            } else {
              this.mainLoad = false;
            }
          })
          .catch((e) => {
            this.mainLoad = false;
          });
      }
      if (target === 'copy') {
        this.$notify({
          title: 'Processing',
          message: 'Generating Links',
          type: 'info',
        });
        this.mainLoad = true;
        this.$backend
          .post(
            apiRoutes.mediaTokenTransmitter,
            {
              email: this.user.email,
              token: this.token.token,
            },
            backendHeaders(this.token.token),
          )
          .then((response) => {
            if (
              response.data.auth &&
              response.data.registered &&
              response.data.token
            ) {
              const link =
                `${window.location.origin + encodeURI(path)}?player=external` +
                `&email=${this.user.email}&token=${response.data.token}&sessionid=${this.session.sessionid}`;
              this.mainLoad = false;
              navigator.clipboard.writeText(link).then(
                () => {
                  notify({
                    title: 'Copied !!',
                    message: 'Successfully Copied.',
                    type: 'success',
                  });
                },
                (err) => {
                  notify({
                    title: 'Failed',
                    message: `Failed to Copied - ${err}`,
                    type: 'error',
                  });
                },
              );
            } else {
              this.mainLoad = false;
            }
          })
          .catch((e) => {
            this.mainLoad = false;
          });
      }
      if (file.mimeType === 'application/vnd.google-apps.folder') {
        this.$router.push({
          path,
        });
        return;
      }
      if (target === 'view') {
        this.$router.push({
          path: checkView(path),
        });
      }
    },
    renderMd() {
      const { cmd } = this.$route.params;
      if (cmd) {
        return;
      }
      if (window.themeOptions.render.head_md) {
        this.headmd = {
          display: true,
          file: 'HEAD.md',
          path: this.headLink,
        };
      }
      // README.md
      if (window.themeOptions.render.readme_md) {
        this.readmemd = {
          display: true,
          file: 'README.md',
          path: this.readmeLink,
        };
      }
    },
    sortIt(name) {
      this.sort[name] = !this.sort[name];
      this.files = sortBy(
        orderBy(this.files, [name], [this.sort[name] ? 'asc' : 'desc']),
        [(q) => !q.isFolder],
      );
    },
    goSearchResult(file, target) {
      this.loading = true;
      const { id } = this.$route.params;
      this.axios
        .post(`/${id}:id2path`, { id: file.id })
        .then((res) => {
          this.loading = false;
          const { data } = res;
          if (data) {
            // eslint-disable-next-line no-param-reassign
            file.path = `/${id}:${data}`;
            this.target(file, target);
          }
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    getIcon(type) {
      return `#${icon[type] ? icon[type] : 'icon-weizhi'}`;
    },
  },
};
</script>
