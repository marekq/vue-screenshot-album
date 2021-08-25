<template>
  <div id = "app">
    <h2>viewing {{this.view}} album</h2>
    <br />
    <masonry-wall :items="imgs" :rtl="true" :column-width="250" :padding="5">
      <template #default="{ item }">
        <div>
          <img :src = item.src @click="() => showImg(index)">
        </div>
      </template>
    </masonry-wall>
    <vue-easy-lightbox
      scrollDisabled
      moveDisabled
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

    const route =this.$route.fullPath;
    let view;

    if (route == '/album/public') {
      view = 'public';
      console.log('public');

    } else if (route == '/album/private') {
      view = 'private';
      console.log('private');

    }
    return {
      data: {
        authuser: ''
      },
      imgs: [],
      visible: false,
      index: 0,
      view: view
    }
  },
  async beforeCreate() {

    // get the cognito user name 
    try {
      const authuser = await Auth.currentAuthenticatedUser();
      this.data.authuser = authuser.username;
      console.log('logged in as ' + this.data.authuser);

    } catch (e) {
      console.log('error with Auth.currentAuthenticatedUser() login')

    }

    // get the private images stored on S3
    var signedImages = [];

    const imgList = await Storage.list('', { level: this.view })
      .then((result) => { 
        return result;
        
      })
      .catch( (err) => { 
        console.log(err);
        return [];
      })

    // create signed url index, as the array numbers need to be in a continuos sequence (i.e. 0, 1, 2, 3)
    var signCounter = 0;
    
    // get url and image key per object
    for (let i = 0; i < imgList.length; i++) {

      // get image key, url and size
      const imageKey = imgList[i].key;
      const imageUrl = await Storage.get(imageKey, { level: this.view });
      const imageSize = imgList[i].size;

      // if image size is bigger than zero (not empty or a folder), add to array
      if (imageSize > 0) {
        signedImages[signCounter] = { 'src': imageUrl, 'title': imageKey };

        // increment sign counter by 1
        signCounter += 1;
      }
    }

    // store image array to local state dict
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
}
a {
  color: #42b983;
}
img {
  max-width: 100%;
}
</style>
