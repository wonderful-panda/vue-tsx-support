// Make enabled to specify HTML attributes to the Vue component

import { AllHTMLAttributes } from "../types/dom";

declare module "vue-tsx-support/types/base" {
    export interface ComponentAdditionalAttrs extends AllHTMLAttributes {}
}
