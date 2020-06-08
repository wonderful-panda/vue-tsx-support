import Vue from "vue";
import { _TsxComponentV3 } from "./api";
import { PropsOf, PrefixedEventsOf } from "../types/base";

export type ComponentProps<V extends typeof Vue> = PropsOf<InstanceType<V>>;
export type ComponentEvents<V extends typeof Vue> = PrefixedEventsOf<InstanceType<V>>;
export type WithProps<V extends typeof Vue, NewProps> = V extends _TsxComponentV3<
  infer V,
  infer Attributes,
  any,
  infer PrefixedEvents,
  infer On,
  infer ScopedSlotArgs
>
  ? _TsxComponentV3<V, Attributes, NewProps, PrefixedEvents, On, ScopedSlotArgs>
  : _TsxComponentV3<Vue, {}, NewProps, {}, {}, {}>;

export type WithEvents<V extends typeof Vue, NewEvents> = V extends _TsxComponentV3<
  infer V,
  infer Attributes,
  infer Props,
  any,
  infer On,
  infer ScopedSlotArgs
>
  ? _TsxComponentV3<V, Attributes, Props, NewEvents, On, ScopedSlotArgs>
  : _TsxComponentV3<Vue, {}, {}, NewEvents, {}, {}>;
