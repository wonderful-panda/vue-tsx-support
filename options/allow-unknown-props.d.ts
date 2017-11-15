// Make enabled to specify unknown attributes(props) to the Vue components

declare namespace VueTsx {
    interface ComponentAdditionalAttrs {
        [name: string]: any;
    }
}
