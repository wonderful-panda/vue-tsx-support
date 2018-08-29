// Add definitions of `router-link` and `router-view`

import { TsxComponentAttrs } from "../types/base";
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
      "router-link"?: TsxComponentAttrs<RouterLinkProps>;
      "router-view"?: TsxComponentAttrs<RouterViewProps>;
    }
  }
}
