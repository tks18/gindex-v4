<template>
    <div class="content registration-page">
      <TopLinks />
        <h4>Delete User</h4>
        <p style="color: #bac964;">{{ databasemessage }}</p>
        <p style="color: #f6f578;">{{ resultmessage }}</p>
        <form @submit.prevent="handleSubmit">
            <label for="email" > > User's E-Mail Address</label>
            <div>
                <input id="email" type="email" v-model="email" required>
            </div>

            <label for="password"> > Your Admin Password</label>
            <div>
                <input id="password" type="password" v-model="password" required>
            </div>
            <div>
                <button class="registration-button" type="submit">
                    Register
                </button>
            </div>
            <p style="color: #bac964;">Note: Use this Feature Wisely.</p>
        </form>
    </div>
</template>
<script>
import TopLinks from "../../common/Top-Links";
export default {
    components: {
      TopLinks,
    },
        props : ["nextUrl"],
        data(){
            return {
                email : "",
                password : "",
                resultmessage: "",
                databasemessage: "",
                userData: JSON.parse(localStorage.getItem("userdata")),
                userToken: JSON.parse(localStorage.getItem("tokendata")),
            }
        },
        methods : {
            handleSubmit(e) {
                e.preventDefault()
                if (this.password && this.password.length > 0)
                {
                    let url = window.apiRoutes.deleteUser
                    this.$http.post(url, {
                          email: this.email,
                          adminpass: this.password,
                          adminuseremail: this.userData.email,
                    })
                    .then(response => {
                        if(response){
                          if(response.data.auth && response.data.registered){
                            this.resultmessage = response.data.message
                          } else {
                            this.resultmessage = response.data.message
                          }
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
                } else {
                    this.resultmessage = "> Passwords Do Not Match"
                    this.password = "";
                }
            },
            homeroute() {
              this.$router.push('/0:home/')
            },
            adminroute() {
              window.alert("Currently under Development")
            },
            contentroute() {
              this.$router.push('/0:/')
            },
            settingsroute() {
              window.alert("Currently under Development")
            }
        },
        mounted: function(){
          this.$http.post(window.apiRoutes.homeRoute).then(response => {
            console.log(response);
            if(response.status == '200'){
              this.databasemessage = `🟢 Database is Live. Ping - ${response.data.ping}ms`
            } else {
              this.databasemessage = "🔴 Database Offline / under Maintenance. Please Try Later"
            }
          })
          var userData = JSON.parse(localStorage.getItem("userdata"));
          var token = JSON.parse(localStorage.getItem("tokendata"));
          if(userData && token){
            if(userData.verified){
              if(userData.admin){
                this.resultmessage = `You are Currently Logged in as ${userData.name} as ${userData.role}`
              } else {
                this.resultmessage = userData.admin
              }
            } else {
              this.resultmessage = userData.admin
            }
          } else {
            this.resultmessage = userData.admin
          }
        }
    }
</script>
