<template>
  <div class="columns is-mobile is-centered">
    <div class="field is-grouped-multiline">
      <div class="control">
        <div class="tags-has-addons home">
            <p class="home-welcome"> > {{ data }} </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        data () {
            return {
              data: "",
            }
        },
        mounted: function() {
          if(this.$route.params.data && this.$route.params.redirectUrl){
              this.data = this.$route.params.data;
              setTimeout(() => {
                  this.$router.push({ path: this.$route.params.redirectUrl })
              }, 3000)
          } else {
            this.data = "Nothing Here!...You will be Redirected"
            setTimeout(() => {
              this.$router.push({ path: '/0:home/' })
            }, 3000)
          }
        }
    }
</script>
