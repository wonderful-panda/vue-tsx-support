// Make enabled to specify HTML attributes to the Vue component
import { AllHTMLAttributes } from "../types/dom";

declare global {
  namespace VueTsxSupport.JSX {
    interface IntrinsicAttributes extends AllHTMLAttributes {}
  }
}
