const server = require("express");
const helmet = require("helmet");

const { isArray } = Array;

const helmetConfigs = [
    "contentSecurityPolicy",
    "crossOriginEmbedderPolicy",
    "crossOriginOpenerPolicy",
    "crossOriginResourcePolicy",
    "dnsPrefetchControl",
    "expectCt",
    "frameguard",
    "hidePoweredBy",
    "hsts",
    "ieNoOpen",
    "noSniff",
    "originAgentCluster",
    "permittedCrossDomainPolicies",
    "referrerPolicy",
    "xssFilter"
];

function lockdown(server, config) {
    if (!server) throw new Error("No server was provided.");

    if (isArray(config)) {
        for (let i = config.length; i--;) {
            if (!helmetConfigs.includes(config[i])) throw new Error(`"${config[i]}" is not a valid helmet configuration.`);
            server.use(helmet());
        }
        return;
    }
    
    server.use(helmet());
}
module.exports = {
    lockdown: lockdown
};