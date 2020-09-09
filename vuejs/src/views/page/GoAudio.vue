<template>
  <div :class="ismobile ? 'content nopad mt-2 mx-0 px-0 mt-2' : 'content nopad mt-2 mt-2 ml-5 mr-5'">
    <div class="loading">
      <loading :active.sync="mainLoad" :can-cancel="false" :is-full-page="fullpage"></loading>
    </div>
    <div class="columns is-multiline is-centered">
      <div class="column mt-2 is-two-thirds">
        <div class="columns is-desktop is-multiline is-centered">
          <div class="column is-full">
            <div id="static-aplayer" class="box has-background-light mt-0">
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
          <div class="has-text-left mx-1 is-small">
            <span class="icon has-text-netflix-only is-medium">
              <i :class="playicon"></i>
            </span>
            <span class="subtitle has-text-netflix-only">{{ playtext }}</span>
          </div>
          <div class="column is-full">
            <div class="box has-text-centered has-background-black">
              <div class="columns is-centered is-vcentered is-mobile is-multiline">
                <div :class="ismobile ? 'column has-text-netflix has-text-centered is-medium is-full' : 'column has-text-netflix is-medium has-text-centered is-half'">
                  <button class="button is-netflix-red" @click="toggleModes" v-tooltip.bottom-start="'Toggle MiniPlayer'">
                    <span class="icon">
                      <i class="fas fa-compact-disc"></i>
                    </span>
                    <span>Toggle MiniPlayer</span>
                  </button>
                </div>
                <div :class="ismobile ? 'column has-text-netflix has-text-centered is-medium is-full' : 'column has-text-netflix is-medium has-text-centered is-half'">
                  <button class="button is-netflix-red" @click="addtoCurrlist" v-tooltip.bottom-start="'Add Songs to Current Playlist. Only for Miniplayer'">
                    <span class="icon">
                      <i class="fas fa-clipboard-list"></i>
                    </span>
                    <span>Add Current Playlist</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="column is-full">
            <div class="box has-text-centered has-background-black">
              <div class="columns is-centered is-vcentered is-mobile is-multiline">
                <div :class="ismobile ? 'column is-full' : 'column is-8'">
                    <p class="subtitle has-text-white has-text-weight-bold"> {{ miniplayer ? "Mini Player is toggled on" : "Mini Player is toggled off" }}</p>
                </div>
                <div :class="ismobile ? 'column has-text-netflix has-text-centered is-medium is-3' : 'column has-text-netflix is-medium has-text-centered is-1'">
                  <button class="button is-netflix-red" @click="modal=true;" v-tooltip.bottom-start="'Play Externally.'">
                    <span class="icon">
                      <i class="fas fa-external-link-square-alt fontonly"></i>
                    </span>
                  </button>
                </div>
                <div :class="ismobile ? 'column has-text-netflix has-text-centered is-medium is-3' : 'column has-text-netflix is-medium has-text-centered is-1'">
                  <button class="button is-netflix-red" v-clipboard:copy="externalUrl" v-tooltip.bottom-start="'Copy Link'">
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
              </div>
            </div>
          </div>
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
  decode64,
} from "@utils/AcrouUtil";
import 'aplayer/dist/APlayer.min.css';
import { apiRoutes, backendHeaders } from "@/utils/backendUtils";
import aplayer from 'aplayer';
import { initializeUser, getgds } from "@utils/localUtils";
import { mapState } from "vuex";
import Loading from 'vue-loading-overlay';
export default {
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
      apiurl: "",
      externalUrl: "",
      metatitle: "",
      downloadUrl: "",
      audiourl: "",
      miniplayer: false,
      windowWidth: window.innerWidth,
      screenWidth: screen.width,
      modal: false,
      mainLoad: true,
      ismobile: false,
      fullpage: true,
      user: {},
      token: {},
      gds: [],
      currgd: {},
      mediaToken: "",
      poster: "",
      loadImage: "",
      player: "",
      playlist: [],
      rawAudios: [],
      playicon: "fas fa-spinner fa-pulse",
      playtext: "Loading Stuffs....",
      audioname: "",
      page: {
        page_token: null,
        page_index: 0,
      },
      files: [],
      originalFiles: [],
      viewer: false,
    };
  },
  components: {
    Loading
  },
  methods: {
    async initializeUser() {
      var userData = await initializeUser();
      if(userData.isThere){
        if(userData.type == "hybrid"){
          this.user = userData.data.user;
          this.logged = userData.data.logged;
        } else if(userData.type == "normal"){
          this.user = userData.data.user;
          this.token = userData.data.token;
          this.logged = userData.data.logged;
        }
      } else {
        this.logged = userData.data.logged;
      }
      await this.$backend.post(apiRoutes.mediaTokenTransmitter, {
        email: userData.data.user.email,
        token: userData.data.token.token,
      }, backendHeaders(this.token.token)).then(response => {
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
    createPlayer(){
      this.player = new aplayer({
      container: document.getElementById('static-aplayer'),
      mini: false,
      autoplay: false,
      loop: 'all',
      theme: '#e50914',
      preload: 'auto',
      volume: 0.7,
      mutex: true,
      audio: [{
          name: this.audioname.split('.').slice(0,-1).join('.'),
          url: this.apiurl,
          cover: this.poster,
          }]
      });
    },
    getAudioUrl() {
      this.audioname = this.url.split('/').pop();
      this.audiourl = window.location.origin + encodeURI(this.url);
      this.apiurl = this.audiourl+"?player=internal"+"&email="+this.user.email+"&token="+this.token.token;
      this.externalUrl = this.audiourl+"?player=external"+"&email="+this.user.email+"&token="+this.mediaToken;
      this.downloadUrl = this.audiourl+"?player=download"+"&email="+this.user.email+"&token="+this.mediaToken;
    },
    checkMobile() {
      var width = this.windowWidth > 0 ? this.windowWidth : this.screenWidth;
      if(width > 966){
        this.ismobile = false
      } else {
        this.ismobile = true
      }
    },
    getFiles($state) {
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
              this.rawAudios.push(...this.getFilteredFiles(...this.buildFiles(data.files), true));
              this.addAudios();
            } else {
              this.originalFiles = this.buildFiles(data.files);
              this.files = this.getFilteredFiles(this.buildFiles(data.files));
              this.rawAudios = this.getFilteredFiles(this.buildFiles(data.files), true);
              this.addAudios();
            }
          }
          this.loading = false;
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
        });
    },
    addAudios() {
      if(this.files.length > 0){
        this.files.forEach((item) => {
          this.player.list.add({
            name: item.name.split('.').slice(0,-1).join('.'),
            cover: this.poster,
            url: window.location.origin + encodeURI(item.path)+"?player=internal"+"&email="+this.user.email+"&token="+this.token.token,
          })
        });
      }
      if(this.rawAudios.length > 0){
        this.rawAudios.forEach((item) => {
          this.playlist.push({
            name: item.name.split('.').slice(0,-1).join('.'),
            cover: this.poster,
            url: window.location.origin + encodeURI(item.path)+"?player=internal"+"&email="+this.user.email+"&token="+this.token.token,
          })
        });
      }
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
    async initializePage() {
      this.mainload = true;
      this.poster = window.themeOptions.audio.default_poster;
      await this.initializeUser();
      await this.getAudioUrl();
      await this.createPlayer();
      await this.checkMobile();
      await this.getFiles();
      this.player.play();
      this.mainLoad = false;
    },
    downloadButton() {
      location.href = this.downloadUrl;
    },
    getFilteredFiles(rawFiles, nofill) {
      const audioRegex = /(audio)\/(.+)/
      if(nofill){
        return rawFiles.filter(file => {
          return audioRegex.test(file.mimeType);
        });
      } else {
        return rawFiles.filter(file => {
          return file.name != this.url.split('/').pop();
        }).filter(file => {
          return audioRegex.test(file.mimeType);
        });
      }
    },
    addtoCurrlist(){
      if(this.$audio.player() == undefined) this.$audio.createPlayer();
      this.$audio.player().list.add(this.playlist);
      this.miniplayer = true;
      this.$audio.player().play();
      this.$bus.$emit("music-toggled", "Music Toggled")
    },
    toggleModes(){
      if(this.$audio.player() == undefined){
        this.$audio.createPlayer()
        this.$audio.player().list.add(this.playlist);
        this.$audio.player().play();
        this.miniplayer = true;
      } else {
        this.miniplayer = false;
        this.$audio.destroy();
      }
      this.$bus.$emit("music-toggled", "Music Toggled")
    }
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
          name: "Cast2Tv",
          icon: "https://assets.materialup.com/uploads/b8e5d402-cd36-4774-bf10-0985e993a33e/preview",
          scheme: "intent:"+this.externalUrl+"#Intent;package=com.instantbits.cast.webvideo;S.title="+this.audioname+";end",
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
    let gddata = getgds(this.$route.params.id);
    this.gds = gddata.gds;
    this.currgd = gddata.current;
    this.initializePage();
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
    player: function(){
      this.player.on('ready', () => {
        this.playicon = "fas fa-spinner fa-pulse";
        this.playtext = "Loading Awesomeness..";
      })
      this.player.on('playing', () => {
        this.metatitle = "Playing"+"-"+decodeURIComponent(this.url.split('/').pop().split('.').slice(0,-1).join('.'));
        this.playicon="fas fa-spin fa-compact-disc";
        this.playtext="Playing"
      });
      this.player.on('pause', () => {
        this.metatitle = "Paused"+"-"+decodeURIComponent(this.url.split('/').pop().split('.').slice(0,-1).join('.'));
        this.playicon="fas fa-pause",
        this.playtext="Paused"
      });
    },
  }
};
</script>
