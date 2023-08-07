import { TransformTree, ModelTree, Model, PageContent } from './types.js';
export default function MakeContent<T extends ModelTree, U extends Model>({ inputDir, modelTree, build, rootPagesSchema }: {
    inputDir: string;
    modelTree: T;
    build: (source: string) => Promise<PageContent>;
    rootPagesSchema?: U;
}): Promise<TransformTree<T, U>>;
//# sourceMappingURL=makeContent.d.ts.map