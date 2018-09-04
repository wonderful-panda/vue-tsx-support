/*
 * Extends Vue interface
 */
import { TsxComponentAttrs } from "./base";
import Vue from "vue";
import * as keys from "../lib/keys";

declare module "vue/types/vue" {
  export interface Vue {
    __tsxattrs: this extends { _tsxattrs: infer A }
      ? A
      : (TsxComponentAttrs<
          this extends { [keys._Props]: infer P } ? P : {},
          this extends { [keys.Events]: infer E } ? E : {},
          this extends { [keys.ScopedSlots]: infer S } ? S : {}
        >);
  }
}
