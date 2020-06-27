<template>
    <div class="content mt-5">
      <TopLinks />
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
      </div>
      <div class="columns is-multiline is-centered is-vcentered">
        <div class="column has-text-centered is-half">
          <h2 class="title has-text-weight-bold has-text-white">Invite Users</h2>
          <p class="subtitle is-small has-text-white has-text-weight-bold">Invite Users using Glory to Heaven Mail Service</p>
          <p class="subtitle is-small has-text-white">(Please Use Considerably As We Have to Incur Mail Costs.)</p>
          <form @submit.prevent="handleSubmit">
            <div class="field">
              <p class="control has-icons-left has-icons-right">
                <input class="input is-rounded" placeholder="Your Name" id="name" type="text" v-model="name" required autofocus>
                <span class="icon is-small is-left">
                  <i class="fas fa-user"></i>
                </span>
                <span class="icon is-small is-right">
                  <i class="fas fa-check"></i>
                </span>
              </p>
            </div>
            <div class="field">
              <p class="control has-icons-left has-icons-right">
                <input class="input is-rounded is-focused" placeholder="Email" id="email" type="email" v-model="email" required>
                <span class="icon is-small is-left">
                  <i class="fas fa-envelope"></i>
                </span>
                <span class="icon is-small is-right">
                  <i class="fas fa-check"></i>
                </span>
              </p>
            </div>
            <label class="subtitle has-text-white"> Invite for Role</label>
            <div class="control mb-3">
                <input class="is-checkradio is-small is-success" id="userradio" type="radio" name="role" checked value="user" :disabled="disabled" v-model="role">
                <label for="userradio" class="subtitle has-text-weight-bold has-text-white">User</label>
                <input class="is-checkradio is-small is-success" id="adminradio" type="radio" name="role" value="admin" :disabled="disabled" v-model="role">
                <label for="adminradio" class="subtitle has-text-weight-bold has-text-white"> Admin</label>
                <input class="is-checkradio is-small is-success" id="superadminradio" type="radio" name="role" value="superadmin" :disabled="disabled" v-model="role">
                <label for="superadminradio" class="subtitle has-text-weight-bold has-text-white">Superadmin</label>
            </div>
            <div class="field">
              <div class="control">
                <textarea class="textarea is-success is-rounded" placeholder="Message to Him" id="message" rows="3" v-model="message" required></textarea>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <div class="b-checkbox is-success is-circular is-inline">
                  <input class="styled has-text-success" type="checkbox" id="terms" name="terms" v-model="checked">
                  <label for="terms">
                    <span class="content has-text-white">  I Accept and Read the <a class="has-text-success" href="https://raw.githubusercontent.com/tks18/gindex-v4/dark-mode-0-1/CONTRIBUTING.md" target="_blank">Community Guidelines</a></span>
                  </label>
                </div>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <div class="b-checkbox is-success is-circular is-inline">
                  <input class="styled has-text-success" type="checkbox" id="code" name="terms" v-model="codechecked">
                  <label for="code">
                    <span class="content has-text-white">  I Accept and Read the <a class="has-text-success" href="https://github.com/tks18/gindex-v4/blob/dark-mode-0-1/CODE_OF_CONDUCT.md" target="_blank">Code of Conduct</a></span>
                  </label>
                </div>
              </div>
            </div>
            <button :class=" loading ? 'button is-loading is-rounded is-success is-medium' : 'button is-success is-rounded is-medium' " type="submit" :disabled="buttondisabled" >
              <span class="icon">
                <i class="fas fa-user-plus"></i>
              </span>
              <span>Invite User</span>
            </button>
          </form>
        </div>
      </div>
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
                disabled: true,
                buttondisabled: true,
                role: "",
                apiurl: "",
                resultmessage: "",
                loading: true,
                fullpage: true,
                checked: "",
                codechecked: "",
            }
        },
        methods : {
            handleSubmit(e) {
              this.loading = true;
                e.preventDefault()
                if(this.checked && this.codechecked && this.name.length > 0 && this.email.length > 0 && this.message.length > 0){
                  this.$http.post(this.apiurl, {
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
            var user = localStorage.getItem("userdata");
            var token = localStorage.getItem("tokendata");
            if(user && token){
              var userData = JSON.parse(this.$hash.AES.decrypt(user, this.$pass).toString(this.$hash.enc.Utf8));
              if(userData.verified){
                if(userData.admin && userData.superadmin){
                  this.loading = false;
                  this.userinfo = userData;
                  this.disabled = false;
                  this.role = 'user';
                  this.resultmessage = `You are Currently Logged in as ${userData.name} as ${userData.role}`
                } else if(userData.admin && !userData.superadmin) {
                  this.loading = false;
                  this.userinfo = userData;
                  this.apiurl = window.apiRoutes.inviteUser;
                  this.disabled = true;
                  this.role = 'user';
                  this.resultmessage = `You are Currently Logged in as ${userData.name} as ${userData.role}`
                } else {
                  this.loading = false;
                  this.$router.push({ name: 'results', params: { id: 0, cmd: "result", success: false, data: "You are Unauthorized", redirectUrl: "/0:home/" } })
                }
              } else {
                this.loading = false;
                this.$router.push({ name: 'results', params: { id: 0, cmd: "result", success: false, data: "You are Unauthorized", redirectUrl: "/0:home/" } })
              }
            } else {
              this.loading = false;
              this.$router.push({ name: 'results', params: { id: 0, cmd: "result", success: false, data: "You are Unauthorized", redirectUrl: "/0:home/" } })
            }
        },
        watch: {
          role: function() {
            if(this.role == "user"){
              this.apiurl = window.apiRoutes.inviteUser;
            } else if(this.role == "admin"){
              this.apiurl = window.apiRoutes.inviteAdmin;
            } else if(this.role == "superadmin"){
              this.apiurl = window.apiRoutes.inviteSuperAdmin;
            }
          },
          codechecked: function() {
            const emailRegex = /[a-z1-9]+@+[a-z1-9A-Z]+[.][a-z]+/g
            if(emailRegex.test(this.email) && this.checked && this.codechecked && this.name.length > 0 && this.email.length > 0 && this.message.length > 0){
              this.buttondisabled = false;
            } else {
              this.buttondisabled = true;
            }
          }
        }
    }
</script>
