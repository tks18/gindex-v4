<template>
  <div class="navbar-item has-dropdown is-hoverable">
    <a class="navbar-link is-arrowless">
      <i class="fa fa-language"></i>
    </a>
    <div class="navbar-dropdown is-right">
      <a
        style="background-color: black;"
        :class="'navbar-item'+(currLanguage===language.value?' navbar-active':'')"
        v-for="language in $languages"
        :key="language.value"
        @click="onChangeLocale(language.value)"
      >{{ language.label }}</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currLanguage : ''
    }
  },
  methods: {
    onChangeLocale(command) {
      this.currLanguage = command
      this.$i18n.locale = command;
    }
  },
  created() {
    this.currLanguage = this.$i18n.locale
  }
};
</script>
