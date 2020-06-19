<template>
  <div class="columns is-mobile is-centered">
    <div class="field is-grouped-multiline">
      <div class="control">
        <div class="loading">
          <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullPage"></loading>
        </div>
        <div class="tags-has-addons home">
            <p class="home-welcome"> > {{ data }} </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
    export default {
        data () {
            return {
              data: "",
              loading: true,
              fullpage: true,
            }
        },
        components: {
          Loading,
        },
        mounted: function() {
          if(this.$route.params.data && this.$route.params.redirectUrl){
              this.data = this.$route.params.data;
              setTimeout(() => {
                  this.$router.push({ path: this.$route.params.redirectUrl })
              }, 1000)
          } else {
            this.data = "Nothing Here!...You will be Redirected"
            setTimeout(() => {
              this.$router.push({ path: '/0:home/' })
            }, 1000)
          }
        }
    }
</script>
