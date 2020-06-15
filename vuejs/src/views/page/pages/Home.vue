<template>
  <div class="columns is-mobile is-centered">
    <div class="field is-grouped-multiline">
      <div class="control">
        <div v-if="logged" class="tags-has-addons home">
            <p class="home-welcome"> > Welcome <span class="home-name">{{ user.name }}</span></p>
            <p class="home-welcome"> > Your Scopes/Permissions -  <span class="home-name">{{ user.role }}</span></p>
            <p class="home-email"> > Your email is <span class="home-emails">"{{ user.email }}"</span></p>
            <p class="home-welcome"> > Valid from - <span class="home-emails">"{{ tokendata.issuedate }}"</span></p>
            <p class="home-welcome"> > Valid through - <span class="home-emails">"{{ tokendata.expirydate }}"</span></p>
            <p class="home-key"> > Your API key is <span class="home-apikey">"{{ truncatedApi }}"</span></p>
            <p class="home-alert">You Have been Successfully Logged In !!. Now You Can View Content</p>
            <p class="home-disclaimer">Above Key is Valid for 1 Week, after that You have to Login Another time</p>
            <div class="home-buttons">
              <div class="columns is-mobile is-centered">
                <div class="field is-grouped-multiline">
                  <div class="control">
                    <div class="tags-has-addons">
                      <a href="/0:home/" @click="logout" v-if="logged" title="Logout" class="logout-button">Logout</a>
                      <a href="/0:/" title="Go to Content" class="content-button">View Content</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div v-else class="tags-has-addons home">
            <p class="home-welcome"> > Welcome to Glory to Heaven - You Anonymous 😜</p>
            <p class="home-alert">I think You are not Logged in, Login / Register to View Content</p>
            <div class="home-buttons">
              <div class="columns is-mobile is-centered">
                <div class="field is-grouped-multiline">
                  <div class="control">
                    <div class="tags-has-addons">
                      <a href="/0:login/" title="Login" class="login-button">Log In</a>
                      <a href="/0:register/" title="Register" class="registration-button">Register</a>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        data () {
            return {
                user: JSON.parse(localStorage.getItem("userdata")),
                tokendata: JSON.parse(localStorage.getItem("tokendata")),
                truncatedApi: "",
                logged: false,
            }
        },
        methods: {
          logout() {
            window.alert("Currently Not Supported. Sorry for Inconvenience")
            }
        },
        created() {
          var token = JSON.parse(localStorage.getItem('tokendata')).token
          this.truncatedApi = token.slice(0,10)+"......."+token.slice(token.length - 6,token.length -1 )
          if (this.user != null && this.tokendata != null){
            this.axios.post(window.apiRoutes.verifyRoute, {
              token: this.tokendata.token
            }).then(response => {
              if(!response.data.auth && !response.data.registered && response.data.tokenuser == null){
                this.$router.push({ name: 'results', params: { data: "I think Your Token Has Expired. Please Login to Regerate Another One", redirectUrl: "/0:login/" } })
              } else {
                this.logged = true
              }
            })
          } else {
            this.logged = false
          }
        }
    }
</script>
