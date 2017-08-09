"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("./base");
var vue_1 = require("vue");
/**
 * Add TSX-support to existing component factory
 */
function convert(component) {
    return component;
}
exports.convert = convert;
/**
 * Specify Props and Event types of component
 *
 * Usage:
 *  // Get TSX-supported component with no props and events
 *  const NewComponent = tsx.convert(Component);
 *
 *  // Get TSX-supported component with props(`name`, `value`) and event(`onInput`)
 *  const NewComponent = tsx.of<{ name: string, value: string }, { onInput: string }>.convert(Component);
 */
function of() {
    return { convert: (function (c) { return c; }) };
}
exports.of = of;
/**
 * Create component from component options (Compatible with Vue.extend)
 */
function createComponent(opts) {
    return vue_1.default.extend(opts);
}
exports.createComponent = createComponent;
var Component = (function (_super) {
    __extends(Component, _super);
    function Component() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Component;
}(vue_1.default));
exports.Component = Component;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsa0JBQWdCO0FBQ2hCLDJCQUFzQjtBQXFEdEI7O0dBRUc7QUFDSCxpQkFBdUMsU0FBeUI7SUFDNUQsTUFBTSxDQUFDLFNBQWdCLENBQUM7QUFDNUIsQ0FBQztBQUZELDBCQUVDO0FBRUQ7Ozs7Ozs7OztHQVNHO0FBQ0g7SUFDSSxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxVQUFDLENBQU0sSUFBSyxPQUFBLENBQUMsRUFBRCxDQUFDLENBQVEsRUFBRSxDQUFDO0FBQy9DLENBQUM7QUFGRCxnQkFFQztBQUVEOztHQUVHO0FBQ0gseUJBQTBELElBQThEO0lBQ3BILE1BQU0sQ0FBQyxhQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBUSxDQUFDO0FBQ25DLENBQUM7QUFGRCwwQ0FFQztBQUVEO0lBQXlELDZCQUFHO0lBQTVEOztJQUVBLENBQUM7SUFBRCxnQkFBQztBQUFELENBQUMsQUFGRCxDQUF5RCxhQUFHLEdBRTNEO0FBRlksOEJBQVMifQ==