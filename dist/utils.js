import { ZodObject } from "zod";
export const trimFileExtension = (filename) => {
    const lastIndexOfPeriod = filename.lastIndexOf('.');
    return lastIndexOfPeriod === -1 ? filename : filename.substring(0, lastIndexOfPeriod);
};
export const ZodValidatePageWithErrorMessage = (schema, page) => {
    try {
        schema.parse(page.frontmatter);
    }
    catch (_error) {
        let error = _error;
        throw `At path ${page.path}: , 
        \n${error.errors.map((error, i) => `${i + 1}. ${error.code} ${error.path} ${error.message}`).join('\n')}`;
    }
};
export const isZodObject = (schemaObject) => {
    return schemaObject instanceof ZodObject;
    // return schemaObject.constructor.name === "ZodObject";
};
//# sourceMappingURL=utils.js.map