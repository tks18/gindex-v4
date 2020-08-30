<template>
  <div :class="ismobile ? 'content nopad mt-2 mx-1 px-1 mt-2' : 'content nopad mt-2 mt-2 ml-5 mr-5'">
    <div class="loading">
      <loading :active.sync="mainLoad" :can-cancel="false" :is-full-page="fullpage"></loading>
    </div>
    <div class="columns is-multiline is-centered">
      <div :class="ismobile ? 'column is-full mx-0 px-1' : 'column is-two-thirds'">
        <div class="columns is-desktop is-multiline is-centered">
          <div class="column is-full">
            <div class="has-text-right is-small">
              <span class="icon has-text-netflix-only is-medium">
                <i :class="playicon"></i>
              </span>
              <span class="subtitle has-text-netflix-only">{{ playtext }}</span>
            </div>
            <vue-plyr ref="plyr" v-bind:key="videokey" :options="options">
              <video :poster="poster" :src="apiurl" class="video-content">
                <source :src="apiurl" type="video/mp4" size="Original Format">
                <track v-for="(sub, index) in suburl" kind="captions" :label="sub.label" :src="sub.url" :srclang="sub.label" v-bind:key="index">
              </video>
            </vue-plyr>
            <div class="box has-background-black">
              <div class="columns is-desktop is-vcentered is-multiline is-mobile">
                <div :class="ismobile ? 'column is-full' : 'column is-8'">
                    <p class="subtitle has-text-white has-text-weight-bold"> {{ decodeURIComponent(videoname.split('.').slice(0,-1).join('.')) }}</p>
                </div>
                <div :class="ismobile ? 'column has-text-netflix has-text-centered is-medium is-3' : 'column has-text-netflix is-medium has-text-centered is-1'">
                  <button class="button is-netflix-red" @click="modal=true;" v-tooltip.bottom-start="'Play Externally.'">
                    <span class="icon">
                      <i class="fas fa-external-link-square-alt fontonly"></i>
                    </span>
                  </button>
                </div>
                <div :class="ismobile ? 'column has-text-netflix has-text-centered is-medium is-3' : 'column has-text-netflix is-medium has-text-centered is-1'">
                  <button class="button is-netflix-red" @click="copy" v-tooltip.bottom-start="'Copy Link'">
                    <span class="icon">
                      <i class="fa fa-copy fontonly"></i>
                    </span>
                  </button>
                </div>
                <div :class="ismobile ? 'column has-text-netflix has-text-centered is-medium is-3' : 'column has-text-netflix is-medium has-text-centered is-1'">
                  <button class="button is-netflix-red" @click="downloadButton" v-tooltip.bottom-start="'Download Now.'">
                    <span class="icon">
                      <i class="fas fa-download fontonly"></i>
                    </span>
                  </button>
                </div>
                <div :class="ismobile ? 'column has-text-netflix has-text-centered is-medium is-3' : 'column has-text-netflix is-medium has-text-centered is-1'">
                  <button class="button is-netflix-red" @click="subModal=true;" v-tooltip.bottom-start="'Load Custom Subtitles..'">
                    <span class="icon">
                      <i class="fas fa-closed-captioning fontonly"></i>
                    </span>
                  </button>
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
          <div :class="subModal ? 'modal is-active' : 'modal'">
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">Load Subtitle File</p>
                <button class="delete" @click="subModal = false;" aria-label="close"></button>
              </header>
              <section class="modal-card-body">
                <article :class=" successMessage ? 'message is-success' : 'message is-hidden is-success'">
                  <div class="message-body">
                    <button class="delete" @click="successMessage = false" aria-label="delete"></button>
                    {{ resultmessage }}
                  </div>
                </article>
                <div class="field">
                  <div class="control">
                    <input :class=" subButLoad ? 'input is-rounded is-success is-loading' : 'input is-rounded is-success' " v-model="subripurl" type="text" :placeholder="'Enter Any Url or Give Path from Drive'">
                  </div>
                </div>
                <div class="field">
                  <p class="control">
                    <input :class=" subButLoad ? 'input is-rounded is-success is-loading' : 'input is-rounded is-success' " placeholder="Label for Subtitle File" id="sublabel" type="text" v-model="custsublabel" required>
                  </p>
                </div>
                <div class="content">
                  <li>Note: Only Give Valid Url's otherwise this page will get Hanged on Sent Back.</li>
                  <li>If You Want to Give drive Path, Give in this Format: <b><i>folder/sub-folder1/sub-folder2</i></b> from Root Folder.</li>
                </div>
              </section>
              <footer class="modal-card-foot">
                <button :class=" subButLoad ? 'button is-loading is-success' : 'button is-success' " @click="loadCustomSub(subripurl, custsublabel)">Save changes</button>
              </footer>
            </div>
          </div>
        </div>
      </div>
      <div :class="ismobile ? 'column is-centered is-vcentered is-one-third is-desktop golist' : 'column is-desktop is-centered is-vcentered is-one-third golist mt-4'" v-loading="loading">
        <div class="column is-full">
          <div class="columns is-mobile is-multiline is-centered is-vcentered">
            <div :class="ismobile ? 'column is-full mx-0 my-0 py-1 px-0' : 'column is-two-thirds mx-0 px-0'">
              <div class="field has-addons is-grouped">
                <div class="control is-expanded has-icons-right is-dark">
                  <input class="input is-rounded searchbar-input"  type="search" v-tooltip.bottom-start="'Filter Videos'" v-model="searchBarTerm" placeholder="Continue Your Binge / Search Videos Here..">
                  <span class="icon has-text-netflix-only is-small is-right" style="padding:0 5px;">
                    <i class="fas fa-search"></i>
                  </span>
                </div>
              </div>
            </div>
            <div :class="ismobile ? 'column is-full mx-0 my-0 px-0 py-1' : 'column is-one-third mx-0 px-0'">
              <h6 class="has-text-right has-text-grey">Found {{ files ? files.length : "0" }} Results</h6>
            </div>
          </div>
        </div>
        <div class="column is-full">
          <div class="columns has-background-dark suggestList is-multiline is-mobile is-centered is-vcentered" v-for="(file, index) in files" v-bind:key="index" @click="action(file,'view')">
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
import { apiRoutes, backendHeaders } from "@/utils/backendUtils";
import { initializeUser, getgds } from "@utils/localUtils";
import {
  formatDate,
  formatFileSize,
  checkoutPath,
  checkView,
} from "@utils/AcrouUtil";
import Loading from 'vue-loading-overlay';
import InfiniteLoading from "vue-infinite-loading";
import { mapState } from "vuex";
import { decode64 } from "@utils/AcrouUtil";
import { srt2vtt } from "@utils/playUtils";
import VuePlyr from "vue-plyr";
export default {
  components: {
    InfiniteLoading,
    Loading,
    VuePlyr
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
      apiurl: "",
      externalUrl: "",
      downloadUrl: "",
      videourl: "",
      poster: "",
      windowWidth: window.innerWidth,
      screenWidth: screen.width,
      mainLoad: false,
      fullpage: true,
      ismobile: false,
      user: {},
      token: {},
      searchBarTerm: "",
      searchBarfaIcon: "fab fa-searchengin",
      videokey: 0,
      mediaToken: "",
      modal: false,
      infiniteId: +new Date(),
      loading: true,
      suburl: [],
      sub: false,
      subModal: false,
      subButLoad: false,
      subripurl: "",
      custsublabel: "",
      successMessage: false,
      resultmessage: "",
      playicon: "fas fa-spinner fa-pulse",
      playtext: "Loading Stuffs....",
      videoname: "",
      loadImage: "",
      gds: [],
      currgd: {},
      page: {
        page_token: null,
        page_index: 0,
      },
      files: [],
      player: {},
      viewer: false,
      icon: {
        "video/mp4": "icon-mp",
        "video/x-matroska": "icon-mkv",
        "video/x-msvideo": "icon-avi",
        "video/webm": "icon-webm",
      },
    };
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
    async initializeUser(){
      var userData = await initializeUser();
      if(userData.isThere){
        if(userData.type == "hybrid"){
          this.user = userData.data.user;
          this.$ga.event({eventCategory: "User Initialized",eventAction: "Hybrid - "+this.siteName,eventLabel: "Video Page",nonInteraction: true})
          this.logged = userData.data.logged;
        } else if(userData.type == "normal"){
          this.$ga.event({eventCategory: "User Initialized",eventAction: "Normal - "+this.siteName,eventLabel: "Video Page",nonInteraction: true})
          this.user = userData.data.user;
          this.token = userData.data.token;
          this.logged = userData.data.logged;
        }
      } else {
        this.logged = userData.data.logged;
      }
      await this.$http.post(apiRoutes.mediaTokenTransmitter, {
        email: userData.data.user.email,
        token: userData.data.token.token,
      }, backendHeaders(userData.data.token.token)).then(response => {
        if(response.data.auth && response.data.registered && response.data.token){
          this.mediaToken = response.data.token;
        } else {
          this.mediaToken = "";
        }
      }).catch(e => {
        console.log(e);
        this.mediaToken = "";
      })
    },
    async render($state) {
      this.mainLoad = true;
      await this.initializeUser();
      this.player = this.$refs.plyr.player
      await this.getFiles($state);
      await this.getVideourl();
      this.checkMobile();
      this.mainLoad = false;
      this.player.play();
    },
    getFiles($state){
      this.metatitle = "Loading...";
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
              this.originalFiles.push(...this.buildFiles(data.files));
              this.files.push(this.getFilteredFiles(...this.buildFiles(data.files)));
              this.checkSuburl();
              this.getPoster();
            } else {
              this.originalFiles = this.buildFiles(data.files)
              this.files = this.getFilteredFiles(this.buildFiles(data.files));
              this.checkSuburl();
              this.getPoster();
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
      this.metatitle = decodeURIComponent(this.url.split('/').pop().split('.').slice(0,-1).join('.'));
      var path = this.url.split(this.url.split('/').pop())[0];
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
    checkMobile() {
      var width = this.windowWidth > 0 ? this.windowWidth : this.screenWidth;
      if(width > 966){
        this.ismobile = false
      } else {
        this.ismobile = true
      }
    },
    checkSuburl() {
      const toks = this.videoname.split('.');
      const pathSansExt = toks.slice(0, -1).join('.');
      const regext = new RegExp(`(?<name>${pathSansExt})`+'\\.(?<label>[\\s\\S\\D]+)\\.(?<format>srt|vtt)');
      return this.originalFiles.forEach(async (item) => {
         if(item.name == pathSansExt + ".srt" || item.name == pathSansExt + ".vtt"){
           let url = item.path+"?player=internal"+"&token="+this.token.token+"&email="+this.user.email;
           let blob = await this.getSrtFile(url);
           if(blob.success){
             this.sub = true;
             this.$notify({
               title: "Subtitle Loaded",
               message: "Done",
               type: "info",
             })
             this.suburl = this.suburl.concat([{url: blob.blobData, label: "Default"}]);
             this.videokey = this.videokey + 1
           } else {
             this.sub = false;
             this.suburl = [];
           }
         } else if(regext.test(item.name)){
           let groups = regext.exec(item.name).groups;
           let url = item.path+"?player=internal"+"&token="+this.token.token+"&email="+this.user.email;
           let blob = await this.getSrtFile(url);
           if(blob.success){
             this.sub = true;
             this.$notify({
               title: "Subtitle Loaded",
               message: "Done",
               type: "info",
             })
             this.suburl = this.suburl.concat([{url: blob.blobData, label: groups.label}]);
             this.videokey = this.videokey + 1
           } else {
             this.sub = false;
             this.suburl = [];
           }
         } else {
           this.sub = false;
           this.suburl = [];
         }
      });
    },
    async getSrtFile(url) {
      try {
        const srt = await this.$http.get(url);
        const blob = new Blob([srt2vtt(srt.data)], { type: 'text/vtt' })
        var srtBlob = URL.createObjectURL(blob);
        return {
          blobData: srtBlob,
          success: true
        };
      } catch(e) {
        return {
          blobData: null,
          success: false
        };
      }
    },
    async loadCustomSub(url, label) {
      this.subButLoad = true;
      const urlRegex = /(http:\/\/|https:\/\/[\s\S]+)/;
      if(urlRegex.test(url)){
        let blob = await this.getSrtFile(url);
        if(blob.success){
          this.suburl = this.suburl.concat([{url: blob.blobData, label: label}]);
          this.$notify({
            title: "Subtitle Loaded",
            message: "Done",
            type: "info",
          })
          this.videokey = this.videokey + 1
          this.successMessage = true;
          this.resultmessage = "Subtitle Loaded Successfully !"
          this.subButLoad = false;
          setTimeout(() => {
            this.subModal = false;
          }, 300);
        } else {
          this.successMessage = true;
          this.resultmessage = "Error Loading the Subtitle. Please Check Your Link."
          this.subButLoad = false;
        }
      } else {
        let getUrl = "/"+this.currgd.id+":/"+url+"?player=internal"+"&token="+this.token.token+"&email="+this.user.email;
        let blob = await this.getSrtFile(getUrl);
        if(blob.success){
          this.suburl = this.suburl.concat([{url: blob.blobData, label: label}]);
          this.videokey = this.videokey + 1
          this.$notify({
            title: "Subtitle Loaded",
            message: "Done",
            type: "info",
          })
          this.successMessage = true;
          this.resultmessage = "Subtitle Loaded Successfully !"
          this.subButLoad = false;
          setTimeout(() => {
            this.subModal = false;
          }, 300);
        } else {
          this.successMessage = true;
          this.resultmessage = "Error Loading the Subtitle. Please Check Your Link."
          this.subButLoad = false;
        }
      }
    },
    loadHls(options) {
      import("@/plugin/video-plugins/hls").then((res) => {
        var Hls = res.default;
        Hls({
          ...options,
          callback: (hls) => {
            // Handle changing captions
            this.player.on("languagechange", () => {
              setTimeout(
                () => (hls.subtitleTrack = this.player.currentTrack),
                50
              );
            });
          },
        });
      });
    },
    loadFlv(options) {
      import("@/plugin/video-plugins/flv").then((res) => {
        var Flv = res.default;
        Flv(options);
      });
    },
    thum(url) {
      return url ? `/${this.$route.params.id}:view?url=${url}` : "";
    },
    copy() {
      this.$copyText(this.externalUrl);
    },
    downloadButton() {
      this.$notify({
        title: "Downloading Now",
        message: "Generating Links and Downloading",
        type: "success",
      })
      this.$ga.event({eventCategory: "Video Download",eventAction: "Download - "+this.siteName,eventLabel: "Video Page",nonInteraction: true})
      location.href = this.downloadUrl;
      return;
    },
    getVideourl() {
      let path = encodeURI(this.url);
      let index = path.lastIndexOf(".");
      let suffix = path.substring(index + 1, path.length);
      this.videoname = this.url.split('/').pop();
      this.videourl = window.location.origin + encodeURI(this.url);
      this.apiurl = this.videourl+"?player=internal"+"&email="+this.user.email+"&token="+this.token.token;
      this.externalUrl = this.videourl+"?player=external"+"&email="+this.user.email+"&token="+this.mediaToken;
      this.downloadUrl = this.videourl+"?player=download"+"&email="+this.user.email+"&token="+this.mediaToken;
      let options = {
        src: this.apiurl,
        autoplay: true,
        media: this.player.media,
      };
      if (suffix === "m3u8") {
        this.loadHls(options);
      } else if (suffix === "flv") {
        this.loadFlv(options);
      }
      this.$notify({
        title: "Video Loaded",
        message: "Done",
        type: "success",
      })
    },
    getIcon(type) {
      return "#" + (this.icon[type] ? this.icon[type] : "icon-weizhi");
    },
    getPoster() {
      var data = this.originalFiles.filter((file) => {
        return file.name == this.videoname
      })[0].thumbnailLink;
      this.poster = data;
    },
    action(file, target) {
      let path = file.path;
      if (target === "view") {
        this.$router.push({
          path: checkView(path),
        });
        return;
      }
    },
    getFilteredFiles(rawFiles) {
      const videoRegex = /(video)\/(.+)/
      return rawFiles.filter(file => {
        return file.name != this.url.split('/').pop();
      }).filter(file => {
        return videoRegex.test(file.mimeType);
      });
    },
  },
  computed: {
    siteName() {
      return window.gds.filter((item, index) => {
        return index == this.$route.params.id;
      })[0];
    },
    url() {
      if (this.$route.params.path) {
        return decode64(this.$route.params.path);
      }
      return "";
    },
    options() {
      return {
        autoplay: false,
        invertTime: false,
        settings: ["quality", "speed", "loop", "captions"],
        ratio: "16:9",
        controls: [
          "play-large",
          "restart",
          "play",
          "progress",
          "current-time",
          "duration",
          "mute",
          "volume",
          "captions",
          "settings",
          "pip",
          "airplay",
          "fullscreen",
        ],
      };
    },
    ...mapState("acrou/view", ["mode"]),
    players() {
      return [
        {
          name: "IINA",
          icon: this.$cdnpath("images/player/iina.png"),
          scheme: "iina://weblink?url=" + this.externalUrl,
        },
        {
          name: "PotPlayer",
          icon: this.$cdnpath("images/player/potplayer.png"),
          scheme: "potplayer://" + this.externalUrl,
        },
        {
          name: "VLC",
          icon: this.$cdnpath("images/player/vlc.png"),
          scheme: "vlc://" + this.externalUrl,
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
          scheme: "nplayer-" + this.externalUrl,
        },
        {
          name: "MXPlayer(Free)",
          icon: this.$cdnpath("images/player/mxplayer.png"),
          scheme:
            "intent:" +
            this.externalUrl +
            "#Intent;package=com.mxtech.videoplayer.ad;S.title=" +
            this.title +
            ";end",
        },
        {
          name: "MXPlayer(Pro)",
          icon: this.$cdnpath("images/player/mxplayer.png"),
          scheme:
            "intent:" +
            this.externalUrl +
            "#Intent;package=com.mxtech.videoplayer.pro;S.title=" +
            this.title +
            ";end",
        },
      ];
    },
    getThunder() {
      return Buffer.from("AA" + this.externalUrl + "ZZ").toString("base64");
    },
  },
  mounted() {
    if(this.$audio.player() != undefined) this.$audio.destroy();
    if(window.themeOptions.loading_image){
      this.loadImage = window.themeOptions.loading_image;
    } else {
      this.loadImage = "https://i.ibb.co/bsqHW2w/Lamplight-Mobile.gif"
    }
    this.render();
  },
  created() {
    let gddata = getgds(this.$route.params.id);
    this.gds = gddata.gds;
    this.currgd = gddata.current;
    this.$ga.page({
      page: "/Video/"+this.url.split('/').pop()+"/",
      title: decodeURIComponent(this.url.split('/').pop().split('.').slice(0,-1).join('.'))+" - "+this.siteName,
      location: window.location.href
    });
  },
  watch: {
    searchBarTerm: function() {
      if(this.searchBarTerm.length > 0){
        const searchRegex = new RegExp(this.searchBarTerm.toLowerCase());
        this.files = this.getFilteredFiles(this.originalFiles.filter((file) => {
          return searchRegex.test(file.name.toLowerCase());
        }));
      } else {
        this.files = this.getFilteredFiles(this.originalFiles);
      }
    },
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
    player: function(){
      this.player.on('ready', () => {
        this.playicon="fas fa-glasses";
        this.playtext="Let's Party"
      });
      this.player.on('loadstart', () => {
        this.playicon = "fas fa-spinner fa-pulse";
        this.playtext = "Loading Awesomeness..";
      })
      this.player.on('play', () => {
        this.$ga.event({eventCategory: this.videoname,eventAction: "Started Playing"+" - "+this.siteName,eventLabel: "Video Page"})
        this.playicon="fas fa-spin fa-compact-disc";
        this.metatitle = "Playing"+"-"+decodeURIComponent(this.url.split('/').pop().split('.').slice(0,-1).join('.'));
        this.playtext="Playing"
      });
      this.player.on('pause', () => {
        this.metatitle = "Paused"+"-"+decodeURIComponent(this.url.split('/').pop().split('.').slice(0,-1).join('.'));
        this.playicon="fas fa-pause",
        this.playtext="Paused"
      });
    }
  }
};
</script>
