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
import { getgds } from "@utils/localUtils";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
    export default {
      metaInfo() {
        return {
          title: this.metatitle,
          titleTemplate: (titleChunk) => {
            if(titleChunk && this.siteName){
              return titleChunk ? `${titleChunk} | ${this.siteName}` : `${this.siteName}`;
            } else {
              return "Loading..."
            }
          },
        }
      },
        data () {
            return {
              data: "",
              loading: true,
              metatitle: "Navigating..",
              success: false,
              gds: [],
              currgd: {},
              fullpage: true,
            }
        },
        components: {
          Loading,
        },
        computed: {
          siteName() {
            return window.gds.filter((item, index) => {
              return index == this.$route.params.id;
            })[0];
          },
        },
        beforeMount() {
          let gddata = getgds(this.$route.params.id);
          this.gds = gddata.gds;
          this.currgd = gddata.current;
        },
        mounted: function() {
          if(this.$audio.player() != undefined) this.$audio.destroy();
          if(this.$route.params.data && this.$route.params.noredirect){
            this.data = this.$route.params.data;
            this.success = this.$route.params.success;
            this.loading = false;
          } else if(this.$route.params.data && this.$route.params.redirectUrl){
              this.data = this.$route.params.data;
              this.success = this.$route.params.success;
              if(this.$route.params.tocmd){
                setTimeout(() => {
                    this.$router.replace({ path: '/'+ this.currgd.id+ ':' + this.$route.params.tocmd+ this.$route.params.redirectUrl })
                }, 1000)
              } else {
                setTimeout(() => {
                    this.$router.replace({ path: '/'+ this.currgd.id + ':' + '/' + this.$route.params.redirectUrl })
                }, 1000)
              }
          } else {
            this.success = false;
            this.data = "Nothing Here!...You will be Redirected"
            setTimeout(() => {
              this.$router.replace({ path: '/'+this.currgd.id+':home/' })
            }, 1000)
          }
        }
    }
</script>
