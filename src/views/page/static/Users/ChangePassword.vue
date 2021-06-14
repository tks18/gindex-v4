<template>
    <div :class="ismobile ? 'content mx-1 mt-2 px-0' : 'content ml-5 mt-2 mr-5 pl-5 pr-5 '">
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
      </div>
      <div class="columns is-multiline is-desktop has-text-centered is-centered is-vcentered">
        <div class="column is-full">
          <h2 class="title has-text-weight-bold has-text-white">Change Your Password</h2>
          <p class="subtitle has-text-danger-dark"> Enter Your Old Password and Change </p>
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
                <input class="input is-rounded" id="oldpassword" type="password" placeholder="Your Old Password" v-model="oldpassword" required>
                <span class="icon is-small is-left">
                  <i class="fas fa-lock"></i>
                </span>
              </p>
            </div>
            <div class="field">
              <p class="control has-icons-left">
                <input class="input is-rounded" id="newpassword" type="password" placeholder="New Password" v-model="newpassword" required>
                <span class="icon is-small is-left">
                  <i class="fas fa-lock"></i>
                </span>
              </p>
            </div>
            <div class="field">
              <p class="control has-icons-left">
                <input class="input is-rounded" id="confirm-password" type="password" placeholder="Confirm Password" v-model="confirmpassword" required>
                <span class="icon is-small is-left">
                  <i class="fas fa-lock"></i>
                </span>
              </p>
            </div>
            <button :class=" loading ? 'button is-rounded is-loading is-netflix-red is-medium' : 'button is-rounded is-medium is-netflix-red'" :disabled="disabled">
              <span class="icon is-medium">
                <i class="fas fa-shipping-fast"></i>
              </span>
              <span>Change</span>
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
        Loading,
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
        data(){
            return {
                user: {},
                oldpassword: "",
                newpassword : "",
                confirmpassword: "",
                gds: [],
                metatitle: "Change Password",
                currgd: {},
                errorMessage: false,
                disabled: true,
                resultmessage: "",
                loading: false,
                fullpage: true,
            }
        },
        methods : {
            handleSubmit(e){
              this.metatitle = "Checking & Changing"
                this.loading = true;
                e.preventDefault();
                if (this.confirmpassword === this.newpassword && this.newpassword.length > 0) {
                    this.$backend.post(apiRoutes.changePasswordRoute, {
                        email: this.user.email,
                        oldpassword: this.oldpassword,
                        newpassword: this.newpassword,
                    }, backendHeaders(this.token.token))
                    .then(response => {
                      if(response.data.auth && response.data.registered && response.data.changed){
                        removeItem("tokendata");
                        removeItem("userdata");
                        this.loading = false;
                        this.metatitle = "Success...";
                        this.$bus.$emit("logout", "User Logged Out");
                        this.$router.push({ name: 'results', params: { id: this.currgd.id, cmd: "result", success: true, redirectUrl: '/', tocmd: 'login', data: `response.data.message. You have to Relogin with new Password` } })
                      } else {
                        this.errorMessage = true
                        this.loading = false;
                        this.metatitle = "Failed...";
                        this.resultmessage = response.data.message;
                      }
                    });
                } else {
                  this.loading = false;
                  this.metatitle = "Failed...";
                  this.resultmessage = "Passwords Do Not Match"
                  this.newpassword = "";
                  this.confirmpassword = "";
                }
            },
            validateData(){
              if(this.confirmpassword === this.newpassword && this.newpassword.length > 0 && this.oldpassword.length > 0){
                this.disabled = false;
              } else {
                this.disabled = true;
              }
            }
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
          oldpassword: "validateData",
          newpassword: "validateData",
          confirmpassword: "validateData"
        },
    }
</script>
