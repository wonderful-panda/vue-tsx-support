///<reference path="../types/base.d.ts" />

// Add definitions of `router-link` and `router-view`

import { Location } from "vue-router";

interface RouterLinkProps {
    to: string | Location;
    tag?: string;
    exact?: boolean;
    append?: boolean;
    replace?: boolean;
    activeClass?: string;
    exactActiveClass?: string;
    event?: string | string[];
}

interface RouterViewProps {
    name?: string;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "router-link"?: VueTsx.TsxComponentAttrs<RouterLinkProps>;
            "router-view"?: VueTsx.TsxComponentAttrs<RouterViewProps>;
        }
    }
}

