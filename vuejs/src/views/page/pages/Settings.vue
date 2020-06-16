<template>
  <div>
    <TopLinks />
    <div v-if="logged" class="content adminarea">
      <h2 class="title"> Settings </h2>
      <hr>
      <div class="userdetails">
        <h3>User Details</h3>
        <p>Your Name - <span class="details">{{ userinfo.name }}</span></p>
        <p>Your Email - <span class="details">{{ userinfo.email }}</span></p>
        <p>Your Role - <span class="details">{{ userinfo.role }}</span></p>
        <p>Your Last Token Issue Date - <span class="details">{{ tokeninfo.issuedate }}</span></p>
        <p>Your Last Token Expiry Date - <span class="details">{{ tokeninfo.expirydate }}</span></p>
        <div class="scopes">
          <li class="scope-list" @click="changePasswordRoute">Change Your Password</li>
          <li class="scope-list" @click="changeEmailRoute">Change Your Email</li>
          <li class="scope-list" v-if="!admin && !superadmin" @click="requestAdmin">Request Admin Access</li>
          <li class="scope-list" v-if="admin && !superadmin" @click="requestAdmin">Request SuperAdmin Access</li>
          <li class="scope-list" @click="deleteAccountRoute">Delete Your Account</li>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TopLinks from "../../common/Top-Links";
    export default {
        components: {
          TopLinks,
        },
        data() {
          return {
            userinfo: {},
            tokeninfo: {},
            logged: false,
            admin: false,
            superadmin: false,
          }
        },
        methods: {
          changePasswordRoute() {
            this.$router.push({ name: 'results', params: { data: "You are Redirected Through a Secure Channel", redirectUrl: "/0:settings/changepassword" } })
          },
          changeEmailRoute() {
            window.alert("Currently Under Development");
            // this.$router.push({ name: 'results', params: { data: "You are Redirected Through a Secure Channel", redirectUrl: "/0:settings/changeemail" } })
          },
          requestAdmin() {
            window.alert("Currently Under Development");
            // this.$router.push({ name: 'results', params: { data: "You are Redirected Through a Secure Channel", redirectUrl: "/0:register/request/admin" } })
          },
          deleteAccountRoute() {
            window.alert("Currently Under Development");
            // this.$router.push({ name: 'results', params: { data: "You are Redirected Through a Secure Channel", redirectUrl: "/0:settings/delete" } })
          }
        },
        mounted() {
          var tokenData = JSON.parse(localStorage.getItem("tokendata"))
          var userData = JSON.parse(localStorage.getItem("userdata"));
          if (userData != null && tokenData != null){
            this.axios.post(window.apiRoutes.verifyRoute, {
              token: tokenData.token
            }).then(response => {
              if(!response.data.auth && !response.data.registered && response.data.tokenuser == null){
                this.$router.push({ name: 'results', params: { data: "I think Your Token Has Expired. Please Login to Regerate Another One", redirectUrl: "/0:login/" } })
              } else {
                if(userData.admin && userData.superadmin){
                  this.userinfo = userData;
                  this.tokeninfo = tokenData;
                  this.logged = true;
                  this.admin = true;
                  this.superadmin = true;
                } else if(userData.admin && !userData.superadmin){
                  this.userinfo = userData;
                  this.tokeninfo = tokenData;
                  this.logged = true;
                  this.admin = true;
                } else {
                  this.userinfo = userData;
                  this.tokeninfo = tokenData;
                  this.logged = true;
                }
              }
            })
          } else {
            this.logged = false
          }
        }
      }
</script>
