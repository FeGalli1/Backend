import winston from "winston";
import config from "../config.js";

const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
);

//configuro uno que reciba el nivel minimo de loggeo
const configLogger = (level) => ({
    level: level,
    format: winston.format.json(), 
    transports: [
        new winston.transports.File({ filename: 'log/errors.log', level: 'error', format: winston.format.json() }), 
        new winston.transports.Console({ format: consoleFormat })
    ]
});

let logger;

if (config.NODE_ENV === 'production') {
    logger = winston.createLogger(configLogger('info'));
} else if(config.NODE_ENV==='development'){
    logger = winston.createLogger(configLogger('debug'));
}


export const logError = (message) => {
    logger.error(message);
};

export const logWarning = (message) => {
    logger.warn(message);
};

export const logInfo = (message) => {
    logger.info(message);
};

export const logDebug = (message) => {
    logger.debug(message);
};

export const logHttp = (message) => {
    logger.http(message);
};


export const logFatal = (message) => {
    logger.error('FATAL', message);
};
