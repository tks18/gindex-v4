<template>
  <div>
    <div class="navigation-buttons">
      <li class="buttons" @click="homeRoute">Home</li>
      <li class="buttons" v-if="logged" @click="settingsRoute">My Settings</li>
      <li class="buttons" v-if="logged && admin && !superadmin" @click="adminRoute">Admin Panel</li>
      <li class="buttons" v-if="logged && admin && superadmin" @click="superAdminRoute">Admin Panel</li>
      <li class="buttons" v-if="logged" @click="contentRoute">View Content</li>
      <li class="buttons" v-if="logged" @click="logoutRoute">Logout</li>
      <li class="buttons" v-if="!logged" @click="requestRoute">Request Access</li>
      <li class="buttons" v-if="!logged" @click="loginRoute">Login</li>
    </div>
    <hr>
  </div>
</template>
<script>
  export default {
      data () {
          return {
              logged: false,
              admin: false,
              superadmin: false,
          }
      },
      methods: {
        homeRoute() {
          this.$router.push("/0:home/")
        },
        settingsRoute() {
          this.$router.push({ name: 'results' , params: { data: "You are Redirected Through a Secure Channel. Please Wait!!", redirectUrl: '/0:settings/' } })
        },
        adminRoute() {
          this.$router.push({ name: 'results' , params: { data: "You are Redirected Through a Secure Channel. Please Wait!!", redirectUrl: '/0:admin/' } })
        },
        superAdminRoute() {
          this.$router.push({ name: 'results' , params: { data: "You are Redirected Through a Secure Channel. Please Wait!!", redirectUrl: '/0:superadmin/' } })
        },
        contentRoute() {
          this.$router.push({ name: 'results' , params: { data: "You are Redirected Through a Secure Channel. Please Wait!!", redirectUrl: '/0:/' } })
        },
        logoutRoute() {
          var tokenData = JSON.parse(localStorage.getItem("tokendata"))
          var userData = JSON.parse(localStorage.getItem("userdata"));
          if (userData != null && tokenData != null){
            localStorage.removeItem("tokendata");
            localStorage.removeItem("userdata");
            this.$router.push({ name: 'results' , params: { data: "You are Being Logged Out. Please Wait", redirectUrl: '/0:home/' } })
          }
        },
        requestRoute() {
          this.$router.push("/0:register/request")
        },
        loginRoute() {
          this.$router.push("/0:login/")
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
              if(userData.admin && !userData.superadmin){
                  this.logged = true;
                  this.admin = true;
              } else if(userData.admin && userData.superadmin){
                this.logged = true;
                this.admin = true;
                this.superadmin = true
              } else {
                this.logged = false
              }
            }
          })
        } else {
          this.logged = false
        }
      }
  }
</script>
