const dotenv = require('dotenv')
dotenv.config();
const data = require('./helper/data')
const express = require('express');
const cookieParser = require('cookie-parser');
const connect = require('./db/conn')
const masterRoute = require('./routes/masterroute');
const port = process.env.PORT;
const app = express();
const logger = require("./db/winston");

connect.Connect()
data.AutoCall()
app.use(express.json());
app.use(cookieParser());
app.use(masterRoute);

app.listen(port, () => {
    logger.error(`server is running on port ${port}`);
});

