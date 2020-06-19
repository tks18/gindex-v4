<template>
    <div class="content registration-page">
      <TopLinks />
        <div class="loading">
          <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullPage"></loading>
        </div>
        <h4>Delete Your Account</h4>
        <p style="color: #bac964;">{{ databasemessage }}</p>
        <p style="color: #f6f578;">{{ resultmessage }}</p>
        <form @submit.prevent="handleSubmit">
            <label for="password"> > Your Password</label>
            <div>
                <input id="password" type="password" v-model="password" required>
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
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
export default {
    components: {
      TopLinks,
      Loading
    },
        props : ["nextUrl"],
        data(){
            return {
                password : "",
                resultmessage: "",
                databasemessage: "",
                userData: JSON.parse(localStorage.getItem("userdata")),
                userToken: JSON.parse(localStorage.getItem("tokendata")),
                loading: true,
                fullpage: true,
            }
        },
        methods : {
            handleSubmit(e) {
              this.loading = true;
                e.preventDefault()
                if (this.password && this.password.length > 0)
                {
                    let url = window.apiRoutes.deleteMe
                    this.$http.post(url, {
                          email: this.userData.email,
                          pass: this.password,
                    })
                    .then(response => {
                        if(response){
                          if(response.data.auth && response.data.registered && response.data.deleted){
                            this.resultmessage = response.data.message
                            localStorage.removeItem('userdata');
                            localStorage.removeItem('tokendata');
                            setTimeout(() => {
                              this.loading = false;
                              this.$router.push({ name: 'results', params: { data: "You Account is Being Deleted. Please Wait", redirectUrl: "/0:home/" } })
                            }, 1500)
                          } else {
                            this.loading = false;
                            this.resultmessage = response.data.message
                          }
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
                } else {
                  this.loading = false;
                    this.resultmessage = "> Fill in Your Password"
                    this.password = "";
                }
            },
        },
        mounted: function(){
          this.loading = true;
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
              this.loading = false;
              this.resultmessage = `You are Currently Logged in as ${userData.name} as ${userData.role}`
            } else {
              this.loading = false;
              this.resultmessage = userData.admin
            }
          } else {
            this.loading = false;
            this.resultmessage = userData.admin
          }
        }
    }
</script>
