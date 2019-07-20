import logConfig from 'configs/logger';
const { enabled, level } = logConfig;

import morgan from 'koa-morgan';
import fs from 'fs';
import moment from 'moment';

/**
 * @author      minz-logger
 * @date        2019. 07. 20
 * @description Logger 설정
 * @param       {*} app 
 */
const loggerSetting = (app) => {
    if (enabled) {
        console.log(level);
        level === 'all' &&
            app.use(morgan('combined',
                {
                    stream: fs.createWriteStream(__dirname + `/logs/access_${moment().format('YYYYMMDD')}.log`, { flags: 'a' }),
                    skip: (req, res) => {
                        return res.statusCode >= 400;
                    }
                }));

        app.use(morgan('combined',
            {
                stream: fs.createWriteStream(__dirname + `/logs/error_${moment().format('YYYYMMDD')}.log`, { flags: 'a' }),
                skip: (req, res) => {
                    return res.statusCode < 400;
                }
            }));
    }
};

export default loggerSetting;