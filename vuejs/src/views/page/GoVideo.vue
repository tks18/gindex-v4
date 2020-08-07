<template>
  <div :class="ismobile ? 'content nopad mt-2 mx-1 px-1 mt-2' : 'content nopad mt-2 mt-2 ml-5 mr-5'">
    <div class="loading">
      <loading :active.sync="mainLoad" :can-cancel="false" :is-full-page="fullpage"></loading>
    </div>
    <div class="columns is-multiline is-centered">
      <div :class="ismobile ? 'column is-full mx-0 px-1' : 'column is-two-thirds'">
        <div class="columns is-desktop is-multiline is-centered">
          <div class="column is-full">
            <vue-plyr ref="plyr" v-bind:key="videokey">
              <video :poster="poster" :src="apiurl" class="video-content">
                <source :src="apiurl" type="video/mp4" size="Original Format">
                <track v-for="(sub, index) in suburl" kind="captions" :label="sub.label" :src="sub.url" :srclang="sub.label" v-bind:key="index">
              </video>
            </vue-plyr>
            <div class="box has-background-black">
              <div class="columns is-mobile is-multiline has-text-white">
                <div class="column is-1">
                  <div class="columns is-desktop is-multiline has-text-white is-centered is-vcentered">
                    <div class="column is-full">
                      <p class="subtitle has-text-weight-bold has-text-netflix-only"><i class="fas fa-video"></i></p>
                    </div>
                  </div>
                </div>
                <div :class="ismobile ? 'column is-11' : 'column is-7'">
                    <p class="subtitle has-text-white has-text-weight-bold"> {{ videoname.split('.').slice(0,-1).join('.') }}</p>
                </div>
                <div :class="ismobile ? 'column is-hidden title has-text-weight-semibold has-text-right is-4' : 'column title has-text-weight-semibold has-text-right is-4'">
                  <span class="icon has-text-netflix-only is-medium">
                    <i :class="playicon"></i>
                  </span>
                  <span class="subtitle has-text-netflix-only ml-2">{{ playtext }}</span>
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
          <div class="column is-full">
            <div class="box has-text-centered has-background-black">
              <div class="columns is-centered is-vcentered is-multiline">
                <div class="column is-quarter">
                  <button class="button is-netflix-red is-rounded" v-clipboard:copy="externalUrl">
                    <span class="icon is-small">
                      <i class="fa fa-copy"></i>
                    </span>
                    <span>{{ ismobile ? 'Share Link' : 'Stream Link'}}</span>
                  </button>
                </div>
                <div class="column is-quarter">
                  <button class="button is-netflix-red is-rounded" @click="subModal=true;">
                    <span class="icon">
                      <i class="fa fa-upload"></i>
                    </span>
                    <span>Load Subtitles</span>
                  </button>
                </div>
                <div v-if="ismobile" class="column is-quarter">
                  <button class="button is-netflix-red is-rounded" @click="modal=true;">
                    <span class="icon">
                     <i class="fas fa-play"></i>
                   </span>
                   <span>External Players</span>
                  </button>
                </div>
                <div class="column is-quarter">
                  <button class="button is-netflix-red is-rounded" @click="downloadButton">
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
      <div :class="ismobile ? 'column is-centered is-vcentered is-one-third is-desktop golist' : 'column is-desktop is-centered is-vcentered is-one-third golist mt-4'" v-loading="loading">
        <div class="column is-full">
          <div class="columns is-mobile is-multiline is-centered is-vcentered">
            <div class="column is-two-thirds">
              <h2 class="title has-text-weight-bold has-text-danger">Continue Your Binge</h2>
            </div>
            <div class="column is-one-third">
              <h6 class="subtitle has-text-right has-text-grey">Found {{ this.files ? this.files.length - 1 : "0" }} Results</h6>
            </div>
          </div>
        </div>
        <div class="column is-full">
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
import Loading from 'vue-loading-overlay';
import InfiniteLoading from "vue-infinite-loading";
import { mapState } from "vuex";
import { decode64, srt2vtt } from "@utils/AcrouUtil";

