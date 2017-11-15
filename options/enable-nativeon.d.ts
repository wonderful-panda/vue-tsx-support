// Make enabled to specify native event listeners to the Vue component

import { EventsNativeOn } from "../types/dom";
import { EventHandlers } from "../types/base";

// prettier-ignore
declare global {
    namespace VueTsx {
        interface ComponentAdditionalAttrs extends EventHandlers<EventsNativeOn> {}
    }
}
