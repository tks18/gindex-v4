<template>
  <section :class="ismobile ? logged ? 'section mx-0 mt-2 px-0' : 'section home-back mt-2 mx-0 px-0' : logged ? 'section' : 'section home-back' ">
    <nav v-if="!logged" class="navbar home-navbar">
      <div class="navbar-brand">
        <a class="navbar-item nav-heading">
          <h3 class="title is-3 has-text-weight-bold" @click="gotoPage('/', 'home')">{{ currgd.name }}</h3>
        </a>
      </div>
      <div v-if="!ismobile" class="navbar-end">
        <a
          class="navbar-item button"
          title="Login"
          v-if="!logged"
          @click="gotoPage('/', 'login')"
         >
         <span>Login</span>
         <span class="icon">
           <i class="fas fa-sign-in-alt"></i>
         </span>
        </a>
      </div>
    </nav>
    <div :class=" ismobile ? 'columns is-mobile is-centered mx-0 px-0' : 'columns is-mobile is-centered mx-0 px-0 '">
      <div class="column is-full">
        <div class="loading">
          <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
        </div>
        <div v-if="logged" class="tags-has-addons mt-3">
           <div class="container has-text-white is-fluid">
             <h1 class="title has-text-white has-text-centered">Hey There, Whaat up? <p class="has-text-info is-italic has-text-weight-bold is-family-monospace">{{ user.name }}</p></h1>
            <div class="tile is-ancestor has-text-centered">
              <div class="tile is-6 is-vertical is-parent">
                <div class="tile is-child notification is-primary box">
                  <p class="title has-text-dark">Currently You are..</p>
                  <div class="content">
                    <p class="subtitle">{{ user.role }}</p>
                    <p v-if="logged && admin && superadmin" class="has-text-black is-italic has-text-weight-semibold is-family-monospace">You have Maximum Access to this Website</p>
                    <button v-if="logged && !superadmin && !admin" class="button is-danger is-light mb-3" @click="gotoPage('/request/', 'register')">Request Admin Access</button>
                    <button v-if="logged && admin && !superadmin" class="button is-danger is-light" @click="gotoPage('/request/', 'register')">Request Super Admin Access</button>
                  </div>
                </div>
                <div class="tile is-child notification is-warning box">
                  <p class="title">Your Email..</p>
                  <div class="content">
                    <p class="subtitle">{{ user.email }}</p>
                    <button v-if="logged" class="button is-danger is-light" @click="gotoPage('/changepassword/', 'settings')">
                      <span class="icon is-small">
                        <i class="fas fa-cog"></i>
                      </span>
                      <span>Change Your Password</span>
                    </button>
                  </div>
                </div>
              </div>
              <div class="tile is-parent is-vertical">
                <div class="tile is-child notification is-success box">
                  <p class="title">Access</p>
                  <div class="columns is-multiline is-vcentered is-centered">
                    <div class="column is-half" v-for="(link, index) in quickLinks" v-bind:key="index">
                      <button class="button is-success is-light" @click="gotoPage('/'+link.link+'/')">
                        <span>{{ link.displayname }}</span>
                      </button>
                    </div>
                    <div v-if="logged" class="column is-half">
                      <button class="button is-success is-light" @click="gotoPage('/')">
                        <span class="icon is-small">
                          <i class="fas fa-heart"></i>
                        </span>
                        <span>Go to Drive</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="tile is-child notification is-danger box">
                  <p class="title">Personal</p>
                  <div class="columns is-multiline is-vcentered is-centered">
                    <div v-if="logged" class="column is-half">
                      <button class="button is-danger is-light" @click="gotoPage('/', 'settings')">
                        <span class="icon is-small">
                          <i class="fas fa-user-cog"></i>
                        </span>
                        <span>Go to my Settings</span>
                      </button>
                    </div>
                    <div v-if="logged && admin" class="column is-half">
                      <button class="button is-danger is-light" @click="gotoPage('/', 'admin')">
                        <span class="icon is-small">
                          <i class="fas fa-users-cog"></i>
                        </span>
                        <span>Your Admin Panel</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section v-else :class="ismobile ? 'hero is-fullheight px-0' : 'hero is-fullheight'">
          <div class="hero-body">
            <div :class="ismobile ? 'container has-text-white is-fluid px-0'  : 'container has-text-white is-fluid'">
              <h1 :class="ismobile ? 'title has-text-white has-text-centered' : 'title is-1 has-text-white has-text-centered'">
                <div class="columns is-multiline is-mobile is-centered is-vcentered">
                  <div :class="ismobile ? 'column is-full'  : 'column is-half'">
                    Binge Watching Made Easy.
                  </div>
                  <div :class="ismobile ? 'column is-full'  : 'column is-full'">
                    <h1 :class="ismobile ? 'title is-small has-text-white has-text-centered' : 'title has-text-white has-text-centered'">
                      Get Started Now !
                    </h1>
                  </div>
                </div>
              </h1>
              <form @submit.prevent="verifyEmail">
                <div class="columns is-multiline is-desktop is-centered is-vcentered">
                  <div class="column is-two-thirds">
                    <div class="columns is-multiline is-centered is-gapless is-vcentered">
                      <div class="column has-text-right is-four-fifths">
                        <div class="field">
                          <p class="control">
                            <input class="input special-email" placeholder="Enter Your Email" id="email" type="email" v-model="email" required autofocus>
                          </p>
                        </div>
                      </div>
                      <div :class="ismobile ? 'column has-text-centered mt-1 is-one-fifth' : 'column has-text-left is-one-fifth'">
                        <button :class="ismobile ? loading ? 'button is-loading is-netflix-red' : 'button is-netflix-red' : loading ? 'button is-loading is-large is-netflix-red' : 'button is-large is-netflix-red'" :disabled="disabled">
                          <span>Start</span>
                          <span class="icon">
                            <i class="fas fa-arrow-right"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="column mx-0 px-0 is-two-thirds">
                    <p class="is-small has-text-grey subtitle has-text-centered">
                      Enter Your Email to Login / Request / Register.
                    </p>
                  </div>
                  <div class="column is-full mb-0 mt-4 mx-0 px-0 has-text-centered">
                    <p class="subtitle has-text-white subtitle has-text-centered">
                      {{ Date.now() | moment("YYYY") }} | {{ currgd.name }}
                    </p>
                  </div>
                </div>
              </form>
           </div>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>
