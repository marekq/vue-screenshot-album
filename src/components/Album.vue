<template>
  <div>
    <div v-if="authState !== 'signedin'">Sign in to see all albums</div>
    <amplify-authenticator>
      <div v-if="authState === 'signedin' && user">
        <div>Hello, {{user.username}}</div>
          <amplify-s3-album />
      </div>
      <amplify-sign-out></amplify-sign-out>
    </amplify-authenticator>
  </div>
</template>

<script>
export default {
  name: 'Album'
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
