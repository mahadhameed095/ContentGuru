import { TransformTree, ArchetypeTree, Page, PageContent, Section } from './types.js';
import { AnyZodObject, z } from 'zod';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { ZodValidatePageWithErrorMessage, isZodObject, trimFileExtension } from './utils.js';
import { existsSync } from 'fs';

export default async function MakeContent<T extends ArchetypeTree, U extends AnyZodObject>
({ inputDir, schemaTree , build, rootPagesSchema } : {
  inputDir : string;
  schemaTree : T;
  build : (source : string) => Promise<PageContent>
  rootPagesSchema ?: U;
}) : Promise<TransformTree<T, U>>
{
  const structure : Section = { 
    path : inputDir,
    pages : [] as Page[],
    sections : []
  };
  const dirents = await readdir(inputDir, {withFileTypes : true});
  const {files, directories} = dirents.reduce((acc, dirent) => {
    dirent.isFile() && acc.files.push(dirent.name);
    dirent.isDirectory() && acc.directories.push(dirent.name);
    return acc;
  }, { files : [] as string[], directories : [] as string[] });
  
  const schemaKeys = Object.keys(schemaTree).filter(key => key !== 'sections' && key !== 'pages');
  const definedFilesInSchema = schemaKeys.filter(key => isZodObject(schemaTree[key] as object));
  const definedFoldersInSchema = schemaKeys.filter(key => !definedFilesInSchema.includes(key));
  const notDefinedFiles = files.filter(file => !definedFilesInSchema.includes(trimFileExtension(file)));
  const notDefinedFolders = directories.filter(folder => !definedFoldersInSchema.includes(folder));
  
  const pagesSchema = schemaTree['pages'] || rootPagesSchema || z.object({});
  
  await Promise.all(
    definedFilesInSchema.map(async filename => {
      const fullPath = join(inputDir, filename + '.mdx');
      if(existsSync(fullPath)){
        const source = await readFile(fullPath, 'utf-8');
        const data = await build(source);
        const page : Page = { ...data, source, path : fullPath};
        ZodValidatePageWithErrorMessage(schemaTree[filename] as AnyZodObject, page)
        structure[filename] = page;
      }else if(!(schemaTree[filename] as AnyZodObject).isOptional()){ /* if file was required */
         throw `${fullPath} is not found yet required in schema!`;
      } /* do nothing if it was optional and not found*/
    })
  );

  await Promise.all(
    notDefinedFiles.map(async filename => {
      const fullPath = join(inputDir, filename);
      const source = await readFile(fullPath, 'utf-8');
      const data = await build(source);
      const page : Page = { ...data, source, path : fullPath}; 
      ZodValidatePageWithErrorMessage(pagesSchema, page)
      structure['pages'].push(page);
    })
  );

  await Promise.all(    
    definedFoldersInSchema.map(async folder => {
      const fullPath = join(inputDir, folder);
      structure[folder] = await MakeContent({
        inputDir : fullPath,
        schemaTree : schemaTree[folder] as ArchetypeTree,
        build,
        rootPagesSchema : pagesSchema
      });
    })
  );
  
  await Promise.all(
    notDefinedFolders.map(async folder => {
      const fullPath = join(inputDir, folder);
      structure['sections'].push(await MakeContent({
        inputDir : fullPath,
        schemaTree : schemaTree['sections'] || { pages : pagesSchema },
        build,
        rootPagesSchema : pagesSchema
      }));
    })
  );

  return structure as any;
}