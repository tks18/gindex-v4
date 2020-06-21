<template>
    <div class="content registration-page">
      <TopLinks />
        <div class="loading">
          <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
        </div>
        <h4>Delete Admin</h4>
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
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
export default {
    components: {
      TopLinks,
      Loading,
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
                    let url = window.apiRoutes.deleteAdmin
                    this.$http.post(url, {
                          email: this.email,
                          adminpass: this.password,
                          adminuseremail: this.userData.email,
                    })
                    .then(response => {
                        if(response){
                          if(response.data.auth && response.data.registered && response.data.deleted){
                            this.resultmessage = response.data.message
                            this.loading = false;
                          } else {
                            this.resultmessage = response.data.message
                            this.loading = false;
                          }
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
                } else {
                    this.resultmessage = "> Passwords Do Not Match"
                    this.password = "";
                    this.loading = false;
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
              if(userData.admin){
                if(userData.superadmin){
                  this.loading = false;
                    this.resultmessage = `You are Currently Logged in as ${userData.name} as ${userData.role}`
                } else {
                  this.loading = false;
                  this.$router.push({ name: 'results', params: { data: "You are Unauthorized", redirectUrl: "/0:home/" } })
                }
              } else {
                this.loading = false;
                this.resultmessage = userData.admin
              }
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
