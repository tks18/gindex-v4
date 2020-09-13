<template>
    <div class="content mx-2 mt-2">
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
      </div>
      <div class="columns is-vcentered is-centered is-multiline">
        <div class="column is-half">
          <section class="hero is-black is-medium">
            <div class="hero-body">
              <div class="container">
                <div class="tile is-ancestor">
                  <div class="tile is-parent">
                    <article class="tile has-text-centered is-child notification is-success">
                      <p class="title has-text-dark">
                        <span class="icon">
                          <i class="fab fa-superpowers"></i>
                        </span>
                        <span> Final Steps... </span>
                      </p>
                      <p class="subtitle">Email Verification</p>
                      <div class="content">
                          <p class="has-text-dark has-text-weight-semibold">After Receiving Confirmation Mail, You Have to Verify your Account with OTP.</p>
                          <p class="has-text-dark">Please Enter your OTP to Verify and Register your Account.</p>
                          <p class="has-text-dark">After Successfully Verifying. Press the Below button to Login.</p>
                      </div>
                    </article>
                  </div>
                </div>
                <div class="buttons is-centered">
                  <button class="button is-rounded is-medium is-netflix-red" @click="gotoPage('/', 'login')">
                    <span class="icon is-medium">
                      <i class="fas fa-shipping-fast"></i>
                    </span>
                    <span>Login</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div class="column is centered has-text-centered has-text-white is-two-fifths">
          <article :class=" errormessageVisibility ? 'message is-danger' : 'message is-hidden is-danger'">
            <div class="message-header">
              <p>Error verifying in!!</p>
              <button class="delete" @click="errormessageVisibility = false" aria-label="delete"></button>
            </div>
            <div class="message-body">
              {{ resultmessage }}
            </div>
          </article>
          <article :class=" successmessageVisibility ? 'message is-success' : 'message is-hidden is-success'">
            <div class="message-header">
              <p>Success !</p>
              <button class="delete" @click="successmessageVisibility = false" aria-label="delete"></button>
            </div>
            <div class="message-body">
              {{ resultmessage }}
            </div>
          </article>
          <h2 class="title has-text-weight-bold has-text-white">Verify Your Account</h2>
            <form @submit.prevent="handleSubmit">
              <div class="field">
                <p class="control has-icons-left has-icons-right">
                  <input class="input is-rounded" placeholder="Email" id="email" type="email" v-model="email" required autofocus>
                  <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                  </span>
                  <span class="icon is-small is-right">
                    <i class="fas fa-check"></i>
                  </span>
                </p>
              </div>
              <div class="field">
                <p class="control has-icons-left has-icons-right">
                  <input class="input is-rounded" placeholder="Enter Your OTP" id="otp" type="text" v-model="otp" autofocus>
                  <span class="icon is-small is-left">
                    <i class="fas fa-key"></i>
                  </span>
                  <span class="icon is-small is-right">
                    <i class="fas fa-check"></i>
                  </span>
                </p>
                <p class="help is-danger">OTP is Case Sensitive</p>
              </div>
              <div class="field">
                <p class="control has-icons-left">
                  <input class="input is-rounded" id="password" type="password" placeholder="Password" v-model="password" required>
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
              <button :class=" loading ? 'button is-rounded is-loading is-netflix-red is-medium' : 'button is-rounded is-netflix-red is-medium' " :disabled="disabled">
                <span class="icon is-medium">
                  <i class="fas fa-user-check"></i>
                </span>
                <span>Verify</span>
              </button>
            </form>
        </div>
      </div>
    </div>
</template>
<script>
import { apiRoutes } from "@/utils/backendUtils";
import { getgds } from "@utils/localUtils";
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
        data(){
            return {
                email : "",
                metatitle: "OTP Register",
                emailFocus: "",
                otpFocus: "",
                otp: "",
                password : "",
                confirmpassword: "",
                resultmessage: "",
                gds: [],
                currgd: {},
                disabled: true,
                databasemessage: "",
                loading: false,
                fullpage: true,
                errormessageVisibility: false,
                successmessageVisibility: false,
            }
        },
        methods : {
            handleSubmit(e){
              this.metatitle = "Verifying..."
              this.loading = true;
                e.preventDefault();
                if (this.confirmpassword === this.password && this.password.length > 0) {
                    this.$backend.post(apiRoutes.otpRegister, {
                        email: this.email,
                        otp: this.otp,
                        newpassword: this.password,
                    })
                    .then(response => {
                      if(response.data.auth && response.data.registered && response.data.changed){
                          this.errormessageVisibility = false;
                          this.successmessageVisibility = true;
                          this.loading = false;
                          this.metatitle = "Success Verifying";
                          this.resultmessage = response.data.message + "Now You can Login with Your Email and Password";
                        } else {
                          this.errormessageVisibility = true;
                          this.successmessageVisibility = false;
                          this.loading = false;
                          this.metatitle = "Failed Verifying";
                          this.resultmessage = response.data.message;
                      }
                    });
                } else {
                  this.errormessageVisibility = true;
                  this.successmessageVisibility = false;
                  this.loading = false;
                  this.resultmessage = "Passwords Do Not Match"
                  this.password = "";
                  this.confirmpassword = "";
                }
            },
            gotoPage(url, cmd) {
              if(cmd){
                this.$router.push({ path: '/'+ this.currgd.id + ':' + cmd + url })
              } else {
                this.$router.push({ path: '/'+ this.currgd.id + ':' + url })
              }
            },
            checkParams() {
              if(this.$route.params.email){
                this.email = this.$route.params.email
                this.emailFocus = false;
                this.otpFocus = true;
              } else {
                this.email = ""
                this.emailFocus = true;
                this.otpFocus = false;
              }
            },
            validateData(){
              const emailRegex = /[a-z1-9].+@+[a-z1-9A-Z].+[.][a-z]+/g
              if(emailRegex.test(this.email) && this.otp.length > 0 && this.password.length > 0 && this.password == this.confirmpassword){
                this.disabled = false;
              } else {
                this.disabled = true;
              }
            },
        },
        computed: {
          siteName() {
            return window.gds.filter((item, index) => {
              return index == this.$route.params.id;
            })[0];
          },
        },
        mounted() {
          if(this.$audio.player() != undefined) this.$audio.destroy();
          this.checkParams();
        },
        created() {
          let gddata = getgds(this.$route.params.id);
          this.gds = gddata.gds;
          this.currgd = gddata.current;
        },
        watch: {
          otp: "validateData",
          email: "validateData",
          password: "validateData",
          confirmpassword: "validateData"
        },
    }
</script>
