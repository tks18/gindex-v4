<template>
    <div class="content registration-page">
      <TopLinks />
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
      </div>
        <h4>Invite User</h4>
        <p style="color: #bac964;">{{ databasemessage }}</p>
        <p style="color: #f6f578;">{{ resultmessage }}</p>
        <form @submit.prevent="handleSubmit">
            <label for="name"> > User's Name</label>
            <div>
                <input id="name" type="text" v-model="name" required autofocus>
            </div>

            <label for="email" > > User's E-Mail Address</label>
            <div>
                <input id="email" type="email" v-model="email" required>
            </div>

            <label for="message"> > Message to Him </label>
            <div>
                <textarea id="message" v-model="message" required></textarea>
            </div>
            <label style="color: grey; font-size: 14px"> (why he Need to get Glory to Heaven?) </label>
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
                name : "",
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
                  let url = window.apiRoutes.inviteUser
                  this.$http.post(url, {
                        name: this.name,
                        email: this.email,
                        message: this.message,
                        adminuseremail: this.userinfo.email,
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
            if(response.status == '200'){
              this.databasemessage = `🟢 Database is Live. Ping - ${response.data.ping}ms`
            } else {
              this.databasemessage = "🔴 Database Offline / under Maintenance. Please Try Later"
            }
            var user = localStorage.getItem("userdata");
            var token = localStorage.getItem("tokendata");
            if(user && token){
              var userData = JSON.parse(this.$hash.AES.decrypt(user, this.$pass).toString(this.$hash.enc.Utf8));
              if(userData.verified){
                if(userData.admin){
                  this.loading = false;
                  this.userinfo = userData;
                  this.resultmessage = `You are Currently Logged in as ${userData.name} as ${userData.role}`
                } else {
                  this.loading = false;
                  this.$router.push({ name: 'results', params: { id: 0, cmd: "result", data: "You are Unauthorized", redirectUrl: "/0:home/" } })
                }
              } else {
                this.loading = false;
                this.$router.push({ name: 'results', params: { id: 0, cmd: "result", data: "You are Unauthorized", redirectUrl: "/0:home/" } })
              }
            } else {
              this.loading = false;
              this.$router.push({ name: 'results', params: { id: 0, cmd: "result", data: "You are Unauthorized", redirectUrl: "/0:home/" } })
            }
          })
        }
    }
</script>
