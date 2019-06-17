// Make enabled to specify unknown attributes to the intrinsic elements
import "..";

declare module "vue-tsx-support/types/base" {
  interface ElementAdditionalAttrs {
    [name: string]: any;
  }
}
