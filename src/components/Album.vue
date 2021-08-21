<template>
  <div>
    <div v-if="authState !== 'signedin'">
      Sign in to see all albums
    </div>
    <div v-if="authState === 'signedin' && user">
      <div>
        Hello, {{user.username}}
        <amplify-s3-album />
      </div>
    </div>
    <amplify-authenticator username-alias = "username" />        
    <div width = "120px">
      <amplify-sign-out v-if="authState === 'signedin'"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Album',
  data() {
    return {
      registerFields: [
        {
          type: "username",
          placeholder: " ",
          label: "Username",
          required: true
        },
        {
          type: "email",
          placeholder: " ",
          label: "E-mail",
          required: true
        },
        {
          type: "password",
          placeholder: " ",
          label: "Password",
          required: true
        }
      ],
      loginFields: [
        {
          type: "username",
          placeholder: " ",
          label: "Username",
          required: true
        },
        {
          type: "password",
          placeholder: " ",
          label: "Password",
          required: true
        }
      ]
    }
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
