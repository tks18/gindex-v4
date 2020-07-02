<template>
  <div>
    <nav
      class="breadcrumb level g2-breadcrumb is-hidden-mobile is-hidden-touch"
      aria-label="breadcrumbs"
    >
      <div class="level-left">
        <div class="level-item">
          <ul>
            <li>
              <a style="color: #e50914"
                v-show="navs && navs.length > 0"
                @click="go('/' + index + ':/')"
                >{{ $t("index") }}</a
              >
            </li>
            <li
              v-for="(item, index) in navs"
              :class="index + 1 == navs.length ? 'is-active' : ''"
              v-bind:key="index"
            >
              <a style="color: #80bdab;" class="breadcrumb-text" v-if="index + 1 == navs.length" aria-current="page" href="#">{{
                item.title
              }}</a>
              <a style="color: #e50914;" v-else @click="go(item.path)">{{ item.title }}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <view-mode />
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import ViewMode from "@/layout/viewmode";
import { decode64 } from "@utils/AcrouUtil";
export default {
  props: ["name"],
  components: {
    ViewMode,
  },
  data: function() {
    return {
      navs: [],
      index: "/",
    };
  },
  mounted() {
    this.render();
  },
  watch: {
    $route: "render",
  },
  methods: {
    go(path) {
      this.$router.push({
        path: path,
      });
    },
    render() {
      this.index = this.$route.params.id;
      let cmd = this.$route.params.cmd;
// Do not render if searching
      if (cmd === "search" || cmd === "home" || cmd === "register" || cmd === "settings" || cmd === "admin" || cmd === "video" || cmd === "audio") {
        this.navs = [];
        return;
      }
      let path = this.$route.path;
      if (cmd) {
        path = decode64(this.$route.params.path);
      }
      var arr = path.trim("/").split("/");
      var p = "/";
      if (arr.length > 0) {
        var navs = [];
        for (var i in arr) {
          var n = arr[i];
          if (n == "") {
            continue;
          }
          n = decodeURIComponent(n);
          p += arr[i] + "/";
          // if (p.match("/[0-9]+:/")[0] === p) {
          //   n = this.$t('index');
          // }
          if (n.match("[0-9]+:")) {
            continue;
          }
          navs.push({
            path: p,
            title: n,
          });
        }
        this.navs = navs;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.g2-breadcrumb {
  padding: 0px 15px;
  border-radius: 25px 25px;
}
.level-left {
  width: 95%;
  .level-item {
    display: initial;
    width: 100%;
  }
}
.level-right {
  .level-item {
    border-radius: 50%;
    height: 40px;
    width: 40px;
    color: #ff9595;
    &:hover {
      // border: 1px dotted transparent;
      // background: rgba(0, 0, 0, 0.15);
      // text-decoration: none;
      cursor: pointer;
    }
  }
}
</style>
