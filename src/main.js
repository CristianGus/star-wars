import { createApp } from "vue";
import App from "./App.vue";
import "./styles/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import store from "./store";

const app = createApp(App);

app.use(store);
app.mount("#app");
