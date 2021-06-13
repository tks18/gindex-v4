<template>
    <div :class="ismobile ? 'content mt-4 mt-2 mx-1 px-0' : 'content mt-4 mt-2 ml-5 mr-5 pl-5 pr-5'">
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
      </div>
      <div class="columns is-multiline has-text-centered is-desktop is-centered is-vcentered">
        <div class="column is-full">
          <h2 class="title has-text-weight-bold has-text-white">Delete Your Account</h2>
          <p class="is-small has-text-danger-dark has-text-weight-bold">Be Cautious !!</p>
        </div>
        <div class="column is-half">
          <article :class=" errorMessage ? 'message is-danger' : 'message is-hidden is-danger'">
            <div class="message-header">
              <p>Error Proccessing</p>
              <button class="delete" @click="errorMessage = false" aria-label="delete"></button>
            </div>
            <div class="message-body">
              {{ resultmessage }}
            </div>
          </article>
          <form @submit.prevent="handleSubmit">
            <div class="field">
              <p class="control has-icons-left">
                <input class="input is-rounded" id="password" type="password" placeholder="Your Password" v-model="password" required>
                <span class="icon is-small is-left">
                  <i class="fas fa-lock"></i>
                </span>
              </p>
            </div>
            <button :class=" loading ? 'button is-loading is-rounded is-netflix-red' : 'button is-netflix-red is-rounded' " type="submit" :disabled="disabled">
              <span class="icon">
                <i class="fas fa-user-minus"></i>
              </span>
              <span>Delete</span>
            </button>
          </form>
        </div>
      </div>
    </div>
</template>
<script>
import { apiRoutes, backendHeaders } from "@/utils/backendUtils";
import { initializeUser, getgds } from "@utils/localUtils";
import { removeItem } from "@utils/encryptUtils";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
export default {
    components: {
      Loading
    },
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
        props : ["nextUrl"],
        data(){
            return {
                user: {},
                password : "",
                gds: [],
                currgd: {},
                metatitle: "Delete Your Account",
                resultmessage: "",
                disabled: true,
                errorMessage: false,
                loading: false,
                fullpage: true,
            }
        },
        methods : {
            handleSubmit(e) {
              this.metatitle = "Deleting in Progress..";
              this.loading = true;
                e.preventDefault()
                if (this.password && this.password.length > 0)
                {
                    let url = apiRoutes.deleteMe
                    this.$backend.post(url, {
                          email: this.user.email,
                          pass: this.password,
                    }, backendHeaders(this.token.token))
                    .then(response => {
                        if(response){
                          if(response.data.auth && response.data.registered && response.data.deleted){
                            this.metatitle = "Deletion Success";
                            this.resultmessage = response.data.message
                            removeItem('userdata');
                            removeItem('tokendata');
                            setTimeout(() => {
                              this.loading = false;
                              this.$bus.$emit("logout", "User Logged Out");
                              this.$router.push({ name: 'results', params: { id: this.currgd.id, cmd: "result", success: true, data: "You Account is Being Deleted. Please Wait", redirectUrl: "/", tocmd: 'home' } })
                            }, 1500)
                          } else {
                            this.metatitle = "Deletion Failed";
                            this.errorMessage = true;
                            this.loading = false;
                            this.resultmessage = response.data.message
                          }
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
                } else {
                    this.errorMessage = true;
                    this.loading = false;
                    this.resultmessage = "Fill in Your Password"
                    this.password = "";
                }
            },
        },
        computed: {
          ismobile() {
            var width = window.innerWidth > 0 ? window.innerWidth : screen.width;
            if(width > 966){
              return false
            } else {
              return true
            }
          },
          siteName() {
            return window.gds.filter((item, index) => {
              return index == this.$route.params.id;
            })[0];
          },
        },
        beforeMount() {
          if(this.$audio.player() != undefined) this.$audio.destroy();
          this.loading = true;
          var userData = initializeUser();
          if(userData.isThere){
            if(userData.type == "hybrid"){
              this.user = userData.data.user;
              this.loading = userData.data.loading;
            } else if(userData.type == "normal"){
              this.user = userData.data.user;
              this.loading = userData.data.loading;
            }
          } else {
            this.loading = userData.data.loading;
          }
        },
        created() {
          let gddata = getgds(this.$route.params.id);
          this.gds = gddata.gds;
          this.currgd = gddata.current;
        },
        watch: {
          password: function() {
            if(this.password.length > 0){
              this.disabled = false;
            } else {
              this.disabled = true;
            }
          }
        },
    }
</script>
