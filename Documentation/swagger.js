const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'PublishEveryDay Backend API',
      version: '1.0.0',
      description: 'API documentation for the PublishEveryDay Backend, which powers the PublishEveryDay Blogging Platform. PublishEveryDay is a web application for bloggers and content creators to write, publish, and share their insights.',
       contact:
       {
        name: 'Innocent Niyonzima',
        email: 'niyinnocent2027@gmail.com',
        url: 'https://innocent-niyonzima.vercel.app/',
       },
      license: {
        name: 'MIT License',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    schemes: ['http', 'https'],
  },
  apis: ['./Documentation/*.js'], 
};


module.exports = swaggerOptions;