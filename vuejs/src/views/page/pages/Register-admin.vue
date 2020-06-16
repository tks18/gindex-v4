<template>
    <div class="content registration-page">
      <TopLinks />
        <h4>Register a Admin User</h4>
        <p style="color: #bac964;">{{ databasemessage }}</p>
        <p style="color: #f6f578;">{{ resultmessage }}</p>
        <form @submit.prevent="handleSubmit">
            <label for="name"> > Recipient Name</label>
            <div>
                <input id="name" type="text" v-model="name" required autofocus>
            </div>

            <label for="email" > > Recipient E-Mail Address</label>
            <div>
                <input id="email" type="email" v-model="email" required>
            </div>

            <label for="password"> > Your Admin Password</label>
            <div>
                <input id="password" type="password" v-model="password" required>
            </div>
            <div>
              <input type="checkbox" id="terms" name="terms" v-model="checked">
              <label for="terms"> I Accept and Read the <a class="guidelines" href="https://github.com/tks18/gindex-v4/blob/dark-mode-0-1/CODE_OF_CONDUCT.md" target="_blank">Community Guidelines</a></label><br>
            </div>
            <div>
                <button class="registration-button" type="submit">
                    Register
                </button>
            </div>
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
                name : "",
                email : "",
                password : "",
                password_confirmation : "",
                resultmessage: "",
                databasemessage: "",
                userData: JSON.parse(localStorage.getItem("userdata")),
                userToken: JSON.parse(localStorage.getItem("tokendata")),
                checked: "",
            }
        },
        methods : {
            handleSubmit(e) {
                e.preventDefault()
                if (this.password && this.password.length > 0)
                {
                  if(this.checked){
                    let url = window.apiRoutes.adminRegisterRoute
                    this.$http.post(url, {
                          name: this.name,
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
                    this.resultmessage = "> You Need to Accept Community Guidelines."
                    this.checked = false;
                  }
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
