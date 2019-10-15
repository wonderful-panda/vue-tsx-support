import Vue, { VNode } from "vue";
import * as vca from "@vue/composition-api";
import { _TsxComponentV3, RequiredPropNames, PropsForOutside } from "./api";
import { RecordPropsDefinition } from "vue/types/options";
import {
  InnerScopedSlots,
  TsxComponentTypeInfo,
  EventHandler,
  DeclareOn,
  DeclarePrefixedEvents,
  DeclareProps
} from "../types/base";

export type SetupContext<PrefixedEvents = {}, ScopedSlots = {}, On = {}> = vca.SetupContext & {
  slots: InnerScopedSlots<ScopedSlots>;
  _tsx?: TsxComponentTypeInfo<{}, {}, PrefixedEvents, On>;
};

export interface CompositionComponentOptions<
  Props,
  PropsDef extends RecordPropsDefinition<Props>,
  PrefixedEvents,
  ScopedSlots,
  On
> {
  props?: PropsDef & RecordPropsDefinition<Props>;
  setup: (
    this: void,
    props: Props,
    ctx: SetupContext<PrefixedEvents, ScopedSlots, On>
  ) => (() => VNode);
}

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
  return vca.createComponent(options as any) as any;
}
export function emit<Events, Name extends string & keyof Events>(
  ctx: SetupContext<any, any, Events>,
  name: Name,
  ...args: Parameters<EventHandler<Events[Name]>>
) {
  ctx.emit(name, ...args);
}

export function emitOn<Events, Name extends string & keyof Events>(
  ctx: SetupContext<Events, any, {}>,
  name: Name,
  ...args: Parameters<EventHandler<Events[Name]>>
) {
  ctx.emit(name.replace(/^on[A-Z]/, v => v[2].toLowerCase()), ...args);
}
