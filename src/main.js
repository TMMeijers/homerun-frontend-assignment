import Vue from 'vue';
import Vuetify from 'vuetify';

import 'vuetify/dist/vuetify.min.css';
import './style/main-styles.css';

import App from './App';
import store from './store';
import router from './router';
import ExpandDirective from './style';

Vue.use(Vuetify);
Vue.use(ExpandDirective);

const app = new Vue({
    store,
    router,
    template: '<App/>',
    components: { App },
});

app.$mount('#app');
