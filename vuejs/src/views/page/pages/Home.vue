<template>
  <div>
    <TopLinks />
    <div class="columns is-mobile is-centered">
      <div class="field is-grouped-multiline">
        <div class="control">
          <div class="loading">
            <loading :active.sync="loading" :can-cancel="false" :is-full-page="fullPage"></loading>
          </div>
          <div v-if="logged" class="tags-has-addons home">
              <p class="home-welcome"> > Welcome <span class="home-name">{{ user.name }}</span></p>
              <p class="home-welcome"> > Your Scopes/Permissions -  <span class="home-name">{{ user.role }}</span></p>
              <p class="home-email"> > Your email is <span class="home-emails">"{{ user.email }}"</span></p>
              <p class="home-welcome"> > Valid from - <span class="home-emails">"{{ tokendata.issuedate }}"</span></p>
              <p class="home-welcome"> > Valid through - <span class="home-emails">"{{ tokendata.expirydate }}"</span></p>
              <p class="home-key"> > Your API key is <span class="home-apikey">"{{ truncatedApi }}"</span></p>
              <p class="home-alert">You Have been Successfully Logged In !!. Now You Can View Content</p>
              <p class="home-disclaimer">Above Key is Valid for 1 Week, after that You have to Login Another time</p>
          </div>
          <div v-else class="tags-has-addons home">
              <p class="home-welcome"> > Welcome to Glory to Heaven - You Anonymous 😜</p>
              <p class="home-alert">I think You are not Logged in, Login / Register to View Content</p>
          </div>
        </div>
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
          Loading,
        },
        data () {
            return {
                user: {},
                tokendata: {},
                truncatedApi: "",
                logged: false,
                loading: true,
            }
        },
        created() {
          var tokenData = JSON.parse(localStorage.getItem("tokendata"))
          var userData = JSON.parse(localStorage.getItem("userdata"));
          if (userData != null && tokenData != null){
            this.axios.post(window.apiRoutes.verifyRoute, {
              token: tokenData.token
            }).then(response => {
              if(!response.data.auth && !response.data.registered && response.data.tokenuser == null){
                this.loading = false;
                this.$router.push({ name: 'results', params: { data: "I think Your Token Has Expired. Please Login to Regerate Another One", redirectUrl: "/0:login/" } })
              } else {
                var token = JSON.parse(localStorage.getItem('tokendata')).token
                this.user = userData;
                this.tokendata = tokenData;
                this.truncatedApi = token.slice(0,10)+"......."+token.slice(token.length - 6,token.length -1 )
                this.logged = true
                setTimeout(() => {
                  this.loading = false;
                }, 1000)
              }
            })
          } else {
            this.logged = false
            this.loading = false;
          }
        }
    }
</script>
