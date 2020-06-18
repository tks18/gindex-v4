<template>
  <div>
    <TopLinks />
    <div v-if="adminuser" class="content adminarea">
      <h2 class="title"> Super Admin Area </h2>
      <hr>
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
    export default {
        components: {
          TopLinks,
        },
        data() {
          return {
            scopes: [],
            userinfo: {},
            tokeninfo: {},
            adminuser: false,
          }
        },
        created() {
          var tokenData = JSON.parse(localStorage.getItem("tokendata"))
          var userData = JSON.parse(localStorage.getItem("userdata"));
          if (userData != null && tokenData != null){
            this.axios.post(window.apiRoutes.verifyRoute, {
              token: tokenData.token
            }).then(response => {
              if(!response.data.auth && !response.data.registered && response.data.tokenuser == null){
                this.$router.push({ name: 'results', params: { data: "I think Your Token Has Expired. Please Login to Regerate Another One", redirectUrl: "/0:login/" } })
              } else {
                if(userData.admin){
                  if(userData.superadmin){
                    this.adminuser = true;
                    this.userinfo = userData;
                    this.tokeninfo = tokenData;
                    var adminScopes = [{id: 0,name: "Add a User", url: "/0:register/user/"}, {id: 1,name: "Accept a Request from User", url: "/0:register/user/"}, {id: 2,name: "Delete a User", url: "/0:delete/user/"}, {id: 3,name: "Add a User to Spam List", url:"/0:register/spam"},{id: 4,name: "Upgrade a User to Admin", url:"/0:request/admin"},{id: 5,name: "Upgrade a User to  Super Admin", url:"/0:request/superadmin"},{id: 6,name: "Delete A Admin User", url:"/0:delete/admin"}];
                    this.scopes = adminScopes;
                  }
                } else {
                  this.$router.push({ name: 'results', params: { data: "You Have Not Given Super Admin Permissions.", redirectUrl: "/0:home/" } })
                }
              }
            })
          } else {
            this.adminuser = false
          }
        }
      }
</script>
