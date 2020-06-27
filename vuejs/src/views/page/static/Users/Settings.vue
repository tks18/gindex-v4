<template>
  <div>
    <div v-if="logged" class="content mt-5">
      <h1 class="title has-text-centered has-text-weight-bold has-text-white">Settings</h1>
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
      </div>
      <div class="columns has-text-white is-centered is-multiline">
        <div class="column is-two-thirds">
          <div class="box has-background-light">
            <h3 class="title has-text-centered has-text-weight-bold has-text-info-dark">Your Details</h3>
            <div class="columns is-vcentered is-centered is-multiline is-mobile">
              <div class="column has-text-centered is-full">
                <figure class="image is-128x128 is-inline-block">
                  <img class="is-rounded" :src="avatar" @click="alerts('Avatar Under Development')">
                </figure>
              </div>
              <div class="column is-three-fifths">
                <p class="subtitle">Name</p>
              </div>
              <div class="column is-two-fifths">
                <p class="subtitle has-text-weight-bold">{{ userinfo.name }}</p>
              </div>
              <div class="column is-three-fifths">
                <p class="subtitle">Email</p>
              </div>
              <div class="column is-two-fifths">
                <p class="subtitle has-text-weight-bold">{{ userinfo.email }}</p>
              </div>
              <div class="column is-three-fifths">
                <p class="subtitle">Current Role</p>
              </div>
              <div class="column is-two-fifths">
                <p class="subtitle has-text-weight-bold">{{ userinfo.role }}</p>
              </div>
              <div v-if="!admin && !superadmin" class="column is-three-fifths">
                <p class="subtitle">Request Admin Status</p>
              </div>
              <div v-if="!admin && !superadmin" class="column is-two-fifths">
                <button class="button is-success" @click="gotoPage('/0:settings/request')">
                  <span class="icon is-small">
                    <i class="fas fa-user-shield"></i>
                  </span>
                  <span>Request</span>
                </button>
              </div>
              <div v-if="admin && !superadmin" class="column is-three-fifths">
                <p class="subtitle">Request Superadmin Status</p>
              </div>
              <div v-if="admin && !superadmin" class="column is-two-fifths">
                <button class="button is-success" @click="gotoPage('/0:register/request')">
                  <span class="icon is-small">
                    <i class="fas fa-user-shield"></i>
                  </span>
                  <span>Request</span>
                </button>
              </div>
              <div v-if="admin && superadmin" class="column has-text-centered is-full">
                <p class="subtitle has-text-warning-dark has-text-weight-bold">You Have Maximum Access to this Website</p>
              </div>
              <div class="column is-three-fifths">
                <p class="subtitle">Last Token Issue Date</p>
              </div>
              <div class="column is-two-fifths">
                <p class="subtitle has-text-weight-bold">{{ tokeninfo.issuedate | moment("dddd, MMMM Do YYYY [at] hh:mm A") }}</p>
              </div>
              <div class="column is-three-fifths">
                <p class="subtitle">Last Token Expiry Date</p>
              </div>
              <div class="column is-two-fifths">
                <p class="subtitle has-text-weight-bold">{{ tokeninfo.expirydate | moment("dddd, MMMM Do YYYY [at] hh:mm A") }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-vcentered is-one-third">
          <div class="columns is-multiline is-desktop is-centered">
            <div class="column is-full">
              <div class="box has-background-warning">
                <h3 class="title has-text-centered has-text-weight-bold">Your Preferences</h3>
                <div class="columns is-vcentered is-centered is-multiline is-mobile">
                  <div class="column is-three-fifths">
                    <p class="subtitle">Change Your Avatar</p>
                  </div>
                  <div class="column is-two-fifths">
                    <button class="button is-rounded is-primary" @click="alerts('Under Development')">
                      <span class="icon is-small">
                        <i class="far fa-user-circle"></i>
                      </span>
                      <span>Change</span>
                    </button>
                  </div>
                  <div class="column is-three-fifths">
                    <p class="subtitle">Change Your Password</p>
                  </div>
                  <div class="column is-two-fifths">
                    <button class="button is-rounded is-primary" @click="gotoPage('/0:settings/changepassword')">
                      <span class="icon is-small">
                        <i class="fas fa-lock"></i>
                      </span>
                      <span>Change</span>
                    </button>
                  </div>
                  <div class="column is-three-fifths">
                    <p class="subtitle">Change Your Email</p>
                  </div>
                  <div class="column is-two-fifths">
                    <button class="button is-rounded is-primary" @click="alerts('Under Development')">
                      <span class="icon is-small">
                        <i class="fas fa-envelope"></i>
                      </span>
                      <span>Change</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-full">
              <div class="box has-background-danger">
                <h3 class="title has-text-centered has-text-white has-text-weight-bold">Danger Zone</h3>
                <div class="columns is-vcentered is-centered is-multiline is-mobile">
                  <div class="column is-three-fifths">
                    <p class="subtitle has-text-white">Delete Your Account</p>
                  </div>
                  <div class="column is-two-fifths">
                    <button class="button is-rounded is-warning" @click="gotoPage('/0:delete/me')">
                      <span class="icon is-small">
                        <i class="fas fa-user-times"></i>
                      </span>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
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
import 'vue-loading-overlay/dist/vue-loading.css';
    export default {
        components: {
          Loading,
        },
        data() {
          return {
            userinfo: {},
            tokeninfo: {},
            logged: false,
            avatar: "",
            admin: false,
            superadmin: false,
            loading: true,
            fullpage: true,
          }
        },
        methods: {
          alerts(text) {
            window.alert(text);
          },
          gotoPage(url) {
            this.loading = true;
            this.$router.push(url)
          }
        },
        mounted() {
          this.loading = true;
          var token = localStorage.getItem("tokendata");
          var user = localStorage.getItem("userdata");
          if (user != null && token != null){
            var userData = JSON.parse(this.$hash.AES.decrypt(user, this.$pass).toString(this.$hash.enc.Utf8));
            var tokenData = JSON.parse(this.$hash.AES.decrypt(token, this.$pass).toString(this.$hash.enc.Utf8));
            if(userData.admin && userData.superadmin){
              this.userinfo = userData;
              this.tokeninfo = tokenData;
              this.logged = true;
              this.admin = true;
              this.loading = false;
              this.superadmin = true;
              if(userData.avatar){
                this.avatar = userData.avatar;
              } else {
                this.avatar = 'https://cdn.statically.io/img/www.joyonlineschool.com/static/emptyuserphoto.png?w=64&h=64&quality=100&f=auto';
              }
            } else if(userData.admin && !userData.superadmin){
              this.userinfo = userData;
              this.tokeninfo = tokenData;
              this.loading = false;
              this.logged = true;
              this.admin = true;
              if(userData.avatar){
                this.avatar = userData.avatar;
              } else {
                this.avatar = 'https://cdn.statically.io/img/www.joyonlineschool.com/static/emptyuserphoto.png?w=64&h=64&quality=100&f=auto';
              }
            } else {
              this.userinfo = userData;
              this.tokeninfo = tokenData;
              this.logged = true;
              this.loading = false;
              if(userData.avatar){
                this.avatar = userData.avatar;
              } else {
                this.avatar = 'https://cdn.statically.io/img/www.joyonlineschool.com/static/emptyuserphoto.png?w=64&h=64&quality=100&f=auto';
              }
            }
          } else {
            this.logged = false
            this.loading = false;
          }
        }
      }
</script>
