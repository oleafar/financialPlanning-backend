import app from './app';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const server = app.listen(PORT, () => {
  console.log(`Financial Planning API running on port ${PORT}`);
});

export default server;
