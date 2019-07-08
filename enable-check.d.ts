import Vue from "vue";
import * as base from "./types/base";
import * as builtin from "./types/builtin-components";

declare global {
  namespace VueTsxSupport.JSX {
    interface Element extends base.Element {}
    interface ElementClass extends base.ElementClass {}
    type LibraryManagedAttributes<C, P> = C extends new () => infer V
      ? (V extends { _tsx: infer T }
          ? base.CombinedTsxComponentAttrs<
              T extends { props: infer X } ? X : {},
              T extends { prefixedEvents: infer X } ? X : {},
              T extends { on: infer X } ? X : {},
              T extends { nativeOn: infer X } ? X : {},
              V extends { $scopedSlots: infer X } ? X : {},
              V extends { _tsx_allowPropsObject: true } ? true : false
            >
          : base.CombinedTsxComponentAttrs<{}, {}, {}, {}, {}, true>)
      : P;

    interface IntrinsicElements extends base.IntrinsicElements {
      // allow unknown elements
      [name: string]: any;

      // builtin components
      transition: base.CombinedTsxComponentAttrs<
        builtin.TransitionProps,
        {},
        {},
        {},
        {},
        true
      >;
      "transition-group": base.CombinedTsxComponentAttrs<
        builtin.TransitionGroupProps,
        {},
        {},
        {},
        {},
        true
      >;
      "keep-alive": base.CombinedTsxComponentAttrs<
        builtin.KeepAliveProps,
        {},
        {},
        {},
        {},
        true
      >;
    }
  }
}
