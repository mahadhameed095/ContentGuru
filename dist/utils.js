export const trimFileExtension = (filename) => {
    const lastIndexOfPeriod = filename.lastIndexOf('.');
    return lastIndexOfPeriod === -1 ? filename : filename.substring(0, lastIndexOfPeriod);
};
//# sourceMappingURL=utils.js.map