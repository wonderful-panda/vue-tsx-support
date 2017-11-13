// Make enabled to specify unknown attributes(props) to the Vue components

declare module "vue-tsx-support/options/allow-unknown-props" {
    module "vue-tsx-support/types/base" {
        interface ComponentAdditionalAttrs {
            [name: string]: any;
        }
    }
}
