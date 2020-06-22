<template>
    <div class="content registration-page">
      <TopLinks />
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
      </div>
        <h4>Register</h4>
        <p style="color: #bac964;">{{ databasemessage }}</p>
        <p style="color: #f6f578;">{{ resultmessage }}</p>
        <form @submit.prevent="handleSubmit">
            <label for="name"> > Recipient Name</label>
            <div>
                <input id="name" type="text" v-model="name" required autofocus>
            </div>

            <label for="email" > > Recipient E-Mail Address</label>
            <div>
                <input id="email" type="email" v-model="email" required>
            </div>

            <label for="password"> > Your Admin Password</label>
            <div>
                <input id="password" type="password" v-model="password" required>
            </div>
            <div class="checkbox">
              <Checkbox color="#ff9595" id="terms" name="terms" v-model="checked">
                I Accept and Read the <a class="guidelines" href="https://github.com/tks18/gindex-v4/blob/dark-mode-0-1/CODE_OF_CONDUCT.md" target="_blank">Community Guidelines</a>
              </Checkbox>
            </div>
            <div>
                <button class="registration-button" type="submit">
                    Register
                </button>
            </div>
            <p style="color: #bac964;">Note: Only Pending User Requests can be Added and Not Anybody.</p>
        </form>
        <hr>
        <div class="pendingusers">
          <button class="getuserbutton" type="submit" @click="getPendingUsers">Reload Request List</button>
          <p style="color: #bac964;">{{ pendingMessage }}</p>
          <div :class="columnVisibility ? 'col-rows' : 'col-rows is-hidden'">
            <h2 class="pendinghead">Pending User List</h2>
              <div class="columns is-mobile is-multiline is-centered">
                <div class="column-head column is-hidden-mobile is-3">
                  <p>Name</p>
                </div>
                <div class="column-head column is-3">
                  <p>Email</p>
                </div>
                <div class="column-head column is-hidden-mobile is-3">
                  <p>Message From Requester</p>
                </div>
              </div>
              <div v-for="user in pendingUserList" v-bind:key="user.name" class="columns is-mobile is-multiline is-centered">
                <div class="col-data column is-hidden-mobile is-3">
                  <p>{{ user.name }}</p>
                </div>
                <div class="col-data column is-3">
                  <p>{{ user.email }}</p>
                </div>
                <div class="col-data column is-hidden-mobile is-3">
                  <p>{{ user.message }}</p>
                </div>
              </div>
          </div>
        </div>
    </div>
</template>
<script>
import TopLinks from "../../common/Top-Links";
import Checkbox from "vue-material-checkbox";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
export default {
    components: {
      TopLinks,
      Checkbox,
      Loading
    },
        props : ["nextUrl"],
        data(){
            return {
                name : "",
                email : "",
                password : "",
                resultmessage: "",
                databasemessage: "",
                userData: JSON.parse(this.$hash.AES.decrypt(localStorage.getItem("userdata"), this.$pass).toString(this.$hash.enc.Utf8)),
                userToken: JSON.parse(this.$hash.AES.decrypt(localStorage.getItem("tokendata"), this.$pass).toString(this.$hash.enc.Utf8)),
                checked: "",
                pendingUserList: [],
                pendingMessage: "",
                columnVisibility: false,
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
                  if(this.checked){
                    let url = window.apiRoutes.registerRoute
                    this.$http.post(url, {
                          name: this.name,
                          email: this.email,
                          adminpass: this.password,
                          adminuseremail: this.userData.email,
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
                } else {
                    this.loading = false;
                    this.resultmessage = "> Passwords Do Not Match"
                    this.password = "";
                }
            },
            getPendingUsers() {
              this.loading = true;
              let url = window.apiRoutes.getPendingUsers
              this.$http.post(url, {
                    adminuseremail: this.userData.email,
              }).then(response => {
                if(response){
                  if(response.data.auth && response.data.registered){
                    this.loading = false;
                    this.columnVisibility = true;
                    this.pendingUserList = response.data.users;
                  } else {
                    this.loading = false;
                    this.columnVisibility = false;
                    this.pendingMessage = response.data.message;
                  }
                }
              })
            }
        },
        mounted: function(){
          this.loading = true;
          this.$http.post(window.apiRoutes.homeRoute).then(response => {
            console.log(response);
            if(response.status == '200'){
              this.databasemessage = `🟢 Database is Live. You can Login. Ping - ${response.data.ping}ms`
            } else {
              this.databasemessage = "🔴 Database Offline / under Maintenance. Please Try Later"
            }
          })
          let url = window.apiRoutes.getPendingUsers
          this.$http.post(url, {
                adminuseremail: this.userData.email,
          }).then(response => {
            if(response){
              if(response.data.auth && response.data.registered){
                this.columnVisibility = true;
                this.pendingUserList = response.data.users;
              } else {
                this.columnVisibility = false;
                this.pendingMessage = response.data.message;
              }
            }
          })
          var user = localStorage.getItem("userdata");
          var token = localStorage.getItem("tokendata");
          if(user && token){
            var userData = JSON.parse(this.$hash.AES.decrypt(user, this.$pass).toString(this.$hash.enc.Utf8));
            if(userData.verified){
              if(userData.admin){
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
          } else {
            this.loading = false;
            this.resultmessage = "Unauthorized";
          }
        }
    }
</script>
