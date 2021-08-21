  
import { createApp } from 'vue';
import App from "./App.vue";
import '@aws-amplify/ui-components';
import router from './router';

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import { applyPolyfills, defineCustomElements } from "@aws-amplify/ui-components/loader";
  applyPolyfills().then(() => {
    defineCustomElements(window);
  });

const app = createApp(App);
app.config.compilerOptions.isCustomElement = tag => tag.startsWith('amplify-');
app.use(router).mount('#app');