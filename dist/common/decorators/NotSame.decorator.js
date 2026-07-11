"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotSame = void 0;
exports.NotSameAs = NotSameAs;
const class_validator_1 = require("class-validator");
let NotSame = class NotSame {
    validate(value, args) {
        return value != args.object[args.constraints[0]];
    }
    defaultMessage(args) {
        return `${args.property} must not be the same as ${args.constraints[0]}`;
    }
};
exports.NotSame = NotSame;
exports.NotSame = NotSame = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'NotSame', async: false })
], NotSame);
function NotSameAs(constraints = [], validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints,
            validator: NotSame,
        });
    };
}
//# sourceMappingURL=NotSame.decorator.js.map