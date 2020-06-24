<template>
    <div class="content login-page">
      <TopLinks />
      <p style="color: #bac964">{{ databasemessage }}</p>
      <p style="color: #f6f578">{{ resultmessage }}</p>
        <h4>Change Your Password</h4>
        <div class="loading">
          <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
        </div>
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
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
    export default {
      components: {
        TopLinks,
        Loading,
      },
        data(){
            return {
                userinfo: JSON.parse(this.$hash.AES.decrypt(localStorage.getItem("userdata"), this.$pass).toString(this.$hash.enc.Utf8)),
                oldpassword: "",
                newpassword : "",
                confirmpassword: "",
                resultmessage: "",
                databasemessage: "",
                loading: true,
                fullpage: true,
            }
        },
        methods : {
            handleSubmit(e){
                this.loading = true;
                e.preventDefault();
                if (this.confirmpassword === this.newpassword && this.newpassword.length > 0) {
                    var tokenData = JSON.parse(this.$hash.AES.decrypt(localStorage.getItem("userdata"), this.$pass).toString(this.$hash.enc.Utf8));
                    var userData = JSON.parse(this.$hash.AES.decrypt(localStorage.getItem("tokendata"), this.$pass).toString(this.$hash.enc.Utf8));
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
                            this.loading = false;
                            this.$router.push({ name: 'results', params: { id: 0, cmd: "result", success: true, redirectUrl: '/0:login/', data: `response.data.message. You have to Relogin with new Password` } })
                            }
                          } else {
                            this.loading = false;
                          this.resultmessage = "> "+response.data.message;
                      }
                    });
                } else {
                  this.loading = false;
                  this.resultmessage = "> Passwords Do Not Match"
                  this.newpassword = "";
                  this.confirmpassword = "";
                }
            },
        },
        mounted: function() {
          this.loading = true;
          this.$http.post(window.apiRoutes.homeRoute).then(response => {
            console.log(response);
            if(response.status == '200'){
              this.loading = false;
              this.databasemessage = `🟢 Database is Live. Ping - ${response.data.ping}ms`
            } else {
              this.loading = false;
              this.databasemessage = "🔴 Database Offline / under Maintenance. Please Try Later"
            }
          })
        }
    }
</script>
