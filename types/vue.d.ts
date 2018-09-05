/*
 * Extends Vue interface
 */
import { TsxComponentAttrs, OuterProps } from "./base";
import Vue from "vue";
import * as keys from "../lib/keys";
import { RecordPropsDefinition } from "vue/types/options";

declare module "vue/types/vue" {
  export interface Vue {
    __tsxattrs: this extends { _tsxattrs: infer A }
      ? A
      : (TsxComponentAttrs<
          (this extends { [keys._Props]: infer P } ? P : {}) &
            (this extends { [keys._PropsDef]: infer PD }
              ? (PD extends RecordPropsDefinition<any> ? OuterProps<PD> : {})
              : {}),
          this extends { [keys.Events]: infer E } ? E : {},
          this extends { [keys.ScopedSlots]: infer S } ? S : {}
        >);
  }
}
