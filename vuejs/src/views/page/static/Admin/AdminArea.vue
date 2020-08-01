<template>
  <div>
    <div v-if="admin" :class="ismobile ? 'content mx-1 mt-2 px-0' : 'content ml-5 mt-2 mr-5 pl-5 pr-5 '">
      <h1 class="title has-text-centered has-text-weight-bold has-text-white">Your Admin Zone</h1>
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
      </div>
      <div class="columns has-text-white is-centered is-multiline">
        <div :class=" notify ? 'column is-full' : 'column is-hidden is-full' ">
          <div class="notification has-text-centered is-danger">
            <button class="delete" @click="notify = false"></button>
            <h2 class="title has-text-white has-text-weight-bold">Disclaimer !!</h2>
            <p class="subtitle has-text-weight-bold">Use your Admin Powers Wisely !!.</p>
          </div>
        </div>
        <div class="column is-half">
          <div class="columns is-multiline is-desktop is-centered">
            <div class="column is-full">
              <div class="box has-background-warning">
                <h2 class="title has-text-centered has-text-weight-bold">Related to New Users</h2>
                <div class="columns is-vcentered is-centered is-multiline is-mobile">
                  <div class="column is-two-thirds">
                    <p class="subtitle">Add a User</p>
                  </div>
                  <div class="column has-text-centered is-one-third">
                    <button class="button is-rounded is-light" @click="gotoPage('/', 'register')">
                      <span class="icon is-small">
                        <i class="fas fa-user-plus"></i>
                      </span>
                      <span>Add</span>
                    </button>
                  </div>
                  <div class="column is-two-thirds">
                    <p class="subtitle">Invite Users</p>
                  </div>
                  <div class="column has-text-centered is-one-third">
                    <button class="button is-rounded is-light" @click="gotoPage('/', 'invite')">
                      <span class="icon is-small">
                        <i class="fas fa-user-plus"></i>
                      </span>
                      <span>Invite</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-full">

            </div>
          </div>
        </div>
        <div class="column is-half">
          <div class="box has-background-light">
            <div class="columns is-centered is-multiline is-mobile">
              <h2 class="title has-text-centered has-text-weight-bold">Related to Existing Users</h2>
              <div class="column is-two-thirds">
                <p class="subtitle has-text-weight-bold">Manage Existing Users</p>
              </div>
              <div class="column has-text-centered is-one-third">
                <button class="button is-rounded is-danger" @click="gotoPage('/manage', 'admin')">
                  <span class="icon is-small">
                    <i class="fas fa-user-plus"></i>
                  </span>
                  <span>Manage</span>
                </button>
              </div>
              <div class="column is-two-thirds">
                <p class="subtitle has-text-weight-bold">Manage Spam Users</p>
              </div>
              <div class="column has-text-centered is-one-third">
                <button class="button is-rounded is-danger" @click="gotoPage('/spam', 'admin')">
                  <span class="icon is-small">
                    <i class="fas fa-hand-paper"></i>
                  </span>
                  <span>Manage</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from 'vue-loading-overlay';
import 'animate.css';
import 'vue-loading-overlay/dist/vue-loading.css';
    export default {
        components: {
          Loading
        },
        data() {
          return {
            notify: true,
            user: {},
            token: {},
            admin: false,
            gds: [],
            currgd: {},
            superadmin: false,
            loading: false,
            fullpage: true,
          }
        },
        methods: {
          gotoPage: function(url, cmd){
            if(cmd){
              this.$router.push({ path: '/'+ this.currgd.id + ':' + cmd + url })
            } else {
              this.$router.push({ path: '/'+ this.currgd.id + ':' + url })
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
          }
        },
        beforeMount() {
          this.loading = true;
          var token = localStorage.getItem("tokendata")
          var user = localStorage.getItem("userdata");
          if (user != null && token != null){
            var tokenData = JSON.parse(this.$hash.AES.decrypt(token, this.$pass).toString(this.$hash.enc.Utf8));
            var userData = JSON.parse(this.$hash.AES.decrypt(user, this.$pass).toString(this.$hash.enc.Utf8));
            this.user = userData, this.token = tokenData, this.loading = false;
          } else {
            this.user = null, this.token = null, this.loading = false;
          }
        },
        mounted() {
          if(this.user.admin && this.user.superadmin){
            this.admin = true, this.superadmin = true,this.loading = false;
          } else if(this.user.admin && !this.user.superadmin) {
            this.admin = true, this.superadmin = false,this.loading = false;
          } else {
            this.$router.push({ name: 'results', params: { id: this.currgd.id, cmd: "result", data: "UnAuthorized Route.", redirectUrl: "/", tocmd: 'home' } })
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
        }
      }
</script>
