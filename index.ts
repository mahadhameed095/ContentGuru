import MakeContent from "./lib/makeContent";
import { buildDoc } from "./buildDoc";
import { Filter, Map } from "./lib/helpers";
import { PagesSchema } from "./schema";


MakeContent({
  inputDir : 'content',
  schemaTree : PagesSchema,
  build : buildDoc,
}).then(content => {
});