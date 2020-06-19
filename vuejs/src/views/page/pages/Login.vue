<template>
    <div class="content login-page">
      <TopLinks />
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullPage"></loading>
      </div>
      <p style="color: #bac964">{{ databasemessage }}</p>
      <p style="color: #f6f578">{{ resultmessage }}</p>
        <h4>Login</h4>
        <form @submit.prevent="handleSubmit">
            <label for="email" > > Your E-Mail Address</label>
            <div>
                <input id="email" type="email" v-model="email" required autofocus>
            </div>
            <div>
                <label for="password" > > Your Password</label>
                <div>
                    <input id="password" type="password" v-model="password" required>
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
                password : "",
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
                if (this.password.length > 0) {
                    this.$http.post(window.apiRoutes.loginRoute, {
                        email: this.email,
                        password: this.password
                    })
                    .then(response => {
                      console.log(response);
                      if(response.data.auth && response.data.registered){
                          localStorage.setItem("tokendata", JSON.stringify({ token: response.data.token ,issuedate: response.data.issuedat, expirydate: response.data.expiryat }));
                          localStorage.setItem("userdata", JSON.stringify( response.data.tokenuser ));
                          var token = JSON.parse(localStorage.getItem("tokendata"));
                          var userData = JSON.parse(localStorage.getItem("userdata"));
                          if(token && userData){
                            this.loading = false;
                            this.resultmessage = `> Logged in Successfully as ${userData.name}. Your token will expire at ${token.expirydate}.`;
                            setTimeout(() => {
                              if(this.$route.params.nextUrl != null){
                                this.$router.push({name: "results", params: { data: "Log in Successfull. You Will be Redirected Through a Secure Channel.", redirectUrl: this.$route.params.nextUrl }});
                              }
                              else{
                                  this.$router.push({name: "results", params: { data: "Log in Successfull. You Will be Redirected Through a Secure Channel.", redirectUrl: '/0:home/' }})
                              }
                            }, 500)
                          }
                      } else {
                        this.loading = false;
                          this.resultmessage = "> "+response.data.message;
                      }
                    });
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
                this.databasemessage = `🟢 Database is Live. You can Login. Ping - ${response.data.ping}ms`
                this.loading = false;
              } else {
                this.databasemessage = "🔴 Database Offline / under Maintenance. Please Try Later"
                this.loading = false;
              }
            })
          }
        }
    }
</script>
