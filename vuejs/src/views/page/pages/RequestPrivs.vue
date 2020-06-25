<template>
    <div class="content registration-page">
      <TopLinks />
        <h4>Request Access</h4>
        <div class="loading">
          <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
        </div>
        <p style="color: #f6f578;">{{ resultmessage }}</p>
        <form @submit.prevent="handleSubmit">
          <div class="control mb-3">
              <input class="is-checkradio is-small is-warning" id="adminradio" type="radio" name="role" value="admin" disabled v-model="role">
              <label for="adminradio"> Admin</label>
              <input class="is-checkradio is-small is-warning" id="superadminradio" type="radio" name="role" value="superadmin" disabled v-model="role">
              <label for="superadminradio">Superadmin</label>
          </div>
            <label for="message"> > Why You Need Admin Previlage ? </label>
            <div>
                <textarea id="message" v-model="message" required></textarea>
            </div>
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
        Loading
      },
        props : ["nextUrl"],
        data(){
            return {
                userinfo: {},
                resultmessage: "",
                checked: "",
                role: "",
                apiurl: "",
                loading: true,
                fullpage: true,
                message: "",
            }
        },
        methods : {
            handleSubmit(e) {
              this.loading = true;
                e.preventDefault()
                if(this.checked){
                  this.$http.post(this.apiurl, {
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
          var token = localStorage.getItem("tokendata");
          var user = localStorage.getItem("userdata");
          if (user != null && token != null){
            var userData = JSON.parse(this.$hash.AES.decrypt(user, this.$pass).toString(this.$hash.enc.Utf8));
            if(!userData.admin && !userData.superadmin){
              this.loading = false;
              this.role = "admin";
              this.apiurl = window.apiRoutes.requestadminroute;
              console.log(this.apiurl)
              this.userinfo = userData;
            } else if(userData.admin && !userData.superadmin) {
              this.loading = false;
              this.role = "superadmin"
              this.apiurl = window.apiRoutes.requestsuperadminroute;
              console.log(this.apiurl)
              this.userinfo = userData;
            } else {
              this.loading = false;
              this.resultmessage = "You are Already a Superadmin. You will be Redirected Now"
              this.role = "superadmin"
              setTimeout(() => {
                  this.$router.push({ name: 'results', params: { id: 0, cmd: "result", success: false, data: "You are Already a Admin or SuperAdmin", redirectUrl: "/0:home/" } })
              }, 1000)
            }
          } else {
            this.loading = false;
            this.logged = false
          }
        }
    }
</script>
