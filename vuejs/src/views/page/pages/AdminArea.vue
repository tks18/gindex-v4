<template>
  <div>
    <TopLinks />
    <div v-if="adminuser" class="content adminarea">
      <h2 class="title"> Super Admin Area </h2>
      <hr>
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullPage"></loading>
      </div>
      <div class="userdetails">
        <h3>User Details</h3>
        <p>Your Name - <span class="details">{{ userinfo.name }}</span></p>
        <p>Your Email - <span class="details">{{ userinfo.email }}</span></p>
        <p>Your Role - <span class="details">{{ userinfo.role }}</span></p>
        <p>Your Last Token Issue Date - <span class="details">{{ tokeninfo.issuedate }}</span></p>
        <p>Your Last Token Expiry Date - <span class="details">{{ tokeninfo.expirydate }}</span></p>
        <li class="settings-button" ><a href="/0:settings/">My Settings</a></li>
        <hr>
      </div>
      <div class="scopes">
        <h3>Permissions</h3>
        <p>You Have Given Following Scopes of Permission in this Website: </p>
        <li class="scope-list" v-for="scope in scopes" v-bind:key="scope.id" ><a :href="scope.url">{{ scope.name }}</a></li>
      </div>
    </div>
  </div>
</template>
<script>
import TopLinks from "../../common/Top-Links";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
    export default {
        components: {
          TopLinks,
          Loading
        },
        data() {
          return {
            scopes: [],
            userinfo: {},
            tokeninfo: {},
            adminuser: false,
            loading: true,
            fullpage: true,
          }
        },
        created() {
          this.loading = true;
          var tokenData = JSON.parse(localStorage.getItem("tokendata"))
          var userData = JSON.parse(localStorage.getItem("userdata"));
          if (userData != null && tokenData != null){
            this.axios.post(window.apiRoutes.verifyRoute, {
              token: tokenData.token
            }).then(response => {
              if(!response.data.auth && !response.data.registered && response.data.tokenuser == null){
                this.loading = false;
                this.$router.push({ name: 'results', params: { data: "I think Your Token Has Expired. Please Login to Regerate Another One", redirectUrl: "/0:login/" } })
              } else {
                if(userData.admin && userData.superadmin){
                  this.loading = false;
                  this.$router.push({ name: 'results', params: { data: "Redirecting you to a Powerful Admin Page..", redirectUrl: "/0:superadmin/" } })
                } else if(userData.admin && !userData.superadmin) {
                  this.adminuser = true;
                  this.userinfo = userData;
                  this.tokeninfo = tokenData;
                  var adminScopes = [{name: "Add a User", url: "/0:register/user/"}, {name: "Invite a User", url: "/0:invite/user/"}, {name: "Delete a User", url: "/0:delete/user/"}];
                  this.scopes = adminScopes;
                  this.loading = false;
                } else {
                  this.loading = false;
                  this.$router.push({ name: 'results', params: { data: "You Have Not Given Super Admin Permissions.", redirectUrl: "/0:home/" } })
                }
              }
            })
          } else {
            this.loading = false;
            this.adminuser = false
          }
        }
      }
</script>
