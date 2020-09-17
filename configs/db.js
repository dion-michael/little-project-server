const mongoose = require('mongoose');
const { DB_PATH, DB_NAME } = process.env;

module.exports = () => {
    mongoose.connect(
        `mongodb://${DB_PATH}/${DB_NAME}`,
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
};
