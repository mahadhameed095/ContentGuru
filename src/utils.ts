import { AnyZodObject, ZodError, ZodObject } from "zod";
import { Page } from "./types.js";

export const trimFileExtension = (filename : string) => {
    const lastIndexOfPeriod = filename.lastIndexOf('.');
    return lastIndexOfPeriod === -1 ? filename : filename.substring(0, lastIndexOfPeriod)
}

export const ZodValidatePageWithErrorMessage = (schema : AnyZodObject, page : Page) => {
    try{
        schema.parse(page.metadata);
      }
      catch(_error : unknown){
        let error = _error as ZodError;
        throw `At path ${page.path}: , 
        \n${error.errors.map((error, i) => `${i + 1}. ${error.code} ${error.path} ${error.message}`).join('\n')}`
      }
}

export const isZodObject = (schemaObject : object) : schemaObject is ZodObject<any> =>  {
  return schemaObject instanceof ZodObject;
  // return schemaObject.constructor.name === "ZodObject";
}