<template>
  <div class="content g2-content">
    <TopLinks />
    <object :data="url" type="application/pdf" name="file.pdf">
      <embed :src="url" type="application/pdf" />
    </object>
  </div>
</template>

<script>
import TopLinks from "../common/Top-Links";
import { decode64 } from "@utils/AcrouUtil";
export default {
  components: {
    TopLinks,
  },
  data: function() {
    return {};
  },
  computed: {
    url() {
      if (this.$route.params.path) {
        return decode64(this.$route.params.path);
      }
      return ''
    }
  },
  methods: {}
};
</script>

<style scoped>
object{
    width: 100%;
    height: -webkit-fill-available;
}
</style>
