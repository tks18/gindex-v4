<template>
    <div :class="ismobile ? 'content mx-1 mt-2 px-0' : 'content ml-5 mt-2 mr-5 pl-5 pr-5'">
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
                      <article class="tile has-text-centered is-child notification is-primary">
                        <p class="title has-text-dark">
                          <span class="icon">
                            <i class="fab fa-superpowers"></i>
                          </span>
                          <span> Ahh!! Perfect !</span>
                        </p>
                        <p class="subtitle">Login</p>
                        <div class="content">
                            <p class="has-text-dark has-text-weight-semibold">Login to this Website to Continue.</p>
                            <p class="has-text-dark">You are Just a Page from Experiencing the Glory.</p>
                            <button class="button mb-3" @click="hyInput = !hyInput">
                              <span class="icon">
                                <i class="fas fa-dolly"></i>
                              </span>
                              <span>Hybrid Login</span>
                            </button>
                            <form @submit.prevent="handleHybrid" v-show="hyInput">
                              <div class="columns is-mobile is-centered is-multiline is-vcentered">
                                <div class="column is-four-fifths">
                                  <div class="field">
                                    <p class="control has-icons-left">
                                      <input class="input is-rounded" id="hypassword" autocomplete="hy-password" type="password" placeholder="Enter Your Hybrid Password" v-model="hypassword" required>
                                      <span class="icon is-small is-left">
                                        <i class="fas fa-lock"></i>
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <div class="column is-one-fifth">
                                  <button class="button is-danger">
                                    <span class="icon">
                                      <i class="fas fa-sign-in-alt"></i>
                                    </span>
                                    <span class="is-hidden-mobile">Login</span>
                                  </button>
                                </div>
                              </div>
                            </form>
                        </div>
                      </article>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div :class=" modal ? 'modal is-active' : 'modal' ">
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title has-text-centered">Forgot Password</p>
                <button class="delete" @click="modal = false;" aria-label="close"></button>
              </header>
              <section class="modal-card-body">
                <article :class=" forgotErrorMessage ? 'message is-danger' : 'message is-hidden is-danger'">
                  <div class="message-header">
                    <p>Error Processing !</p>
                    <button class="delete" @click="forgotErrorMessage = false" aria-label="delete"></button>
                  </div>
                  <div class="message-body">
                    {{ forgotMessage }}
                  </div>
                </article>
                <article :class=" forgotSuccessMessage ? 'message is-success' : 'message is-hidden is-success'">
                  <div class="message-header">
                    <p>Success !</p>
                    <button class="delete" @click="forgotSuccessMessage = false" aria-label="delete"></button>
                  </div>
                  <div class="message-body">
                    {{ forgotMessage }}<br>
                    <span class="forgot-pass is-medium has-text-weight-bold" @click="gotoPage('/otp/', 'register')" style="cursor: pointer;">Click Here to Enter OTP</span>
                  </div>
                </article>
                <form @submit.prevent="handleForgotPass">
                  <div class="columns is-centered is-desktop is-multiline is-vcentered">
                    <div class="column is-two-thirds">
                      <div class="field">
                        <p class="control has-icons-left has-icons-right">
                          <input class="input is-rounded" placeholder="Enter Your Account Email" id="foremail" type="email" v-model="forgotEmail" required autofocus>
                          <span class="icon is-small is-left">
                            <i class="fas fa-envelope"></i>
                          </span>
                          <span class="icon is-small is-right">
                            <i class="fas fa-check"></i>
                          </span>
                        </p>
                      </div>
                    </div>
                    <div class="column has-text-centered is-two-thirds">
                      <button :class=" loading ? 'button is-rounded is-loading is-danger' : 'button is-rounded is-danger'">
                        <span class="icon">
                          <i class="fas fa-user-plus"></i>
                        </span>
                        <span>Get OTP</span>
                      </button>
                    </div>
                  </div>
                </form>
              </section>
            </div>
          </div>
          <div class="column is centered has-text-centered has-text-white is-two-fifths">
            <article :class=" errormessageVisibility ? 'message is-danger' : 'message is-hidden is-danger'">
              <div class="message-header">
                <p>Error Logging in!!</p>
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
            <h2 class="title has-text-weight-bold has-text-white">Login</h2>
            <form @submit.prevent="handleSubmit">
              <div class="field">
                <p class="control has-icons-left has-icons-right">
                  <input class="input is-rounded" placeholder="Email" autocomplete="username" id="logemail" type="email" v-model="email" required autofocus>
                  <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                  </span>
                  <span class="icon is-small is-right">
                    <i class="fas fa-check"></i>
                  </span>
                </p>
              </div>
              <div class="field">
                <p class="control has-icons-left">
                  <input class="input is-rounded" id="logpassword" autocomplete="current-password" type="password" placeholder="Password" v-model="password" required>
                  <span class="icon is-small is-left">
                    <i class="fas fa-lock"></i>
                  </span>
                </p>
              </div>
              <p class="help subtitle has-text-weight-bold forgot-pass has-text-right is-success" style="cursor: pointer;" @click="modal = true;">Forgot Password ?</p>
              <button :class=" loading ? 'button is-rounded is-loading is-danger is-medium' : 'button is-rounded is-medium is-danger'" :disabled="disabled">
                <span class="icon is-medium">
                  <i class="fas fa-shipping-fast"></i>
                </span>
                <span>Login</span>
              </button>
            </form>
          </div>
        </div>
    </div>
