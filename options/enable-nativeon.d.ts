///<reference path="../types/base.d.ts" />

// Make enabled to specify native event listeners to the Vue component

declare namespace VueTsx {
    interface ComponentAdditionalAttrs extends VueTsx.EventHandlers<VueTsxDOM.EventsNativeOn> {
    }
}
