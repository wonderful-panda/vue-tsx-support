import Vue from "vue";
import { _TsxComponentV3 } from "./api";
import { PropsOf, PrefixedEventsOf } from "../types/base";

export type ComponentProps<V extends typeof Vue> = PropsOf<InstanceType<V>>;
export type ComponentEventsOn<V extends typeof Vue> = PrefixedEventsOf<InstanceType<V>>;
export type ReplaceComponentProps<V extends typeof Vue, NewProps> = V extends _TsxComponentV3<
  infer V,
  infer Attributes,
  any,
  infer PrefixedEvents,
  infer On,
  infer ScopedSlotArgs
>
  ? _TsxComponentV3<V, Attributes, NewProps, PrefixedEvents, On, ScopedSlotArgs>
  : _TsxComponentV3<Vue, {}, NewProps, {}, {}, {}>;
