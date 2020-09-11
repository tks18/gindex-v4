<template>
  <div :class="ismobile ? 'mt-2' : 'ml-5 mt-2 mr-5 pl-5 pr-5' ">
    <div class="loading">
      <loading :active.sync="mainLoad" :can-cancel="false" :is-full-page="fullpage"></loading>
    </div>
    <div class="golist" v-loading="loading">
      <bread-crumb ref="breadcrumb"></bread-crumb>
      <list-view
        :data="files"
        :originalData="files"
        v-if="mode === 'list'"
        :icons="getIcon"
        :sortIt="sortIt"
        :action="action"
      />
      <grid-view
        class="g2-content"
        :data="files"
        v-if="mode !== 'list'"
        :getIcon="getIcon"
        :action="action"
        :thum="thum"
      />
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
        :style="'background: url('+loadImage+') no-repeat 50% 50%;height: 240px;line-height: 240px;text-align: center;margin-top: 20px;'"
      ></div>
    </div>
    <div
      class="is-divider"
      :data-content="
        $t('list.total') + ' ' + files.length + ' ' + $t('list.item')
      "
    ></div>
    <headmd :option="headmd" v-if="renderHeadMD && headmd.display"></headmd>
    <readmemd :option="readmemd" v-if="renderReadMeMD && readmemd.display"></readmemd>
    <viewer
      v-if="viewer && images && images.length > 0"
      :images="images"
      class="is-hidden"
      ref="viewer"
      :options="{ toolbar: true, url: 'data-source' }"
      @inited="inited"
    >
      <img
        v-for="image in images"
        :src="thum(image.thumbnailLink)"
        :data-source="image.path+'?player=internal'+'&email='+user.email+'&token='+token.token"
        :key="image.path"
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
} from "@utils/AcrouUtil";
import { orderBy, sortBy } from "lodash";
import { initializeUser, getgds, icon } from "@utils/localUtils";
import { mapState } from "vuex";
import Loading from 'vue-loading-overlay';
import notify from "@/components/notification";
import { apiRoutes, backendHeaders } from "@utils/backendUtils";
import BreadCrumb from "../common/BreadCrumb";
import ListView from "./components/list";
import GridView from "./components/grid";
import Markdown from "../common/Markdown";
import InfiniteLoading from "vue-infinite-loading";
export default {
  name: "GoList",
  components: {
    BreadCrumb,
    ListView,
    GridView,
    Headmd: Markdown,
    Readmemd: Markdown,
    InfiniteLoading,
    Loading
  },
  metaInfo() {
    return {
      title: this.metatitle,
      titleTemplate: (titleChunk) => {
        if(titleChunk && this.siteName){
          return titleChunk ? `${titleChunk} | ${this.siteName}` : `${this.siteName}`;
        } else {
          return "Loading..."
        }
      },
    }
  },
  data: function() {
    return {
      metatitle: "",
      infiniteId: +new Date(),
      loading: true,
      windowWidth: window.innerWidth,
      screenWidth: screen.width,
      ismobile: false,
      loadImage: "",
      currentLocation: "",
      gds: [],
      user: {},
      token: {},
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
      readmeLink: "",
      headLink: "",
      headmd: { display: false, file: {}, path: "" },
      readmemd: { display: false, file: {}, path: "" },
    };
  },
  mounted() {
    this.metatitle = "Getting Files..."
    this.checkMobile();
    if(window.themeOptions.loading_image){
      this.loadImage = window.themeOptions.loading_image;
    } else {
      this.loadImage = "https://i.ibb.co/bsqHW2w/Lamplight-Mobile.gif"
    }
    if(window.themeOptions.render.readme_md){
      this.readmeLink = window.themeOptions.render.readme_md_link;
    } else {
      this.readmeLink = "";
    }
    if(window.themeOptions.render.head_md){
      this.headLink = window.themeOptions.render.head_md_link;
    } else {
      this.headLink = "";
    }
  },
  computed: {
    ...mapState("acrou/view", ["mode"]),
    images() {
      return this.files.filter(
        (file) => file.mimeType.indexOf("image") != -1
      )
    },
    siteName() {
      return window.gds.filter((item, index) => {
        return index == this.$route.params.id;
      })[0];
    },
    renderHeadMD() {
      return window.themeOptions.render.head_md || false;
    },
    renderReadMeMD() {
      return window.themeOptions.render.readme_md || false;
    },
  },
  created() {
    this.initializeUser();
    this.render();
    let gddata = getgds(this.$route.params.id);
    this.gds = gddata.gds;
    this.currgd = gddata.current;
  },
  methods: {
    infiniteHandler($state) {
      // The first time you enter the page does not execute the scroll event
      if (!this.page.page_token) {
        return;
      }
      this.page.page_index++;
      this.render($state);
      console.log($state)
    },
    render($state) {
      this.metatitle = "Getting Files..."
      this.headmd = { display: false, file: "", path: "" };
      this.readmemd = { display: false, file: "", path: "" };
      var path = this.$route.path;
      var password = localStorage.getItem("password" + path);
      let q = this.$route.query.q;
      var p = {
        q: q ? decodeURIComponent(q) : "",
        password: password || null,
        ...this.page,
      };
      this.axios
        .post(path, p)
        .then((res) => {
          var body = res.data;
          if (body) {
            // Determine the response status
            if (body.error && body.error.code == "401") {
              this.checkPassword(path);
              return;
            }
            var data = body.data;
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
          console.log(e);
        });
    },
    buildFiles(files) {
      let lastName = decodeURIComponent(this.$route.fullPath.split("/").slice(0,-1).join("/").split("/").pop());
      this.metatitle = lastName.slice(lastName.length-1, lastName.length) == ":" ? "Root" : lastName;
      var path = this.$route.path;
      return !files
        ? []
        : sortBy(orderBy(files
            .map((item) => {
              var p = path + checkoutPath(item.name, item);
              let isFolder =
                item.mimeType === "application/vnd.google-apps.folder";
              let size = isFolder ? "-" : formatFileSize(item.size);
              return {
                path: p,
                ...item,
                modifiedTime: formatDate(item.modifiedTime),
                size: size,
                absoluteSize: item.size,
                isFolder: isFolder,
              };
            }), ['file'], ['asc']),
            [function(q){
              return !q.isFolder;
            }]);
    },
    checkPassword(path) {
      var pass = prompt(this.$t("list.auth"), "");
      localStorage.setItem("password" + path, pass);
      if (pass != null && pass != "") {
        this.render(path);
      } else {
        this.$router.go(-1);
      }
    },
    checkMobile() {
      var width = this.windowWidth > 0 ? this.windowWidth : this.screenWidth;
      if(width > 966){
        this.ismobile = false
      } else {
        this.ismobile = true
      }
    },
    async initializeUser() {
      var userData = await initializeUser();
      if(userData.isThere){
        if(userData.type == "hybrid"){
          this.user = userData.data.user;
        } else if(userData.type == "normal"){
          this.user = userData.data.user;
          this.token = userData.data.token;
        }
      } else {
        this.logged = userData.data.logged;
      }
    },
    thum(url) {
      return url ? `/${this.$route.params.id}:view?url=${url}` : "";
    },
    inited(viewer) {
      this.$viewer = viewer;
    },
    action(file, target) {
      let cmd = this.$route.params.cmd;
      if (file.mimeType === "application/vnd.google-apps.shortcut") {
        this.$notify({
          title: "notify.title",
          message: "error.shortcut_not_down",
          type: "warning",
        });
        return;
      }
      if (cmd && cmd === "search") {
        this.goSearchResult(file, target);
        return;
      }
      if (file.mimeType.startsWith("image/") && target === "view") {
       this.viewer = true;
       this.$nextTick(() => {
         let index = this.images.findIndex((item) => item.path === file.path);
         this.$viewer.view(index);
       });
       return;
     }
      this.target(file, target);
    },
    target(file, target) {
      let path = file.path;
      if (target === "_blank") {
        if(file.mimeType == 'application/vnd.google-apps.folder'){
          window.open(window.location.origin+path);
          return;
        } else {
          window.open(window.location.origin+checkView(path));
          return;
        }
      }
      if (target === "down") {
        this.$notify({
          title: "Downloading Now",
          message: "Generating Links and Downloading",
          type: "success",
        })
        this.mainLoad = true;
        this.$backend.post(apiRoutes.mediaTokenTransmitter, {
          email: this.user.email,
          token: this.token.token,
        }, backendHeaders(this.token.token)).then(response => {
          if(response.data.auth && response.data.registered && response.data.token){
            let link = window.location.origin+encodeURI(path.replace(/^\/(\d+:)\//, "/$1down/"))+"?player=download"+"&email="+this.user.email+"&token="+response.data.token;
            this.mainLoad = false;
            location.href=link;
            return;
          } else {
            this.mainLoad = false;
            return;
          }
        }).catch(e => {
          console.log(e);
          this.mainLoad = false;
          return;
        })
      }
      if (target === "copy") {
        this.$notify({
          title: "Processing",
          message: "Generating Links",
          type: "info",
        })
        this.mainLoad = true;
        this.$backend.post(apiRoutes.mediaTokenTransmitter, {
          email: this.user.email,
          token: this.token.token,
        }, backendHeaders(this.token.token)).then(response => {
          if(response.data.auth && response.data.registered && response.data.token){
            let link = window.location.origin+encodeURI(path)+"?player=external"+"&email="+this.user.email+"&token="+response.data.token;
            this.mainLoad = false;
            navigator.clipboard.writeText(link).then(function() {
              notify({
                title: "Copied !!",
                message: "Successfully Copied.",
                type: "success",
              })
              return;
            }, function(err) {
              notify({
                title: "Failed",
                message: "Failed to Copied - "+err,
                type: "error",
              })
              return;
            });
            return;
          } else {
            this.mainLoad = false;
            return;
          }
        }).catch(e => {
          console.log(e);
          this.mainLoad = false;
          return;
        })
      }
      if (file.mimeType === "application/vnd.google-apps.folder") {
        this.$router.push({
          path: path,
        });
        return;
      }
      if (target === "view") {
        this.$router.push({
          path: checkView(path),
        });
        return;
      }

    },
    renderMd() {
      var cmd = this.$route.params.cmd;
      if (cmd) {
        return;
      }
      if (window.themeOptions.render.head_md) {
        this.headmd = {
          display: true,
          file: "HEAD.md",
          path: this.headLink,
        };
      }
      // README.md
      if (window.themeOptions.render.readme_md) {
        this.readmemd = {
          display: true,
          file: "README.md",
          path: this.readmeLink,
        };
      }
    },
    sortIt(name){
      this.sort[name] = !this.sort[name];
      this.files = sortBy(
        orderBy(
          this.files,
          [name],
          [this.sort[name] ? 'asc' : 'desc']
        ),
        [function(q){
        return !q.isFolder;
      }])
    },
    goSearchResult(file, target) {
      this.loading = true;
      let id = this.$route.params.id;
      this.axios
        .post(`/${id}:id2path`, { id: file.id })
        .then((res) => {
          this.loading = false;
          let data = res.data;
          if (data) {
            file.path = `/${id}:${data}`;
            this.target(file, target);
          }
        })
        .catch((e) => {
          this.loading = false;
          console.log(e);
        });
    },
    getIcon(type) {
      return "#" + (icon[type] ? icon[type] : "icon-weizhi");
    },
  },
  watch: {
    screenWidth: function() {
      var width = this.windowWidth > 0 ? this.windowWidth : this.screenWidth;
      if(width > 966){
        this.ismobile = false
      } else {
        this.ismobile = true
      }
    },
    windowWidth: function() {
      var width = this.windowWidth > 0 ? this.windowWidth : this.screenWidth;
      if(width > 966){
        this.ismobile = false
      } else {
        this.ismobile = true
      }
    },
  }
};
</script>
