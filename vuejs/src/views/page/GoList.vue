<template>
  <div :class="ismobile ? 'mt-2' : 'ml-5 mt-2 mr-5 pl-5 pr-5' ">
    <div class="golist" v-loading="loading">
      <bread-crumb ref="breadcrumb"></bread-crumb>
      <list-view
        :data="files"
        v-if="mode === 'list'"
        :icons="getIcon"
        :action="action"
        :copy="copy"
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
        :data-source="image.path"
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
  checkExtends,
} from "@utils/AcrouUtil";
import { mapState } from "vuex";
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
  },
  data: function() {
    return {
      infiniteId: +new Date(),
      loading: true,
      loadImage: "",
      page: {
        page_token: null,
        page_index: 0,
      },
      files: [],
      viewer: false,
      readmeLink: "",
      headLink: "",
      icon: {
        "application/vnd.google-apps.folder": "icon-morenwenjianjia",
        "video/mp4": "icon-mp",
        "audio/mpeg": "icon-mkv",
        "audio/ogg": "icon-mkv",
        "audio/aac": "icon-mkv",
        "audio/vnd.wav": "icon-mkv",
        "video/x-matroska": "icon-mkv",
        "video/x-msvideo": "icon-avi",
        "video/webm": "icon-webm",
        "text/plain": "icon-txt",
        "text/markdown": "icon-markdown",
        "text/x-ssa": "icon-ASS",
        "text/html": "icon-html",
        "text/x-python-script": "icon-python",
        "text/x-java": "icon-java1",
        "text/x-sh": "icon-SH",
        "application/x-subrip": "icon-srt",
        "application/zip": "icon-zip",
        "application/x-zip-compressed": "icon-zip",
        "application/rar": "icon-rar",
        "application/pdf": "icon-pdf",
        "application/json": "icon-JSON1",
        "application/x-yaml": "icon-YML",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          "icon-word",
        "image/bmp": "icon-img",
        "image/jpeg": "icon-img",
        "image/png": "icon-img",
        "image/gif": "icon-img"
      },
      headmd: { display: false, file: {}, path: "" },
      readmemd: { display: false, file: {}, path: "" },
    };
  },
  mounted() {
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
      );
    },
    ismobile() {
      var width = window.innerWidth > 0 ? window.innerWidth : screen.width;
      if(width > 966){
        return false
      } else {
        return true
      }
    },
    renderHeadMD() {
      return window.themeOptions.render.head_md || false;
    },
    renderReadMeMD() {
      return window.themeOptions.render.readme_md || false;
    },
  },
  created() {
    this.render();
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
      var path = this.$route.path;
      return !files
        ? []
        : files
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
                isFolder: isFolder,
              };
            })
            .sort((a, b) => {
              if (a.isFolder && b.isFolder) {
                return 0;
              }
              return a.isFolder ? -1 : 1;
            });
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
    copy(path) {
      let origin = window.location.origin;
      path = origin + encodeURI(path);
      this.$copyText(path)
        .then(() => {
          this.$notify({
            title: this.$t("notify.title"),
            message: this.$t("copy.success"),
            type: "success",
          });
        })
        .catch(() => {
          this.$notify.error({
            title: this.$t("notify.title"),
            message: this.$t("copy.error"),
          });
        });
    },
    thum(url) {
      return url ? `/${this.$route.params.id}:view?url=${url}` : "";
    },
    inited(viewer) {
      this.$viewer = viewer;
    },
    action(file, target) {
      if (file.mimeType.indexOf("image") != -1) {
        this.viewer = true;
        this.$nextTick(() => {
          let index = this.images.findIndex((item) => item.path === file.path);
          this.$viewer.view(index);
        });
        return;
      }
      let cmd = this.$route.params.cmd;
      if (cmd && cmd === "search") {
        this.goSearchResult(file, target);
        return;
      }
      this.target(file, target);
    },
    target(file, target) {
      let path = file.path;
      if (target === "_blank") {
        window.open(path);
        return;
      }
      if (target === "copy") {
        this.copy(path);
        return;
      }
      if (target === "down" || (!checkExtends(path) && !file.isFolder)) {
        location.href = path.replace(/^\/(\d+:)\//, "/$1down/");
        return;
      }
      if (target === "view") {
        this.$router.push({
          path: checkView(path),
        });
        return;
      }
      if (file.mimeType === "application/vnd.google-apps.folder") {
        this.$router.push({
          path: path,
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
      return "#" + (this.icon[type] ? this.icon[type] : "icon-weizhi");
    },
  },
};
</script>
