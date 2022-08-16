<template>
  <div class = 'app'>
    <div v-bind:style = '{textAlign: "center"}' class = 'navbar'>
      <router-link to = "/">
        <a>Home</a>
      </router-link>
      <router-link to = "/album/public">
        <a>Public albums</a>
      </router-link>
      <router-link to = "/album/private" v-if = "signedIn">
        <a>My albums</a>
      </router-link>
      <router-link to = "/auth/" v-if = "!signedIn">
        <a>Login</a>
      </router-link>
    </div>
    <router-view :key="$route.fullPath" />
    <br /><br />
    <div class = 'sign-out' sticky = "bottom">
      <amplify-sign-out v-if = "signedIn"></amplify-sign-out>
      <br /><br />
    </div>
  </div>
</template>

<script>
import { Auth, Hub } from 'aws-amplify';

export default {
  name: 'app',
  metaInfo: {
    title: 'ColdStart',
    meta: [
      { charset: 'utf-8' },
      { name: 'description', content: 'ColdStart' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  },
  data() {
    return {
      signedIn: false
    }
  },

  beforeCreate() {
    Hub.listen('auth', data => {
      const { payload } = data
      if (payload.event === 'signIn') {
        this.signedIn = true
        this.$router.push('/album')
      }
      if (payload.event === 'signOut') {
        this.signedIn = false
        this.$router.push('/')
      }
    })
    
    Auth.currentAuthenticatedUser()
      .then(() => {
        this.signedIn = true
        console.log('signin true')
      })
      .catch(() => {
        this.signedIn = false
        console.log('signin false')
      })
  }
}
</script>

<style scoped>
table, th, td {
  padding: 10px 10px 10px 10px;
}
.navbar {
  font-size: 18px;
  text-align: center;
  margin: 1em auto;
  width: 375px;
}

div {
  text-align: center;
}

.sign-out {
  width: 160px;
  margin: 0 auto;
}
</style>
