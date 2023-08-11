import { ZodObject } from "zod";
export const trimFileExtension = (filename) => {
    const lastIndexOfPeriod = filename.lastIndexOf('.');
    return lastIndexOfPeriod === -1 ? filename : filename.substring(0, lastIndexOfPeriod);
};
export const ZodValidatePageWithErrorMessage = (schema, page) => {
    try {
        schema.parse(page.metadata);
    }
    catch (_error) {
        let error = _error;
        throw `At path ${page.path}: , 
        \n${error.errors.map((error, i) => `${i + 1}. ${error.code} ${error.path} ${error.message}`).join('\n')}`;
    }
};
export function isPage(value) {
    if (!value || typeof value !== 'object')
        return false;
    return 'metadata' in value && 'source' in value;
}
export function isSection(value) {
    if (!value || typeof value !== 'object')
        return false;
    return 'pages' in value;
}
export function isValidObject(schema, data) {
    try {
        schema.parse(data);
        return true;
    }
    catch {
        return false;
    }
}
export function isModel(value) {
    if (!value || typeof value !== 'object')
        return false;
    return 'metadata' in value && value['metadata'] instanceof ZodObject;
}
//# sourceMappingURL=utils.js.map