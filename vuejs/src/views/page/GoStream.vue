<template>
  <div class="content">
    <div class="columns is-desktop is-multiline is-centered is-vcentered">
      <h1 class="title is-5 has-text-centered has-text-white mx-4 my-4 px-4">Live Stream</h1>
      <div class="column is-full">
        <div class="columns is-desktop is-multiline is-centered is-vcentered">
          <div :class="ismobile ? 'column is-full' : 'column is-two-thirds'">
            <vue-plyr ref="plyr" v-bind:key="videokey" class="my-2">
              <video preload="none" controls crossorigin playsinline class="video-content">
                <source :src="url" type="application/x-mpegURL">
              </video>
            </vue-plyr>
          </div>
          <div v-if="url.length > 0" :class="(ismobile ? 'column is-full' : 'column is-two-thirds')+' has-text-white mx-2'">
            <b>Playing: </b>{{ url }}
          </div>
        </div>
      </div>
      <div class="column is-full mx-1">
        <div class="columns has-text-centered is-centered is-vcentered">
          <div class="column is-quarter">
            <button class="button is-netflix-red" @click="loadModal = true;">
              <span class="icon">
                <i class="fas fa-upload"></i>
              </span>
              <span>Load M3u8</span>
            </button>
          </div>
          <div class="column is-quarter">
            <button class="button is-netflix-red" @click="modal = true;">
              <span class="icon">
                <i class="fas fa-external-link-square-alt fontonly"></i>
              </span>
              <span>External Players</span>
            </button>
          </div>
        </div>
      </div>
      <div :class="loadModal ? 'modal is-active' : 'modal'">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Start M3U8 Stream</p>
            <button class="delete" @click="loadModal = false;" aria-label="close"></button>
          </header>
          <section class="modal-card-body">
            <div class="field">
              <div class="control">
                <input class="input is-rounded is-success" v-model="m3url" type="text" :placeholder="'Enter M3u8 Url'">
              </div>
            </div>
            <div class="content">
              <li>Note: Only M3u8 Links Are Supported</li>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button class="button is-success" @click="loadVideo(m3url)">Load it !</button>
          </footer>
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
                <button class="button is-netflix-red is-rounded" @click="modal = false;handleExternalPlay(item.name)">
                  <span class="icon is-small">
                    <i class="fas fa-play"></i>
                  </span>
                  <span>Play</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { players } from "@utils/playUtils";
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
  data: function(){
    return {
      videokey: 0,
      metatitle: "",
      url: "",
      loadModal: false,
      modal: false,
      m3url: "",
    }
  },
  methods: {
    loadVideo(url){
      this.loadModal = false;
      this.url = url;
      let options = {
          src: url,
          autoplay: true,
          media: this.player.media,
      };
      this.metatitle = "Playing - "+url;
      this.loadHls(options);
    },
    loadHls(options) {
      import("@/plugin/video-plugins/hls").then((res) => {
        var Hls = res.default;
        Hls({
          ...options,
          callback: (hls) => {
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
    handleExternalPlay(name){
      if(this.url.length > 0){
        this.$notify({
          title: "Playing Externally",
          message: "Loading into External Player",
          type: "success",
        })
        var curplay = players(this.url, "LiveStream").filter((player) => {
          return player.name == name;
        })[0];
        location.href=curplay.scheme;
        return;
      }
    },
  },
  computed: {
    player(){
      return this.$refs.plyr.player
    },
    siteName() {
      return window.gds.filter((item, index) => {
        return index == this.$route.params.id;
      })[0];
    },
    players() {
      return players().map((player) => {
        return {
          name: player.name,
          icon: player.icon
        }
      })
    },
    ismobile() {
      var width = window.innerWidth > 0 ? window.innerWidth : screen.width;
      if(width > 966){
        return false
      } else {
        return true
      }
    },
  },
  created(){
    this.metatitle = "Live Stream"
    this.$notify({
      title: "Load the Url",
      message: "Use the Button to Load the M3u8 Stream",
      type: "info",
    })
  }
}
</script>
