# ContentGuru
ContentGuru is a TypeScript-first content handling library, leveraging the power of Zod for data validation. It is designed to simplify content management in various applications by providing a schema-driven approach. With ContentGuru, you can easily define, organize, and manipulate content while taking advantage of the familiarity and intuitiveness of local file storage.

# Features
## TypeScript and Zod Integration
Being TypeScript-first and built on Zod, ContentGuru provides a strongly-typed and safe content handling experience. The library ensures that your content conforms to the specified schemas, catching potential errors at compile-time rather than runtime.

## Intuitive Local File Storage
ContentGuru follows an intuitive file storage approach, where content is stored locally as files. This makes it straightforward for users to create and edit content, as it closely resembles the familiar file system structure.

## Schema-Driven Content Management
ContentGuru operates exclusively based on schema definitions, allowing you to organize content using a hierarchical schema tree. The schema tree includes an index page and multiple child pages, each representing distinct pieces of content.
```
- blog
  |- index.mdx
  |- post1.mdx
  |- post2.mdx
  |- post3.mdx
  |- post4.mdx
  |- post5.mdx
```
```js
const blogSchema = {
  index : z.object({
    description: z.string(),
  }),
  pages : z.object({
    title: z.string(),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    author: z.string(),
    description : z.string(),
  })
}
```
In ContentGuru, you have the flexibility to define individual file schemas, such as the index file, to suit specific content requirements. Additionally, for a more general schema that applies to the remaining content files, you can utilize the special pages schema.

## Taxonomies?
ContentGuru is designed to be an opinion-free content handling library, providing a neutral and flexible foundation for managing content. While we have avoided imposing any specific taxonomies or categorization structures, we have equipped users with the tools to easily implement their taxonomies through features like Filter. This feature allows users to define custom filtering logic based on content attributes such as tags, categories, or any other taxonomy they desire. By leveraging the Filter feature, users can effortlessly implement their preferred taxonomies and organize content in a way that aligns perfectly with their project's needs, thus maintaining the library's openness and adaptability to diverse taxonomical approaches.
```js
MakeContent({
    inputDir : 'content',
    schemaTree : PagesSchema,
    build : buildDoc
}).then( section => {
    const TaxonomyPages = Filter({
        section,
        filter : z.object({ tags : z.array(z.string())})
    }); /* Intelligent type inference */
})
```
## Bring Your Own Compilation
To cater to diverse use cases and flexibility, ContentGuru does not enforce any specific compilation process. Instead, you can bring your own compilation library, such as mdx-bundler, to compile content according to your specific needs.

## Schema Inheritance
Enhance content organization and reduce redundancy with schema inheritance. New page schemas can inherit properties from their parent schema, simplifying schema definitions and making content management more efficient.

# Future Steps:
- Implement Automatic File Generation from Schema
- Enhance Computed Fields Support
- Explore Hot Module Replacement (HMR) for Real-time Content Updates
- CommonJS support
We are continuously listening to user feedback and suggestions to drive the development of ContentGuru, ensuring it remains a powerful, intuitive, and customizable content handling solution.

# Contributions
We welcome contributions to improve and expand ContentGuru. If you find bugs or have suggestions for new features, please feel free to create an issue or submit a pull request on our GitHub repository.
