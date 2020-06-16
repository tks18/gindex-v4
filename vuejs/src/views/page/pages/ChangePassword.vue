<template>
    <div class="content login-page">
      <TopLinks />
      <p style="color: #bac964">{{ databasemessage }}</p>
      <p style="color: #f6f578">{{ resultmessage }}</p>
        <h4>Change Your Password</h4>
        <form @submit.prevent="handleSubmit">
            <p style="color:white">Your Email - <span style="color: #ff9595">"{{ userinfo.email }}"</span></p>
            <div>
                <label for="oldpassword" > > Your Old Password</label>
                <div>
                    <input id="oldpassword" type="password" v-model="oldpassword" required>
                </div>
            </div>
            <div>
                <label for="newpassword" > > Your New Password</label>
                <div>
                    <input id="newpassword" type="password" v-model="newpassword" required>
                </div>
            </div>
            <div>
                <label for="confirm-password" > > Confirm New Password</label>
                <div>
                    <input id="confirm-password" type="password" v-model="confirmpassword" required>
                </div>
            </div>
            <div>
                <button class="login-button" type="submit" >
                    Login
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
        data(){
            return {
                userinfo: JSON.parse(localStorage.getItem("userdata")),
                oldpassword: "",
                newpassword : "",
                confirmpassword: "",
                resultmessage: "",
                databasemessage: "",
            }
        },
        methods : {
            handleSubmit(e){
                e.preventDefault();
                if (this.confirmpassword === this.newpassword && this.newpassword.length > 0) {
                    var tokenData = JSON.parse(localStorage.getItem("tokendata"))
                    var userData = JSON.parse(localStorage.getItem("userdata"));
                    this.$http.post(window.apiRoutes.changePasswordRoute, {
                        email: userData.email,
                        oldpassword: this.oldpassword,
                        newpassword: this.newpassword,
                    })
                    .then(response => {
                      console.log(response);
                      if(response.data.auth && response.data.registered && response.data.changed){
                          if (userData != null && tokenData != null) {
                            localStorage.removeItem("tokendata");
                            localStorage.removeItem("userdata");
                            this.$router.push({ name: 'results', params: { redirectUrl: '/0:login/', data: `response.data.message. You have to Relogin with new Password` } })
                            }
                          } else {
                          this.resultmessage = "> "+response.data.message;
                      }
                    });
                } else {
                  this.resultmessage = "> Passwords Do Not Match"
                  this.newpassword = "";
                  this.confirmpassword = "";
                }
            },
        },
        mounted: function() {
          this.$http.post(window.apiRoutes.homeRoute).then(response => {
            console.log(response);
            if(response.status == '200'){
              this.databasemessage = `🟢 Database is Live. Ping - ${response.data.ping}ms`
            } else {
              this.databasemessage = "🔴 Database Offline / under Maintenance. Please Try Later"
            }
          })
        }
    }
</script>
