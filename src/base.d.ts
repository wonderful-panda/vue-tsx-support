import Vue from "vue";

declare global {
    namespace JSX {
        interface Element extends Vue.VNode {
        }

        interface ElementClass extends Vue {
        }

        interface ElementAttributesProperty {
            _tsxattrs: any;
        }
    }
    namespace VueTsxSupport {
        export interface AddtionalAttrs {
        }
    }
}