</template>
<script>
import {
  decodeSecret,
  encodeSecret,
  getItem,
  setItem,
  checkPass
} from '@utils/encryptUtils';
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
                password : "",
                hypassword: "",
                disabled: true,
                metatitle: "Login",
                modal: false,
                forgotEmail: "",
                forgotMessage: "",
                forgotErrorMessage: false,
                forgotSuccessMessage: false,
                emailFocus: true,
                gds: [],
                hyInput: false,
                currgd: {},
                passwordFocus: false,
                resultmessage: "",
                databasemessage: "",
                loading: false,
                fullpage: true,
                errormessageVisibility: false,
                successmessageVisibility: false,
            }
        },
        methods : {
            handleSubmit(e){
              this.metatitle = "Logging You In..."
              this.loading = true;
                e.preventDefault();
                if (this.password.length > 0 && this.email.length > 0) {
                    this.$http.post(window.apiRoutes.loginRoute, {
                        email: this.email,
                        password: this.password
                    })
                    .then(response => {
                      if(response.data.auth && response.data.registered){
                          this.metatitle = "Success...";
                          setItem("tokendata", encodeSecret(JSON.stringify({ token: response.data.token ,issuedate: response.data.issuedat, expirydate: response.data.expiryat })));
                          setItem("userdata", encodeSecret(JSON.stringify( response.data.tokenuser )));
                          var token = getItem("tokendata");
                          var user = getItem("userdata");
                          if(token != null && user != null){
                            var tokenData = JSON.parse(decodeSecret(token));
                            var userData = JSON.parse(decodeSecret(user));
                            this.loading = false;
                            this.errormessageVisibility = false;
                            this.successmessageVisibility = true;
                            this.$ga.event({eventCategory: "Normal Login",eventAction: "Successfully Logged"+" - "+this.siteName,eventLabel: "Login"})
                            this.resultmessage = `Logged in Successfully as ${userData.name}. Your token will expire at ${ this.$moment(tokenData.expirydate).format("dddd, MMMM Do YYYY [at] hh:mm A")}.`;
                            this.$bus.$emit('logged', 'User Logged')
                            setTimeout(() => {
                              if(this.$route.params.nextUrl != null){
                                this.$router.push({name: "results", params: { id: this.currgd.id, cmd: "result", success: true, data: "Log in Successfull. You Will be Redirected Through a Secure Channel.", redirectUrl: this.$route.params.nextUrl }});
                              }
                              else{
                                  this.$router.push({name: "results", params: { id: this.currgd.id, cmd: "result", success: true, tocmd: 'home', data: "Log in Successfull. You Will be Redirected Through a Secure Channel.", redirectUrl: '/' }})
                              }
                            }, 500)
                          }
                      } else {
                        this.metatitle = "Failed...";
                        this.$ga.event({eventCategory: "Normal Login",eventAction: "Failed"+" - "+this.siteName,eventLabel: "Login"})
                        this.errormessageVisibility = true;
                        this.successmessageVisibility = false;
                        this.loading = false;
                        this.resultmessage = response.data.message;
                      }
                    });
                }
            },
            async handleHybrid() {
              this.metatitle = "Logging You In..."
              this.loading = true;
              const hyBridpass = window.gdHybridPass;
              var synced = await checkPass(this.hypassword, hyBridpass)
              if(synced){
                const hybridData = {
                  user: true,
                  name: "Anon",
                  email: "anonymous@gmail.com",
                  registeredDate: Date.now(),
                  role: "User",
                  admin: false,
                  superadmin: false,
                  verified: true
                }
                await setItem("hybridToken", encodeSecret(JSON.stringify( hybridData )));
                var dataFromLocal = await JSON.parse(decodeSecret(getItem("hybridToken")));
                if(dataFromLocal.user){
                  this.metatitle = "Success...";
                  this.loading = false;
                  this.errormessageVisibility = false;
                  this.successmessageVisibility = true;
                  this.$ga.event({eventCategory: "Hybrid Login",eventAction: "Successfully Logged"+" - "+this.siteName,eventLabel: "Login"})
                  this.resultmessage = `Logged in Successfully as Guest User.You will Log Out after this Browser Session.`;
                  this.$bus.$emit('logged', 'User Logged');
                  setTimeout(() => {
                    this.$router.push({name: "results", params: { id: this.currgd.id, cmd: "result", success: true, tocmd: 'home', data: "Log in Successfull. You Will be Redirected Through a Secure Channel.", redirectUrl: '/' }})
                  }, 500)
                } else {
                  this.metatitle = "Failed...";
                  this.loading = false;
                  this.$ga.event({eventCategory: "Hybrid Login",eventAction: "Failed"+" - "+this.siteName,eventLabel: "Login"})
                  this.errormessageVisibility = true;
                  this.successmessageVisibility = false;
                  this.resultmessage = `Hybrid Password is Wrong`;
                }
              } else {
                this.metatitle = "Failed...";
                this.loading = false;
                this.$ga.event({eventCategory: "Hybrid Login",eventAction: "Failed"+" - "+this.siteName,eventLabel: "Login"})
                this.errormessageVisibility = true;
                this.successmessageVisibility = false;
                this.resultmessage = `Hybrid Password is Wrong`;
              }
            },
            checkParams() {
              if(this.$route.params.email){
                this.email = this.$route.params.email
                this.emailFocus = false;
                this.passwordFocus = true;
              } else {
                this.emailFocus = true;
                this.passwordFocus = false;
              }
            },
            gotoPage(url, cmd) {
              this.$ga.event({eventCategory: "Page Navigation",eventAction: url+" - "+this.siteName,eventLabel: "Login"})
              if(cmd){
                this.$router.push({ path: '/'+ this.currgd.id + ':' + cmd + url })
              } else {
                this.$router.push({ path: '/'+ this.currgd.id + ':' + url })
              }
            },
            validateData(){
              const emailRegex = /[a-z1-9].+@+[a-z1-9A-Z].+[.][a-z]+/g
              if(emailRegex.test(this.email) && this.password.length > 0){
                this.disabled = false;
              } else {
                this.disabled = true;
              }
            },
            handleForgotPass(e) {
              this.metatitle = "Forgot Password";
              this.loading = true;
              e.preventDefault();
              if(this.forgotEmail.length > 0){
                this.$http.post(window.apiRoutes.forgotPass, {
                  email: this.forgotEmail
                }).then(response => {
                  if(response.data.auth && response.data.registered && response.data.changed){
                    this.loading = false;
                    this.$ga.event({eventCategory: "Forgot Password",eventAction: "Successfully Reset"+" - "+this.siteName,eventLabel: "Login"})
                    this.forgotSuccessMessage = true;
                    this.forgotErrorMessage = false;
                    this.metatitle = "Password Reset Success";
                    this.forgotMessage = response.data.message
                  } else {
                    this.loading = false;
                    this.$ga.event({eventCategory: "Forgot Password",eventAction: "Failed"+" - "+this.siteName,eventLabel: "Login"})
                    this.forgotSuccessMessage = false;
                    this.forgotErrorMessage = true;
                    this.metatitle = "Password Reset Failed";
                    this.forgotMessage = response.data.message;
                  }
                })
              } else {
                this.loading = false;
                this.forgotSuccessMessage = false;
                this.forgotErrorMessage = true;
                this.forgotMessage = "Please Type in Your Email First."
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
        mounted() {
          if(this.$audio.player() != undefined) this.$audio.destroy();
          this.checkParams();
        },
        created() {
          let gddata = getgds(this.$route.params.id);
          this.gds = gddata.gds;
          this.currgd = gddata.current;
          this.$ga.page({
            page: this.$route.path,
            title: "Login"+" - "+this.siteName,
            location: window.location.href
          });
        },
        watch: {
          email: "validateData",
          password: "validateData",
        },
    }
</script>
