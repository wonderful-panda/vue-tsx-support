// Make enabled to specify native event listeners to the Vue component
import { EventsNativeOn, Events } from "../types/dom";
import { EventHandlers } from "../types/base";
import { VNodeData } from "vue";

declare global {
  namespace VueTsxSupport.JSX {
    interface IntrinsicAttributes extends EventHandlers<EventsNativeOn> {
      nativeOn?: EventHandlers<Events> & VNodeData["nativeOn"];
    }
  }
}
