// swaggerConfig.js

const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'PublishEveryDay Backend API',
        version: '1.0.0',
        description: 'API documentation for the PublishEveryDay Backend, which powers the PublishEveryDay Blogging Platform. PublishEveryDay is a web application for bloggers and content creators to write, publish, and share their insights.',
        contact: {
          name: 'Innocent Niyonzima___Rwandantechy',
          email: 'niyinnocent2027@gmail.com',
        },
        license: {
          name: 'MIT License',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      schemes: ['http', 'https'],
    },
    apis: ['./routes/blogs.js'], // Adjust the path to your blogs.js file.
  };
  
  export default swaggerOptions;
  