const server = require("express");
const helmet = require("helmet");

function lockdown(server, config = {}) {
    
    server.use(helmet());

}
module.exports = {
    lockdown: lockdown
};