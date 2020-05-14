import Vue from "vue";
import * as base from "./types/base";
import * as builtin from "./types/builtin-components";

declare global {
  namespace VueTsxSupport.JSX {
    interface Element extends base.Element {}
    interface ElementClass extends base.ElementClass {}
    type LibraryManagedAttributes<C, P> = C extends new () => infer V
      ? base.CombinedTsxComponentAttrs<
          base.AttributesOf<V>,
          base.PropsOf<V>,
          base.PrefixedEventsOf<V>,
          base.OnOf<V>,
          V extends { $scopedSlots: infer X } ? X : {},
          base.IsPropsObjectAllowed<V>
        > &
          (V extends { _tsxattrs: infer T } ? T : {})
      : P;

    interface IntrinsicElements extends base.IntrinsicElements {
      // allow unknown elements
      [name: string]: any;

      // builtin components
      transition: base.CombinedTsxComponentAttrs<builtin.TransitionProps, {}, {}, {}, {}, true>;
      "transition-group": base.CombinedTsxComponentAttrs<
        builtin.TransitionGroupProps,
        {},
        {},
        {},
        {},
        true
      >;
      "keep-alive": base.CombinedTsxComponentAttrs<builtin.KeepAliveProps, {}, {}, {}, {}, true>;
    }
  }
}
