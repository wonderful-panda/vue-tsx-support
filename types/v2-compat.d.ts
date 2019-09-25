import Vue, { VueConstructor } from "vue";
import { KnownAttrs, ScopedSlotHandlers, EventHandlers } from "./base";

export type TsxComponentAttrs<TProps = {}, TEvents = {}, TScopedSlots = {}> =
  | ({ props: TProps } & Partial<TProps> &
      KnownAttrs & {
        scopedSlots?: ScopedSlotHandlers<TScopedSlots>;
      } & EventHandlers<TEvents>)
  | (TProps &
      KnownAttrs & {
        scopedSlots?: ScopedSlotHandlers<TScopedSlots>;
      } & EventHandlers<TEvents>);

export type TsxComponentInstance<V extends Vue, Props, EventsWithOn, ScopedSlotArgs> = {
  _tsxattrs: TsxComponentAttrs<Props, EventsWithOn, ScopedSlotArgs>;
} & V;

export type TsxComponent<
  V extends Vue,
  Props = {},
  EventsWithOn = {},
  ScopedSlotArgs = {},
  AdditionalThisAttrs = {}
> = VueConstructor<
  TsxComponentInstance<V, Props, EventsWithOn, ScopedSlotArgs> & AdditionalThisAttrs
>;
