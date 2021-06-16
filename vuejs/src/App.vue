<template>
  <div id="app" class="mx-0 blur-part my-0 px-0 py-0">
    <Layout ref="layout" />
  </div>
</template>

<script>
import Layout from './views/Layout';
import { removeItem } from '@utils/encryptUtils';
export default {
  name: 'App',
  components: {
    Layout,
  },
  data: function () {
    return {
      github: 'https://github.com/tks18/gindex-v4',
      netflix_black: false,
    };
  },
  created() {
    this.delTemps();
  },
  mounted() {
    // this.checkVersion();
    this.netflix_black = window.themeOptions.prefer_netflix_black;
  },
  methods: {
    delTemps() {
      window.addEventListener('beforeunload', () => {
        removeItem('sessionStore');
        removeItem('prev');
      });
    },
  },
};
</script>
