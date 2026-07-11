"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchFields = void 0;
exports.IsMatch = IsMatch;
const class_validator_1 = require("class-validator");
let MatchFields = class MatchFields {
    validate(value, args) {
        return value == args.object[args.constraints[0]];
    }
    defaultMessage(args) {
        return `Failed to match between ${args.property} and ${args.constraints}`;
    }
};
exports.MatchFields = MatchFields;
exports.MatchFields = MatchFields = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'MatchFields', async: false })
], MatchFields);
function IsMatch(constraints = [], validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints,
            validator: MatchFields,
        });
    };
}
//# sourceMappingURL=match.decorator.js.map