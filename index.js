const helmet = require("helmet");

const compression = require("compression");

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

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 500, // 15 minutes
	max: 35, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const AntiDDoS = require("ddos");
const { config } = require("process");

const { ddos: ddosProtection } = new AntiDDoS({burst:15, limit:20});

/**
 * 
 * @param {expressServer} server any express.js server
 * @param {object} _config Object of settings, if not expressly stated, defaults will be used (activated)
 * @returns 
 */
function lockdown(server, _config) {
    if (!server) throw new Error("No server was provided.");

    if (config?.ddosProtection) {
        server.use(limiter); //stop ddoses
        server.use(ddosProtection);
    };

    server.use(compression());

    if (typeof _config === "object") {
        let config = Object.entries(config);
        for (let i = config.length; i--;) {
            if (!helmetConfigs.includes(config[i][0])) throw new Error(`"${config[i][0]}" is not a valid helmet configuration.`);
            if (config[i][1]) {
                server.use(helmet[config[i][0]]());
            };
        };
        return;
    };
    
    server.use(helmet());
}
module.exports = {
    lockdown: lockdown
};