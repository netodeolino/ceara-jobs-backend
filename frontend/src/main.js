import Vue from "vue";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import Vuelidate from "vuelidate";
import VueSelect from "vue-select";
import VueMoment from "vue-moment";
import moment from "moment-timezone";
import Argon from "./plugins/argon-kit";
import Notifications from "vue-notification";

axios.defaults.headers.post["Content-Type"] = "application/json";
Vue.component("v-select", VueSelect);
Vue.config.productionTip = false;
Vue.use(VueMoment, { moment });
Vue.use(Notifications);
Vue.use(Vuelidate);
Vue.use(Argon);

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
