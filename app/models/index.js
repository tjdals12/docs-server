import config from 'configs';
const { dbUri, dbUser, dbPass } = config;

import mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';

/**
 * @author      minz-logger
 * @date        2019. 07. 20
 * @description DB 연결
 */
export const connect = () => {
    return new Promise((resolve, reject) => {
        mongoose.Promise = global.Promise;

        if (process.env.NODE_ENV === 'development') {
            const mockgoose = new Mockgoose(mongoose);

            mockgoose.prepareStorage().then(() => {
                mongoose.connect('mongodb://127.0.0.1:27017/admin',
                    {
                        useNewUrlParser: true,
                        useCreateIndex: true,
                        useFindAndModify: false
                    })
                    .then((res, err) => {
                        if (err) reject(err);

                        resolve('mockgoose');
                    });
            });
        } else {
            mongoose.connect(dbUri,
                {
                    useNewUrlParser: true,
                    useCreateIndex: true,
                    useFindAndModify: false,
                    user: dbUser,
                    pass: dbPass
                })
                .then((res, err) => {
                    if (err) reject(err);

                    resolve('mongoose');
                });
        }
    });
};

/**
 * @author      minz-logger
 * @date        2019. 07. 20
 * @description DB 종료
 */
export const close = () => {
    return mongoose.disconnect();
};