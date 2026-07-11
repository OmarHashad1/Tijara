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
exports.RequestPublicFile = void 0;
const aws_1 = require("../services/aws");
const common_1 = require("@nestjs/common");
let RequestPublicFile = class RequestPublicFile {
    s3Service;
    constructor(s3Service) {
        this.s3Service = s3Service;
    }
    async use(req, res, next) {
        const { path } = req.params;
        const requestFile = await this.s3Service.getAsset({ Key: path.join("/") });
        return res.status(common_1.HttpStatus.OK).json({ message: "File fetched sucessfully", url: requestFile });
    }
};
exports.RequestPublicFile = RequestPublicFile;
exports.RequestPublicFile = RequestPublicFile = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [aws_1.S3Service])
], RequestPublicFile);
//# sourceMappingURL=requestPublicFile.middleware.js.map