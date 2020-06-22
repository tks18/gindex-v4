<template>
    <div class="content registration-page">
      <TopLinks />
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
      </div>
        <h4>Request Access</h4>
        <p style="color: #bac964;">{{ databasemessage }}</p>
        <p style="color: #f6f578;">{{ resultmessage }}</p>
        <form @submit.prevent="handleSubmit">
            <label for="name"> > Your Name</label>
            <div>
                <input id="name" type="text" v-model="name" required autofocus>
            </div>

            <label for="email" > > Your E-Mail Address</label>
            <div>
                <input id="email" type="email" v-model="email" required>
            </div>

            <label for="message"> > Why You Need Access </label>
            <div>
                <textarea id="message" v-model="message" required></textarea>
            </div>
            <label style="color: grey; font-size: 14px"> (How did You Know about this and Why do You need?) </label>
            <div>
              <Checkbox color="#ff9595" id="terms" name="terms" v-model="checked">
                I Accept and Read the <a class="guidelines" href="https://github.com/tks18/gindex-v4/blob/dark-mode-0-1/CODE_OF_CONDUCT.md" target="_blank">Community Guidelines</a>
              </Checkbox>
            </div>
            <div>
                <button class="registration-button" type="submit">
                    Request Access
                </button>
            </div>
        </form>
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
        Loading,
      },
        props : ["nextUrl"],
        data(){
            return {
                name : "",
                email : "",
                message: "",
                resultmessage: "",
                databasemessage: "",
                checked: "",
                loading: true,
                fullpage: true,
            }
        },
        methods : {
            handleSubmit(e) {
              this.loading = true;
                e.preventDefault()
                if(this.checked){
                  let url = window.apiRoutes.requestRoute
                  this.$http.post(url, {
                        name: this.name,
                        email: this.email,
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
              this.loading = false;
              this.databasemessage = `🟢 Database is Live. Ping - ${response.data.ping}ms`
            } else {
              this.loading = false;
              this.databasemessage = "🔴 Database Offline / under Maintenance. Please Try Later"
            }
          })
        }
    }
</script>
