/*
 * Extends Vue interface
 */
import { TsxComponentAttrs } from "./base";
import Vue from "vue";

declare module "vue/types/vue" {
  export interface Vue {
    _tsxattrs: TsxComponentAttrs;
  }
}
