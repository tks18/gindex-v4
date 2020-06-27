<template>
  <section class="section">
    <TopLinks />
    <div class="columns is-mobile is-centered">
      <div class="field is-grouped-multiline">
        <div class="control">
          <div class="loading">
            <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
          </div>
          <div v-if="logged" class="tags-has-addons mt-3">
             <div class="container has-text-white is-fluid">
               <h1 class="title has-text-white has-text-centered">Hey There, Whaat up? <p class="has-text-info is-italic has-text-weight-bold is-family-monospace">{{ user.name }}</p></h1>
               <article class="message is-danger">
                <div class="message-header">
                  <p>Token Details</p>
                </div>
                <div class="message-body">
                  Remember!! Your Token will Expire on <strong><em>{{ tokendata.expirydate | moment("dddd, MMMM Do YYYY [at] hh:mm A") }}</em></strong></div>
              </article>
              <div class="tile is-ancestor has-text-centered">
                <div class="tile is-6 is-vertical is-parent">
                  <div class="tile is-child notification is-primary box">
                    <p class="title has-text-dark">Currently You are..</p>
                    <div class="content">
                      <p class="subtitle">{{ user.role }}</p>
                      <p v-if="logged && admin && superadmin" class="has-text-black is-italic has-text-weight-semibold is-family-monospace">You have Maximum Access to this Website</p>
                      <button v-if="logged && !superadmin && !admin" class="button is-danger is-light mb-3" @click="gotoPage('/0:register/request/admin/')">Request Admin Access</button>
                      <button v-if="logged && admin && !superadmin" class="button is-danger is-light" @click="gotoPage('/0:register/request/superadmin/')">Request Super Admin Access</button>
                    </div>
                  </div>
                  <div class="tile is-child notification is-warning box">
                    <p class="title">Your Email..</p>
                    <div class="content">
                      <p class="subtitle">{{ user.email }}</p>
                      <button v-if="logged" class="button is-danger is-light" @click="gotoPage('/0:settings/changepassword/')">
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
                    <p class="title">Quick Access</p>
                    <div class="columns is-multiline is-vcentered is-centered">
                      <div v-if="logged" class="column is-half">
                        <button class="button is-success is-light" @click="gotoPage('/0:/Anime/')">
                          <span class="icon is-small">
                            <i class="fas fa-heart"></i>
                          </span>
                          <span>Anime</span>
                        </button>
                      </div>
                      <div v-if="logged" class="column is-half">
                        <button class="button is-success is-light" @click="gotoPage('/0:/Movies/')">
                          <span class="icon is-small">
                            <i class="fas fa-video"></i>
                          </span>
                          <span>The Cinema :-)</span>
                        </button>
                      </div>
                      <div v-if="logged" class="column is-half">
                        <button class="button is-success is-light" @click="gotoPage('/0:/Series/')">
                          <span class="icon is-small">
                            <i class="fas fa-tv"></i>
                          </span>
                          <span>TV Series</span>
                        </button>
                      </div>
                      <div v-if="logged" class="column is-half">
                        <button class="button is-success is-light" @click="gotoPage('/0:/Courses/')">
                          <span class="icon is-small">
                            <i class="fas fa-glasses"></i>
                          </span>
                          <span>Courses</span>
                        </button>
                      </div>
                      <div v-if="logged" class="column is-half">
                        <button class="button is-success is-light" @click="gotoPage('/0:/Music/')">
                          <span class="icon is-small">
                            <i class="fas fa-play"></i>
                          </span>
                          <span>Music</span>
                        </button>
                      </div>
                      <div v-if="logged" class="column is-half">
                        <button class="button is-success is-light"  @click="gotoPage('/0:/')">
                          <span class="icon is-small">
                            <i class="fas fa-folder-open"></i>
                          </span>
                          <span>View Full List</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="tile is-child notification is-danger box">
                    <p class="title">Personal</p>
                    <div class="columns is-multiline is-vcentered is-centered">
                      <div v-if="logged" class="column is-half">
                        <button class="button is-danger is-light" @click="gotoPage('/0:settings/')">
                          <span class="icon is-small">
                            <i class="fas fa-user-cog"></i>
                          </span>
                          <span>Go to my Settings</span>
                        </button>
                      </div>
                      <div v-if="logged && admin" class="column is-half">
                        <button class="button is-danger is-light" @click="gotoPage('/0:admin/')">
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
          <div v-else class="tags-has-addons mt-3">
            <div class="container has-text-white is-fluid">
              <h1 class="title has-text-white has-text-centered">Ah! You <p class="has-text-info is-italic has-text-weight-bold is-family-monospace">Anonymous !!</p></h1>
              <article class="message is-danger has-text-centered">
               <div class="message-header">
                 <p>Important</p>
               </div>
               <div class="message-body">
                 <strong>
                   <p>You are Not Registered / Logged in. Please Login to Continue</p>
                   <p>If You Have OTP, then Register with OTP.</p>
                 </strong>
                 <p>If You are Not Registered, Please Request Access to Get OTP through Email</p>
              </div>
             </article>
             <div class="columns is-multiline is-centered  has-text-centered">
               <div class="column is-full">
                 <p class="subtitle has-text-white">
                   Quick Links
                 </p>
               </div>
               <div class="column is-quarter">
                 <button class="button is-outlined is-medium is-success is-rounded" @click="gotoPage('/0:login/')">
                   <span class="icon is-medium">
                    <i class="fas fa-power-off"></i>
                  </span>
                  <span>Login</span>
                 </button>
               </div>
               <div class="column is-quarter">
                 <button class="button is-outlined is-medium is-warning is-rounded" @click="gotoPage('/0:register/request/user')">
                   <span class="icon is-medium">
                    <i class="fas fa-user-plus"></i>
                  </span>
                  <span>Request Access</span>
                 </button>
               </div>
               <div class="column is-quarter">
                 <button class="button is-outlined is-medium is-danger is-rounded" @click="gotoPage('/0:register/otp/')">
                   <span class="icon is-medium">
                    <i class="fas fa-user-check"></i>
                  </span>
                  <span>Register with OTP</span>
                 </button>
               </div>
             </div>
           </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import TopLinks from "../../common/Top-Links";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
    export default {
        components: {
          TopLinks,
          Loading,
        },
        data () {
            return {
                user: {},
                tokendata: {},
                truncatedApi: "",
                logged: false,
                admin: false,
                superadmin: false,
                loading: true,
                fullpage: true,
            }
        },
        methods: {
          gotoPage(url) {
            this.loading = true;
            this.$router.push(url)
          }
        },
        created() {
          var token = localStorage.getItem("tokendata");
          var user = localStorage.getItem("userdata");
          if (user != null && token != null){
            var tokenData = JSON.parse(this.$hash.AES.decrypt(token, this.$pass).toString(this.$hash.enc.Utf8));
            var userData = JSON.parse(this.$hash.AES.decrypt(user, this.$pass).toString(this.$hash.enc.Utf8));
            if(userData.admin && userData.superadmin){
              this.superadmin = true;
              this.admin = true;
              this.user = userData;
              this.tokendata = tokenData;
              this.truncatedApi = tokenData.token.slice(0,10)+"......."+token.slice(token.length - 6,token.length -1 )
              this.logged = true
              setTimeout(() => {
                this.loading = false;
              }, 1000)
            } else if(userData.admin && !userData.superadmin){
              this.admin = true;
              this.user = userData;
              this.tokendata = tokenData;
              this.truncatedApi = tokenData.token.slice(0,10)+"......."+token.slice(token.length - 6,token.length -1 )
              this.logged = true
              setTimeout(() => {
                this.loading = false;
              }, 1000)
            } else {
              this.user = userData;
              this.tokendata = tokenData;
              this.truncatedApi = tokenData.token.slice(0,10)+"......."+token.slice(token.length - 6,token.length -1 )
              this.logged = true
              setTimeout(() => {
                this.loading = false;
              }, 1000)
            }
          } else {
            this.logged = false
            this.loading = false;
          }
        }
    }
</script>
