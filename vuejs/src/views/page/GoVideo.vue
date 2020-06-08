videourl<template>
  <div class="content g2-content">
    <div class="video-content">
    <vue-plyr>
      <video :src="apiurl">
        <source :src="apiurl" type="video/mp4" size="720">
        <source :src="apiurl" type="video/mp4" size="1080">
      </video>
    </vue-plyr>
    </div>
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          <span class="icon">
            <i class="fa fa-play-circle" aria-hidden="true"></i>
          </span>
          {{ $t("page.video.play") }} /
          <span class="icon">
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
                <input id="copy-link" class="input download-link" type="text" :value="videourl" />
              </div>
              <center>
                <button id="copy-url" type="button" v-clipboard:copy="videourl">Copy Link <i class="fa fa-copy"></i></button>
                <a class="download-button" :href="videourl" target="_blank">Download <i class="fa fa-download"></i></a>
              </center>
            </div>
          </div>
          <div class="columns is-mobile is-multiline has-text-centered">
            <div
              class="column"
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
  </div>
</template>

<script>
var interval = setInterval(function(){
  var countforVideo = document.getElementById("vid").readyState;
  if(countforVideo == 4){
    document.getElementById("vid").play();
    clearInterval(interval);
  }
}, 2000)
import { decode64 } from "@utils/AcrouUtil";
export default {
  data: function() {
    return {
      apiurl: "",
      videourl: "",
    };
  },
  methods: {
    render() {
      // Easy to debug in development environment
      this.videourl = window.location.origin + encodeURI(this.url);
      this.apiurl = this.videourl;
    },
  },
  activated() {
    this.render();
  },
  computed: {
    url() {
      if (this.$route.params.path) {
        return decode64(this.$route.params.path);
      }
      return "";
    },
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
      return Buffer.from("AA" + this.videourl + "ZZ").toString("base64");
    },
  },
};
</script>
