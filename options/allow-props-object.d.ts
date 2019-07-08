import Vue from "vue";

declare module "vue/types/vue" {
  interface Vue {
    _tsx_allowPropsObject: true;
  }
}
