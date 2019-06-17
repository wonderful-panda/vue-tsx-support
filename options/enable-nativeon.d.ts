// Make enabled to specify native event listeners to the Vue component
import "..";
import { EventsNativeOn } from "../types/dom";
import { EventHandlers } from "../types/base";

declare module "vue-tsx-support/types/base" {
  interface ComponentAdditionalAttrs extends EventHandlers<EventsNativeOn> {}
}
