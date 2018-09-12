import Vue, { VueConstructor } from "vue";
import * as keys from "./keys";
import { AllEventHandlers, StringKeyOf, TypedScopedSlot } from "../types/base";
import { RecordPropsDefinition, ComponentOptions } from "vue/types/options";
import ComponentDecorator from "vue-class-component";

export const Keys = {
  PropsDef: keys.PropsDef as typeof keys.PropsDef,
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

export interface ComponentExtension extends Vue {
  $$emit: this extends { __events: infer E } ? AllEventHandlers<E> : never;
  $scopedSlots: this extends { __scopedSlots: infer S }
    ? {
        [K in StringKeyOf<S>]: TypedScopedSlot<
          S[K] extends (props: infer P) => any ? P : S[K]
        >
      }
    : {};
  $props: this extends { __propsDef: infer PD }
    ? PD extends RecordPropsDefinition<infer P> ? P : {}
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
  (typeof Vue extends VC ? {} : InstanceType<VC>) &
    ComponentExtension &
    P & { __propsDef: PD }
> {
  return (Super || Vue).extend({ props, computed: { $$emit } }) as any;
}

export function Extend<VC extends typeof Vue>(
  Super: VC
): VueConstructor<
  (typeof Vue extends VC ? {} : InstanceType<VC>) & ComponentExtension
> {
  return Super.extend({
    computed: { $$emit }
  }) as any;
}

export const ExVue = Extend(Vue);

export interface Decorator {
  <VC extends typeof Vue>(Ctor: VC): VC;
  <V extends Vue>(options: ComponentOptions<V> & ThisType<V>): <
    VC extends typeof Vue
  >(
    Ctor: VC
  ) => VC;
}

function componentFactory(options: ComponentOptions<Vue>, Ctor: typeof Vue) {
  const props = Ctor.prototype[keys.PropsDef];
  if (props) {
    return ComponentDecorator({
      ...options,
      props: { ...options.props, ...props }
    })(Ctor);
  } else {
    return ComponentDecorator(options)(Ctor);
  }
}

export const Component = ((options: ComponentOptions<Vue> | typeof Vue) => {
  if (typeof options === "function") {
    return componentFactory({}, options);
  } else {
    return (Ctor: typeof Vue) => componentFactory(options, Ctor);
  }
}) as Decorator;
