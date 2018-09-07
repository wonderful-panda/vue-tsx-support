import Vue, { VueConstructor } from "vue";
import * as keys from "./keys";
import { AllEventHandlers, StringKeyOf, TypedScopedSlot } from "../types/base";
import { RecordPropsDefinition } from "vue/types/options";

export const Keys = {
  Events: keys.Events as typeof keys.Events,
  ScopedSlots: keys.ScopedSlots as typeof keys.ScopedSlots
};

if (typeof (window as any)["Proxy"] !== "function") {
  console.warn("[vue-tsx-support] $$emit does not work without ES6 Proxy");
}

function $$emit(this: Vue) {
  const proxy = new Proxy(new Object(null) as any, {
    get: (target, name) => {
      if (typeof name === "string" && name.startsWith("on")) {
        let emitter = target[name];
        if (!emitter) {
          // onEventName -> eventName
          const eventName = name.replace(/^on[A-Z]/, s =>
            s.slice(2).toLowerCase()
          );
          target[name] = emitter = (...args: any[]) => {
            this.$emit(eventName, ...args);
          };
        }
        return emitter;
      }
      return target[name];
    }
  });
  return proxy;
}

export interface ComponentExtension {
  $$emit: this extends { __events: infer E } ? AllEventHandlers<E> : never;
  $scopedSlots: this extends { __scopedSlots: infer S }
    ? {
        [K in StringKeyOf<S>]: TypedScopedSlot<
          S[K] extends (props: infer P) => any ? P : S[K]
        >
      }
    : {};
}

export function WithProps<
  P,
  PD extends RecordPropsDefinition<P>,
  VC extends typeof Vue
>(
  props: PD & RecordPropsDefinition<P>,
  Super?: VC
): VueConstructor<
  InstanceType<VC> & ComponentExtension & P & { __propsDef__: PD }
> {
  return (Super || Vue).extend({ props, computed: { $$emit } }) as any;
}

export function Extend<VC extends typeof Vue>(
  Super: VC
): VueConstructor<InstanceType<VC> & ComponentExtension> {
  return Super.extend({
    computed: { $$emit }
  }) as any;
}

export const ExVue = Extend(Vue);
