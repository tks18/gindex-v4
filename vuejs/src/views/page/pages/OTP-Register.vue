<template>
    <div class="content login-page">
      <TopLinks />
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullPage"></loading>
      </div>
      <p style="color: #bac964">{{ databasemessage }}</p>
      <p style="color: #f6f578">{{ resultmessage }}</p>
        <h4>Verify Your Account</h4>
        <form @submit.prevent="handleSubmit">
            <label for="email" > > Your E-Mail Address</label>
            <div>
                <input id="email" type="email" v-model="email" required autofocus>
            </div>
            <div>
                <label for="otp" > > OTP</label>
                <div>
                    <input id="otp" type="password" v-model="otp" required>
                </div>
                <label style="color: grey; font-size: 14px;"> OTP is Case Sensitive</label>
            </div>
            <div>
                <label for="password" > > Password</label>
                <div>
                    <input id="password" type="password" v-model="password" required>
                </div>
            </div>
            <div>
                <label for="confirm-password" > > Confirm Password</label>
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
        Loading
      },
        data(){
            return {
                email : "",
                otp: "",
                password : "",
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
                if (this.confirmpassword === this.password && this.password.length > 0) {
                    this.$http.post(window.apiRoutes.otpRegister, {
                        email: this.email,
                        otp: this.otp,
                        newpassword: this.password,
                    })
                    .then(response => {
                      console.log(response);
                      if(response.data.auth && response.data.registered && response.data.changed){
                        this.loading = false;
                            this.$router.push({ name: 'results', params: { redirectUrl: '/0:login/', data: response.data.message } })
                          } else {
                            this.loading = false;
                          this.resultmessage = "> "+response.data.message;
                      }
                    });
                } else {
                  this.loading = false;
                  this.resultmessage = "> Passwords Do Not Match"
                  this.password = "";
                  this.confirmpassword = "";
                }
            },
        },
        mounted: function() {
          this.loading = true;
          if(this.$route.params.summa){
            this.databasemessage = this.$route.params.data
          } else {
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
    }
</script>
