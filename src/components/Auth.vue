<template>
  <div class = "auth">
    <amplify-authenticator>
      <amplify-sign-in
        username-alias = "username" 
        :form-fields.prop = "loginFields" 
      />
      <amplify-sign-up
        username-alias = "username" 
        :form-fields.prop = "registerFields" 
      />
    </amplify-authenticator>  
  </div>
</template>

<script>
  export default {
    name: 'auth-page',
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
    },
  }
</script>

<style>
  .auth {
    margin: 0 auto;
    width: 460px;
  }

  amplify-sign-in {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 4;
    height: 100vh;
    color: purple;
  }
</style>