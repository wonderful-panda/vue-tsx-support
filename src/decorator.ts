import Vue from "vue";
import { Emit } from "vue-property-decorator";

export function EmitWithoutPrefix(target: Vue, key: string, descriptor: any) {
  const emitName = key.replace(/^on([A-Z])/, (_, a: string) => a.toLowerCase());
  Emit(emitName)(target, key, descriptor);
}