<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
    export default {
        components: {
          Loading,
        },
        data () {
            return {
                user: {},
                token: {},
                gds: [],
                currgd: {},
                email: "",
                quickLinks: [],
                disabled: true,
                truncatedApi: "",
                logged: false,
                admin: false,
                superadmin: false,
                loading: false,
                fullpage: true,
            }
        },
        methods: {
          gotoPage(url, cmd) {
            if(cmd){
              this.$router.push({ path: '/'+ this.currgd.id + ':' + cmd + url })
            } else {
              this.$router.push({ path: '/'+ this.currgd.id + ':' + url })
            }
          },
          assignUserInfo() {
            this.loading = true;
            var token = localStorage.getItem("tokendata");
            var user = localStorage.getItem("userdata");
            if (user != null && token != null){
              var tokenData = JSON.parse(this.$hash.AES.decrypt(token, this.$pass).toString(this.$hash.enc.Utf8));
              var userData = JSON.parse(this.$hash.AES.decrypt(user, this.$pass).toString(this.$hash.enc.Utf8));
              this.user = userData;
              this.token = tokenData;
              this.logged = true;
              this.loading = false;
            } else {
              this.logged = false
              this.loading = false;
            }
          },
          verifyEmail(e) {
            this.loading = true;
            e.preventDefault();
            if(this.email.length > 0){
              this.$http.post(window.apiRoutes.checkEmail, {
                  email: this.email,
              }).then(response => {
                if(response.data.auth && response.data.user && response.data.status == "User Present & Verified"){
                  this.loading = false;
                  this.$bus.$emit('verified', 'User Verified')
                  this.$router.push({ name: 'login', params: { cmd: 'login', id:0, email: this.email } })
                } else if(!response.data.auth && response.data.user && response.data.status == "User Present & Not Verified"){
                  this.loading = false;
                  this.$bus.$emit('verified', 'User Verified')
                  this.$router.push({ name: 'otp', params: { cmd: 'register', id:0, email: this.email } })
                } else if(!response.data.auth && !response.data.user && response.data.status == "User Not Present"){
                  this.loading = false;
                  this.$bus.$emit('verified', 'User Verified')
                  this.$router.push({ name: 'request' , params: { cmd: 'register', id: 0, email: this.email } })
                } else if(!response.data.auth && !response.data.user && response.data.status == "Pending Confirmation from Admins."){
                  this.loading = false;
                  this.$bus.$emit('verified', 'User Verified')
                  this.$router.push({ name: 'results', params: { cmd: 'result', id: 0, noredirect: true, success: true, data: "You Are Currently Pending Confirmation from Admins. Please Wait till they Accept Your Request." } })
                } else if(!response.data.auth && !response.data.user && response.data.status == "Spammed User"){
                  this.loading = false;
                  this.$bus.$emit('verified', 'User Verified')
                  this.$router.push({ name: 'results', params: { cmd: 'result', id: 0, noredirect: true, success: false, data: "You are being Added to Our Spam List for Violations. Please Contact Admins for Help." } })
                } else {
                  this.loading = false;
                  this.$bus.$emit('verified', 'User Verified')
                  this.$router.push({ name: 'results', params: { cmd: 'result', id: 0, noredirect: true, success: false, data: "There's Some Error With Your Network. Please Try Again Later." } })
                }
              }).catch(error => {
                this.loading = false;
                this.$bus.$emit('verified', 'User Verified')
                this.$router.push({ name: 'results', params: { cmd: 'result', id: 0, noredirect: true, success: false, error: error, data: "There's Some Error With Your Network. Please Try Again Later." } })
              })
            }
          }
        },
        beforeMount() {
          this.quickLinks = window.quicklinks
          this.assignUserInfo();
        },
        mounted() {
          if(this.user.admin && this.user.superadmin){
            this.admin = true,this.superadmin = true, this.loading = false;
          } else if(this.user.admin && !this.user.superadmin){
            this.admin = true, this.loading = false;
          } else {
            this.loading = false;
          }
        },
        created() {
          if (window.gds && window.gds.length > 0) {
            this.gds = window.gds.map((item, index) => {
              return {
                name: item,
                id: index,
              };
            });
            let index = this.$route.params.id;
            if (this.gds && this.gds.length >= index) {
              this.currgd = this.gds[index];
            }
          }
        },
        updated() {
          this.$bus.$on('logged', () => {
            this.assignUserInfo();
          })
          this.$bus.$on('logout', () => {
            this.assignUserInfo();
          })
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
        watch: {
          email: function() {
            const emailRegex = /[a-z1-9].+@+[a-z1-9A-Z].+[.][a-z]+/g
            if(emailRegex.test(this.email)){
              this.disabled = false;
            } else {
              this.disabled = true;
            }
          }
        }
    }
</script>
