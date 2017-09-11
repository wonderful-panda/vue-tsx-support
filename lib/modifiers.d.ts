export declare type EventFilter = (event: Event) => boolean;
export declare type EventHandler<E extends Event> = (event: E) => void;
export declare type ModifierName = "esc" | "tab" | "enter" | "space" | "up" | "down" | "del" | "left" | "right" | "middle" | "ctrl" | "shift" | "alt" | "meta" | "noctrl" | "noshift" | "noalt" | "nometa" | "prevent" | "stop" | "self";
export declare type Modifiers = {
    [K in ModifierName]: Modifier;
};
export interface Modifier extends Modifiers {
    <E extends Event>(handler: EventHandler<E>): EventHandler<E>;
    (event: Event): void;
}
export declare const esc: Modifier, tab: Modifier, enter: Modifier, space: Modifier, up: Modifier, down: Modifier, del: Modifier, left: Modifier, right: Modifier, middle: Modifier, ctrl: Modifier, shift: Modifier, alt: Modifier, meta: Modifier, noctrl: Modifier, noshift: Modifier, noalt: Modifier, nometa: Modifier, stop: Modifier, prevent: Modifier, self: Modifier;
