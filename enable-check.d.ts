import * as base from "./types/base";
import * as builtin from "./types/builtin-components";
import "./types/vue";

declare global {
    namespace JSX {
        interface Element extends base.Element {}
        interface ElementClass extends base.ElementClass {}
        interface ElementAttributesProperty extends base.ElementAttributesProperty {}

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
