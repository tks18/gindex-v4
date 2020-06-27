<template>
    <div class="content">
      <p style="color: #f6f578">{{ resultmessage }}</p>
      <div class="loading">
        <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullpage"></loading>
      </div>
      <div class="columns is-multiline is-desktop has-text-centered is-centered is-vcentered">
        <div class="column is-full">
          <h2 class="title has-text-weight-bold has-text-white">Change Your Password</h2>
          <p class="subtitle has-text-danger-dark"> Enter Your Old Password and Change </p>
        </div>
        <div class="column is-half">
          <form @submit.prevent="handleSubmit">
            <div class="field">
              <p class="control has-icons-left">
                <input class="input is-rounded" id="oldpassword" type="password" placeholder="Your Old Password" v-model="oldpassword" required>
                <span class="icon is-small is-left">
                  <i class="fas fa-lock"></i>
                </span>
              </p>
            </div>
            <div class="field">
              <p class="control has-icons-left">
                <input class="input is-rounded" id="newpassword" type="password" placeholder="New Password" v-model="newpassword" required>
                <span class="icon is-small is-left">
                  <i class="fas fa-lock"></i>
                </span>
              </p>
            </div>
            <div class="field">
              <p class="control has-icons-left">
                <input class="input is-rounded" id="confirm-password" type="password" placeholder="Confirm Password" v-model="confirmpassword" required>
                <span class="icon is-small is-left">
                  <i class="fas fa-lock"></i>
                </span>
              </p>
            </div>
            <button :class=" loading ? 'button is-rounded is-loading is-danger is-medium' : 'button is-rounded is-medium is-danger'" :disabled="disabled">
              <span class="icon is-medium">
                <i class="fas fa-shipping-fast"></i>
              </span>
              <span>Change</span>
            </button>
          </form>
        </div>
      </div>
    </div>
</template>
<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
    export default {
      components: {
        Loading,
      },
        data(){
            return {
                userinfo: JSON.parse(this.$hash.AES.decrypt(localStorage.getItem("userdata"), this.$pass).toString(this.$hash.enc.Utf8)),
                oldpassword: "",
                newpassword : "",
                confirmpassword: "",
                disabled: true,
                resultmessage: "",
                databasemessage: "",
                loading: false,
                fullpage: true,
            }
        },
        methods : {
            handleSubmit(e){
                this.loading = true;
                e.preventDefault();
                if (this.confirmpassword === this.newpassword && this.newpassword.length > 0) {
                    this.$http.post(window.apiRoutes.changePasswordRoute, {
                        email: this.userinfo.email,
                        oldpassword: this.oldpassword,
                        newpassword: this.newpassword,
                    })
                    .then(response => {
                      console.log(response);
                      var userData = localStorage.getItem('userdata');
                      var tokenData = localStorage.getItem('tokendata');
                      if(response.data.auth && response.data.registered && response.data.changed){
                          if (userData != null && tokenData != null) {
                            localStorage.removeItem("tokendata");
                            localStorage.removeItem("userdata");
                            this.loading = false;
                            this.$router.push({ name: 'results', params: { id: 0, cmd: "result", success: true, redirectUrl: '/0:login/', data: `response.data.message. You have to Relogin with new Password` } })
                            }
                          } else {
                            this.loading = false;
                          this.resultmessage = "> "+response.data.message;
                      }
                    });
                } else {
                  this.loading = false;
                  this.resultmessage = "Passwords Do Not Match"
                  this.newpassword = "";
                  this.confirmpassword = "";
                }
            },
        },
        watch: {
          confirmpassword: function() {
            if(this.confirmpassword === this.newpassword && this.newpassword.length > 0){
              this.disabled = false;
            } else {
              this.disabled = true;
            }
          }
        }
    }
</script>
