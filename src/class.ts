import Vue, { VueConstructor } from "vue";
import Component_ from "vue-class-component";
import * as keys from "./keys";
import { AllEventHandlers, StringKeyOf, TypedScopedSlot } from "../types/base";
import { RecordPropsDefinition, ComponentOptions } from "vue/types/options";

export const plugin = {
  install(vue: typeof Vue) {
    const strategies = vue.config.optionMergeStrategies;
    strategies.$$events = strategies.methods;
  }
};

export const Keys = {
  Events: keys.Events as typeof keys.Events,
  ScopedSlots: keys.ScopedSlots as typeof keys.ScopedSlots
};

export interface ComponentExtension {
  $$emit: this extends { [keys.Events]: infer E } ? AllEventHandlers<E> : never;
  $scopedSlots: this extends { [keys.ScopedSlots]: infer S }
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
  InstanceType<VC> & ComponentExtension & P & { [keys._PropsDef]: PD }
> {
  return (Super || Vue).extend({ props }) as any;
}

export const ComponentBase = Vue as VueConstructor<Vue & ComponentExtension>;

export interface ComponentDecorator {
  <VC extends typeof Vue>(target: VC): VC;
  <V extends Vue>(options: ComponentOptions<V> & ThisType<V>): (<
    VC extends typeof Vue
  >(
    target: VC
  ) => VC);
}

function $$emit(this: Vue) {
  const ret = {} as { [key: string]: Function };
  const events = (this.$options as any).$$events;
  if (events) {
    Object.keys(events).forEach(handlerName => {
      // onEventName -> eventName
      const eventName = handlerName.replace(/^on[A-Z]?/, s =>
        s.slice(2).toLowerCase()
      );
      ret[handlerName] = (...args: any[]) => this.$emit(eventName, ...args);
    });
  }
  return Object.freeze(ret);
}

function componentFactory(
  options: ComponentOptions<Vue> & { [key: string]: any },
  target: typeof Vue
): typeof Vue {
  const $$events = target.prototype[keys.Events];
  if ($$events) {
    delete target.prototype[keys.Events];
    options = { ...options, $$events };
    options.computed = {
      ...options.computed,
      $$emit
    };
  }
  if (target.prototype[keys.ScopedSlots]) {
    delete target.prototype[keys.ScopedSlots];
  }
  return Component_(options)(target);
}

export const Component = ((options: typeof Vue | ComponentOptions<Vue>) => {
  if (typeof options === "function") {
    return componentFactory({}, options);
  } else {
    return (target: typeof Vue) => componentFactory(options, target);
  }
}) as ComponentDecorator;
