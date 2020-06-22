<template>
  <div class="container has-text-white has-text-centered" style="border-radius: 0.5rem;border: 2px solid #ff9595; margin: 5px; padding: 5px;">
    <div class="loading">
      <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
    </div>
    <div class="tags-has-addons">
        <p class="home-welcome has-text-white"> > {{ data }} </p>
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
          }
          else {
            this.data = "Nothing Here!...You will be Redirected"
            setTimeout(() => {
              this.$router.push({ path: '/0:home/' })
            }, 1000)
          }
        }
    }
</script>
