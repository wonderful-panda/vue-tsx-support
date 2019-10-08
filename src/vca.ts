import Vue, { VNode } from "vue";
import * as vca from "@vue/composition-api";
import { _TsxComponentV3, RequiredPropNames, PropsForOutside } from "./api";
import { RecordPropsDefinition } from "vue/types/options";
import { InnerScopedSlots } from "../types/base";

export type SetupContext<ScopedSlots> = vca.SetupContext & {
  slots: InnerScopedSlots<ScopedSlots>;
};

export interface CompositionComponentOptions<
  Props,
  PropsDef extends RecordPropsDefinition<Props>,
  ScopedSlots
> {
  props?: PropsDef & RecordPropsDefinition<Props>;
  setup: (this: void, props: Props, ctx: SetupContext<ScopedSlots>) => (() => VNode);
}

export interface ComponentFactory<PrefixedEvents, ScopedSlots> {
  create<
    Props,
    PropsDef extends RecordPropsDefinition<Props>,
    RequiredProps extends keyof Props = RequiredPropNames<PropsDef> & keyof Props
  >(
    options: CompositionComponentOptions<Props, PropsDef, ScopedSlots>
  ): _TsxComponentV3<Vue, {}, PropsForOutside<Props, RequiredProps>, PrefixedEvents, {}, {}>;
}

const factory = {
  create(options: any) {
    return vca.createComponent(options);
  }
} as ComponentFactory<{}, {}>;

export const component = factory.create;

export function componentFactoryOf<PrefixedEvents, ScopedSlots = {}>(): ComponentFactory<
  PrefixedEvents,
  ScopedSlots
> {
  return factory as any;
}
