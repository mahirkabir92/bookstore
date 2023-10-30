require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const booksRoute = require('./routes/booksRoute.js');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());


app.get('/', (request, response) => {
  console.log(request);
  return response.status(234).send('Connected');
});

const PORT = process.env.PORT || 5555;
const mongoDBURL = process.env.MONGODB_URL;

app.use('/books', booksRoute);

 app.listen(PORT, () => {
   console.log(`App is listening to port: ${PORT}`);
  });

  mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('Connected');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
    