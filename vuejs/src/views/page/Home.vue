<template>
  <div class="columns is-mobile is-centered">
    <div class="field is-grouped-multiline">
      <div class="control">
        <div v-if="loggedIn" class="tags-has-addons home">
            <p class="home-welcome"> > Welcome <span class="home-name">{{ user.name }}</span></p>
            <p class="home-email"> > Your email is <span class="home-emails">"{{ user.email }}"</span></p>
            <p class="home-key"> > Your API key is <span class="home-apikey">"{{ truncatedApi }}"</span></p>
            <p class="home-alert">You Have been Successfully Logged In !!. Now You Can View Content</p>
            <p class="home-disclaimer">Above Key is Valid for 1 Week, after that You have to Login Another time</p>
            <div class="home-buttons">
              <div class="columns is-mobile is-centered">
                <div class="field is-grouped-multiline">
                  <div class="control">
                    <div class="tags-has-addons">
                      <a href="/0:home/" @click="logout" v-if="loggedIn" title="Logout" class="logout-button">Logout</a>
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
                user: JSON.parse(localStorage.getItem('user')),
                truncatedApi: localStorage.getItem('jwt').slice(0,10)+"......."+localStorage.getItem('jwt').slice(localStorage.getItem('jwt').length - 6,localStorage.getItem('jwt').length -1 )
            }
        },
        methods: {
          logout() {
            let user = localStorage.getItem('user');
            let token = localStorage.getItem('jwt');
            if(user != null && token != null) {
              localStorage.removeItem('user');
              localStorage.removeItem('jwt');
              this.$router.push('/0:home/')
            }
          }
        },
        computed: {
          loggedIn() {
            if (this.user != null){
                console.log(localStorage.getItem('jwt'));
                return true
            } else {
              return false;
            }
          }
        }
    }
</script>
