<template>
  <div>
    <div class="navigation-buttons">
      <li class="buttons" @click="homeRoute">Home</li>
      <li class="buttons" v-if="logged" @click="settingsRoute">My Settings</li>
      <li class="buttons" v-if="!logged" @click="otpRegisterRoute">OTP Registration</li>
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
          this.$router.push({ name: 'results' , params: { id: 0, cmd: "result", data: "You are Redirected Through a Secure Channel. Please Wait!!", redirectUrl: '/0:settings/' } })
        },
        adminRoute() {
          this.$router.push({ name: 'results' , params: { id: 0, cmd: "result", data: "You are Redirected Through a Secure Channel. Please Wait!!", redirectUrl: '/0:admin/' } })
        },
        superAdminRoute() {
          this.$router.push({ name: 'results' , params: { id: 0, cmd: "result", data: "You are Redirected Through a Secure Channel. Please Wait!!", redirectUrl: '/0:superadmin/' } })
        },
        contentRoute() {
          this.$router.push({ name: 'results' , params: { id: 0, cmd: "result", data: "You are Redirected Through a Secure Channel. Please Wait!!", redirectUrl: '/0:/' } })
        },
        logoutRoute() {
          var token = localStorage.getItem("tokendata")
          var user = localStorage.getItem("userdata");
          if (user != null && token != null){
            localStorage.removeItem("tokendata");
            localStorage.removeItem("userdata");
            this.$router.push({ name: 'results' , params: { id: 0, cmd: "result", data: "You are Being Logged Out. Please Wait", redirectUrl: '/0:home/' } })
          }
        },
        requestRoute() {
          this.$router.push("/0:register/request/user")
        },
        loginRoute() {
          this.$router.push("/0:login/")
        },
        otpRegisterRoute() {
          this.$router.push("/0:register/otp")
        }
      },
      created() {
        var token = localStorage.getItem("tokendata");
        var user = localStorage.getItem("userdata");
        if (user != null && token != null){
          var tokenData = JSON.parse(this.$hash.AES.decrypt(token, this.$pass).toString(this.$hash.enc.Utf8));
          var userData = JSON.parse(this.$hash.AES.decrypt(user, this.$pass).toString(this.$hash.enc.Utf8));
          this.axios.post(window.apiRoutes.verifyRoute, {
            token: tokenData.token
          }).then(response => {
            if(!response.data.auth && !response.data.registered && response.data.tokenuser == null){
              this.$router.push({ name: 'results', params: { id: 0, cmd: "results", data: "I think Your Token Has Expired. Please Login to Regerate Another One", redirectUrl: "/0:login/" } })
            } else {
              if(userData.admin && !userData.superadmin){
                  this.logged = true;
                  this.admin = true;
              } else if(userData.admin && userData.superadmin){
                this.logged = true;
                this.admin = true;
                this.superadmin = true
              } else {
                this.logged = true
              }
            }
          })
        } else {
          this.logged = false
        }
      }
  }
</script>
