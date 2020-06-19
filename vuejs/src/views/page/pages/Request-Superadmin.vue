<template>
    <div class="content registration-page">
      <TopLinks />
        <h4>Request Access</h4>
        <div class="loading">
          <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullPage"></loading>
        </div>
        <p style="color: #bac964;">{{ databasemessage }}</p>
        <p style="color: #f6f578;">{{ resultmessage }}</p>
        <form @submit.prevent="handleSubmit">
            <label for="message"> > Why You Need Super Admin Previlage ? </label>
            <div>
                <textarea id="message" v-model="message" required></textarea>
            </div>
            <div>
              <input type="checkbox" id="terms" name="terms" v-model="checked">
              <label for="terms"> I Accept and Read the <a class="guidelines" href="https://github.com/tks18/gindex-v4/blob/dark-mode-0-1/CODE_OF_CONDUCT.md" target="_blank">Community Guidelines</a></label><br>
            </div>
            <div>
                <button class="registration-button" type="submit">
                    Request Admin Access
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
                userinfo: {},
                resultmessage: "",
                databasemessage: "",
                checked: "",
                loading: true,
                message: "",
            }
        },
        methods : {
            handleSubmit(e) {
              this.loading = true;
                e.preventDefault()
                if(this.checked){
                  let url = window.apiRoutes.requestsuperadminroute
                  this.$http.post(url, {
                        name: this.userinfo.name,
                        email: this.userinfo.email,
                        message: this.message,
                  })
                  .then(response => {
                      if(response){
                        if(response.data.auth && response.data.registered){
                          this.loading = false;
                          this.resultmessage = response.data.message
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
                  this.resultmessage = "> You Need to Accept Community Guidelines."
                  this.checked = false;
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
          var tokenData = JSON.parse(localStorage.getItem("tokendata"))
          var userData = JSON.parse(localStorage.getItem("userdata"));
          if (userData != null && tokenData != null){
            this.axios.post(window.apiRoutes.verifyRoute, {
              token: tokenData.token
            }).then(response => {
              if(!response.data.auth && !response.data.registered && response.data.tokenuser == null){
                this.loading = false;
                this.$router.push({ name: 'results', params: { data: "I think Your Token Has Expired. Please Login to Regerate Another One", redirectUrl: "/0:login/" } })
              } else {
                if(userData.admin && !userData.superadmin){
                  this.loading = false;
                  this.userinfo = userData;
                } else {
                  this.loading = false;
                  this.$router.push({ name: 'results', params: { data: "You are Already a Admin or SuperAdmin", redirectUrl: "/0:home/" } })
                }
              }
            })
          } else {
            this.loading = false;
            this.logged = false
          }
        }
    }
</script>
