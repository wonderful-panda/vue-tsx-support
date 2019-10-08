import Vue, { VNode } from "vue";
import * as vca from "@vue/composition-api";
import { _TsxComponentV3, RequiredPropNames, PropsForOutside } from "./api";
import { RecordPropsDefinition } from "vue/types/options";

export interface CompositionComponentOptions<Props, PropsDef extends RecordPropsDefinition<Props>> {
  props?: PropsDef & RecordPropsDefinition<Props>;
  setup: (props: Props, ctx: vca.SetupContext) => (() => VNode);
}

export interface ComponentFactory<PrefixedEvents> {
  create<
    Props,
    PropsDef extends RecordPropsDefinition<Props>,
    RequiredProps extends keyof Props = RequiredPropNames<PropsDef> & keyof Props
  >(
    options: CompositionComponentOptions<Props, PropsDef>
  ): _TsxComponentV3<Vue, {}, PropsForOutside<Props, RequiredProps>, PrefixedEvents, {}, {}>;
}

const factory = {
  create(options: any) {
    return vca.createComponent(options);
  }
} as ComponentFactory<{}>;

export const component = factory.create;

export function componentFactoryOf<PrefixedEvents>(): ComponentFactory<PrefixedEvents> {
  return factory as any;
}
