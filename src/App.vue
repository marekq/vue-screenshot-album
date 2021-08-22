<template>
  <div class = 'app'>
    <div width = "100%" class = 'navbar'>
      <router-link tag = "div" to = "/">
        <a>Home</a> 
      </router-link>
      <router-link tag = "p" to = "/public/">
        <a>Public albums</a>
      </router-link>
      <router-link tag = "p" to = "/auth/" v-if = "!signedIn">
        <a>Login</a>
      </router-link>
      <router-link tag = "p" to = "/album/" v-if = "signedIn">
        <a>My albums</a>
      </router-link>
    </div>
    <router-view />
    <br /><br />
    <div class = 'sign-out' sticky = "bottom">
      <amplify-sign-out v-if = "signedIn"></amplify-sign-out>
    </div>
  </div>
</template>

<script>
import { Auth, Hub } from 'aws-amplify';

export default {
  name: 'app',
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
        this.$router.push('/')
        this.signedIn = false
      }
    })
    
    Auth.currentAuthenticatedUser()
      .then(() => {
        this.signedIn = true
      })
      .catch(() => this.signedIn = false)
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
  margin: 1em 3em 3em 3em;
}

div {
  text-align: center;
}

.sign-out {
  width: 160px;
  margin: 0 auto;
}
</style>
