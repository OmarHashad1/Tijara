"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProductImages = exports.uploadBrandLogo = exports.uploadFile = void 0;
const multer_1 = require("multer");
const os_1 = require("os");
const multer_enum_1 = require("../enums/multer.enum");
const common_1 = require("@nestjs/common");
const uploadFile = ({ opts, storageType, }) => {
    return {
        storage: storageType == multer_enum_1.STORAGE_TYPE.MEMORY
            ? (0, multer_1.memoryStorage)()
            : (0, multer_1.diskStorage)({
                destination: (_req, _file, cb) => cb(null, (0, os_1.tmpdir)()),
                filename: (req, file, cb) => {
                    const fileExtention = file.originalname.split('.').at(-1);
                    cb(null, `${opts.buildFileName(req, file)}.${fileExtention}`);
                },
            }),
        fileFilter: (_req, file, cb) => {
            if (opts.allwedMimType.includes(file.mimetype))
                cb(null, true);
            else
                cb(new common_1.BadRequestException(`Invalid file type: ${file.mimetype}`), false);
        },
        limits: { fileSize: opts.fileSize },
    };
};
exports.uploadFile = uploadFile;
exports.uploadBrandLogo = (0, exports.uploadFile)({
    opts: {
        allwedMimType: ['image/png', 'image/jpeg', 'image/webp'],
        fileSize: 2 * 1024 * 1024,
        buildFileName: (req, file) => `${req.credentials.user.firstName}_${file.originalname}_${crypto.randomUUID()}`,
    },
    storageType: multer_enum_1.STORAGE_TYPE.DISK,
});
exports.uploadProductImages = (0, exports.uploadFile)({
    opts: {
        allwedMimType: ['image/png', 'image/jpeg', 'image/webp'],
        fileSize: 5 * 1024 * 1024,
        buildFileName: (_req, _file) => `product_${crypto.randomUUID()}`,
    },
    storageType: multer_enum_1.STORAGE_TYPE.MEMORY,
});
//# sourceMappingURL=multer.util.js.map