import * as vuetsx from "vue-tsx-support";
import Vue from "vue";

interface Props {
  text: string;
}

const MyComponent = vuetsx.createComponent<Props>({});
Vue.component("my-component", MyComponent);
