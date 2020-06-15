<template>
    <div class="content registration-page">
      <div class="top-buttons">
        <button class="registration-top-buttons" type="submit" @click="homeroute">Home</button>
        <button class="registration-top-buttons" type="submit" @click="loginroute">Login</button>
      </div>
      <hr>
        <h4>Register</h4>
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
              <input type="checkbox" id="terms" name="terms" v-model="checked">
              <label for="terms"> I Accept and Read the <a class="guidelines" href="https://github.com/tks18/gindex-v4/blob/dark-mode-0-1/CODE_OF_CONDUCT.md" target="_blank">Community Guidelines</a></label><br>
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
    export default {
        props : ["nextUrl"],
        data(){
            return {
                name : "",
                email : "",
                message: "",
                resultmessage: "",
                databasemessage: "",
                checked: "",
            }
        },
        methods : {
            handleSubmit(e) {
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
                          this.resultmessage = response.data.message
                        } else {
                          this.resultmessage = response.data.message
                        }
                      }
                  })
                  .catch(error => {
                      console.error(error);
                  });
                } else {
                  this.resultmessage = "> You Need to Accept Community Guidelines."
                  this.checked = false;
                }
            },
            homeroute() {
              this.$router.push('/0:home/')
            },
            loginroute() {
              this.$router.push('/0:login/')
            },
        },
        mounted: function(){
          this.$http.post(window.apiRoutes.homeRoute).then(response => {
            console.log(response);
            if(response.status == '200'){
              this.databasemessage = `🟢 Database is Live. Ping - ${response.data.ping}ms`
            } else {
              this.databasemessage = "🔴 Database Offline / under Maintenance. Please Try Later"
            }
          })
        }
    }
</script>
