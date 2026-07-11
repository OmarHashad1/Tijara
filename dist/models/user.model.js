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
exports.UserModel = exports.UserSchema = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const security_1 = require("../common/services/security");
const enums_1 = require("../common/enums");
let User = class User {
    firstName;
    lastName;
    username;
    email;
    password;
    oldPasswords;
    role;
    phoneNumber;
    addresses;
    paymentsMethod;
    status;
    isEmailVerified;
    credentialsChangedAt;
    banReason;
    deletedAt;
    restoredAt;
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        minLength: 3,
        maxLength: 16,
        trim: true,
    }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        minLength: 3,
        maxLength: 16,
        trim: true,
    }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Virtual)({
        set: function (value) {
            const [firstName, lastName] = value.split(' ');
            this.set({ firstName, lastName });
        },
        get: function () {
            return `${this.firstName} ${this.lastName}`;
        },
    }),
    __metadata("design:type", Object)
], User.prototype, "username", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        index: true,
        required: true,
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        select: false,
        default: null,
    }),
    __metadata("design:type", Object)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [], select: false }),
    __metadata("design:type", Array)
], User.prototype, "oldPasswords", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: enums_1.ROLE.USER, enum: [...Object.values(enums_1.ROLE)] }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        unique: true,
        sparse: true,
    }),
    __metadata("design:type", Object)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                city: String,
                country: String,
                isDefault: Boolean,
            },
        ],
    }),
    __metadata("design:type", Object)
], User.prototype, "addresses", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                method: { type: { enum: [...Object.values(enums_1.PAYMENT_METHOD)] } },
                last4: Number,
                isDefault: Boolean,
            },
        ],
    }),
    __metadata("design:type", Object)
], User.prototype, "paymentsMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: [...Object.values(enums_1.USER_STATUS)],
        default: enums_1.USER_STATUS.ACTIVE,
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "isEmailVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], User.prototype, "credentialsChangedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], User.prototype, "banReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
    }),
    __metadata("design:type", Object)
], User.prototype, "deletedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
    }),
    __metadata("design:type", Object)
], User.prototype, "restoredAt", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({
        toJSON: { virtuals: true, getters: true },
        toObject: { virtuals: true, getters: true },
        timestamps: true,
        strictQuery: true,
        strict: true,
        optimisticConcurrency: true,
    })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
exports.UserModel = mongoose_1.MongooseModule.forFeatureAsync([
    {
        name: User.name,
        useFactory: (securityService) => {
            const schema = exports.UserSchema;
            schema.pre('save', async function () {
                this.newDocument = this.isNew;
                if (this.isDirectModified('password')) {
                    this.password = await securityService.hash(this.password);
                }
                if (this.isDirectModified('phoneNumber') && this.phoneNumber) {
                    this.phoneNumber = securityService.encrypt(this.phoneNumber);
                }
            });
            schema.post('save', async function () { });
            schema.pre(['find', 'findOne', 'countDocuments'], function () {
                if (!this.getOptions().paranoId) {
                    this.where({ deletedAt: null });
                }
            });
            schema.post(['findOne', 'find'], function (docs) {
                if (this.op == 'find') {
                    docs.forEach((doc) => {
                        if (doc.phoneNumber)
                            doc.phoneNumber = securityService.decrypt(doc.phoneNumber);
                    });
                }
                else {
                    const doc = docs;
                    if (doc && doc.phoneNumber) {
                        doc.phoneNumber = securityService.decrypt(doc?.phoneNumber);
                    }
                }
            });
            schema.pre(['updateOne', 'findOneAndUpdate'], function () {
                const update = this.getUpdate();
                if (update.deletedAt) {
                    this.setUpdate({ ...update, $unset: { restoredAt: 1 } });
                }
                if (update.restoredAt) {
                    this.setUpdate({ ...update, $unset: { deletedAt: 1 } });
                    this.setQuery({ deletedAt: { $exists: false }, ...this.getQuery() });
                }
                const query = this.getQuery();
                const options = this.getOptions();
                if (options.paranoId) {
                    this.setQuery({ ...query });
                }
                else {
                    this.setQuery({ ...query, deletedAt: { $exists: false } });
                }
            });
            return schema;
        },
        inject: [security_1.SecurityService],
    },
]);
//# sourceMappingURL=user.model.js.map