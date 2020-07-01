<template>
  <div class="columns is-mobile is-centered mt-5 ml-5 mr-5 pl-5 pr-5">
    <div class="field is-grouped-multiline">
      <div class="control">
        <div class="loading">
          <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
        </div>
        <div class="tags-has-addons">
          <div v-if="!success" class="notification has-text-centered is-danger">
            <h2 class="title has-text-white has-text-weight-bold">Error</h2>
            <p class="subtitle has-text-weight-bold">{{ data }}</p>
          </div>
          <div v-if="success" class="notification has-text-centered is-success">
            <h2 class="title has-text-white has-text-weight-bold">Success</h2>
            <p class="subtitle has-text-weight-bold">{{ data }}</p>
          </div>
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
              success: false,
              fullpage: true,
            }
        },
        components: {
          Loading,
        },
        mounted: function() {
          if(this.$route.params.data && this.$route.params.noredirect){
            this.data = this.$route.params.data;
            this.success = this.$route.params.success;
            this.loading = false;
          } else if(this.$route.params.data && this.$route.params.redirectUrl){
              this.data = this.$route.params.data;
              this.success = this.$route.params.success;
              setTimeout(() => {
                  this.$router.replace({ path: this.$route.params.redirectUrl })
              }, 1000)
          } else {
            this.success = false;
            this.data = "Nothing Here!...You will be Redirected"
            setTimeout(() => {
              this.$router.replace({ path: '/0:home/' })
            }, 1000)
          }
        }
    }
</script>
