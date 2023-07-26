"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimFileExtension = void 0;
const trimFileExtension = (filename) => {
    const lastIndexOfPeriod = filename.lastIndexOf('.');
    return lastIndexOfPeriod === -1 ? filename : filename.substring(0, lastIndexOfPeriod);
};
exports.trimFileExtension = trimFileExtension;
//# sourceMappingURL=utils.js.map