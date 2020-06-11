<template>
    <div v-if="loggedIn" class="hello">
        <h1>Welcome {{ user.name }}</h1>
        <h2>Your email is {{ user.email }}</h2>
        <h2>Your key is {{ truncatedApi }}</h2>
        <h2>Above Key is Valid for 1 Day, after that You have to Login Another time</h2>
    </div>
    <div v-else class="hello">
        <h1>This is homepage</h1>
        <h2></h2>
        <h2>Not Present</h2>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                msg: 'Hello World!',
                user: JSON.parse(localStorage.getItem('user')),
                truncatedApi: localStorage.getItem('jwt').slice(10,20) + "............" + localStorage.getItem('jwt').slice(20,25)
            }
        },
        computed: {
          loggedIn() {
            if (this.user != null){
                return true
            } else {
              return false;
            }
          }
        }
    }
</script>
