<template>
  <div :class="ismobile ? 'content nopad mt-2 mx-0 px-0 mt-2' : 'content nopad mt-2 mt-2 ml-5 mr-5'">
    <div class="columns is-multiline is-centered">
      <div class="column mt-2 is-two-thirds">
        <div class="columns is-desktop is-multiline is-centered">
          <div class="column is-full">
            <div class="box has-background-black custompad">
              <vue-plyr ref="plyr">
                <audio controls autoplay preload="auto" class="audioplayer" :src="apiurl">Does Not Support</audio>
              </vue-plyr>
            </div>
            <div class="box has-background-black">
              <div class="columns is-mobile is-multiline has-text-white">
                <div class="column is-1">
                  <div class="columns is-desktop is-multiline has-text-white is-centered is-vcentered">
                    <div class="column is-full">
                      <p class="subtitle has-text-weight-bold has-text-warning"><i class="fas fa-audio"></i></p>
                    </div>
                  </div>
                </div>
                <div :class="ismobile ? 'column is-11' : 'column is-7'">
                    <p class="subtitle has-text-white has-text-weight-bold"> {{ audioname }}</p>
                </div>
                <div :class="ismobile ? 'column is-hidden title has-text-weight-semibold has-text-success has-text-right is-4' : 'column title has-text-weight-semibold has-text-success has-text-right is-4'">
                  <span class="icon is-medium">
                    <i :class="playicon"></i>
                  </span>
                  <span class="subtitle has-text-success ml-2">{{ playtext }}</span>
                </div>
              </div>
            </div>
          </div>
          <div :class=" modal ? 'modal is-active' : 'modal' ">
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title has-text-centered">External Players</p>
                <button class="delete" @click="modal = false;" aria-label="close"></button>
              </header>
              <section class="modal-card-body">
                <div class="columns is-centered is-mobile" v-for="(item, index) in players" v-bind:key="index">
                  <div class="column is-3">
                    <figure class="image is-48x48" style="margin: 0 auto;">
                      <img class="icon" :src="item.icon" />
                    </figure>
                  </div>
                  <div class="column is-5">
                    <p class>{{ item.name }}</p>
                  </div>
                  <div class="column is-4">
                    <a class="button is-danger is-rounded" @click="modal = false;" :href="item.scheme">
                      <span class="icon is-small">
                        <i class="fas fa-play"></i>
                      </span>
                      <span>Play</span>
                    </a>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <div class="column is-full">
            <div class="box has-text-centered has-background-dark">
              <div class="columns is-centered is-vcentered is-multiline">
                <div class="column is-2">
                  <button class="button is-success is-rounded" v-clipboard:copy="audiourl">
                    <span class="icon is-small">
                      <i class="fa fa-copy"></i>
                    </span>
                    <span>Share Link</span>
                  </button>
                </div>
                <div class="column is-4">
                  <button class="button is-success is-rounded" @click="modal=true;">
                    <span class="icon">
                     <i class="fas fa-play"></i>
                   </span>
                   <span>External Players</span>
                  </button>
                </div>
                <div class="column is-2">
                  <button class="button is-danger is-rounded" @click="downloadButton">
                    <span class="icon">
                     <i class="fas fa-download"></i>
                   </span>
                   <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-one-third golist" v-loading="loading">
        <h2 class="title has-text-centered has-text-weight-bold has-text-warning"><i class="fas fa-film"></i>  Continue Your Binge !</h2>
        <hr>
          <div class="columns has-background-dark suggestList is-multiline is-mobile is-centered is-vcentered" v-for="(file, index) in getFilteredFiles" v-bind:key="index" @click="action(file,'view')">
            <div class="column is-2">
              <svg class="iconfont" style="font-size: 20px">
                <use :xlink:href="getIcon(file.mimeType)" />
              </svg>
            </div>
            <div class="column is-10">
              <div class="columns is-desktop is-multiline">
                <div class="column is-full">
                  <p class="is-small is-clipped has-text-white">{{ file.name }}</p>
                </div>
                <div class="column is-full">
                  <div class="columns is-mobile is-multiline">
                    <div :class="ismobile ? 'column has-text-left is-12' : 'column has-text-left is-8'">
                      <p class="is-small is-clipped has-text-grey">
                        {{ file.modifiedTime }}
                      </p>
                    </div>
                    <div :class="ismobile ? 'column is-hidden has-text-right is-4' : 'column has-text-right is-4'">
                      <p class="is-small is-clipped has-text-grey">
                        {{ file.size }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
          >
        </div>
      </div>
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
      modal: false,
      infiniteId: +new Date(),
      loading: true,
      loadImage: "",
      player: "",
      playicon: "fas fa-spinner fa-pulse",
      playtext: "Loading Stuffs....",
      audioname: "",
      page: {
        page_token: null,
        page_index: 0,
      },
      files: [],
      viewer: false,
      icon: {
        "application/vnd.google-apps.folder": "icon-morenwenjianjia",
        "video/mp4": "icon-mp",
        "audio/mp3": "icon-webm",
        "audio/ogg": "icon-webm",
        "audio/flac": "icon-webm",
        "audio/vnd.wav": "icon-webm",
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
      this.page.page_token++;
      this.render($state);
    },
    render($state) {
      var path = this.url.split(this.url.split('/').pop())[0];
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
    shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array
    },
    downloadButton() {
      window.open(this.audiourl);
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
      return this.shuffle(this.files).filter(file => {
        return file.name != this.url.split('/').pop();
      }).filter(file => {
        return file.mimeType == "audio/mp3" || "audio/flac" || "audio/ogg";
      }).slice(0,15);
    },
    ismobile() {
      var width = window.innerWidth > 0 ? window.innerWidth : screen.width;
      if(width > 966){
        return false
      } else {
        return true
      }
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
          scheme: "iina://weblink?url=" + this.audiourl,
        },
        {
          name: "PotPlayer",
          icon: this.$cdnpath("images/player/potplayer.png"),
          scheme: "potplayer://" + this.audiourl,
        },
        {
          name: "VLC",
          icon: this.$cdnpath("images/player/vlc.png"),
          scheme: "vlc://" + this.audiourl,
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
          scheme: "nplayer-" + this.audiourl,
        },
        {
          name: "MXPlayer(Free)",
          icon: this.$cdnpath("images/player/mxplayer.png"),
          scheme:
            "intent:" +
            this.audiourl +
            "#Intent;package=com.mxtech.videoplayer.ad;S.title=" +
            this.title +
            ";end",
        },
        {
          name: "MXPlayer(Pro)",
          icon: this.$cdnpath("images/player/mxplayer.png"),
          scheme:
            "intent:" +
            this.audiourl +
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
  mounted() {
    if(window.themeOptions.loading_image){
      this.loadImage = window.themeOptions.loading_image;
    } else {
      this.loadImage = "https://i.ibb.co/bsqHW2w/Lamplight-Mobile.gif"
    }
    this.player = this.$refs.plyr.player
    this.audioname = this.url.split('/').pop();
  },
  watch: {
    player: function(){
      this.player.on('ready', () => {
        this.playicon="fas fa-glasses";
        this.playtext="Ready to Play !"
      });
      this.player.on('play', () => {
        this.playicon="fas fa-spin fa-compact-disc";
        this.playtext="Playing"
      });
      this.player.on('pause', () => {
        this.playicon="fas fa-pause",
        this.playtext="Paused"
      });
    }
  }
};
</script>
