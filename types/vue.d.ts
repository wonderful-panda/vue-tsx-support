/*
 * Extends Vue interface
 */
import { TsxComponentAttrs, OuterProps } from "./base";
import Vue from "vue";
import { RecordPropsDefinition } from "vue/types/options";

declare module "vue/types/vue" {
  export interface Vue {
    __tsxattrs: this extends { _tsxattrs: infer A }
      ? A
      : (TsxComponentAttrs<
          (this extends { __props__: infer P } ? P : {}) &
            (this extends { __propsDef__: infer PD }
              ? (PD extends RecordPropsDefinition<any> ? OuterProps<PD> : {})
              : {}),
          this extends { __events: infer E } ? E : {},
          this extends { __scopedSlots: infer S } ? S : {}
        >);
  }
}
