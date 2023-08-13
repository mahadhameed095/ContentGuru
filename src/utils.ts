import { AnyZodObject, ZodError, ZodObject } from "zod";
import { Model, Obj, Page, Section } from "./types.js";

export const trimFileExtension = (filename : string) => {
    const lastIndexOfPeriod = filename.lastIndexOf('.');
    return lastIndexOfPeriod === -1 ? filename : filename.substring(0, lastIndexOfPeriod)
}

export const ZodParsePageMetadataWithErrorMessage = (schema : AnyZodObject, pagePath : string, pageMetadata : Obj) => {
    try{
        return schema.parse(pageMetadata);
      }
      catch(_error : unknown){
        let error = _error as ZodError;
        throw `At path ${pagePath}: ,
        \n${error.errors.map((error, i) => `${i + 1}. ${error}`).join('\n')}`
      }
}

export function isPage(value : any) : value is Page {
  if(!value || typeof value !== 'object') return false;
  return 'metadata' in value && 'source' in value;
}

export function isSection(value : any) : value is Section{
  if(!value || typeof value !== 'object') return false;
  return 'pages' in value;
}

export function isValidObject(schema : AnyZodObject, data : unknown) {
  try{
      schema.parse(data)
      return true;
  } catch {
      return false;
  }
}

export function isModel(value : any) : value is Model{
  if(!value || typeof value !== 'object') return false;
  return 'metadata' in value && value['metadata'] instanceof ZodObject;
}