const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorMiddleWare = require('./middlewares/error');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(cors())

app.use(express.json());
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

const products = require('./routes/product');
const userRouter = require('./routes/auth');

//Route paths
app.use('/api/v1',products);
app.use('/api/v1',userRouter);

//handling errors should be used in last
app.use(errorMiddleWare)

module.exports = app;