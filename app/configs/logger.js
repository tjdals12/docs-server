import config from 'configs';
const { env, name } = config;

const logConfig = {
    enabled: process.env.LOG_ENABLED || ['production', 'development'].includes(env),
    name,
    level: process.env.LOG_LEVEL || (env === 'production') ? 'info' : 'debug',
    redact: []
};

export default logConfig;