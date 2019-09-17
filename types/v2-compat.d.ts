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
