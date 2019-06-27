import * as base from "./types/base";
import * as builtin from "./types/builtin-components";

declare global {
  namespace VueTsxSupport.JSX {
    interface Element extends base.Element {}
    interface ElementClass extends base.ElementClass {}
    type LibraryManagedAttributes<C, P> = C extends new () => infer V
      ? (V extends { _tsxattrs: infer A } ? A : base.TsxComponentAttrs) &
          base.ClassComponentProps<C, V> &
          base.ClassComponentScopedSlots<V>
      : P;

    interface IntrinsicElements extends base.IntrinsicElements {
      // allow unknown elements
      [name: string]: any;

      // builtin components
      transition: base.TsxComponentAttrs<builtin.TransitionProps>;
      "transition-group": base.TsxComponentAttrs<builtin.TransitionGroupProps>;
      "keep-alive": base.TsxComponentAttrs<builtin.KeepAliveProps>;
    }
  }
}
