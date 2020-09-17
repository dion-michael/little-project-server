require('dotenv').config();
const express = require('express');
const { handleError } = require('./helpers/errorHandler');
const socketIo = require('socket.io');
const http = require('http');
const app = express();
const cors = require('cors');
const initSocket = require('./configs/socket');
const initDB = require('./configs/db');
const port = process.env.PORT || 3002;
const { DB_PATH, DB_NAME, JWT_SECRET, PORT } = process.env;

initDB();
app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    }),
);
app.use('/', require('./routes'));
app.use(handleError);

const server = http.createServer(app);
const io = socketIo(server);
initSocket(io);

server.listen(port, () => {
    console.log(`listening on port ${port}`);
});
