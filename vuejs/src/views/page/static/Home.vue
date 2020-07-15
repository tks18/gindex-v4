<template>
  <section :class="ismobile ? logged ? 'section mx-0 px-0' : 'section home-back mx-0 px-0' : logged ? 'section mx-0 px-0' : 'section home-back mx-0 px-0' ">
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
      <div class="column is-full mx-0 px-0">
        <div class="loading">
          <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
        </div>
         <div v-show="logged" class="columns is-desktop is-multiline is-centered is-vcentered mx-0 px-0">
           <div v-for="(hero, index) in mainhero" v-bind:key="index" class="column is-full mx-0 px-0 mt-0 pt-0">
             <section class="hero is-fullheight mx-0 px-0" :style="'background-image: url('+hero.poster+');background-size:cover;min-width:100%;box-shadow:inset 0 0 0 2000px rgba(0, 0, 0, 0.2);'">
              <div class="hero-body">
                <div class="container">
                  <h2 class="subtitle has-text-white">
                    {{ hero.subtitle }}
                  </h2>
                  <h1 class="title main-home-hero-title has-text-white is-1">
                    {{ hero.name }}
                  </h1>
                  <h3 class="subtitle has-text-white">
                    Watch Here
                  </h3>
                  <button class="button is-dark" @click="gotoPage('/'+hero.link+'/')">
                    <span class="icon">
                      <i class="fas fa-play"></i>
                    </span>
                    <span>Play Now</span>
                  </button>
                </div>
              </div>
            </section>
           </div>
           <div :class=" ismobile ? 'column is-full mt-2 mr-0'  : 'column is-full ml-2 mr-0 pl-4 pr-0'">
             <div class="columns is-mobile">
               <div class="column is-half">
                 <h2 class="subtitle has-text-netflix-only has-text-weight-bold">
                   Top Trending
                 </h2>
               </div>
               <div class="column pr-4 mr-4 is-half has-text-centered">
                 <span class="icon has-text-weight-bold has-text-netflix" style="cursor: pointer;font-size:18px;">
                   <i class="fas fa-arrow-alt-circle-left" @click="scroll_left('.trending-block')"></i>
                 </span>
                 <span class="icon has-text-weight-bold has-text-netflix" style="cursor: pointer;font-size:18px;">
                   <i class="fas fa-arrow-alt-circle-right" @click="scroll_right('.trending-block')"></i>
                 </span>
               </div>
             </div>
             <div class="trending-block">
               <div v-for="(trend, index) in getShuffledTrending" v-bind:key="index" class="trend-link" @click="gotoPage('/'+trend.link+'/')" :style="'background: url('+trend.poster+');background-size:cover;cursor: pointer;'">
               </div>
             </div>
           </div>
           <div :class=" ismobile ? 'column is-full mt-2 mr-0'  : 'column is-full ml-2 mr-0 pl-4 pr-0'">
             <div class="columns is-mobile">
               <div class="column is-half">
                 <h2 class="subtitle has-text-netflix-only has-text-weight-bold">
                   Categories
                 </h2>
               </div>
               <div class="column pr-4 mr-4 is-half has-text-centered">
                 <span class="icon has-text-weight-bold has-text-netflix" style="cursor: pointer;font-size:18px;">
                   <i class="fas fa-arrow-alt-circle-left" @click="scroll_left('.category-block')"></i>
                 </span>
                 <span class="icon has-text-weight-bold has-text-netflix" style="cursor: pointer;font-size:18px;">
                   <i class="fas fa-arrow-alt-circle-right" @click="scroll_right('.category-block')"></i>
                 </span>
               </div>
             </div>
             <div class="category-block">
               <div v-for="(cat, index) in getShuffledCategory" v-bind:key="index" class="cat-link" :style="'background: url('+cat.poster+');background-size:cover;cursor: pointer;'">
                 <h1 class="title is-4 has-text-centered has-text-white has-text-weight-bold" style="display: flex;align-items: baseline;">
                   {{ cat.name }}
                 </h1>
               </div>
             </div>
           </div>
         </diV>
        <section v-show="!logged" :class="ismobile ? 'hero is-fullheight px-0' : 'hero is-fullheight'">
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
                            <input class="input special-email" autofocus placeholder="Enter Your Email" id="email" type="email" v-model="email" required>
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
                mainhero: {},
                trending: [],
                category: [],
                currgd: {},
                email: "",
                heroCss:"",
                disabled: true,
                truncatedApi: "",
                logged: false,
                quickLinks: [],
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
          shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

              // Pick a remaining element...
              randomIndex = Math.floor(Math.random() * currentIndex);
              currentIndex -= 1;

              // And swap it with the current element.
              temporaryValue = array[currentIndex];
              array[currentIndex] = array[randomIndex];
              array[randomIndex] = temporaryValue;
            }

            return array
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
          },
          scroll_left(func) {
            let content = document.querySelector(func);
            content.scrollLeft -= 200;
          },
          scroll_right(func) {
            let content = document.querySelector(func);
            content.scrollLeft += 200;
          },
          validateData(){
            const emailRegex = /[a-z1-9].+@+[a-z1-9A-Z].+[.][a-z]+/g
            if(emailRegex.test(this.email)){
              this.disabled = false;
            } else {
              this.disabled = true;
            }
          }
        },
        beforeMount() {
          this.assignUserInfo();
        },
        mounted() {
          console.log(this.shuffle(window.mainHeroLinks).slice(0,1));
          this.mainhero = this.shuffle(window.mainHeroLinks).slice(0,1);
          this.trending = window.trendingPosterLinks;
          this.category = window.homeCategories;
          this.quickLinks = window.quickLinks;
          if(this.user.admin && this.user.superadmin){
            this.admin = true,this.superadmin = true, this.loading = false;
          } else if(this.user.admin && !this.user.superadmin){
            this.admin = true, this.loading = false;
          } else {
            this.loading = false;
          }
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
          },
          getShuffledTrending() {
            return this.shuffle(this.trending)
          },
          getShuffledCategory() {
            return this.shuffle(this.category)
          }
        },
        watch: {
          email: "validateData"
        }
    }
</script>
