import Vue, { createApp, inject } from 'vue';
import store from './store'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import lazyPlugin from 'vue3-lazy'
import Vue3TouchEvents from "vue3-touch-events";
import VueSimpleAlert from "vue3-simple-alert";

export const VueMeta = Symbol();

export function useToasted() {
  const VueMeta = inject(VueMeta);
  if (!VueMeta) throw new Error('No VueToasted provided!!!');

  return VueMeta;
}
  
createApp(App)
    .use(VueMeta)
    .use(router)
    .use(store)
    .use(Vue3TouchEvents)
    .use(VueSimpleAlert)
    .use(lazyPlugin, {
      loading: 'loading.png',
      error: 'error.png'
    })
    .mount('#app')
