import { TransformTree, ArchetypeTree, PageContent } from './types';
import { AnyZodObject } from 'zod';
export default function MakeContent<T extends ArchetypeTree, U extends AnyZodObject>({ inputDir, schemaTree, build, rootPagesSchema }: {
    inputDir: string;
    schemaTree: T;
    build: (source: string) => Promise<PageContent>;
    rootPagesSchema?: U;
}): Promise<TransformTree<T, U>>;
//# sourceMappingURL=makeContent.d.ts.map