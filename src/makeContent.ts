import { TransformTree, ModelTree, Model, Page, Section, PageContent } from './types.js';
import { z } from 'zod';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { ZodValidatePageWithErrorMessage, isZodObject, trimFileExtension } from './utils.js';
import { existsSync } from 'fs';


type FilesAndFolders = {
  files : string[];
  folders : string[];
}

async function GetFilesAndFolders(inputDir : string) : Promise<FilesAndFolders>{
  const dirents = await readdir(inputDir, {withFileTypes : true});
  const result = dirents.reduce<FilesAndFolders>((acc, dirent) => {
    dirent.isFile() && acc.files.push(dirent.name);
    dirent.isDirectory() && acc.folders.push(dirent.name);
    return acc;
  }, 
  { 
    files : [],
    folders : [] 
  });
  return result; 
}


export default async function MakeContent<T extends ModelTree, U extends Model>
({ inputDir, modelTree , build, rootPagesSchema } : {
  inputDir : string;
  modelTree : T;
  build : (source : string) => Promise<PageContent>
  rootPagesSchema ?: U;
}) : Promise<TransformTree<T, U>>
{
  const section : Section = { 
    path : inputDir,
    pages : [] as Page[],
    sections : []
  };

  const {files, folders} = await GetFilesAndFolders(inputDir);
  
  const schemaKeys = Object.keys(modelTree).filter(key => key !== 'sections' && key !== 'pages');
  const definedFilesInSchema = schemaKeys.filter(key => isZodObject(modelTree[key] as object));
  const definedFoldersInSchema = schemaKeys.filter(key => !definedFilesInSchema.includes(key));
  const notDefinedFiles = files.filter(file => !definedFilesInSchema.includes(trimFileExtension(file)));
  const notDefinedFolders = folders.filter(folder => !definedFoldersInSchema.includes(folder));
  
  const pagesModel =  modelTree['pages'] || 
                      rootPagesSchema || 
                      { metadata : z.object({}), computedFields : undefined};

  await Promise.all(
    definedFilesInSchema.map(async filename => {
      const fullPath = join(inputDir, filename + '.mdx');
      if(existsSync(fullPath)){
        const source = await readFile(fullPath, 'utf-8');
        const data = await build(source);
        let page : Page = { ...data, source, path : fullPath};        
        const model = (modelTree[filename] as Model)
        
        ZodValidatePageWithErrorMessage(model['metadata'], page)        
        
        const computedFields = model.computedFields  ? 
        { computedFields : model['computedFields'](page) } : {};

        page = {...page, ...computedFields};
        section[filename] = page;
      }else if(!(modelTree[filename] as Model)['metadata'].isOptional()){ /* if file was required */
         throw `${fullPath} is not found yet required in schema!`;
      } /* do nothing if it was optional and not found*/
    })
  );

  await Promise.all(
    notDefinedFiles.map(async filename => {
      const fullPath = join(inputDir, filename);
      const source = await readFile(fullPath, 'utf-8');
      const data = await build(source);
      let page : Page = { ...data, source, path : fullPath}; 
      ZodValidatePageWithErrorMessage(pagesModel['metadata'], page);
      
      const computedFields = pagesModel.computedFields  ? 
      { computedFields : pagesModel['computedFields'](page) } : {};

      page = {...page, ...computedFields};
      section['pages'].push(page);
    })
  );

  await Promise.all(    
    definedFoldersInSchema.map(async folder => {
      const fullPath = join(inputDir, folder);
      section[folder] = await MakeContent({
        inputDir : fullPath,
        modelTree : modelTree[folder] as ModelTree,
        build,
        rootPagesSchema : pagesModel
      });
    })
  );
  
  await Promise.all(
    notDefinedFolders.map(async folder => {
      const fullPath = join(inputDir, folder);
      section['sections'].push(await MakeContent({
        inputDir : fullPath,
        modelTree : modelTree['sections'] || { pages : pagesModel },
        build,
        rootPagesSchema : pagesModel
      }));
    })
  );

  return section as any;
}