export default {
  components: {
    InfiniteLoading,
    Loading
  },
  data: function() {
    return {
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
      player: {},
      files: [],
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
              this.getPoster();
            } else {
              this.files = this.buildFiles(data.files);
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
      return this.files.forEach(async (item) => {
         if(item.name == pathSansExt + ".srt" || item.name == pathSansExt + ".vtt"){
           let url = item.path+"?player=internal"+"&token="+this.token.token+"&email="+this.user.email;
           let blob = await this.getSrtFile(url);
           if(blob.success){
             this.sub = true;
             this.suburl = this.suburl.concat([{url: blob.blobData, label: "Default"}]);
             this.videokey = this.videokey + 1
           } else {
             this.sub = false;
             this.suburl = [];
           }
         } else if(regext.test(item.name)){
           let groups = regext.exec(item.name).groups;
           console.log(groups)
           let url = item.path+"?player=internal"+"&token="+this.token.token+"&email="+this.user.email;
           let blob = await this.getSrtFile(url);
           if(blob.success){
             this.sub = true;
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
    thum(url) {
      return url ? `/${this.$route.params.id}:view?url=${url}` : "";
    },
    downloadButton() {
      location.href = this.downloadUrl;
      return;
    },
    getVideourl() {
      // Easy to debug in development environment
      this.videourl = window.location.origin + encodeURI(this.url);
      this.apiurl = this.videourl+"?player=internal"+"&email="+this.user.email+"&token="+this.token.token;
      this.externalUrl = this.videourl+"?player=external"+"&email="+this.user.email+"&token="+this.mediaToken;
      this.downloadUrl = this.videourl+"?player=download"+"&email="+this.user.email+"&token="+this.mediaToken;
    },
    getIcon(type) {
      return "#" + (this.icon[type] ? this.icon[type] : "icon-weizhi");
    },
    getPoster() {
      var data = this.files.filter((file) => {
        return file.name == this.videoname
      })[0].thumbnailLink;
      this.poster = data;
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
  computed: {
    getFilteredFiles() {
      this.checkSuburl();
      const videoRegex = /(video)\/(.+)/
      return this.files.filter(file => {
        return file.name != this.url.split('/').pop();
      }).filter(file => {
        return videoRegex.test(file.mimeType);
      });
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
  created() {
    if (window.gds) {
      this.gds = window.gds.map((item, index) => {
        return {
          name: item,
          id: index,
        };
      });
      let index = this.$route.params.id;
      if (this.gds) {
        this.currgd = this.gds[index];
      }
    }
  },
  beforeMount() {
    this.mainLoad = true;
    var user = localStorage.getItem("userdata");
    var token = localStorage.getItem("tokendata");
    if(user && token){
      var tokenData = JSON.parse(this.$hash.AES.decrypt(token, this.$pass).toString(this.$hash.enc.Utf8));
      var userData = JSON.parse(this.$hash.AES.decrypt(user, this.$pass).toString(this.$hash.enc.Utf8));
      this.user = userData, this.token = tokenData;
      this.$http.post(window.apiRoutes.mediaTokenTransmitter, {
        email: userData.email,
        token: tokenData.token,
      }).then(response => {
        if(response.data.auth && response.data.registered && response.data.token){
          this.mainLoad = false;
          this.mediaToken = response.data.token;
          this.getVideourl();
        } else {
          this.mainLoad = false;
          this.mediaToken = "";
        }
      }).catch(e => {
        console.log(e);
        this.mainLoad = false;
        this.mediaToken = "";
      })
    } else {
      this.user = null, this.token = null, this.mainLoad = false;
    }
  },
  mounted() {
    this.checkMobile();
    this.render();
    if(window.themeOptions.loading_image){
      this.loadImage = window.themeOptions.loading_image;
    } else {
      this.loadImage = "https://i.ibb.co/bsqHW2w/Lamplight-Mobile.gif"
    }
    this.player = this.$refs.plyr.player
    this.videoname = this.url.split('/').pop();
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
        this.playicon="fas fa-glasses";
        this.playtext="Ready to Play !"
      });
      this.player.on('loadstart', () => {
        this.playicon = "fas fa-spinner fa-pulse";
        this.playtext = "Loading Awesomeness..";
      })
      this.player.on('canplay', () => {
        this.playicon="fas fa-glasses";
        this.playtext="Let's Party"
      })
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
