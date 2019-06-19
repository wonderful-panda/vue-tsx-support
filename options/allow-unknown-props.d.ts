// Make enabled to specify unknown attributes(props) to the Vue components
declare namespace VueTsxSupport.JSX {
  interface IntrinsicAttributes {
    [name: string]: any;
  }
}
