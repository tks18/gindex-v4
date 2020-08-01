<template>
  <div :class="ismobile ? 'content mx-0 mt-2 px-0 g2-content' : 'content ml-5 mr-5 mt-2 pl-5 pr-5 g2-content'">
    <object :data="url" type="application/pdf" name="file.pdf">
      <embed :src="url" type="application/pdf" />
    </object>
  </div>
</template>

<script>
import { decode64 } from "@utils/AcrouUtil";
export default {
  data: function() {
    return {
      windowWidth: window.innerWidth,
      screenWidth: screen.width,
      ismobile: false,
    };
  },
  computed: {
    url() {
      this.checkMobile();
      if (this.$route.params.path) {
        return decode64(this.$route.params.path);
      }
      return ''
    },
  },
  methods: {
    checkMobile() {
      var width = this.windowWidth > 0 ? this.windowWidth : this.screenWidth;
      if(width > 966){
        this.ismobile = false
      } else {
        this.ismobile = true
      }
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

<style scoped>
object{
    width: 100%;
    height: -webkit-fill-available;
}
</style>
