const { logging } = require('../configs/options');

module.exports = (message) => {
    if (logging) {
        console.log(message);
    }
};
