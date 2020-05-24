require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { handleError } = require('./helpers/errorHandler');
const app = express();
const cors = require('cors');
const port = 3002;
const { DB_PATH } = process.env;

mongoose.connect(
    DB_PATH,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    },
    (err) => {
        if (err) {
            throw err;
        } else {
            console.log('connection successful');
        }
    },
);

app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    }),
);

app.use('/', require('./routes'));

app.use(handleError);
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
