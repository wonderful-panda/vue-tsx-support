// Make enabled to specify unknown attributes to the intrinsic elements

declare module "vue-tsx-support/options/allow-element-unknown-attrs" {
    module "vue-tsx-support/types/base" {
        interface ElementAdditionalAttrs {
            [name: string]: any;
        }
    }
}
