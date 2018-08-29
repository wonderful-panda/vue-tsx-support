export interface TransitionPropsBase {
  name?: string;
  appear?: boolean;
  css?: boolean;
  type?: string;
  enterClass?: string;
  leaveClass?: string;
  enterActiveClass?: string;
  leaveActiveClass?: string;
  appearClass?: string;
  appearActiveClass?: string;

  onBeforeEnter?: (el: Element) => void;
  onEnter?: (el: Element, done: () => void) => void;
  onAfterEnter?: (el: Element) => void;
  onEnterCancelled?: (el: Element) => void;

  onBeforeLeave?: (el: Element) => void;
  onLeave?: (el: Element, done: () => void) => void;
  onAfterLeave?: (el: Element) => void;
  onLeaveCancelled?: (el: Element) => void;

  onBeforeAppear?: (el: Element) => void;
  onAppear?: (el: Element, done: () => void) => void;
  onAfterAppear?: (el: Element) => void;
  onAppearCancelled?: (el: Element) => void;
}

export interface TransitionProps extends TransitionPropsBase {
  mode?: string;
}

export interface TransitionGroupProps extends TransitionPropsBase {
  tag?: string;
  moveClass?: string;
}

export interface KeepAliveProps {
  include?: string | RegExp | (string | RegExp)[];
  exclude?: string | RegExp | (string | RegExp)[];
}
