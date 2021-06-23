<template>
  <span
    v-show="$route.meta.view === 'list'"
    class="icon accent"
    :title="mode === 'list' ? 'Grid' : 'List'"
    @click="toggleMode"
  >
    <i
      :class="'fa' + (mode === 'list' ? ' fa-th' : ' fa-th-list')"
      aria-hidden="true"
    ></i>
  </span>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    toggleMode() {
      this.toggle(this.mode === 'list' ? 'grid' : 'list');
    },
  },
};
</script>
