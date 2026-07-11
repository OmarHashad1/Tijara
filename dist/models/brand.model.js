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
exports.BrandModel = exports.BrandSchema = exports.Brand = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Brand = class Brand {
    categoryIds;
    name;
    slug;
    logo;
    description;
};
exports.Brand = Brand;
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_2.Types.ObjectId], ref: 'Category', default: [], index: true }),
    __metadata("design:type", Array)
], Brand.prototype, "categoryIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 64,
    }),
    __metadata("design:type", String)
], Brand.prototype, "name", void 0);
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
], Brand.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null, trim: true }),
    __metadata("design:type", Object)
], Brand.prototype, "logo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null, trim: true, maxLength: 1024 }),
    __metadata("design:type", Object)
], Brand.prototype, "description", void 0);
exports.Brand = Brand = __decorate([
    (0, mongoose_1.Schema)({
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true,
        strict: true,
        strictQuery: true,
    })
], Brand);
exports.BrandSchema = mongoose_1.SchemaFactory.createForClass(Brand);
exports.BrandModel = mongoose_1.MongooseModule.forFeature([
    { name: Brand.name, schema: exports.BrandSchema },
]);
//# sourceMappingURL=brand.model.js.map