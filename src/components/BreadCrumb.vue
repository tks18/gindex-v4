<template>
  <div>
    <nav
      class="breadcrumb level g2-breadcrumb is-hidden-mobile"
      aria-label="breadcrumbs"
    >
      <div class="level-left">
        <div class="level-item">
          <ul>
            <li>
              <a
                v-show="navs && navs.length > 0"
                class="accent"
                @click="go('/' + root + ':/')"
                >Index
              </a>
            </li>
            <li
              v-for="(item, index) in navs"
              :key="index"
              :class="index + 1 == navs.length ? 'is-active accent' : 'accent'"
            >
              <a
                v-if="index + 1 == navs.length"
                class="accent"
                style="color: white"
                aria-current="page"
                href="#"
                >{{ item.title }}
              </a>
              <a v-else class="accent" @click="go(item.path)">{{
                item.title
              }}</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
/* eslint-disable no-continue */

import { decode64 } from '@utils/AcrouUtil';

export default {
  data() {
    return {
      navs: [],
      root: '/',
    };
  },
  watch: {
    $route: 'render',
  },
  mounted() {
    this.render();
  },
  methods: {
    go(path) {
      this.$router.push({
        path,
      });
    },
    render() {
      this.root = this.$route.params.id;
      const { cmd } = this.$route.params;
      // Do not render if searching
      if (
        cmd === 'search' ||
        cmd === 'home' ||
        cmd === 'result' ||
        cmd === 'register' ||
        cmd === 'settings' ||
        cmd === 'admin' ||
        cmd === 'video' ||
        cmd === 'pdf' ||
        cmd === 'audio' ||
        cmd === 'login'
      ) {
        this.navs = [];
        return;
      }
      let { path } = this.$route;
      if (cmd) {
        path = decode64(this.$route.params.path);
      }
      const arr = path.trim('/').split('/');
      let p = '/';
      if (arr.length > 0) {
        const navs = [];
        for (const i in arr) {
          let n = arr[i];
          if (n === '') {
            continue;
          }
          n = decodeURIComponent(n);
          p += `${arr[i]}/`;
          if (n.match('[0-9]+:')) {
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
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
