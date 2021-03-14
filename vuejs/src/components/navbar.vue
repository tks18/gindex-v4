<template>
  <v-app-bar app dark dense flat collapse-on-scroll>
    <v-app-bar-nav-icon
      @click="$state.navdraw.active = !$state.navdraw.active"
    ></v-app-bar-nav-icon>
    <v-avatar
      size="38"
      @click="homeroute"
      class="mx-2 point-cursor"
      color="primary"
    >
      {{ currgd.name.slice(0, 1) }}
    </v-avatar>
    <v-toolbar-title @click="homeroute" class="point-cursor">
      {{ currgd.name }}
    </v-toolbar-title>
  </v-app-bar>
</template>

<script>
export default {
  data: () => {
    return {
      currgd: {},
      gdindex: 0,
    };
  },
  methods: {
    chooseGD() {
      let index = this.$route.params.id;
      if (this.gds && this.gds.length >= index) {
        this.currgd = this.gds[index];
        this.gdindex = this.gds[index].index;
      }
    },
    homeroute() {
      this.$router.push({ path: '/' + this.gdindex + ':' + 'home/' });
    },
  },
  created() {
    if (window.gds && window.gds.length > 0) {
      this.gds = window.gds.map((item, index) => {
        return {
          name: item,
          id: '/' + index + ':',
          index: index,
        };
      });
    }
    this.chooseGD();
  },
  watch: {
    '$route.params.id': 'chooseGD',
  },
};
</script>

<style></style>
