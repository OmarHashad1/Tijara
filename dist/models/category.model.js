"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = exports.CategorySchema = exports.Category = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const enums_1 = require("../common/enums");
let Category = class Category {
    name;
    slug;
    status;
};
exports.Category = Category;
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 64,
    }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
        index: true,
        lowercase: true,
        trim: true,
    }),
    __metadata("design:type", String)
], Category.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: [...Object.values(enums_1.CATEGORY_STATUS)],
        default: enums_1.CATEGORY_STATUS.PUBLISHED,
        index: true,
    }),
    __metadata("design:type", String)
], Category.prototype, "status", void 0);
exports.Category = Category = __decorate([
    (0, mongoose_1.Schema)({
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true,
        strict: true,
        strictQuery: true,
    })
], Category);
exports.CategorySchema = mongoose_1.SchemaFactory.createForClass(Category);
exports.CategoryModel = mongoose_1.MongooseModule.forFeatureAsync([
    {
        name: Category.name,
        useFactory: () => {
            const schema = exports.CategorySchema;
            return schema;
        },
    },
]);
//# sourceMappingURL=category.model.js.map