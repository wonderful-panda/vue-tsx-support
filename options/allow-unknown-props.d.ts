// Make enabled to specify unknown attributes(props) to the Vue components
import "..";

declare module "vue-tsx-support/types/base" {
  interface ComponentAdditionalAttrs {
    [name: string]: any;
  }
}
