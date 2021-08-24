<template>
  <div id = "app">
    <masonry-wall :items="imgs" :rtl="true" :column-width="300" :padding="10">
      <template #default="{ item }">
        <div>
          <h1><img :src = item.src @click="() => showImg(index)"></h1>
          <span>{{item.title}}</span>
        </div>
      </template>
    </masonry-wall>
    <vue-easy-lightbox
      :visible="visible"
      :index="index"
      :imgs="imgs"
      @hide="handleHide"
    /> 
  </div>
</template>

<script>
import VueEasyLightbox from 'vue-easy-lightbox';
import { Auth, Storage } from 'aws-amplify';
import MasonryWall from '@yeger/vue-masonry-wall';

export default {
  name: 'Album',
  components: {
    MasonryWall,
    VueEasyLightbox
  },
  data () {
    return {
      data: {
        authuser: ''
      },
      imgs: [],
      visible: false,
      index: 0
    }
  },
  async beforeCreate() {

    // get the cognito user name 
    const authuser = await Auth.currentAuthenticatedUser();
    this.data.authuser = authuser.username;

    // get the private images stored on S3
    var signedImages = [];
    const imgList = await Storage.list('', { level: 'private' })
      .then((result) => { 
        console.log(result);
        return result;
        
      })
      .catch( (err) => { 
        console.log(err);
      })

    // get url and image key per object
    for (let i = 0; i < imgList.length; i++) {
      const key = imgList[i].key;
      const imageUrl = await Storage.get(key, { level: 'private' });
      const imageKey = imgList[i].key;
      signedImages[i] = {'src': imageUrl, 'title': imageKey};
    }

    // store images to dict
    this.imgs = signedImages;
  },

  methods: {

    // show image method
    showImg(index) {
      this.index = index
      this.visible = true
    },

    // hide detail panel method
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
  max-width: 100%;
}
</style>
