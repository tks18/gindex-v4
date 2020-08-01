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
                                      <input class="input is-rounded" id="hypassword" type="password" placeholder="Enter Your Hybrid Password" v-model="hypassword" required>
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
                  <input class="input is-rounded" placeholder="Email" id="logemail" type="email" v-model="email" required autofocus>
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
                  <input class="input is-rounded" id="logpassword" type="password" placeholder="Password" v-model="password" required>
                  <span class="icon is-small is-left">
                    <i class="fas fa-lock"></i>
                  </span>
                </p>
              </div>
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
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
    export default {
        components: {
          Loading
        },
        data(){
            return {
                email : "",
                password : "",
                hypassword: "",
                disabled: true,
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
              this.loading = true;
                e.preventDefault();
                if (this.password.length > 0 && this.email.length > 0) {
                    this.$http.post(window.apiRoutes.loginRoute, {
                        email: this.email,
                        password: this.password
                    })
                    .then(response => {
                      if(response.data.auth && response.data.registered){
                          localStorage.setItem("tokendata", this.$hash.AES.encrypt(JSON.stringify({ token: response.data.token ,issuedate: response.data.issuedat, expirydate: response.data.expiryat }), this.$pass).toString());
                          localStorage.setItem("userdata", this.$hash.AES.encrypt(JSON.stringify( response.data.tokenuser ), this.$pass).toString());
                          var token = localStorage.getItem("tokendata");
                          var user = localStorage.getItem("userdata");
                          if(token != null && user != null){
                            var tokenData = JSON.parse(this.$hash.AES.decrypt(token, this.$pass).toString(this.$hash.enc.Utf8))
                            var userData = JSON.parse(this.$hash.AES.decrypt(user, this.$pass).toString(this.$hash.enc.Utf8));
                            this.loading = false;
                            this.errormessageVisibility = false;
                            this.successmessageVisibility = true;
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
                        this.errormessageVisibility = true;
                        this.successmessageVisibility = false;
                        this.loading = false;
                        this.resultmessage = response.data.message;
                      }
                    });
                }
            },
            async handleHybrid() {
              this.loading = true;
              console.log(this.hypassword);
              const hyBridpass = window.gdHybridPass;
              var synced = await this.$saltIt.compareSync(this.hypassword, hyBridpass)
              if(synced){
                console.log(synced);
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
                await localStorage.setItem("hybridToken", this.$hash.AES.encrypt(JSON.stringify( hybridData ), this.$pass).toString());
                var dataFromLocal = await JSON.parse(this.$hash.AES.decrypt(localStorage.getItem("hybridToken"), this.$pass).toString(this.$hash.enc.Utf8));
                if(dataFromLocal.user){
                  console.log("Super Pa")
                  console.log(localStorage.getItem("hybridToken"));
                  this.loading = false;
                  this.errormessageVisibility = false;
                  this.successmessageVisibility = true;
                  this.resultmessage = `Logged in Successfully as Guest User.You will Log Out after this Browser Session.`;
                  this.$bus.$emit('logged', 'User Logged');
                  setTimeout(() => {
                    this.$router.push({name: "results", params: { id: this.currgd.id, cmd: "result", success: true, tocmd: 'home', data: "Log in Successfull. You Will be Redirected Through a Secure Channel.", redirectUrl: '/' }})
                  }, 500)
                } else {
                  this.loading = false;
                  this.errormessageVisibility = true;
                  this.successmessageVisibility = false;
                  this.resultmessage = `Hybrid Password is Wrong`;
                }
              } else {
                this.loading = false;
                this.errormessageVisibility = true;
                this.successmessageVisibility = false;
                this.resultmessage = `Hybrid Password is Wrong`;
              }
            },
            checkParams() {
              console.log("checked")
              if(this.$route.params.email){
                this.email = this.$route.params.email
                this.emailFocus = false;
                this.passwordFocus = true;
              } else {
                this.emailFocus = true;
                this.passwordFocus = false;
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
        },
        computed: {
          ismobile() {
            var width = window.innerWidth > 0 ? window.innerWidth : screen.width;
            if(width > 966){
              return false
            } else {
              return true
            }
          }
        },
        mounted() {
          this.checkParams();
        },
        created() {
          if (window.gds) {
            this.gds = window.gds.map((item, index) => {
              return {
                name: item,
                id: index,
              };
            });
            let index = this.$route.params.id;
            if (this.gds) {
              this.currgd = this.gds[index];
            }
          }
        },
        watch: {
          email: "validateData",
          password: "validateData",
        },
    }
</script>
