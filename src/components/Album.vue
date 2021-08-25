<template>
  <div id = "app">
    <h2>viewing {{this.view}} album</h2>
    <br />
    <masonry-wall :items="imgs" :rtl="true" :column-width="300" :padding="5">
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

    const route = this.$route.params;
    console.log(route);

    // get the cognito user name 
    try {
      const authuser = await Auth.currentAuthenticatedUser();
      this.data.authuser = authuser.username;
      console.log('logged in as ' + this.data.authuser);

    } catch (e) {
      console.log('error login')
    }

    // get the private images stored on S3
    var signedImages = [];

    const imgList = await Storage.list('', { level: this.view })
      .then((result) => { 
        console.log(result);
        return result;
        
      })
      .catch( (err) => { 
        console.log(err);
        return [];
      })

    // get url and image key per object
    for (let i = 0; i < imgList.length; i++) {
      const key = imgList[i].key;
      const imageUrl = await Storage.get(key, { level: this.view });
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
