<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <div class="footpad footicons">
        Github - <a class="icon-tag" href="https://github.com/tks18/gindex-v4">Shan.tk</a> | Support Me!
      </div>
      <div class="footpad footer-copyright">
        Copyright&nbsp;<i class="fas fa-copyright"></i> 2020 | &nbsp;{{ currgd.name }}
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  props: {},
  watch: {},
  data: function () {
    return {
      content: "",
      gds: [],
      currgd: {},
    };
  },
  components: {},
  methods: {},
  created() {
    if (window.gds && window.gds.length > 0) {
      this.gds = window.gds.map((item, index) => {
        return {
          name: item,
          id: index,
        };
      });
      let index = this.$route.params.id;
      if (this.gds && this.gds.length >= index) {
        this.currgd = this.gds[index];
      }
    }
  },
};
</script>
