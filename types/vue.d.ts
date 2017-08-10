///<reference path="base.d.ts" />

/*
 * Extends Vue interface
 */
import Vue from "vue";

declare module "vue/types/vue" {
    export interface Vue {
        _tsxattrs: VueTsx.TsxComponentAttrs;
    }
}

