<template>
    <div class="content registration-page">
      <TopLinks />
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
      </div>
        <h4>Delete User</h4>
        <p style="color: #bac964;">{{ databasemessage }}</p>
        <p style="color: #f6f578;">{{ resultmessage }}</p>
        <form @submit.prevent="handleSubmit">
            <label for="email" > > User's E-Mail Address</label>
            <div>
                <input id="email" type="email" v-model="email" required>
            </div>

            <div class="control mb-3">
                <input class="is-checkradio is-small is-warning" id="adminradio" type="radio" name="role" value="admin" :disabled="disabled" v-model="role">
                <label for="adminradio"> Admin</label>
                <input class="is-checkradio is-small is-warning" id="superadminradio" type="radio" name="role" value="superadmin" :disabled="disabled" v-model="role">
                <label for="superadminradio">Superadmin</label>
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
      Loading
    },
        props : ["nextUrl"],
        data(){
            return {
                email : "",
                password : "",
                resultmessage: "",
                role: "",
                apiurl: "",
                disabled: "",
                databasemessage: "",
                userData: JSON.parse(this.$hash.AES.decrypt(localStorage.getItem("userdata"), this.$pass).toString(this.$hash.enc.Utf8)),
                userToken: JSON.parse(this.$hash.AES.decrypt(localStorage.getItem("tokendata"), this.$pass).toString(this.$hash.enc.Utf8)),
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
                    this.$http.post(this.apiurl, {
                          email: this.email,
                          adminpass: this.password,
                          adminuseremail: this.userData.email,
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
          var user = localStorage.getItem("userdata");
          var token = localStorage.getItem("tokendata");
          if(user && token){
            var userData = JSON.parse(this.$hash.AES.decrypt(user, this.$pass).toString(this.$hash.enc.Utf8));
            if(userData.verified){
              if(userData.admin && !userData.superadmin){
                this.loading = false;
                this.role = "user"
                this.disabled = true;
                this.resultmessage = `You are Currently Logged in as ${userData.name} as ${userData.role}`
              } else if(userData.admin && userData.superadmin) {
                this.loading = false;
                this.disabled = false;
                this.resultmessage = `You are Currently Logged in as ${userData.name} as ${userData.role}`
              } else {
                this.loading = false;
                this.$router.push({ name: 'results', params: { id: 0, cmd: "result", success: false, data: "Authorized Area. Not Allowed", redirectUrl: "/0:home/" } })
              }
            } else {
              this.loading = false;
              this.$router.push({ name: 'results', params: { id: 0, cmd: "result", success: false, data: "Authorized Area. Not Allowed", redirectUrl: "/0:home/" } })
            }
          } else {
            this.loading = false;
            this.$router.push({ name: 'results', params: { id: 0, cmd: "result", success: false, data: "Authorized Area. Not Allowed", redirectUrl: "/0:home/" } })
          }
        },
        watch: {
          role: function() {
            if(this.role == "admin"){
              this.apiurl = window.apiRoutes.deleteUser;
            } else if(this.role == "superadmin") {
              this.apiurl = window.apiRoutes.deleteAdmin;
            }
          }
        }
    }
</script>
