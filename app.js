// app.js
import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import blogsRouter from './routes/blogs.js';
import swaggerOptions from './swaggerConfig.js'; 
const app = express();

app.use('/api/v3/app', blogsRouter);

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use((req, res, next) => {
  if (req.path === '/') {
    res.send('Welcome to the homepage');
  } else {
    res.status(404).json('no such resource');
  }
});

app.use('/api', (error, req, res, next) => {
  res.send('Welcome to the API');
  res.json({
    error: { message: error.message },
  });
});

export default app;
