<template>
  <div :class="ismobile ? 'content mx-0 mt-2 px-0 g2-content' : 'content ml-5 mt-2 mr-5 pl-5 pr-5 g2-content'">
    <figure class="image">
      <img :src="imgurl" :class="!display?'is-hidden':''" @load="loading" />
      <center :class="display?'is-hidden':''">
        <i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>
        <span class="sr-only">Loading...</span>
      </center>
    </figure>
    <hr />
  </div>
</template>

<script>
import { decode64 } from "@utils/AcrouUtil";
export default {
  data: function() {
    return {
      imgurl: "",
      display: false
    };
  },
  computed: {
    url() {
      if (this.$route.params.path) {
        return decode64(this.$route.params.path);
      }
      return ''
    },
    ismobile() {
      var width = window.innerWidth > 0 ? window.innerWidth : screen.width;
      if(width > 966){
        return false
      } else {
        return true
      }
    }
  },
  activated() {
    this.render();
  },
  methods: {
    render() {
      let path = this.url;
// Easy to debug in development environment
// path = process.env.NODE_ENV === "development"? "/api" + path: "";
      this.imgurl = path;
    },
    loading(event) {
      if (event.target.complete == true) {
        this.display = true;
      }
    }
  }
};
</script>
