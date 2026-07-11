"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseRepo = void 0;
class DatabaseRepo {
    model;
    constructor(model) {
        this.model = model;
        this.model = model;
    }
    async create({ data, options, }) {
        const payload = await this.model.create(Array.isArray(data) ? data : [data], options);
        return Array.isArray(data) ? payload : payload[0];
    }
    async findOne({ filter, options = { lean: false }, projection, }) {
        const payload = await this.model.findOne(filter, projection, options);
        return payload;
    }
    async find({ filter, options = { lean: false }, projection, }) {
        const payload = await this.model.find(filter, projection, options);
        return payload;
    }
    async findOneAndUpdate({ filter, update, options = {}, }) {
        const existingInc = update.$inc;
        return this.model.findOneAndUpdate(filter, { ...update, $inc: { ...existingInc, __v: 1 } }, options);
    }
    async paginate({ filter, options, projection, page, size, }) {
        let count = 0;
        if (Number(page) > 0) {
            const pageNumber = Number(page);
            const parsedSize = Number(size);
            options.skip = (pageNumber - 1) * parsedSize;
            options.limit = parsedSize;
            count = await this.model.countDocuments(filter || {});
        }
        const docs = await this.find({
            filter: filter || {},
            projection,
            options: options,
        });
        return {
            docs,
            meta: {
                ...(Number(page) > 0
                    ? {
                        count,
                        page,
                        size,
                        pages: Math.ceil(count / Number(size)),
                    }
                    : {}),
            },
        };
    }
    async updateOne({ filter, update, options, }) {
        const existingInc = update.$inc;
        return this.model.updateOne(filter, { ...update, $inc: { ...existingInc, __v: 1 } }, options);
    }
    async updateMany({ filter, update, options, }) {
        const existingInc = update.$inc;
        return this.model.updateMany(filter, { ...update, $inc: { ...existingInc, __v: 1 } }, options);
    }
    async deleteOne({ filter, }) {
        return this.model.deleteOne(filter);
    }
}
exports.DatabaseRepo = DatabaseRepo;
//# sourceMappingURL=db.repo.js.map