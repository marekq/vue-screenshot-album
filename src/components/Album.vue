<template>
  <div id = "app">
    <h2>viewing {{this.title}} album</h2>
    <div v-for="data in albumLinks" v-bind:key = "data.url">
      <router-link v-bind:to="data.url" replace >
        {{ data.prefix }}
      </router-link>
    </div>
    <br />
    <masonry-wall :items="imgs" :rtl="false" :column-width="250" :padding="5">
      <template #default="{ item }">
        <div>
          <img :title = item.title :src = item.src @click="() => showImg(item.index)">
        </div>
      </template>
    </masonry-wall>
    <vue-easy-lightbox
      scrollDisabled
      moveDisabled
      loop
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
      index: 0,
      view: 'public',
      privatePath: false,
      title: 'public',
      albumLinks: [],
      basePath: ''
    }
  },

  // run before page renders
  async beforeCreate() {

    // get the cognito user name 
    try {

      const authuser = await Auth.currentAuthenticatedUser();
      this.data.authuser = authuser.username;
      console.log('logged in as ' + this.data.authuser);

    } catch (e) {
      console.log('error with Auth.currentAuthenticatedUser() login')

    }

    // set url path, i.e. /album/private/album2
    const path = this.$route.fullPath;
    this.path = path;

    if (path.startsWith('/album/private')) {
      this.privatePath = true;
      this.basePath = '/album/private/';
      this.view = 'private';

    } else {
      this.privatePath = false;
      this.basePath = '/album/public/';
      this.view = 'public';

    }
    
    // set subpath, i.e. album1
    this.subpath = typeof this.$route.params.album !== 'undefined' ?  this.$route.params.album + '/' : '';
    console.log('path ' + path + ', subpath: ' + this.subpath);

    // set album title
    if (this.subpath == '') {
      this.title = this.view;

    } else {
      this.title = this.view + '/' + this.$route.params.album;

    }

    // get the private images stored on S3
    var signedImages = [];

    // list all images in the S3 prefix
    const imgListResp = await Storage.list(this.subpath, { track: true, level: this.view })
      .then((result) => { 
        return result;
        
      })
      .catch( (err) => { 
        console.log(err);
        return [];
      })

    // create signed url index, as the array numbers need to be in a continuos sequence (i.e. 0, 1, 2, 3)
    var signCounter = 0;
    const foundPrefixes = [];

    // add home link
    this.albumLinks.push({ 
      "prefix": "home", 
      "url": "/album/" + this.view 
    });

    // find folder prefixes in image list response
    for (let i = 0; i < imgListResp.length; i++) {
      
      const prefixKey = imgListResp[i].key;
      const prefixName = prefixKey.substring(0, prefixKey.lastIndexOf('/'));

      if (!foundPrefixes.includes(prefixName)) {

        foundPrefixes.push(prefixName);

        this.albumLinks.push({ 
          "prefix" : prefixName, 
          "url" : this.basePath + prefixName + '/'
        });

        console.log('pushed prefix ' + prefixName);

      }
    }

    // shuffle directory results in random order
    var imgList = this.shuffleList(imgListResp);
    
    let listlen;
    if (imgList.length > 25) {
      listlen = 25;

    } else {
      listlen = imgList.length;

    }

    // get url and image key per object
    for (let i = 0; i < listlen; i++) {

      // get image key, url and size
      const imageKey = imgList[i].key;
      const imageUrl = await Storage.get(imageKey, { level: this.view, track: true });
      const imageSize = imgList[i].size;

      // if image size is bigger than zero (not empty or a folder), add to array
      if (imageSize > 0) {
        signedImages[signCounter] = { 'index': signCounter, 'src': imageUrl, 'title': imageKey };

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
    },

    // shuffle the order of the imgList array
    shuffleList(array) {

      var currentIndex = array.length, randomIndex;
      while (currentIndex != 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }

      return array;
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
