// Make enabled to specify native event listeners to the Vue component
import { EventsNativeOn } from "../types/dom";
import { EventHandlers } from "../types/base";

declare global {
  namespace VueTsxSupport.JSX {
    interface IntrinsicAttributes extends EventHandlers<EventsNativeOn> {}
  }
}
