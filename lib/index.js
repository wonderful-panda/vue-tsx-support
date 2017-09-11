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
///<reference path="../types/base.d.ts" />
///<reference path="../types/vue.d.ts" />
var vue_1 = require("vue");
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    function Component() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Component;
}(vue_1.default));
exports.Component = Component;
/**
 * Create component from component options (Compatible with Vue.extend)
 */
function createComponent(opts) {
    return vue_1.default.extend(opts);
}
exports.createComponent = createComponent;
var factoryImpl = {
    convert: function (c) { return c; }, extend: function (c) { return c; }
};
/**
 * Specify Props and Event types of component
 *
 * Usage:
 *  // Get TSX-supported component with props(`name`, `value`) and event(`onInput`)
 *  const NewComponent = tsx.ofType<{ name: string, value: string }, { onInput: string }>.convert(Component);
 */
function ofType() {
    return factoryImpl;
}
exports.ofType = ofType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsMENBQTBDO0FBQzFDLHlDQUF5QztBQUN6QywyQkFBc0I7QUFhdEI7SUFBbUQsNkJBQUc7SUFBdEQ7O0lBRUEsQ0FBQztJQUFELGdCQUFDO0FBQUQsQ0FBQyxBQUZELENBQW1ELGFBQUcsR0FFckQ7QUFGWSw4QkFBUztBQUl0Qjs7R0FFRztBQUNILHlCQUFvRCxJQUFnRTtJQUNoSCxNQUFNLENBQUMsYUFBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQVEsQ0FBQztBQUNuQyxDQUFDO0FBRkQsMENBRUM7QUFVRCxJQUFNLFdBQVcsR0FBRztJQUNoQixPQUFPLEVBQUUsVUFBQyxDQUFNLElBQUssT0FBQSxDQUFDLEVBQUQsQ0FBQyxFQUFFLE1BQU0sRUFBRSxVQUFDLENBQU0sSUFBSyxPQUFBLENBQUMsRUFBRCxDQUFDO0NBQ2hELENBQUM7QUFFRjs7Ozs7O0dBTUc7QUFDSDtJQUNJLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDdkIsQ0FBQztBQUZELHdCQUVDIn0=