<template>
    <div class="content registration-page">
      <TopLinks />
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
      </div>
        <h4>Invite - Admin</h4>
        <p style="color: #bac964;">{{ databasemessage }}</p>
        <p style="color: #f6f578;">{{ resultmessage }}</p>
        <form @submit.prevent="handleSubmit">
            <label for="email" > > User's E-Mail Address</label>
            <div>
                <input id="email" type="email" v-model="email" required>
            </div>
            <label for="message"> > Message to Him </label>
            <div> v
                <textarea id="message" v-model="message" required></textarea>
            </div>
            <label style="color: grey; font-size: 14px"> (Why he Needs Admin Status Heaven?) </label>
            <div>
              <input type="checkbox" id="terms" name="terms" v-model="checked">
              <label for="terms"> I Accept and Read the <a class="guidelines" href="https://github.com/tks18/gindex-v4/blob/dark-mode-0-1/CODE_OF_CONDUCT.md" target="_blank">Community Guidelines</a></label><br>
            </div>
            <div>
                <button class="registration-button" type="submit">
                    Invite User
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
                email : "",
                message: "",
                resultmessage: "",
                databasemessage: "",
                loading: true,
                fullpage: true,
            }
        },
        methods : {
            handleSubmit(e) {
              this.loading = true;
                e.preventDefault()
                if(this.checked){
                  let url = window.apiRoutes.inviteAdmin
                  this.$http.post(url, {
                        email: this.email,
                        message: this.message,
                        adminuseremail: this.userinfo.email,
                  })
                  .then(response => {
                      if(response){
                        if(response.data.auth && response.data.registered){
                          this.resultmessage = response.data.message
                          this.loading = false;
                        } else {
                          this.resultmessage = response.data.message
                          this.loading = false;
                        }
                      }
                  })
                  .catch(error => {
                      this.resultmessage = error;
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
            var userData = JSON.parse(localStorage.getItem("userdata"));
            var token = JSON.parse(localStorage.getItem("tokendata"));
            if(userData && token){
              if(userData.verified){
                if(userData.admin){
                  if(userData.superadmin){
                    this.userinfo = userData;
                    this.loading = false;
                    this.resultmessage = `You are Currently Logged in as ${userData.name} as ${userData.role}`
                  } else {
                    this.loading = false;
                    this.$router.push({ name: 'results', params: { data: "You are Unauthorized", redirectUrl: "/0:home/" } })
                  }
                } else {
                  this.loading = false;
                  this.$router.push({ name: 'results', params: { data: "You are Unauthorized", redirectUrl: "/0:home/" } })
                }
              } else {
                this.loading = false;
                this.$router.push({ name: 'results', params: { data: "You are Unauthorized", redirectUrl: "/0:home/" } })
              }
            } else {
              this.loading = false;
              this.$router.push({ name: 'results', params: { data: "You are Unauthorized", redirectUrl: "/0:login/" } })
            }
          })
        }
    }
</script>
