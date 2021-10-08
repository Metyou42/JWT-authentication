require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const authRouter = require('./router/index');
const errorMiddleware = require('./middlewares/error-middleware');

const app = express();
app.disable('x-powered-by');

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api', authRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
async function start() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true,
    });
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}:`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
