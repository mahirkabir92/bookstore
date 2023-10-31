require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const booksRoute = require('./routes/booksRoute.js');
const cors = require('cors');

const app = express();

mongoose.connect(process.env.MONGODB_URL)

app.use(express.json());
const SERVERDEVPORT = 4741
const CLIENTDEVPORT = 5173
app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${CLIENTDEVPORT}` }))

app.use('/books', booksRoute);


app.get('/*', (request, response) => {
  console.log(request);
  return response.status(234).send('Connected');
});

const PORT = process.env.PORT || SERVERDEVPORT;




 app.listen(PORT, () => {
   console.log(`App is listening to port: ${PORT}`);
  });

    