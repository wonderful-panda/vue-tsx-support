// Add definitions of `router-link` and `router-view`

import { CombinedTsxComponentAttrs } from "../types/base";
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
  namespace VueTsxSupport.JSX {
    interface IntrinsicElements {
      "router-link"?: CombinedTsxComponentAttrs<RouterLinkProps, {}, {}, {}, {}, true>;
      "router-view"?: CombinedTsxComponentAttrs<RouterViewProps, {}, {}, {}, {}, true>;
    }
  }
}
