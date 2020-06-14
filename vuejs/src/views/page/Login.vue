<template>
    <div class="content login-page">
      <p style="color: #bac964">{{ databasemessage }}</p>
      <p style="color: #f6f578">{{ resultmessage }}</p>
        <h4>Login</h4>
        <form @submit.prevent="handleSubmit">
            <label for="email" > > Your E-Mail Address</label>
            <div>
                <input id="email" type="email" v-model="email" required autofocus>
            </div>
            <div>
                <label for="password" > > Your Password</label>
                <div>
                    <input id="password" type="password" v-model="password" required>
                </div>
            </div>
            <div>
                <button class="login-button" type="submit" >
                    Login
                </button>
            </div>
            <a class="login-register" href="/0:register/">No Account ? Click Here to Register</a>
        </form>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                email : "",
                password : "",
                resultmessage: "",
                databasemessage: "",
            }
        },
        methods : {
            handleSubmit(e){
                e.preventDefault();
                if (this.password.length > 0) {
                    this.$http.post(window.apiRoutes.loginRoute, {
                        email: this.email,
                        password: this.password
                    })
                    .then(response => {
                      console.log(response);
                      if(response.data.auth && response.data.registered){
                          this.resultmessage = "> Logged in Successfully. You will be Redirected now.";
                          setTimeout(() => {
                            this.$router.push('/0:register/')
                          }, 2000)
                      } else {
                          this.resultmessage = "> "+response.data.message;
                      }
                    });
                }
            }
        },
        mounted: function() {
            this.$http.post(window.apiRoutes.homeRoute).then(response => {
              console.log(response);
              if(response.status == '200'){
                this.databasemessage = `🟢 Database is Live. You can Login. Ping - ${response.data.ping}ms`
              } else {
                this.databasemessage = "🔴 Database Offline / under Maintenance. Please Try Later"
              }
            })
        }
    }
</script>
