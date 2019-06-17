// Make enabled to specify HTML attributes to the Vue component
import "..";
import { AllHTMLAttributes } from "../types/dom";

declare module "vue-tsx-support/types/base" {
  interface ComponentAdditionalAttrs extends AllHTMLAttributes {}
}
