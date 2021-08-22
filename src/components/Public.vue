<template>
    <div class = "container" v-bind:style = '{textAlign: "center"}'>
        Welcome to the public album
        <br /><br />
        <amplify-s3-album picker = "false" />
    </div>
</template>

<script>
    export default {
        name: 'home'
    }
</script>