// Make enabled to specify HTML attributes to the Vue component

import { AllHTMLAttributes } from "../types/dom";

// prettier-ignore
declare global {
    namespace VueTsx {
        interface ComponentAdditionalAttrs extends AllHTMLAttributes {}
    }
}
