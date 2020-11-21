import Vue, { VNode, ComponentOptions } from "vue";
import { defineComponent, SetupContext as SetupContext_ } from "@vue/composition-api";
import { _TsxComponentV3, RequiredPropNames, PropsForOutside } from "./api";
import { RecordPropsDefinition } from "vue/types/options";
import { InnerScopedSlots, TsxComponentTypeInfo, EventHandler } from "../types/base";

export type SetupContext<
  PrefixedEvents = unknown,
  ScopedSlots = unknown,
  On = unknown
> = SetupContext_ & {
  slots: InnerScopedSlots<ScopedSlots>;
  _tsx?: TsxComponentTypeInfo<{}, {}, PrefixedEvents, On>;
};

export type CompositionComponentOptions<
  Props,
  PropsDef extends RecordPropsDefinition<Props>,
  PrefixedEvents,
  ScopedSlots,
  On
> = {
  props?: PropsDef & RecordPropsDefinition<Props>;
  setup: (
    this: void,
    props: Props,
    ctx: SetupContext<PrefixedEvents, ScopedSlots, On>
  ) => () => VNode;
} & Pick<
  ComponentOptions<Vue>,
  "name" | "components" | "comments" | "inheritAttrs" | "directives" | "filters"
>;

export function component<
  Props,
  PropsDef extends RecordPropsDefinition<Props>,
  PrefixedEvents,
  ScopedSlots,
  On,
  RequiredProps extends keyof Props = RequiredPropNames<PropsDef> & keyof Props
>(
  options: CompositionComponentOptions<Props, PropsDef, PrefixedEvents, ScopedSlots, On>
): _TsxComponentV3<
  Vue,
  {},
  PropsForOutside<Props, RequiredProps>,
  PrefixedEvents,
  On,
  ScopedSlots
> {
  return defineComponent(options as any) as any;
}
export function emit<Events, Name extends string & keyof Events>(
  ctx: SetupContext<any, any, Events>,
  name: Name,
  ...args: Parameters<EventHandler<Events[Name]>>
) {
  ctx.emit(name, ...args);
}

export function emitOn<Events, Name extends string & keyof Events>(
  ctx: SetupContext<Events, any, any>,
  name: Name,
  ...args: Parameters<EventHandler<Events[Name]>>
) {
  ctx.emit(
    name.replace(/^on[A-Z]/, v => v[2].toLowerCase()),
    ...args
  );
}

export function updateEmitter<Props>() {
  return <K extends keyof Props & string>(ctx: SetupContext, name: K, value: Props[K]) => {
    ctx.emit("update:" + name, value);
  };
}
