<template>
  <div>
    Welcome to your private album, {{this.data.authuser}}
    <br /><br />
    <amplify-s3-album 
      picker = "true"
      level = "private"
    />
  </div>
</template>

<script>
import { Auth } from 'aws-amplify';

export default {
  name: 'Album',
  data () {
    return {
      data: {
        authuser: ''
      }
    }
  },
  async beforeCreate() {

      // get the cognito user name 
      const authuser = await Auth.currentAuthenticatedUser();
      this.data.authuser = authuser.username;
      console.log(authuser.username)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
