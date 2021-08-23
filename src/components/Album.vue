<template>
  <div id = "app">
    <div class = "gallery">
      <div
        v-for="(img, idx) in imgs"
        :key="idx"
        class="pic"
        @click="() => show(idx)"
        v-bind:style = '{width: "400px"}'
      >
        <img :src="img.src ? img.src : img">
      </div>
    </div>

    <vue-easy-lightbox
      :visible="visible"
      :index="index"
      :imgs="imgs"
      loop="true"
      moveDisabled="true"
      @hide="visible = false"
      @on-prev="handlePrev"
      @on-next="handleNext"
    />
  </div>
</template>

<script>
import VueEasyLightbox from 'vue-easy-lightbox';
import { Auth, Storage } from 'aws-amplify';

export default {
  name: 'Album',
  components: {
    VueEasyLightbox
  },
  data () {
    return {
      data: {
        authuser: ''
      },
      imgs: [],
      visible: false,
      index: 0 // default
    }
  },
  async beforeCreate() {

    // get the cognito user name 
    const authuser = await Auth.currentAuthenticatedUser();
    this.data.authuser = authuser.username;

    var signedImages = [];
    const imgList = await Storage.list('', { level: 'private' })
      .then((result) => { 
        console.log(result);
        return result;
        
      })
      .catch( (err) => { 
        console.log(err);
      })

    for (let i = 0; i < imgList.length; i++) {
      const key = imgList[i].key;
      const imageUrl = await Storage.get(key, { level: 'private' });
      signedImages[i] = imageUrl;
    }

    this.imgs = signedImages;
  },
  methods: {
    show(index) {
      this.index = index
      this.visible = true
    },
    handleHide() {
      this.visible = false
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
img {
  width: 50%;
  margin: 1em auto auto auto;
}
</style>
