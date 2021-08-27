  
import { createApp } from 'vue';
import App from "./App.vue";
import '@aws-amplify/ui-components';
import router from './router';

import Amplify, { Analytics } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

// Amplify Pinpoint Analytics - session tracking
Analytics.autoTrack('session', {
  enable: true,
  events: ['click']
});

// Amplify Pinpoint Analytics - pageView tracking
Analytics.autoTrack('pageView', {
  enable: true,
  eventName: 'pageView',
  type: 'SPA',
  provider: 'AWSPinpoint',
  getUrl: () => {
      return window.location.origin + window.location.pathname;
  }
});

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import { applyPolyfills, defineCustomElements } from "@aws-amplify/ui-components/loader";
  applyPolyfills().then(() => {
    defineCustomElements(window);
  });

const app = createApp(App);
app.config.compilerOptions.isCustomElement = tag => tag.startsWith('amplify-');
app.use(router).mount('#app');