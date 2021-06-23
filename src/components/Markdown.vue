<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="content mkdown-text" v-html="content"></div>
</template>

<script>
import { get_file } from '@utils/AcrouUtil';
import marked from 'marked';

export default {
  props: {
    option: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      content: '',
    };
  },
  computed: {
    defaultContent() {
      return `
        <center>
            <i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>
            <span class="sr-only">Loading...</span>
        </center>
      `;
    },
  },
  watch: {
    option() {
      this.render();
    },
  },
  mounted() {
    this.render();
  },
  methods: {
    render() {
      this.content = this.defaultContent;
      get_file(this.option, (data) => {
        this.content = marked(data);
      });
    },
  },
};
</script>
