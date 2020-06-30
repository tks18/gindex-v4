<template>
  <div class="content g2-content">
    <div class="audio-card">
      <vue-plyr>
        <audio controls autoplay preload="auto" :src="apiurl">Does Not Support</audio>
      </vue-plyr>
    </div>
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          <span class="icon" style="color: #ff9595">
            <i class="fa fa-play-circle" aria-hidden="true"></i>
          </span>
          {{ $t("page.video.play") }} /
          <span class="icon" style="color: #ff9595">
            <i class="fa fa-download" aria-hidden="true"></i>
          </span>
          {{ $t("page.video.download") }}
        </p>
      </header>
      <div class="card-content">
        <div class="content">
          <div class="field">
            <label class="label">{{ $t("page.video.link") }}</label>
            <div class="control">
              <div class="link-text copy-download-link">
                <input class="input download-link" type="text" :value="audiourl" />
              </div>
                <center>
                  <button id="copy-url" type="button" v-clipboard:copy="audiourl">Copy Link <i class="fa fa-copy"></i></button>
                  <a class="download-button" :href="audiourl" target="_blank">Download <i class="fa fa-download"></i></a>
                </center>
            </div>
          </div>
          <div class="columns is-mobile is-multiline has-text-centered">
            <div
              class="column audiocolumn"
              v-for="(item, index) in players"
              v-bind:key="index"
            >
              <p class="heading">
                <a :href="item.scheme">
                  <figure class="image is-48x48" style="margin: 0 auto;">
                    <img class="icon" :src="item.icon" />
                  </figure>
                </a>
              </p>
              <p class>{{ item.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="golist" v-loading="loading">
      <div class="summa" v-for="(file, index) in getFilteredFiles" v-bind:key="index">
        <svg class="iconfont" aria-hidden="true">
          <use :xlink:href="getIcon(file.mimeType)" />
        </svg>
        <p class="has-text-white" @click.self="
          action(
            file,
            'view'
          )
        ">{{ file.name }}</p>
      </div>
      <infinite-loading
        v-show="!loading"
        ref="infinite"
        spinner="bubbles"
        @infinite="infiniteHandler"
      >
    </infinite-loading>
      <div
        v-show="files.length === 0"
        class="has-text-centered no-content"
      ></div>
    </div>
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
import InfiniteLoading from "vue-infinite-loading";
import { mapState } from "vuex";
import { decode64 } from "@utils/AcrouUtil";
export default {
  data: function() {
    return {
      apiurl: "",
      audiourl: "",
      infiniteId: +new Date(),
      loading: true,
      page: {
        page_token: null,
        page_index: 0,
      },
      files: [],
      viewer: false,
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
    };
  },
  components: {
    InfiniteLoading,
  },
  methods: {
    infiniteHandler($state) {
      // The first time you enter the page does not execute the scroll event
      if (!this.page.page_token) {
        return;
      }
      this.render($state);
    },
    render($state) {
      console.log(this.url);
      var path = this.url.split(this.url.split('/').pop())[0];
      console.log(path);
      var password = localStorage.getItem("password" + path);
      var p = {
        q: "",
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
      var path = this.url.split(this.url.split('/').pop())[0];
      console.log(path);
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
    getAudioUrl() {
      // Easy to debug in development environment
      this.audiourl = window.location.origin + encodeURI(this.url);
      this.apiurl = this.audiourl;
    },
    getIcon(type) {
      return "#" + (this.icon[type] ? this.icon[type] : "icon-weizhi");
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
  },
  activated() {
    this.render();
    this.getAudioUrl();
  },
  computed: {
    getFilteredFiles() {
      return this.files.filter(file => {
        return file.name != this.url.split('/').pop();
      }).filter(file => {
        return file.mimeType != "application/vnd.google-apps.folder";
      }).slice(0,10);
    },
    url() {
      if (this.$route.params.path) {
        return decode64(this.$route.params.path);
      }
      return "";
    },
    ...mapState("acrou/view", ["mode"]),
    players() {
      return [
        {
          name: "IINA",
          icon: this.$cdnpath("images/player/iina.png"),
          scheme: "iina://weblink?url=" + this.videourl,
        },
        {
          name: "PotPlayer",
          icon: this.$cdnpath("images/player/potplayer.png"),
          scheme: "potplayer://" + this.videourl,
        },
        {
          name: "VLC",
          icon: this.$cdnpath("images/player/vlc.png"),
          scheme: "vlc://" + this.videourl,
        },
        {
          name: "Thunder",
          icon: this.$cdnpath("images/player/thunder.png"),
          scheme: "thunder://" + this.getThunder,
        },
        {
          name: "Aria2",
          icon: this.$cdnpath("images/player/aria2.png"),
          scheme: 'javascript:alert("Not Yet Supported")',
        },
        {
          name: "nPlayer",
          icon: this.$cdnpath("images/player/nplayer.png"),
          scheme: "nplayer-" + this.videourl,
        },
        {
          name: "MXPlayer(Free)",
          icon: this.$cdnpath("images/player/mxplayer.png"),
          scheme:
            "intent:" +
            this.videourl +
            "#Intent;package=com.mxtech.videoplayer.ad;S.title=" +
            this.title +
            ";end",
        },
        {
          name: "MXPlayer(Pro)",
          icon: this.$cdnpath("images/player/mxplayer.png"),
          scheme:
            "intent:" +
            this.videourl +
            "#Intent;package=com.mxtech.videoplayer.pro;S.title=" +
            this.title +
            ";end",
        },
      ];
    },
    getThunder() {
      return Buffer.from("AA" + this.audiourl + "ZZ").toString("base64");
    },
  },
};
</script>
