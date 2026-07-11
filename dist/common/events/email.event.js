"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailEmitter = void 0;
const stream_1 = require("stream");
const email_enums_1 = require("../enums/email.enums");
class EmailEmitter extends stream_1.EventEmitter {
    emit(event, payload) {
        return super.emit(event, payload);
    }
    on(event, listner) {
        return super.on(event, listner);
    }
}
exports.emailEmitter = new EmailEmitter();
//# sourceMappingURL=email.event.js.map