<template>
  <div id="dynamic-aplayer"></div>
</template>
<script>

export default {
  data: function(){
    return {}
  },
  mounted() {

  },
  watch: {
    "this.$audio": function(){
      console.log(this.$audio)
    }
  }
}
</script>
