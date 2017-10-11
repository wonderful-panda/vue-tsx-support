import "./types/base";
import "./types/builtin-components";
import "./types/vue";

declare global {
    namespace JSX {
        interface Element extends VueTsx.Element {}
        interface ElementClass extends VueTsx.ElementClass {}
        interface ElementAttributesProperty extends VueTsx.ElementAttributesProperty {}

        interface IntrinsicElements extends VueTsx.IntrinsicElements {
            // allow unknown elements
            [name: string]: any;

            // builtin components
            transition: VueTsx.TsxComponentAttrs<VueTsxBuiltin.TransitionProps>;
            "transition-group": VueTsx.TsxComponentAttrs<VueTsxBuiltin.TransitionGroupProps>;
            "keep-alive": VueTsx.TsxComponentAttrs<VueTsxBuiltin.KeepAliveProps>;
        }
    }
}
