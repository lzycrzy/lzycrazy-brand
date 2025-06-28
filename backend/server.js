import app from './app.js';

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening at port ${process.env.PORT}`);
});