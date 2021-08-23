<template>
    <div class = "container" v-bind:style = '{textAlign: "center"}'>
        Welcome to the public album
        <br /><br />
        
        <amplify-s3-album picker = "false" />
            <vue-easy-lightbox
                :visible="visible"
                :imgs="imgs"
                @hide="visible = false"
            />
    </div>
</template>

<script>
import VueEasyLightbox from 'vue-easy-lightbox';

export default {
    name: 'home',
    components: {
        VueEasyLightbox
    }
}
</script>