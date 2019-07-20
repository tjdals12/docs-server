import config from 'configs';
const { port, host } = config;

import * as db from 'models';
import app from './app';

db.connect().then(type => {
    console.log(`Connected ${type}`);

    app.listen(port, host, () => {
        console.log(`Server ${host}:${port}`);
    });
});